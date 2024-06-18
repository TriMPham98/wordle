let TEST_WORD; // Initialize TEST_WORD

document.addEventListener("DOMContentLoaded", async function () {
  const response = await fetch("words.txt");
  const data = await response.text();
  const words = data.split("\n");
  TEST_WORD = words[Math.floor(Math.random() * words.length)]
    .trim()
    .toUpperCase();
  console.log("Test Word:", TEST_WORD); // Log the test word to the console
  document.getElementById("wordInput").focus();
});

let currentGuess = 1; // Track the current guess number

document
  .getElementById("wordInput")
  .addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      // Check if the Enter key was pressed
      const input = event.target.value.toUpperCase();
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

        event.target.value = ""; // Clear input after filling the cells

        // Compare input with the test word
        if (input === TEST_WORD) {
          console.log("Correct! The word matches the test word.");
          document.getElementById("wordInput").style.display = "none"; // Hide input field
          event.target.value = ""; // Clear input after correct guess
          // Reset or end game logic here
        } else {
          console.log("Incorrect. Try again.");
          currentGuess++; // Move to the next guess
          if (currentGuess > 6) {
            document.getElementById("wordInput").style.display = "none"; // Hide input field
            console.log("No more guesses left.");
            // Handle end of game, e.g., reveal word, disable input
          }
        }
      } else {
        console.log("Invalid input. Please enter only letters.");
        event.target.value = ""; // Clear the input field if invalid
      }
    }
  });
