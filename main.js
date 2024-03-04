const defaultValues = {
  players: ["X", "O"],
  fieldSize: 3,
  itemsInRowToWin: 3,
};

const events = {
  update: "update-field",
  restart: "restart-game",
};

let currentRound = createRound();

window.addEventListener(events.update, () => {
  render(currentRound, handleCellClick, handleRestartClick);
});

window.addEventListener(events.restart, () => {
  currentRound = createRound();
  window.dispatchEvent(new Event(events.update));
});

window.dispatchEvent(new Event(events.update));

function handleCellClick(i, j) {
  const { players, turnIndex, field, fieldSize, result } = currentRound;
  const currentPlayer = players[turnIndex % players.length];

  if (result.type !== "playing") {
    return;
  }

  if (field[i][j]) {
    return;
  }

  currentRound.field[i][j] = currentPlayer;
  currentRound.result.winner = checkWinnerOnField() ? currentPlayer : null;
  currentRound.turnIndex++;

  let isFieldFilled = field.flat().join("").length === fieldSize ** 2;

  if (result.winner) {
    result.type = "win";
  } else {
    if (isFieldFilled) {
      result.type = "draw";
    }
  }

  window.dispatchEvent(new Event(events.update));
}

function handleRestartClick() {
  window.dispatchEvent(new Event(events.restart));
}

function checkWinnerOnField() {
  const { field, fieldSize, itemsInRowToWin } = currentRound;

  const isWinnerInRows = field.some((row) => checkWinnerInRow(row));
  if (isWinnerInRows) {
    return true;
  }

  const isWinnerInColumns = field.some((_, i) => {
    return checkWinnerInRow(field.map((row) => row[i]));
  });
  if (isWinnerInColumns) {
    return true;
  }

  const iterations = fieldSize - itemsInRowToWin + 1;
  for (let i = 0; i < iterations; i++) {
    for (let j = 0; j < iterations; j++) {
      const fieldPart = field.slice(i, i + itemsInRowToWin);

      const isWinnerInFirstDiagonal = checkWinnerInRow(
        fieldPart.map((row, index) => row[index + j])
      );
      const isWinnerInSecondDiagonal = checkWinnerInRow(
        fieldPart.map((row, index) => row[itemsInRowToWin - 1 - index + j])
      );

      if (isWinnerInFirstDiagonal || isWinnerInSecondDiagonal) {
        return true;
      }
    }
  }

  return false;
}

function checkWinnerInRow(row) {
  const { itemsInRowToWin, players, turnIndex } = currentRound;
  return row
    .join("")
    .includes(players[turnIndex % players.length].repeat(itemsInRowToWin));
}

function createRound() {
  const { players, itemsInRowToWin, fieldSize } = defaultValues;

  return {
    turnIndex: 0,
    players,
    itemsInRowToWin,
    fieldSize,
    result: {
      type: "playing" /*  playing | draw | win  */,
      winner: null,
    },
    field: Array.from({ length: fieldSize }, () =>
      Array.from({ length: fieldSize }, () => "")
    ),
  };
}

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
