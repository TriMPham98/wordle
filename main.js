const TEST_WORD = "HELLO"; // Define a test word

document
  .getElementById("wordInput")
  .addEventListener("keyup", function (event) {
    // console.log("Event triggered", event.key); // Log the key that was pressed
    if (event.key === "Enter") {
      // Check if the Enter key was pressed
      const input = event.target.value.toUpperCase();
      if (input.length === 5) {
        console.log("Correct input length"); // Confirm input length is 5
        const cells = document.querySelectorAll(".first-row .cell");
        console.log("Cells selected:", cells.length); // Log the number of cells selected
        cells.forEach((cell, index) => {
          cell.textContent = input[index];
          console.log(`Cell ${index} set to:`, cell.textContent); // Log each cell's content
        });
        event.target.value = ""; // Clear input after filling the cells

        // Compare input with the test word
        if (input === TEST_WORD) {
          console.log("Correct! The word matches the test word.");
        } else {
          console.log("Incorrect. Try again.");
        }
      }
    }
  });