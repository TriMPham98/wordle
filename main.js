const TEST_WORD = "HELLO"; // Define a test word

let currentGuess = 1; // Track the current guess number

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('wordInput').focus();
});

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
        cells.forEach((cell, index) => {
          cell.textContent = input[index];
          if (input[index] === TEST_WORD[index]) {
            cell.style.backgroundColor = "green";
            letterCount[input[index]]--;
          } else if (
            TEST_WORD.includes(input[index]) &&
            (usedLetters[input[index]] || 0) < letterCount[input[index]]
          ) {
            cell.style.backgroundColor = "yellow";
            usedLetters[input[index]] = (usedLetters[input[index]] || 0) + 1;
          } else {
            cell.style.backgroundColor = "";
          }
        });
        event.target.value = ""; // Clear input after filling the cells

        // Compare input with the test word
        if (input === TEST_WORD) {
          console.log("Correct! The word matches the test word.");
          document.getElementById('wordInput').style.display = 'none'; // Hide input field
          event.target.value = ""; // Clear input after correct guess
          // Reset or end game logic here
        } else {
          console.log("Incorrect. Try again.");
          currentGuess++; // Move to the next guess
          if (currentGuess > 6) {
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


