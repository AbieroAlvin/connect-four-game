import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";

import {
  dropBall,
  switchPlayer,
  checkForWin,
  updatePlayerOneScore,
  updatePlayerTwoScore,
  updateTimer,
} from "../player/PlayerSlice";

import { RootState } from "../Store";

import GameBoardItem from "../ui/GameBoardItem";

const PlayerGameBoard = () => {
  const { currentPlayer, gameBoard, winner, winningTiles, isMenuOpen } =
    useSelector((store: RootState) => store.player);
  const dispatch = useDispatch();

  const handleColumnClick = (column: number) => {
    if (!winner) {
      if (gameBoard[0][column]) {
        return;
      }

      dispatch(dropBall({ column, currentPlayer }));
      dispatch(checkForWin());
      dispatch(switchPlayer());
    }
  };

  const [isWinnerUpdated, setIsWinnerUpdated] = useState(false);

  useEffect(() => {
    if (!isMenuOpen && !isWinnerUpdated) {
      if (winner === "playerOne") {
        dispatch(updatePlayerOneScore());
        setIsWinnerUpdated(true);
      }
      if (winner === "playerTwo") {
        dispatch(updatePlayerTwoScore());
        setIsWinnerUpdated(true);
      }

      if (winner === "tie") {
        setIsWinnerUpdated(true);
      }
    }

    if (!winner) setIsWinnerUpdated(false);
  }, [dispatch, winner, isMenuOpen, isWinnerUpdated]);

  useEffect(() => {
    let timerInterval: number | undefined;
    if (!winner && !isMenuOpen) {
      timerInterval = window.setInterval(() => {
        dispatch(updateTimer());
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [dispatch, winner, isMenuOpen]);

  const windowWidth = window.innerWidth <= 700;
  const whiteBoardLayer = windowWidth
    ? "./board-layer-white-small.svg"
    : "./board-layer-white-large.svg";
  const blackBoardLayer = windowWidth
    ? "./board-layer-black-small.svg"
    : "./board-layer-black-large.svg";

  return (
    <motion.div
      className="relative z-[5] grid h-[58.4rem] w-[63.2rem] grid-cols-7 grid-rows-6 rounded-[4rem] pb-16 pl-6 pt-6 desktop:col-span-full desktop:row-start-2 tablet:h-[31rem] tablet:w-[33.5rem] mobile:justify-self-center mobile:pb-[3.5rem] mobile:pl-[0.8rem] mobile:pt-0"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {gameBoard.map((row, rowIndex) =>
        row.map((cell, columnIndex) => (
          <button
            key={`${rowIndex}-${columnIndex}`}
            className="cell relative z-20 h-[6.4rem] w-[6.4rem] cursor-pointer rounded-full tablet:h-[3.8rem] tablet:w-[3.8rem] "
            onClick={() => handleColumnClick(columnIndex)}
          >
            {cell && (
              <GameBoardItem
                rowIndex={rowIndex}
                cell={cell}
                isWinner={winningTiles?.some(
                  ([winningRow, winningCol]) =>
                    winningRow === rowIndex && winningCol === columnIndex
                )}
              />
            )}
          </button>
        ))
      )}

      <img
        src={whiteBoardLayer}
        alt="white board layer"
        className="absolute inset-0 z-10"
      />
      <img
        src={blackBoardLayer}
        alt="black board layer"
        className="absolute inset-0"
      />
    </motion.div>
  );
};

export default PlayerGameBoard;
