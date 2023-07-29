import { GameState, Team } from "../../types";
import Modal from "../Modal";
import "../styles/gameOverScreen.scss";

type Props = {
  gameState: GameState;
  aiTeam: Team;
  handleClose: () => void;
  handleRematch: () => void;
};

export default function GameOverScreen({ gameState, aiTeam, handleClose, handleRematch }: Props) {
  if (typeof gameState === "string") return null;

  const isDraw = gameState.drawBy !== undefined;
  const didAiWin = gameState.winner === aiTeam;

  // Play audio based on result
  const base = "/assets/audio";
  const audio = new Audio();
  audio.src = isDraw ? `${base}/lose.mp3` : didAiWin ? `${base}/lose.mp3` : `${base}/win.mp3`;
  audio.volume = 0.25;
  audio.play();

  return (
    <Modal open={typeof gameState !== "string"} className="game-over-screen">
      <div className="color-overlay"></div>
      <div className="game-over-result">{isDraw ? <h1>Draw!</h1> : <h1>{gameState.winner} wins!</h1>}</div>
      <div className="game-over-message">
        <h2>by {gameState.drawBy ? gameState.drawBy : gameState.wonBy}</h2>
      </div>
      <button onClick={handleRematch}>Rematch</button>
      <button onClick={handleClose}>Close</button>
    </Modal>
  );
}
