const fieldSize = 3;
const events = {
  update: "update-field",
  restart: "restart-game",
};

const winCombinations = createWinCombinationsBySize(fieldSize);
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
  return winCombinations.some((line) => {
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

function createWinCombinationsBySize(size) {
  // I will use "for" just because another ways are not readable,
  // it will be hard to understand
  // (just check previous commits to see it).
  // So, code below with "for" is more readable in my opinion.

  const winCombinations = [];

  // horizontals
  for (let i = 0; i < size; i++) {
    const combination = [];
    for (let j = 0; j < size; j++) {
      combination.push(i * size + j);
    }

    winCombinations.push(combination);
  }

  // verticals
  for (let i = 0; i < size; i++) {
    const combination = [];
    for (let j = 0; j < size; j++) {
      combination.push(winCombinations[j][i]);
    }

    winCombinations.push(combination);
  }

  // diagonals
  const combinationLeft = [];
  const combinationRight = [];
  for (let i = 0; i < size; i++) {
    combinationLeft.push(winCombinations[i][i]);
    combinationRight.push(winCombinations[i][size - i - 1]);
  }
  winCombinations.push(combinationLeft);
  winCombinations.push(combinationRight);

  return winCombinations;
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

  turnInfoDiv.classList.remove("hidden");
  turnInfoDiv.innerText = `Ход #${turnIndex + 1}: ${["X", "O"][turnIndex % 2]}`;

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
