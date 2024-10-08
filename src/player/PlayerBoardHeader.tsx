import { useDispatch } from "react-redux";
import { startGame, toggleMenu } from "./PlayerSlice";
import { motion } from "framer-motion";
import Button from "../ui/Button";
import Logo from "../ui/Logo";

const PlayerBoardHeader = () => {
  const dispatch = useDispatch();

  const openMenu = () => {
    dispatch(toggleMenu(true));
  };

  const handleRestart = () => {
    dispatch(startGame());
  };
  return (
    <motion.header
      className="mb-24 mt-12 flex w-[40%] items-center justify-between desktop:w-[70%] tablet:px-7 mobile:mb-20 mobile:w-full"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <Button onClick={openMenu}>Menu</Button>
      <Logo />
      <Button onClick={handleRestart}>Restart</Button>
    </motion.header>
  );
};

export default PlayerBoardHeader;
