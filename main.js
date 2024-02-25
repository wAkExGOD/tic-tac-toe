let turnIndex = 0;
let winner = "";
let isDraw = false;

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

let rows = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

window.addEventListener("update-field", () => {
  render(
    {
      rows,
      turnIndex,
      winner,
      isDraw,
    },
    handleCellClick,
    handleRestartClick
  );
});

window.addEventListener("restart-game", () => {
  turnIndex = 0;
  winner = "";
  isDraw = false;
  rows = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  window.dispatchEvent(new Event("update-field"));
});

window.dispatchEvent(new Event("update-field"));

function handleCellClick(i, j) {
  if (winner || isDraw) {
    return;
  }

  if (rows[i][j]) {
    return;
  }

  rows[i][j] = ["X", "O"][turnIndex % 2];
  winner = getWinner(rows);
  isDraw = rows.flat().join("").length === 9 && !winner;
  turnIndex++;

  window.dispatchEvent(new Event("update-field"));
}

function handleRestartClick() {
  window.dispatchEvent(new Event("restart-game"));
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

function render(gameInfo, onCellClick, onRestartClick) {
  const { rows, turnIndex, winner, isDraw } = gameInfo;

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

  if (winner || isDraw) {
    const notificationDiv = document.createElement("div");
    const restartGameButton = document.createElement("div");

    notificationDiv.classList.add("notification");
    restartGameButton.classList.add("restart");
    restartGameButton.textContent = "Играть снова";
    restartGameButton.addEventListener("click", onRestartClick);
    notificationDiv.textContent = winner
      ? `Победил игрок ${winner}!`
      : "Ничья!";

    infoDiv.appendChild(notificationDiv);
    infoDiv.appendChild(restartGameButton);

    turnInfoDiv.classList.add("hidden");
  }
}