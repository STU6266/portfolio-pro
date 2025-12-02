// public/js/hangman.js
// ---------------------------------------------------------
// Browser version of the C# Hangman game.
// Based on your original console logic:
// - difficulty (easy / medium / hard) controls word length
// - random word from a word list
// - up to 10 wrong guesses (then you lose)
// - ASCII hangman drawing, similar to PrintHangmanFigure.
// ---------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  // --- DOM elements -------------------------------------------------
  const difficultySelect = document.querySelector("#hangman-difficulty");
  const newGameButton = document.querySelector("#hangman-new-game");

  const wordDisplay = document.querySelector("#hangman-word");
  const wrongCountSpan = document.querySelector("#hangman-wrong-count");
  const maxSpan = document.querySelector("#hangman-max");
  const guessedLettersSpan = document.querySelector("#hangman-guessed-letters");
  const messageSpan = document.querySelector("#hangman-message");
  const figurePre = document.querySelector("#hangman-figure");
  const keyboardContainer = document.querySelector("#hangman-keyboard");

  // --- Game state ---------------------------------------------------
  let secretWord = "";         // the word to guess (lowercase)
  let revealed = [];           // array of chars, '_' or the revealed letter
  let wrongGuesses = 0;        // how many wrong letters so far
  const maxWrongGuesses = 10;  // like in your C# code
  let guessedLetters = new Set(); // track all guessed letters

  maxSpan.textContent = String(maxWrongGuesses);

  // Small word list for demo.
  // We don't load from a file here; instead it's all in the script.
  // Difficulty is decided later based on word length.
  const allWords = [
    // easy-ish (short words)
    "cat", "dog", "code", "game", "tree", "house", "print", "bed",
    "nozzle", "axis", "gear", "filament", "layer", "motor", "plate",
    // some medium/longer
    "extruder", "settings", "quality", "progress",
    "portfolio", "project", "backend", "frontend", "express",
    "javascript", "variable", "function", "hardware", "software",
    "terminal", "console", "practice", "learning"
  ];

  // ASCII hangman stages (0..10).
  // These are simple, but they mirror the idea of your C# PrintHangmanFigure.
  const hangmanStages = [
    `
       
       
       
       
       
       
    `,
    `
       
       
       
       
       
=======`,
    `
 |     
 |     
 |     
 |     
 |     
=======`,
    `
 +---+
 |   |
 |    
 |    
 |    
=======`,
    `
 +---+
 |   |
 |   |
 |    
 |    
=======`,
    `
 +---+
 |   |
 |   O
 |   |
 |    
=======`,
    `
 +---+
 |   |
 |   O
 |   |
 |   |
=======`,
    `
 +---+
 |   |
 |   O
 |  /|
 |   |
=======`,
    `
 +---+
 |   |
 |   O
 |  /|\\
 |   |
=======`,
    `
 +---+
 |   |
 |   O
 |  /|\\
 |  / 
=======`,
    `
 +---+
 |   |
 |   O
 |  /|\\
 |  / \\
=======`
  ];

  // --- Helper: pick a word based on difficulty ----------------------
  function pickRandomWord(difficulty) {
    let minLength, maxLength;

    // Same idea as your C# switch(difficulty)
    switch (difficulty) {
      case "easy":
        minLength = 1;
        maxLength = 5;
        break;
      case "medium":
        minLength = 6;
        maxLength = 8;
        break;
      case "hard":
        minLength = 9;
        maxLength = Infinity;
        break;
      default:
        minLength = 1;
        maxLength = 5;
        break;
    }

    // Filter allWords according to length
    const filtered = allWords.filter((w) => {
      const len = w.trim().length;
      return len >= minLength && len <= maxLength;
    });

    // Fallback: if somehow no word matches, use the full list
    const list = filtered.length > 0 ? filtered : allWords;

    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex].trim().toLowerCase();
  }

  // --- Helper: start a new game ------------------------------------
  function startNewGame() {
    const difficulty = difficultySelect.value || "easy";

    secretWord = pickRandomWord(difficulty);
    revealed = Array(secretWord.length).fill("_");
    wrongGuesses = 0;
    guessedLetters = new Set();

    // Reset UI text
    updateWordDisplay();
    updateStatus();
    drawFigure(0);
    buildKeyboard();
    messageSpan.textContent = `I picked a word with ${secretWord.length} letters. Good luck!`;
  }

  // --- Update displayed word ---------------------------------------
  function updateWordDisplay() {
    // e.g. "_ _ a _ _"
    const display = revealed.join(" ");
    wordDisplay.textContent = display;
  }

  // --- Update wrong count + guessed letters -------------------------
  function updateStatus() {
    wrongCountSpan.textContent = String(wrongGuesses);

    if (guessedLetters.size === 0) {
      guessedLettersSpan.textContent = "–";
    } else {
      guessedLettersSpan.textContent = Array.from(guessedLetters).join(", ");
    }
  }

  // --- Draw ASCII figure for current wrongGuesses -------------------
  function drawFigure(stage) {
    const index = Math.min(
      Math.max(stage, 0),
      hangmanStages.length - 1
    );
    figurePre.textContent = hangmanStages[index];
  }

  // --- Create on-screen A–Z keyboard -------------------------------
  function buildKeyboard() {
    keyboardContainer.innerHTML = "";

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (const ch of alphabet) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn-secondary hangman-key";
      btn.textContent = ch;

      btn.addEventListener("click", () => {
        handleGuess(ch.toLowerCase());
      });

      keyboardContainer.appendChild(btn);
    }
  }

  // --- Handle a single letter guess --------------------------------
  function handleGuess(letter) {
    // If game is already over, ignore any further clicks
    if (isGameOver()) {
      return;
    }

    // If already guessed, ignore
    if (guessedLetters.has(letter)) {
      messageSpan.textContent = `You already guessed "${letter.toUpperCase()}". Try another letter.`;
      return;
    }

    guessedLetters.add(letter);

    // Is the letter in the secret word?
    if (secretWord.includes(letter)) {
      // Reveal all occurrences
      for (let i = 0; i < secretWord.length; i++) {
        if (secretWord[i] === letter) {
          revealed[i] = letter;
        }
      }
      messageSpan.textContent = `Good job! "${letter.toUpperCase()}" is in the word.`;
    } else {
      // Wrong guess
      wrongGuesses++;
      messageSpan.textContent = `Sorry, "${letter.toUpperCase()}" is not in the word.`;
    }

    // Update UI after the guess
    updateWordDisplay();
    updateStatus();
    drawFigure(wrongGuesses);
    updateKeyboardState();

    // Check win/lose conditions
    checkGameEnd();
  }

  // --- Check if game is over ---------------------------------------
  function isGameOver() {
    const wordGuessed = revealed.join("") === secretWord;
    const noAttemptsLeft = wrongGuesses >= maxWrongGuesses;
    return wordGuessed || noAttemptsLeft;
  }

  function checkGameEnd() {
    const wordGuessed = revealed.join("") === secretWord;
    const noAttemptsLeft = wrongGuesses >= maxWrongGuesses;

    if (wordGuessed) {
      messageSpan.textContent = "Congratulations! You guessed the word 🎉";
      disableKeyboard();
    } else if (noAttemptsLeft) {
      messageSpan.textContent = `Game over! The word was "${secretWord.toUpperCase()}".`;
      // Draw final figure just in case
      drawFigure(maxWrongGuesses);
      disableKeyboard();
    }
  }

  // --- Disable all keys if game is finished -------------------------
  function disableKeyboard() {
    const buttons = keyboardContainer.querySelectorAll("button");
    buttons.forEach((btn) => {
      btn.disabled = true;
    });
  }

  // --- Update keyboard styles after each guess ----------------------
  function updateKeyboardState() {
    const buttons = keyboardContainer.querySelectorAll("button");
    buttons.forEach((btn) => {
      const letter = btn.textContent.toLowerCase();
      btn.disabled = guessedLetters.has(letter);

      // Optional: you can adjust classes here (e.g. success/error colors)
      // depending on whether the letter is in the word.
    });
  }

  // --- Wire up "Start new game" button ------------------------------
  newGameButton.addEventListener("click", () => {
    startNewGame();
  });

  // On page load, show empty keyboard and neutral state
  buildKeyboard();
  drawFigure(0);
  updateWordDisplay();
  updateStatus();
});
