let TEST_WORD;
let currentGuess = 1;
const keyboardKeys = {};
let validWords = [];
let commonWords = [];
let gameOver = false;
let nightMode = false;

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
  initializeNightModeToggle();
});

function initializeNightModeToggle() {
  const toggle = document.getElementById("nightModeToggle");
  toggle.addEventListener("change", function () {
    nightMode = this.checked;
    updateNightMode();
  });
}

function updateNightMode() {
  document.body.classList.toggle("night-mode", nightMode);
  updateAllColors();
}

function updateAllColors() {
  document.querySelectorAll(".cell").forEach((cell) => {
    updateCellColor(cell);
  });
  document.querySelectorAll(".key").forEach((key) => {
    updateKeyColor(key);
  });
}

function startNewGame() {
  TEST_WORD = commonWords[Math.floor(Math.random() * commonWords.length)];
  console.log("Test Word:", TEST_WORD);

  currentGuess = 1;
  gameOver = false;

  document.querySelectorAll(".cell").forEach((cell) => {
    cell.textContent = "";
    cell.dataset.state = "";
    cell.style.backgroundColor = "";
    cell.style.borderColor = "";
    cell.style.color = "";
    cell.style.transform = "";
  });

  document.querySelectorAll(".key").forEach((key) => {
    key.dataset.state = "";
    updateKeyColor(key);
  });

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

function shakeRow(rowClass) {
  const row = document.querySelector(`.${rowClass}`);
  row.classList.add("shake");
  setTimeout(() => {
    row.classList.remove("shake");
  }, 500);
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
      showNewGamePopup("Not in word list", true);
      shakeRow(rowClass);
    }
  } else {
    console.log("Please enter a 5-letter word.");
    shakeRow(rowClass);
  }
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

  const cellStates = new Array(5).fill("absent");

  // First pass: Mark correct letters
  for (let i = 0; i < 5; i++) {
    if (input[i] === TEST_WORD[i]) {
      cellStates[i] = "correct";
      letterCount[input[i]]--;
    }
  }

  // Second pass: Mark present letters
  for (let i = 0; i < 5; i++) {
    if (cellStates[i] === "absent" && letterCount[input[i]] > 0) {
      cellStates[i] = "present";
      letterCount[input[i]]--;
    }
  }

  animateCells(cells, cellStates, input);
}

function animateCells(cells, cellStates, input) {
  cells.forEach((cell, index) => {
    setTimeout(() => {
      cell.dataset.state = cellStates[index];
      updateCellAndKey(cell, keyboardKeys[input[index]], cellStates[index]);
      if (index === 4) {
        checkGameState(input);
      }
    }, index * 250);
  });
}

function updateCellAndKey(cell, key, state) {
  updateCellColor(cell);
  if (key) {
    if (
      state === "correct" ||
      (state === "present" && key.dataset.state !== "correct") ||
      (state === "absent" &&
        key.dataset.state !== "correct" &&
        key.dataset.state !== "present")
    ) {
      key.dataset.state = state;
      updateKeyColor(key);
    }
  }
}

function updateCellColor(cell) {
  const state = cell.dataset.state;
  cell.className = `cell ${state}`;
}

function updateKeyColor(key) {
  const state = key.dataset.state;
  key.className = `key ${state}`;
}

function checkGameState(input) {
  if (input === TEST_WORD) {
    console.log("Correct! You've won the game!");
    showNewGamePopup(
      `Congratulations, you've guessed the word in ${currentGuess} ${
        currentGuess === 1 ? "try" : "tries"
      }.`,
      false,
      "You won!"
    );
    gameOver = true;
  } else {
    console.log("Incorrect. Try again.");
  }

  currentGuess++;
  if (currentGuess > 6 && input !== TEST_WORD) {
    console.log("Game over. The word was: " + TEST_WORD);
    showNewGamePopup(`The word was: ${TEST_WORD}`, false, "Game over!");
    gameOver = true;
  }
}

function showNewGamePopup(message, isTemporary = false, title = "") {
  const existingPopup = document.getElementById("newGamePopup");
  if (existingPopup) {
    existingPopup.remove();
  }

  const popup = document.createElement("div");
  popup.id = "newGamePopup";

  if (isTemporary) {
    popup.innerHTML = `<div class="popup-content"><p>${message}</p></div>`;
    popup.classList.add("temporary");
    document.body.appendChild(popup);
    setTimeout(() => {
      popup.remove();
    }, 2000);
  } else {
    popup.innerHTML = `
      <div class="popup-content">
        <h2>${title}</h2>
        <p>${message}</p>
        <button id="newGameButton">Play Again</button>
        <p>Press ENTER to start a new game</p>
      </div>
    `;

    document.body.appendChild(popup);

    document.getElementById("newGameButton").addEventListener("click", () => {
      startNewGame();
    });
  }
}
