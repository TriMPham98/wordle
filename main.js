let TEST_WORD;
let currentGuess = 1;
const keyboardKeys = {};
let validWords = [];
let commonWords = [];
let gameOver = false;

document.addEventListener("DOMContentLoaded", async function () {
  try {
    // Load valid words
    const validWordsResponse = await fetch("valid-words.txt");
    const validWordsData = await validWordsResponse.text();
    validWords = validWordsData
      .split("\n")
      .map((word) => word.trim().toUpperCase());

    // Load common words
    const commonWordsResponse = await fetch("common-words.txt");
    const commonWordsData = await commonWordsResponse.text();
    commonWords = commonWordsData
      .split("\n")
      .map((word) => word.trim().toUpperCase());

    startNewGame();
  } catch (error) {
    console.error("Error loading words:", error);
    TEST_WORD = "WOULD";
    validWords = [TEST_WORD];
    commonWords = [TEST_WORD];
    startNewGame();
  }

  initializeKeyboard();
});

function startNewGame() {
  // Pick a random word from common words
  TEST_WORD = commonWords[Math.floor(Math.random() * commonWords.length)];
  console.log("Test Word:", TEST_WORD);

  // Reset game state
  currentGuess = 1;
  gameOver = false;

  // Clear the game board
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.textContent = "";
    cell.style.backgroundColor = "";
    cell.style.borderColor = "";
    cell.style.color = "";
    cell.style.transform = "";
  });

  // Reset keyboard colors
  document.querySelectorAll(".key").forEach((key) => {
    key.style.backgroundColor = "";
    key.style.color = "";
  });

  // Hide the new game popup if it's visible
  const popup = document.getElementById("newGamePopup");
  if (popup) {
    popup.remove();
  }
}

function initializeKeyboard() {
  document.querySelectorAll(".key").forEach((key) => {
    keyboardKeys[key.dataset.key] = key;
    key.addEventListener("click", handleKeyClick);
  });

  document.addEventListener("keydown", handleKeyPress);
}

function handleKeyClick() {
  const keyValue = this.dataset.key;
  processKey(keyValue);
}

function handleKeyPress(event) {
  const keyValue = event.key.toUpperCase();
  if (
    /^[A-Z]$/.test(keyValue) ||
    keyValue === "BACKSPACE" ||
    keyValue === "ENTER"
  ) {
    processKey(keyValue);
  }
}

function processKey(keyValue) {
  if (gameOver) {
    if (keyValue === "ENTER") {
      startNewGame();
    }
    return;
  }

  if (keyValue === "BACKSPACE") {
    handleBackspace();
  } else if (keyValue === "ENTER") {
    handleEnter();
  } else {
    handleKeyInput(keyValue);
  }
}

function handleKeyInput(key) {
  if (currentGuess <= 6) {
    const rowClass = `${
      ["first", "second", "third", "fourth", "fifth", "sixth"][currentGuess - 1]
    }-row`;
    const cells = document.querySelectorAll(`.${rowClass} .cell`);
    const emptyCell = Array.from(cells).find((cell) => cell.textContent === "");
    if (emptyCell) {
      emptyCell.textContent = key;
    }
  }
}

function handleBackspace() {
  if (currentGuess <= 6) {
    const rowClass = `${
      ["first", "second", "third", "fourth", "fifth", "sixth"][currentGuess - 1]
    }-row`;
    const cells = document.querySelectorAll(`.${rowClass} .cell`);
    const lastFilledCell = Array.from(cells)
      .reverse()
      .find((cell) => cell.textContent !== "");
    if (lastFilledCell) {
      lastFilledCell.textContent = "";
    }
  }
}

function handleEnter() {
  const rowClass = `${
    ["first", "second", "third", "fourth", "fifth", "sixth"][currentGuess - 1]
  }-row`;
  const cells = document.querySelectorAll(`.${rowClass} .cell`);
  const input = Array.from(cells)
    .map((cell) => cell.textContent)
    .join("");

  if (input.length === 5) {
    if (validWords.includes(input)) {
      processGuess(input);
    } else {
      showMessage("Not in word list");
    }
  } else {
    console.log("Please enter a 5-letter word.");
  }
}

function showMessage(text) {
  const messageElement = document.createElement("div");
  messageElement.textContent = text;
  messageElement.style.cssText = `
    position: fixed;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 16px;
  `;
  document.body.appendChild(messageElement);
  setTimeout(() => {
    messageElement.remove();
  }, 2000);
}

function processGuess(input) {
  const cells = document.querySelectorAll(
    `.${
      ["first", "second", "third", "fourth", "fifth", "sixth"][currentGuess - 1]
    }-row .cell`
  );
  const letterCount = {};
  for (let char of TEST_WORD) {
    letterCount[char] = (letterCount[char] || 0) + 1;
  }

  const cellStates = new Array(5).fill("gray");

  // First pass: Mark correct letters
  for (let i = 0; i < 5; i++) {
    if (input[i] === TEST_WORD[i]) {
      cellStates[i] = "green";
      letterCount[input[i]]--;
    }
  }

  // Second pass: Mark present letters
  for (let i = 0; i < 5; i++) {
    if (cellStates[i] === "gray" && letterCount[input[i]] > 0) {
      cellStates[i] = "yellow";
      letterCount[input[i]]--;
    }
  }

  animateCells(cells, cellStates, input);
}

function animateCells(cells, cellStates, input) {
  cells.forEach((cell, index) => {
    setTimeout(() => {
      updateCellAndKey(cell, keyboardKeys[input[index]], cellStates[index]);
      if (index === 4) {
        checkGameState(input);
      }
    }, index * 250);
  });
}

function updateCellAndKey(cell, key, state) {
  const colors = { green: "#6aaa64", yellow: "#c9b458", gray: "#787c7e" };
  const color = colors[state];

  cell.style.backgroundColor = color;
  cell.style.borderColor = color;
  cell.style.color = "white";
  cell.style.transform = "rotateX(360deg)";

  if (key) {
    // Update keyboard key color only if it's an improvement
    if (
      state === "green" ||
      (state === "yellow" && key.style.backgroundColor !== colors.green) ||
      (state === "gray" &&
        key.style.backgroundColor !== colors.green &&
        key.style.backgroundColor !== colors.yellow)
    ) {
      key.style.backgroundColor = color;
      key.style.color = "white";
    }
  }
}

function checkGameState(input) {
  if (input === TEST_WORD) {
    console.log("Correct! You've won the game!");
    showMessage(
      `Congratulations! You've guessed the word in ${currentGuess} ${
        currentGuess === 1 ? "try" : "tries"
      }.`
    );
    gameOver = true;
    showNewGamePopup("You won!");
  } else {
    console.log("Incorrect. Try again.");
  }

  currentGuess++;
  if (currentGuess > 6 && input !== TEST_WORD) {
    console.log("Game over. The word was: " + TEST_WORD);
    showMessage(`Game over. The word was: ${TEST_WORD}`);
    gameOver = true;
    showNewGamePopup("Game over");
  }
}

function showNewGamePopup(message) {
  // Remove any existing popup
  const existingPopup = document.getElementById("newGamePopup");
  if (existingPopup) {
    existingPopup.remove();
  }

  const popup = document.createElement("div");
  popup.id = "newGamePopup";
  popup.innerHTML = `
    <div class="popup-content">
      <h2>${message}</h2>
      <p>The word was: <strong>${TEST_WORD}</strong></p>
      <button id="newGameButton">Play Again</button>
      <p>Press ENTER to start a new game</p>
    </div>
  `;
  popup.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.75);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  `;

  const style = document.createElement("style");
  style.textContent = `
    .popup-content {
      background-color: #121213;
      color: #ffffff;
      padding: 24px;
      border-radius: 12px;
      text-align: center;
      max-width: 90%;
      width: 300px;
      box-shadow: 0 4px 23px 0 rgba(0, 0, 0, 0.2);
    }
    .popup-content h2 {
      font-size: 24px;
      margin-bottom: 16px;
    }
    .popup-content p {
      font-size: 18px;
      margin-bottom: 24px;
    }
    .popup-content strong {
      color: #6aaa64;
    }
    #newGameButton {
      background-color: #538d4e;
      color: #ffffff;
      border: none;
      padding: 12px 24px;
      font-size: 16px;
      font-weight: bold;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s ease;
      margin-bottom: 16px;
    }
    #newGameButton:hover {
      background-color: #6aaa64;
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(popup);

  document.getElementById("newGameButton").addEventListener("click", () => {
    startNewGame();
  });
}
