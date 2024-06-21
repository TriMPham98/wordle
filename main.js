let TEST_WORD; // Initialize TEST_WORD

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const response = await fetch("words.txt");
    const data = await response.text();
    const words = data.split("\n");
    TEST_WORD = words[Math.floor(Math.random() * words.length)]
      .trim()
      .toUpperCase();
    console.log("Test Word:", TEST_WORD); // Log the test word to the console
  } catch (error) {
    console.error("Error loading words:", error);
    TEST_WORD = "WOULD"; // Fallback word if loading fails
  }
});

let currentGuess = 1; // Track the current guess number

document.addEventListener("keydown", function (event) {
  const allowedKeys = /^[A-Z]$/i;
  if (allowedKeys.test(event.key) && currentGuess <= 6) {
    const rowClass = `${
      ["first", "second", "third", "fourth", "fifth", "sixth"][currentGuess - 1]
    }-row`;
    const cells = document.querySelectorAll(`.${rowClass} .cell`);
    const filledCells = Array.from(cells).filter(
      (cell) => cell.textContent !== ""
    );
    if (filledCells.length < 5) {
      cells[filledCells.length].textContent = event.key.toUpperCase();
    }
  }
  if (event.key === "Backspace" && currentGuess <= 6) {
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
  if (event.key === "Enter") {
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

    console.log("Input:", input);
    console.log("Test Word:", TEST_WORD);

    if (/^[A-Z]{5}$/.test(input)) {
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

      // First pass: check for exact matches (green)
      // Inside the Enter key event listener, after the input validation
      cells.forEach((cell, index) => {
        if (input[index] === TEST_WORD[index]) {
          console.log(`Letter ${input[index]} at position ${index} is correct`);
          cell.style.backgroundColor = "green";
        } else if (TEST_WORD.includes(input[index])) {
          console.log(
            `Letter ${input[index]} at position ${index} is in the word but wrong position`
          );
          cell.style.backgroundColor = "#d2b100";
        } else {
          console.log(
            `Letter ${input[index]} at position ${index} is incorrect`
          );
          cell.style.backgroundColor = "gray";
        }
        // Remove the setTimeout to see if it's causing issues
        cell.style.transform = "rotateX(360deg)";
      });

      if (input === TEST_WORD) {
        console.log("Correct! The word matches the test word.");
        // Add logic for winning the game
      } else {
        // Second pass: check for partial matches (yellow) and incorrect (gray)
        cells.forEach((cell, index) => {
          if (cell.style.backgroundColor !== "green") {
            setTimeout(() => {
              cell.style.transform = "rotateX(360deg)";
              if (
                TEST_WORD.includes(input[index]) &&
                (usedLetters[input[index]] || 0) < letterCount[input[index]]
              ) {
                cell.style.backgroundColor = "#d2b100";
                usedLetters[input[index]] =
                  (usedLetters[input[index]] || 0) + 1;
              } else {
                cell.style.backgroundColor = "gray";
              }
            }, index * 150);
          }
        });
        console.log("Incorrect. Try again.");
        currentGuess++; // Move to the next guess
        if (currentGuess > 6) {
          console.log("No more guesses left. The word was: " + TEST_WORD);
        }
      }
    } else {
      console.log("Invalid input. Please enter only letters.");
    }
  }
});
