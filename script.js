function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const playMove = (row, column, player) => {
    if (board[row][column].getValue() === 0) {
      board[row][column].addToken(player);
    } else {
      console.log("Cell is already taken, please choose another move.");
    }
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithCellValues);
  };

  return { getBoard, playMove, printBoard };
}

function Cell() {
  let value = 0;

  const addToken = (player) => {
    value = player;
  };

  const getValue = () => value;

  return { addToken, getValue };
}

function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const board = Gameboard();
  const rows = 3;
  const columns = 3;

  const players = [
    {
      name: playerOneName,
      token: "X",
    },
    {
      name: playerTwoName,
      token: "O",
    },
  ];
  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const checkWin = () => {
    for (let i = 0; i < rows; i++) {
      if (
        board.getBoard()[i][0].getValue() !== 0 &&
        board.getBoard()[i][0].getValue() ===
          board.getBoard()[i][1].getValue() &&
        board.getBoard()[i][0].getValue() === board.getBoard()[i][2].getValue()
      ) {
        return true;
      }
    }

    for (let j = 0; j < columns; j++) {
      if (
        board.getBoard()[0][j].getValue() !== 0 &&
        board.getBoard()[0][j].getValue() ===
          board.getBoard()[1][j].getValue() &&
        board.getBoard()[1][j].getValue() === board.getBoard()[2][j].getValue()
      ) {
        return true;
      }
    }

    if (
      board.getBoard()[0][0].getValue() !== 0 &&
      board.getBoard()[0][0].getValue() === board.getBoard()[1][1].getValue() &&
      board.getBoard()[1][1].getValue() === board.getBoard()[2][2].getValue()
    ) {
      return true;
    }

    if (
      board.getBoard()[0][2].getValue() !== 0 &&
      board.getBoard()[0][2].getValue() === board.getBoard()[1][1].getValue() &&
      board.getBoard()[1][1].getValue() === board.getBoard()[2][0].getValue()
    ) {
      return true;
    }

    return false;
  };

  const isBoardFull = () => {
    return board
      .getBoard()
      .every((row) => row.every((cell) => cell.getValue() !== 0));
  };

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const playRound = (row, column) => {
    console.log(
      `Placing ${
        getActivePlayer().name
      }'s token into column ${column}, row ${row}...`
    );
    board.playMove(row, column, getActivePlayer().token);

    if (checkWin()) {
      console.log(`${getActivePlayer().name} wins!`);
      return;
    }

    if (isBoardFull()) {
      console.log("It's a draw!");
      return;
    }

    switchPlayerTurn();
    printNewRound();
  };

  const resetGame = () => {
    board.getBoard().forEach((row) => row.forEach((cell) => cell.addToken(0)));
    activePlayer = players[0];
    printNewRound();
  };

  printNewRound();

  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
    resetGame,
  };
}

function ScreenController() {
  const game = GameController();
  const playerTurnDiv = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");
  const newGameButton = document.querySelector(".new-game");

  const updateScreen = () => {
    boardDiv.textContent = "";

    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

    board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = columnIndex;
        cellButton.textContent = cell.getValue() === 0 ? "" : cell.getValue();
        boardDiv.appendChild(cellButton);
      });
    });
  };

  function clickHandlerBoard(e) {
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.column;

    if (selectedColumn === undefined || selectedRow === undefined) return;

    game.playRound(parseInt(selectedRow), parseInt(selectedColumn));
    updateScreen();
  }

  function clickHandlerNewGame() {
    game.resetGame();
    updateScreen();
  }
  boardDiv.addEventListener("click", clickHandlerBoard);
  newGameButton.addEventListener("click", clickHandlerNewGame);

  updateScreen();
}

ScreenController();
