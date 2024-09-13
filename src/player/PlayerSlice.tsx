import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Player = "playerOne" | "playerTwo" | "tie" | null;
type GameBoard = (string | null)[][];

interface GameState {
  playerOneScore: number;
  playerTwoScore: number;
  currentPlayer: Player;
  winner: Player;
  timer: number;
  gameBoard: GameBoard;
  winningTiles: [number, number][];
  isMenuOpen: boolean;
}

const initialGameBoard: GameBoard = Array.from({ length: 6 }, () =>
  Array(7).fill(null)
);

const initialState: GameState = {
  playerOneScore: parseInt(localStorage.getItem("playerOneScore") || "0", 10),
  playerTwoScore: parseInt(localStorage.getItem("playerTwoScore") || "0", 10),
  currentPlayer: "playerOne",
  winner: null,
  timer: 30,
  gameBoard: initialGameBoard,
  winningTiles: [],
  isMenuOpen: false,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    updatePlayerOneScore(state) {
      state.playerOneScore++;
      localStorage.setItem("playerOneScore", state.playerOneScore.toString());
    },
    updatePlayerTwoScore(state) {
      state.playerTwoScore++;
      localStorage.setItem("playerTwoScore", state.playerTwoScore.toString());
    },
    updateTimer(state) {
      if (state.timer === 0) {
        state.winner =
          state.currentPlayer === "playerOne" ? "playerTwo" : "playerOne";
      } else if (state.timer > 0) {
        state.timer--;
      }
    },
    startGame(state) {
      state.gameBoard = initialGameBoard;
      state.currentPlayer = "playerOne";
      state.winner = null;
      state.timer = 30;
      state.winningTiles = [];
      state.isMenuOpen = false;
    },
    dropBall(
      state,
      action: PayloadAction<{ column: number; currentPlayer: Player }>
    ) {
      const { column, currentPlayer } = action.payload;

      for (let row = 5; row >= 0; row--) {
        if (!state.gameBoard[row][column]) {
          state.gameBoard[row][column] =
            currentPlayer === "playerOne"
              ? "counter-red-large"
              : "counter-yellow-large";
          break;
        }
      }
    },
    switchPlayer(state) {
      state.currentPlayer =
        state.currentPlayer === "playerOne" ? "playerTwo" : "playerOne";
      state.timer = 30;
    },
    checkForWin(state) {
      const { gameBoard, currentPlayer } = state;
      let winningCombination: [number, number][] | null = null;

      const checkDirection = (
        startRow: number,
        startCol: number,
        rowDelta: number,
        colDelta: number
      ): boolean => {
        const cellValue =
          currentPlayer === "playerOne"
            ? "counter-red-large"
            : "counter-yellow-large";

        for (let i = 0; i < 4; i++) {
          const row = startRow + i * rowDelta;
          const col = startCol + i * colDelta;

          if (
            row < 0 ||
            row >= 6 ||
            col < 0 ||
            col >= 7 ||
            gameBoard[row][col] !== cellValue
          ) {
            return false;
          }
        }

        winningCombination = Array.from({ length: 4 }, (_, i) => [
          startRow + i * rowDelta,
          startCol + i * colDelta,
        ]) as [number, number][];
        return true;
      };

      for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 4; col++) {
          if (checkDirection(row, col, 0, 1)) {
            state.winner = currentPlayer;
            break;
          }
        }
      }

      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 7; col++) {
          if (checkDirection(row, col, 1, 0)) {
            state.winner = currentPlayer;
            break;
          }
        }
      }

      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 4; col++) {
          if (checkDirection(row, col, 1, 1)) {
            state.winner = currentPlayer;
            break;
          }
        }
      }

      for (let row = 3; row < 6; row++) {
        for (let col = 0; col < 4; col++) {
          if (checkDirection(row, col, -1, 1)) {
            state.winner = currentPlayer;
            break;
          }
        }
      }

      const isTie = gameBoard.every((row) =>
        row.every((cell) => cell !== null)
      );
      if (isTie) {
        state.winner = "tie";
      }

      if (state.winner && winningCombination) {
        state.winningTiles = winningCombination;
      }
    },
    toggleMenu(state, action: PayloadAction<boolean>) {
      state.isMenuOpen = action.payload;
    },
    resetGame(state) {
      state.playerOneScore = 0;
      state.playerTwoScore = 0;
      state.currentPlayer = "playerOne";
      state.winner = null;
      state.timer = 30;
      state.gameBoard = initialGameBoard;
      state.winningTiles = [];
      state.isMenuOpen = false;
    },
  },
});

export default playerSlice.reducer;

export const {
  updatePlayerOneScore,
  updatePlayerTwoScore,
  updateTimer,
  dropBall,
  switchPlayer,
  checkForWin,
  startGame,
  toggleMenu,
  resetGame,
} = playerSlice.actions;
