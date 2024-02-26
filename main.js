let currentRound = createRound();

const winLines = [
  // Horizontals
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Verticals
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonals
  [0, 4, 8],
  [2, 4, 6],
];

const events = {
  update: 'update-field',
  restart: 'restart-game',
};

window.addEventListener(events.update, () => {
  render(
    currentRound,
    handleCellClick,
    handleRestartClick
  );
});

window.addEventListener(events.restart, () => {
  currentRound = createRound();
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
  let isFieldFilled = currentRound.rows.flat().join("").length === 9;

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
    const [a, b, c] = line;

    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      winner = board[a];
      return true;
    }
  })
    ? winner
    : null;
}

function createRound() {
  return {
    turnIndex: 0,
    result: {
      type: "playing", /*  playing | draw | win  */
      winner: null,
    },
    rows: [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ],
  }
}

function render(currentRound, onCellClick, onRestartClick) {
  const { rows, turnIndex, result } = currentRound;

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
    notificationDiv.textContent = result.type === "win"
      ? `Игрок ${result.winner} победил на ${turnIndex} ходу!`
      : "Ничья!";

    infoDiv.appendChild(notificationDiv);
    infoDiv.appendChild(restartGameButton);

    turnInfoDiv.classList.add("hidden");
  }
}
