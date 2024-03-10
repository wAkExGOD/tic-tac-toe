function render(currentRound, onCellClick, onRestartClick) {
  const { field, turnIndex, fieldSize, result } = currentRound;

  document.body.style = `--field-size: ${fieldSize}`;
  const fieldDiv = document.querySelector(".field");
  const turnInfoDiv = document.querySelector(".turn");
  const infoDiv = document.querySelector(".info");

  turnInfoDiv.classList.remove("hidden");
  turnInfoDiv.innerText = `Ход #${turnIndex + 1}: ${["X", "O"][turnIndex % 2]}`;

  fieldDiv.innerHTML = "";
  infoDiv.innerHTML = "";

  field.forEach((row, i) => {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row");

    row.forEach((cell, j) => {
      const cellDiv = document.createElement("div");
      cellDiv.innerText = cell;
      cellDiv.classList.add("cell");
      rowDiv.appendChild(cellDiv);

      cellDiv.addEventListener("click", () => onCellClick(i, j));
    });

    fieldDiv.appendChild(rowDiv);
  });

  if (result.type !== "playing") {
    const notificationDiv = document.createElement("div");
    const restartGameButton = document.createElement("div");

    notificationDiv.classList.add("notification");
    restartGameButton.classList.add("restart");
    restartGameButton.textContent = "Играть снова";
    restartGameButton.addEventListener("click", onRestartClick);
    notificationDiv.textContent =
      result.type === "win"
        ? `Игрок ${result.winner} победил на ${turnIndex} ходу!`
        : "Ничья!";

    infoDiv.appendChild(notificationDiv);
    infoDiv.appendChild(restartGameButton);

    turnInfoDiv.classList.add("hidden");
  }
}
