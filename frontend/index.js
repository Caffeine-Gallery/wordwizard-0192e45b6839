import { backend } from "declarations/backend";

let targetWord = "";
let currentRow = 0;
const maxGuesses = 6;
const wordLength = 5;

async function initGame() {
    targetWord = await backend.getWord();
    createGameBoard();
}

function createGameBoard() {
    const gameBoard = document.getElementById("game-board");
    for (let i = 0; i < maxGuesses; i++) {
        const row = document.createElement("div");
        row.className = "guess-row";
        for (let j = 0; j < wordLength; j++) {
            const letterBox = document.createElement("div");
            letterBox.className = "letter-box";
            row.appendChild(letterBox);
        }
        gameBoard.appendChild(row);
    }
}

async function handleGuess(guess) {
    if (guess.length !== 5) {
        showMessage("Please enter a 5-letter word");
        return;
    }

    const result = await backend.checkGuess(guess, targetWord);
    updateGameBoard(guess, result);

    if (result.every(r => r === 2)) {
        showMessage("Congratulations! You won!");
        disableInput();
        return;
    }

    currentRow++;
    if (currentRow >= maxGuesses) {
        showMessage(`Game Over! The word was ${targetWord}`);
        disableInput();
    }
}

function updateGameBoard(guess, result) {
    const row = document.getElementsByClassName("guess-row")[currentRow];
    const letterBoxes = row.getElementsByClassName("letter-box");
    
    for (let i = 0; i < guess.length; i++) {
        const letterBox = letterBoxes[i];
        letterBox.textContent = guess[i];
        
        switch (result[i]) {
            case 2:
                letterBox.classList.add("correct");
                break;
            case 1:
                letterBox.classList.add("wrong-position");
                break;
            case 0:
                letterBox.classList.add("incorrect");
                break;
        }
    }
}

function showMessage(text) {
    document.getElementById("message").textContent = text;
}

function disableInput() {
    document.getElementById("guess-input").disabled = true;
    document.getElementById("submit-guess").disabled = true;
}

document.getElementById("submit-guess").addEventListener("click", () => {
    const input = document.getElementById("guess-input");
    const guess = input.value.toUpperCase();
    input.value = "";
    handleGuess(guess);
});

document.getElementById("guess-input").addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        const input = event.target;
        const guess = input.value.toUpperCase();
        input.value = "";
        handleGuess(guess);
    }
});

// Initialize the game when the page loads
initGame();
