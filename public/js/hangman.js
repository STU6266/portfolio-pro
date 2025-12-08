// public/js/hangman.js

/**
 * Browser-based implementation of the original C# Hangman game.
 *
 * Features:
 * - Difficulty selector (easy / medium / hard) based on word length.
 * - Random word selection from an in-memory word list.
 * - Up to maxWrongGuesses incorrect attempts before the game is lost.
 * - ASCII hangman figure that progresses with each wrong guess.
 * - On-screen A–Z keyboard for mouse-based play.
 */

document.addEventListener("DOMContentLoaded", () => {
  // DOM elements for controls and game state display.
  const difficultySelect = document.querySelector("#hangman-difficulty");
  const newGameButton = document.querySelector("#hangman-new-game");

  const wordDisplay = document.querySelector("#hangman-word");
  const wrongCountSpan = document.querySelector("#hangman-wrong-count");
  const maxSpan = document.querySelector("#hangman-max");
  const guessedLettersSpan = document.querySelector("#hangman-guessed-letters");
  const messageSpan = document.querySelector("#hangman-message");
  const figurePre = document.querySelector("#hangman-figure");
  const keyboardContainer = document.querySelector("#hangman-keyboard");

  // Game state.
  let secretWord = "";
  let revealed = [];
  let wrongGuesses = 0;
  const maxWrongGuesses = 10;
  let guessedLetters = new Set();

  maxSpan.textContent = String(maxWrongGuesses);

  // Word list. Difficulty is derived later from the word length.
  const allWords = [
    "cat",
    "dog",
    "code",
    "game",
    "tree",
    "house",
    "print",
    "bed",
    "nozzle",
    "axis",
    "gear",
    "filament",
    "layer",
    "motor",
    "plate",
    "extruder",
    "settings",
    "quality",
    "progress",
    "portfolio",
    "project",
    "backend",
    "frontend",
    "express",
    "javascript",
    "variable",
    "function",
    "hardware",
    "software",
    "terminal",
    "console",
    "practice",
    "learning",
  ];

  // ASCII hangman stages for 0..10 wrong guesses.
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
=======`,
  ];

  // ---------------------------------------------------------------------------
  // Game setup and helpers
  // ---------------------------------------------------------------------------

  /**
   * Picks a random word from the word list according to the selected
   * difficulty. Difficulty is expressed through minimum and maximum length.
   */
  function pickRandomWord(difficulty) {
    let minLength;
    let maxLength;

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

    const filtered = allWords.filter((w) => {
      const len = w.trim().length;
      return len >= minLength && len <= maxLength;
    });

    const list = filtered.length > 0 ? filtered : allWords;
    const randomIndex = Math.floor(Math.random() * list.length);

    return list[randomIndex].trim().toLowerCase();
  }

  /**
   * Resets the game state and UI for a new round.
   */
  function startNewGame() {
    const difficulty = difficultySelect.value || "easy";

    secretWord = pickRandomWord(difficulty);
    revealed = Array(secretWord.length).fill("_");
    wrongGuesses = 0;
    guessedLetters = new Set();

    updateWordDisplay();
    updateStatus();
    drawFigure(0);
    buildKeyboard();

    messageSpan.textContent = `A word with ${secretWord.length} letters has been chosen.`;
  }

  /**
   * Updates the text representation of the current word state.
   */
  function updateWordDisplay() {
    wordDisplay.textContent = revealed.join(" ");
  }

  /**
   * Updates the wrong guess counter and the list of guessed letters.
   */
  function updateStatus() {
    wrongCountSpan.textContent = String(wrongGuesses);

    if (guessedLetters.size === 0) {
      guessedLettersSpan.textContent = "–";
    } else {
      guessedLettersSpan.textContent = Array.from(guessedLetters).join(", ");
    }
  }

  /**
   * Writes the ASCII hangman figure corresponding to the given stage.
   */
  function drawFigure(stage) {
    const index = Math.min(Math.max(stage, 0), hangmanStages.length - 1);
    figurePre.textContent = hangmanStages[index];
  }

  // ---------------------------------------------------------------------------
  // On-screen keyboard
  // ---------------------------------------------------------------------------

  /**
   * Builds the A–Z keyboard and wires click handlers for each letter.
   */
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

  /**
   * Updates the disabled state of all keyboard buttons based on the guess set.
   */
  function updateKeyboardState() {
    const buttons = keyboardContainer.querySelectorAll("button");
    buttons.forEach((btn) => {
      const letter = btn.textContent.toLowerCase();
      btn.disabled = guessedLetters.has(letter);
    });
  }

  /**
   * Disables all keyboard buttons once the game has finished.
   */
  function disableKeyboard() {
    const buttons = keyboardContainer.querySelectorAll("button");
    buttons.forEach((btn) => {
      btn.disabled = true;
    });
  }

  // ---------------------------------------------------------------------------
  // Guess handling and end-of-game logic
  // ---------------------------------------------------------------------------

  /**
   * Processes a single letter guess and updates the state and UI.
   */
  function handleGuess(letter) {
    if (isGameOver()) {
      return;
    }

    if (guessedLetters.has(letter)) {
      messageSpan.textContent = `The letter "${letter.toUpperCase()}" has already been tried.`;
      return;
    }

    guessedLetters.add(letter);

    if (secretWord.includes(letter)) {
      for (let i = 0; i < secretWord.length; i++) {
        if (secretWord[i] === letter) {
          revealed[i] = letter;
        }
      }
      messageSpan.textContent = `Correct: "${letter.toUpperCase()}" is in the word.`;
    } else {
      wrongGuesses++;
      messageSpan.textContent = `Incorrect: "${letter.toUpperCase()}" is not in the word.`;
    }

    updateWordDisplay();
    updateStatus();
    drawFigure(wrongGuesses);
    updateKeyboardState();
    checkGameEnd();
  }

  /**
   * Returns true once the game has either been won or lost.
   */
  function isGameOver() {
    const wordGuessed = revealed.join("") === secretWord;
    const noAttemptsLeft = wrongGuesses >= maxWrongGuesses;
    return wordGuessed || noAttemptsLeft;
  }

  /**
   * Evaluates whether the player has won or lost and updates the game message.
   */
  function checkGameEnd() {
    const wordGuessed = revealed.join("") === secretWord;
    const noAttemptsLeft = wrongGuesses >= maxWrongGuesses;

    if (wordGuessed) {
      messageSpan.textContent = "Congratulations! The word has been guessed. 🎉";
      disableKeyboard();
    } else if (noAttemptsLeft) {
      messageSpan.textContent = `Game over. The word was "${secretWord.toUpperCase()}".`;
      drawFigure(maxWrongGuesses);
      disableKeyboard();
    }
  }

  // ---------------------------------------------------------------------------
  // Initialisation
  // ---------------------------------------------------------------------------

  newGameButton.addEventListener("click", () => {
    startNewGame();
  });

  // Show a neutral state on first load so that the structure is visible.
  buildKeyboard();
  drawFigure(0);
  updateWordDisplay();
  updateStatus();
});
