const TEST_WORD = "HELLO"; // Define a test word

document
  .getElementById("wordInput")
  .addEventListener("keyup", function (event) {
    // console.log("Event triggered", event.key); // Log the key that was pressed
    if (event.key === "Enter") {
      // Check if the Enter key was pressed
      const input = event.target.value.toUpperCase();
      if (/^[A-Z]{5}$/.test(input)) { // Check if input contains exactly 5 letters
        const cells = document.querySelectorAll(".first-row .cell");
        cells.forEach((cell, index) => {
          cell.textContent = input[index];
        //   console.log(`Cell ${index} set to:`, cell.textContent); // Log each cell's content
        });
        event.target.value = ""; // Clear input after filling the cells

        // Compare input with the test word
        if (input === TEST_WORD) {
          console.log("Correct! The word matches the test word.");
        } else {
          console.log("Incorrect. Try again.");
        }
      } else {
        console.log("Invalid input. Please enter only letters.");
        event.target.value = ""; // Optionally clear the input field if invalid
      }
    }
  });