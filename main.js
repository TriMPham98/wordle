let TEST_WORD;
let currentGuess = 1;
const keyboardKeys = {};
let validWords = [];

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const response = await fetch("words.txt");
    const data = await response.text();
    validWords = data.split("\n").map((word) => word.trim().toUpperCase());
    TEST_WORD = validWords[Math.floor(Math.random() * validWords.length)];
    console.log("Test Word:", TEST_WORD);
  } catch (error) {
    console.error("Error loading words:", error);
    TEST_WORD = "WOULD";
    validWords = [TEST_WORD];
  }

  initializeKeyboard();
});

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
    // Add additional winning game logic here if needed
  } else {
    console.log("Incorrect. Try again.");
  }

  currentGuess++;
  if (currentGuess > 6 && input !== TEST_WORD) {
    console.log("Game over. The word was: " + TEST_WORD);
    showMessage(`Game over. The word was: ${TEST_WORD}`);
    // Add additional losing game logic here if needed
  }
}
