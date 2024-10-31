import Char "mo:base/Char";
import List "mo:base/List";
import Nat8 "mo:base/Nat8";

import Array "mo:base/Array";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Random "mo:base/Random";
import Nat "mo:base/Nat";
import Buffer "mo:base/Buffer";
import Blob "mo:base/Blob";

actor {
    // List of possible words
    private let words : [Text] = [
        "APPLE", "BEACH", "CHAIR", "DANCE", "EAGLE", "FLAME", "GRAPE", "HOUSE",
        "IMAGE", "JUICE", "KNIFE", "LEMON", "MOUSE", "NIGHT", "OCEAN", "PIANO",
        "QUEEN", "RADIO", "SNAKE", "TABLE", "UNCLE", "VOICE", "WATER", "YOUTH"
    ];

    // Get a random word
    public func getWord() : async Text {
        let seed = await Random.blob();
        let seedBytes = Blob.toArray(seed);
        if (seedBytes.size() > 0) {
            let randomNum = Nat.abs(Nat8.toNat(seedBytes[0]) % words.size());
            words[randomNum]
        } else {
            words[0] // fallback to first word if we can't get random bytes
        }
    };

    // Validate a guess and return feedback
    public query func checkGuess(guess: Text, target: Text) : async [Nat] {
        let guessChars = Iter.toArray(Text.toIter(Text.toUppercase(guess)));
        let targetChars = Iter.toArray(Text.toIter(target));
        
        let result = Buffer.Buffer<Nat>(5);
        
        // 0: wrong, 1: wrong position, 2: correct position
        for (i in Iter.range(0, 4)) {
            if (i >= guessChars.size() or i >= targetChars.size()) {
                ignore result.add(0)
            } else {
                if (guessChars[i] == targetChars[i]) {
                    ignore result.add(2)
                } else if (Array.find<Char>(targetChars, func(c) { c == guessChars[i] }) != null) {
                    ignore result.add(1)
                } else {
                    ignore result.add(0)
                }
            }
        };
        
        Buffer.toArray(result)
    };
}
