let TEST_WORD;
let currentGuess = 1;
const keyboardKeys = {};

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const response = await fetch("words.txt");
    const data = await response.text();
    const words = data.split("\n");
    TEST_WORD = words[Math.floor(Math.random() * words.length)]
      .trim()
      .toUpperCase();
    console.log("Test Word:", TEST_WORD);
  } catch (error) {
    console.error("Error loading words:", error);
    TEST_WORD = "WOULD";
  }

  // Initialize keyboard key elements
  document.querySelectorAll(".key").forEach((key) => {
    keyboardKeys[key.textContent] = key;
  });

  // Add click event listeners to keyboard keys
  document.querySelectorAll(".key").forEach((key) => {
    key.addEventListener("click", function () {
      const keyValue = this.textContent;
      if (keyValue === "⌫") {
        handleBackspace();
      } else if (keyValue === "ENTER") {
        handleEnter();
      } else {
        handleKeyInput(keyValue);
      }
    });
  });
});

document.addEventListener("keydown", function (event) {
  if (/^[A-Z]$/i.test(event.key)) {
    handleKeyInput(event.key.toUpperCase());
  } else if (event.key === "Backspace") {
    handleBackspace();
  } else if (event.key === "Enter") {
    handleEnter();
  }
});

function handleKeyInput(key) {
  if (currentGuess <= 6) {
    const rowClass = `${
      ["first", "second", "third", "fourth", "fifth", "sixth"][currentGuess - 1]
    }-row`;
    const cells = document.querySelectorAll(`.${rowClass} .cell`);
    const filledCells = Array.from(cells).filter(
      (cell) => cell.textContent !== ""
    );
    if (filledCells.length < 5) {
      cells[filledCells.length].textContent = key;
    }
  }
}

function handleBackspace() {
  if (currentGuess <= 6) {
    const rowClass = `${
      ["first", "second", "third", "fourth", "fifth", "sixth"][currentGuess - 1]
    }-row`;
    const cells = document.querySelectorAll(`.${rowClass} .cell`);
    const filledCells = Array.from(cells).filter(
      (cell) => cell.textContent !== ""
    );
    if (filledCells.length > 0) {
      cells[filledCells.length - 1].textContent = "";
    }
  }
}

function handleEnter() {
  const input = Array.from(
    document.querySelectorAll(
      `.${
        ["first", "second", "third", "fourth", "fifth", "sixth"][
          currentGuess - 1
        ]
      }-row .cell`
    )
  )
    .map((cell) => cell.textContent)
    .join("");

  if (/^[A-Z]{5}$/.test(input)) {
    processGuess(input);
  } else {
    console.log("Invalid input. Please enter only letters.");
  }
}

function processGuess(input) {
  const rowClass = `${
    ["first", "second", "third", "fourth", "fifth", "sixth"][currentGuess - 1]
  }-row`;
  const cells = document.querySelectorAll(`.${rowClass} .cell`);

  const letterCount = {};
  TEST_WORD.split("").forEach((char) => {
    letterCount[char] = (letterCount[char] || 0) + 1;
  });

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

  // Animate and color cells sequentially
  animateCells(cells, cellStates, input);
}

function animateCells(cells, cellStates, input) {
  let index = 0;
  const animateNext = () => {
    if (index >= cells.length) {
      checkGameState(input);
      return;
    }

    const cell = cells[index];
    const letter = input[index];
    cell.style.transform = "rotateX(360deg)";

    setTimeout(() => {
      updateCellAndKey(cell, keyboardKeys[letter], cellStates[index]);
      cell.style.transform = "rotateX(360deg)";
      setTimeout(() => animateNext(), 250);
    }, 250);

    index++;
  };

  animateNext();
}

function updateCellAndKey(cell, key, state) {
  let color;
  if (state === "green") {
    color = "green";
  } else if (state === "yellow") {
    color = "#d2b100";
  } else {
    color = "gray";
  }

  cell.style.backgroundColor = color;
  if (key) {
    key.style.backgroundColor = color;
    key.style.color = "white";
  }
}

function checkGameState(input) {
  if (input === TEST_WORD) {
    console.log("Correct! You've won the game!");
    // Add winning game logic here
  } else {
    console.log("Incorrect. Try again.");
    currentGuess++;
    if (currentGuess > 6) {
      console.log("Game over. The word was: " + TEST_WORD);
      // Add losing game logic here
    }
  }
}
