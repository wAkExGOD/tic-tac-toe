const defaultValues = {
  players: ["X", "O"],
  fieldSize: 3,
  itemsInRowToWin: 3,
};

let currentRound = createRound();

function onRestart() {
  currentRound = createRound();
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

function onTurn(i, j) {
  const { players, turnIndex, field, fieldSize, result } = currentRound;
  const currentPlayer = players[turnIndex % players.length];

  if (result.type !== "playing" || field[i][j]) {
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
}
