const fieldSize = 3;
const events = {
  update: "update-field",
  restart: "restart-game",
};

const winLines = createWinLinesBySize(fieldSize);
let currentRound = createRound(fieldSize);

window.addEventListener(events.update, () => {
  render(currentRound, handleCellClick, handleRestartClick);
});

window.addEventListener(events.restart, () => {
  currentRound = createRound(fieldSize);
  window.dispatchEvent(new Event(events.update));
});

window.dispatchEvent(new Event(events.update));

function handleCellClick(i, j) {
  if (currentRound.result.type !== "playing") {
    return;
  }

  if (currentRound.rows[i][j]) {
    return;
  }

  currentRound.rows[i][j] = ["X", "O"][currentRound.turnIndex % 2];
  currentRound.result.winner = getWinner(currentRound.rows);
  currentRound.turnIndex++;
  let isFieldFilled =
    currentRound.rows.flat().join("").length === fieldSize * fieldSize;

  if (currentRound.result.winner) {
    currentRound.result.type = "win";
  } else {
    if (isFieldFilled) {
      currentRound.result.type = "draw";
    }
  }

  window.dispatchEvent(new Event(events.update));
}

function handleRestartClick() {
  window.dispatchEvent(new Event(events.restart));
}

function getWinner(rows) {
  const board = rows.flat();

  let winner = "";
  return winLines.some((line) => {
    let firstItem = board[line[0]];
    const isWin = line.every((index) => board[index] === firstItem);

    if (isWin) {
      winner = firstItem;
      return true;
    }
  })
    ? winner
    : null;
}

function createWinLinesBySize(size) {
  const winLines = [];

  // horizontals
  winLines.push(
    ...Array.from({ length: size }, (_, i) =>
      Array.from({ length: size }, (_, j) => i * size + j)
    )
  );

  // verticals
  winLines.push(
    ...Array.from({ length: size }, (_, i) =>
      Array.from({ length: size }, (_, j) => winLines[j][i])
    )
  );

  // diagonals
  const combinationLeft = Array.from(
    { length: size },
    (_, i) => winLines[i][i]
  );
  const combinationRight = Array.from(
    { length: size },
    (_, i) => winLines[i][size - i - 1]
  );
  winLines.push(combinationLeft, combinationRight);

  return winLines;
}

function createRound(fieldSize = 3) {
  return {
    turnIndex: 0,
    fieldSize,
    result: {
      type: "playing" /*  playing | draw | win  */,
      winner: null,
    },
    rows: Array.from({ length: fieldSize }, () =>
      Array.from({ length: fieldSize }, () => "")
    ),
  };
}

function render(currentRound, onCellClick, onRestartClick) {
  const { rows, turnIndex, fieldSize, result } = currentRound;

  document.body.style = `--field-size: ${fieldSize}`;
  const fieldDiv = document.querySelector(".field");
  const turnInfoDiv = document.querySelector(".turn");
  const infoDiv = document.querySelector(".info");

  const player = ["X", "O"][turnIndex % 2];

  turnInfoDiv.classList.remove("hidden");
  turnInfoDiv.innerText = `Ход #${turnIndex + 1}: ${player}`;

  fieldDiv.innerHTML = "";
  infoDiv.innerHTML = "";

  rows.forEach((row, i) => {
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
