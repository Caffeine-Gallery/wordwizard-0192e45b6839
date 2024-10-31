import { backend } from "declarations/backend";

let currentWord = '';
let currentGuess = '';
let currentRow = 0;
let gameOver = false;

async function initGame() {
    currentWord = await backend.getWord();
    setupBoard();
    setupKeyboard();
}

function setupBoard() {
    const rows = document.querySelectorAll('.row');
    rows.forEach(row => {
        for (let i = 0; i < 5; i++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            row.appendChild(tile);
        }
    });
}

function setupKeyboard() {
    document.querySelectorAll('#keyboard button').forEach(button => {
        button.addEventListener('click', (e) => {
            if (!gameOver) {
                const key = e.target.getAttribute('data-key');
                handleInput(key);
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (!gameOver) {
            let key = e.key.toUpperCase();
            if (key === 'ENTER' || key === 'BACKSPACE' || (key.length === 1 && key.match(/[A-Z]/))) {
                handleInput(key);
            }
        }
    });
}

function handleInput(key) {
    if (key === 'ENTER') {
        if (currentGuess.length === 5) {
            submitGuess();
        }
    } else if (key === 'BACKSPACE') {
        currentGuess = currentGuess.slice(0, -1);
        updateRow();
    } else if (currentGuess.length < 5 && key.length === 1) {
        currentGuess += key;
        updateRow();
    }
}

function updateRow() {
    const tiles = document.querySelectorAll('.row')[currentRow].children;
    for (let i = 0; i < 5; i++) {
        tiles[i].textContent = currentGuess[i] || '';
    }
}

async function submitGuess() {
    const result = await backend.checkGuess(currentGuess, currentWord);
    updateTileColors(result);
    updateKeyboardColors(result);

    if (result.every(r => r === 2)) {
        showMessage('Congratulations! You won!', 'success');
        gameOver = true;
    } else if (currentRow === 5) {
        showMessage(`Game Over! The word was ${currentWord}`, 'danger');
        gameOver = true;
    } else {
        currentRow++;
        currentGuess = '';
    }
}

function updateTileColors(result) {
    const tiles = document.querySelectorAll('.row')[currentRow].children;
    result.forEach((r, i) => {
        const tile = tiles[i];
        setTimeout(() => {
            tile.classList.add('flip');
            setTimeout(() => {
                if (r === 2) tile.classList.add('correct');
                else if (r === 1) tile.classList.add('present');
                else tile.classList.add('absent');
            }, 250);
        }, i * 100);
    });
}

function updateKeyboardColors(result) {
    const keys = document.querySelectorAll('#keyboard button');
    currentGuess.split('').forEach((letter, i) => {
        const key = Array.from(keys).find(k => k.getAttribute('data-key') === letter);
        if (key) {
            if (result[i] === 2) {
                key.classList.add('correct');
            } else if (result[i] === 1 && !key.classList.contains('correct')) {
                key.classList.add('present');
            } else if (!key.classList.contains('correct') && !key.classList.contains('present')) {
                key.classList.add('absent');
            }
        }
    });
}

function showMessage(text, type) {
    const message = document.getElementById('message');
    message.textContent = text;
    message.classList.remove('d-none', 'alert-success', 'alert-danger');
    message.classList.add(`alert-${type}`);
}

initGame();
