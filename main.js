let TEST_WORD; // Initialize TEST_WORD

document.addEventListener("DOMContentLoaded", async function () {
  const response = await fetch("words.txt");
  const data = await response.text();
  const words = data.split("\n");
  TEST_WORD = words[Math.floor(Math.random() * words.length)]
    .trim()
    .toUpperCase();
  console.log("Test Word:", TEST_WORD); // Log the test word to the console
});

let currentGuess = 1; // Track the current guess number

document
  .addEventListener("keydown", function (event) {
    const allowedKeys = /^[A-Z]$/i;
    if (allowedKeys.test(event.key) && currentGuess <= 6) {
      const rowClass = `${["first", "second", "third", "fourth", "fifth", "sixth"][currentGuess - 1]}-row`;
      const cells = document.querySelectorAll(`.${rowClass} .cell`);
      const filledCells = Array.from(cells).filter(cell => cell.textContent !== "");
      if (filledCells.length < 5) {
        cells[filledCells.length].textContent = event.key.toUpperCase();
      }
    }
    if (event.key === "Backspace" && currentGuess <= 6) {
      const rowClass = `${["first", "second", "third", "fourth", "fifth", "sixth"][currentGuess - 1]}-row`;
      const cells = document.querySelectorAll(`.${rowClass} .cell`);
      const filledCells = Array.from(cells).filter(cell => cell.textContent !== "");
      if (filledCells.length > 0) {
        cells[filledCells.length - 1].textContent = "";
      }
    }
    if (event.key === "Enter") {
      // Check if the Enter key was pressed
      const input = Array.from(document.querySelectorAll(`.${["first", "second", "third", "fourth", "fifth", "sixth"][currentGuess - 1]}-row .cell`)).map(cell => cell.textContent).join("");
      if (/^[A-Z]{5}$/.test(input)) {
        // Check if input contains exactly 5 letters
        const rowClass = `${
          ["first", "second", "third", "fourth", "fifth", "sixth"][
            currentGuess - 1
          ]
        }-row`;
        const cells = document.querySelectorAll(`.${rowClass} .cell`);

        const letterCount = {};
        TEST_WORD.split("").forEach((char) => {
          letterCount[char] = (letterCount[char] || 0) + 1;
        });

        const usedLetters = {};

        // First pass: check for exact matches
        cells.forEach((cell, index) => {
          cell.textContent = input[index];
          if (input[index] === TEST_WORD[index]) {
            cell.style.backgroundColor = "green";
            letterCount[input[index]]--;
            usedLetters[input[index]] = (usedLetters[input[index]] || 0) + 1;
          }
        });

        // Second pass: check for partial matches
        cells.forEach((cell, index) => {
          if (cell.style.backgroundColor !== "green") {
            if (
              TEST_WORD.includes(input[index]) &&
              (usedLetters[input[index]] || 0) < letterCount[input[index]]
            ) {
              cell.style.backgroundColor = "yellow";
              usedLetters[input[index]] = (usedLetters[input[index]] || 0) + 1;
            } else {
              cell.style.backgroundColor = "";
            }
          }
        });

        // Compare input with the test word
        if (input === TEST_WORD) {
          console.log("Correct! The word matches the test word.");
          // Hide input field
          // Clear input after correct guess
          // Reset or end game logic here
        } else {
          console.log("Incorrect. Try again.");
          currentGuess++; // Move to the next guess
          if (currentGuess > 6) {
            // Hide input field
            console.log("No more guesses left.");
            // Handle end of game, e.g., reveal word, disable input
          }
        }
      } else {
        console.log("Invalid input. Please enter only letters.");
        // Clear the input field if invalid
      }
    }
  });
