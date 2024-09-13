import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Cell = "counter-red-large" | "counter-yellow-large" | null;

interface GameState {
  playerScore: number;
  computerScore: number;
  currentPlayer: "player" | "computer";
  winner: "player" | "computer" | "tie" | null;
  timer: number;
  gameBoard: Cell[][];
  winningTiles: [number, number][];
  isMenuOpen: boolean;
}

const initialGameBoard: Cell[][] = Array.from({ length: 6 }, () =>
  Array(7).fill(null)
);

const initialState: GameState = {
  playerScore: parseInt(localStorage.getItem("playerScore") || "0", 10),
  computerScore: parseInt(localStorage.getItem("computerScore") || "0", 10),
  currentPlayer: "player",
  winner: null,
  timer: 30,
  gameBoard: initialGameBoard,
  winningTiles: [],
  isMenuOpen: false,
};

const computerSlice = createSlice({
  name: "computer",
  initialState,
  reducers: {
    updatePlayerScore(state) {
      state.playerScore++;
      localStorage.setItem("playerScore", state.playerScore.toString());
    },
    updateComputerScore(state) {
      state.computerScore++;
      localStorage.setItem("computerScore", state.computerScore.toString());
    },
    updateTimer(state) {
      if (state.timer === 0) {
        state.winner = state.currentPlayer === "player" ? "computer" : "player";
      } else if (state.timer > 0) {
        state.timer--;
      }
    },
    startGame(state) {
      state.gameBoard = initialGameBoard;
      state.currentPlayer =
        state.currentPlayer === "player" ? "player" : "computer";
      state.winner = null;
      state.timer = 30;
      state.winningTiles = [];
      state.isMenuOpen = false;
    },
    dropBall(
      state,
      action: PayloadAction<{
        column: number;
        currentPlayer: "player" | "computer";
      }>
    ) {
      const { column, currentPlayer } = action.payload;

      for (let row = 5; row >= 0; row--) {
        if (!state.gameBoard[row][column]) {
          state.gameBoard[row][column] =
            currentPlayer === "player"
              ? "counter-red-large"
              : "counter-yellow-large";
          break;
        }
      }
    },
    switchPlayer(state) {
      state.currentPlayer =
        state.currentPlayer === "player" ? "computer" : "player";
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
      ) => {
        const cellValue: Cell =
          currentPlayer === "player"
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

      // Check for horizontal, vertical, and diagonal wins
      for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 7; col++) {
          if (col < 4 && checkDirection(row, col, 0, 1)) {
            state.winner = currentPlayer;
            break;
          }
          if (row < 3 && checkDirection(row, col, 1, 0)) {
            state.winner = currentPlayer;
            break;
          }
          if (row < 3 && col < 4 && checkDirection(row, col, 1, 1)) {
            state.winner = currentPlayer;
            break;
          }
          if (row >= 3 && col < 4 && checkDirection(row, col, -1, 1)) {
            state.winner = currentPlayer;
            break;
          }
        }
      }

      // Check for a tie
      const isTie = gameBoard.every((row) =>
        row.every((cell) => cell !== null)
      );
      if (isTie) {
        state.winner = "tie";
      }

      // Set the winning tiles
      if (state.winner && winningCombination) {
        state.winningTiles = winningCombination;
      }
    },
    toggleMenu(state, action: PayloadAction<boolean>) {
      state.isMenuOpen = action.payload;
    },
    resetGame(state) {
      state.playerScore = 0;
      state.computerScore = 0;
      state.currentPlayer = "player";
      state.winner = null;
      state.timer = 30;
      state.gameBoard = initialGameBoard;
      state.winningTiles = [];
      state.isMenuOpen = false;
    },
  },
});

export default computerSlice.reducer;

export const {
  updatePlayerScore,
  updateComputerScore,
  updateTimer,
  dropBall,
  switchPlayer,
  checkForWin,
  startGame,
  toggleMenu,
  resetGame,
} = computerSlice.actions;
