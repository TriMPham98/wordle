document
  .getElementById("wordInput")
  .addEventListener("input", function (event) {
    const input = event.target.value.toUpperCase();
    if (input.length === 5) {
      // Assuming you want to fill the first row for demonstration
      const cells = document.querySelectorAll(".row:first-child .cell");
      cells.forEach((cell, index) => {
        cell.textContent = input[index];
      });
      event.target.value = ""; // Clear input after filling the cells
    }
  });
