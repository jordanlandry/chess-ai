import { useContext, useEffect, useState } from "react";
import { Evaluation } from "../../engine/types";
import { GameState, Team } from "../../types";
import getMoveEvaluation, { MoveEvaluation } from "../../functions/getMoveEvaluation";
import Message from "../Message";
import Svg from "../Svg";
import { ScoreContext } from "./GamePage";
import "../styles/moveSection.scss";

type Props = {
  moves: string[];
  header?: string;
  aiTeam: Team;
  previousScore: Evaluation;
  depth: number;
  gameState: GameState;
  handleNewGame: () => void;
  handleResign: () => void;
};

// Prefixes and suffixes for move evaluations to give it a more natural language feel
const prefixes = {
  book: "a",
  best: "the",
  good: "a",
  great: "a",
  excellent: "an",
  brilliant: "a",
  inaccuracy: "an",
  mistake: "a",
  blunder: "a",
} as { [key in MoveEvaluation]: string };

const suffixes = {
  book: "move",
  best: "move",
  good: "move",
  great: "move",
  excellent: "move",
  brilliant: "move",
  inaccuracy: "",
  mistake: "",
  blunder: "",
} as { [key in MoveEvaluation]: string };

export default function MoveSection(props: Props) {
  const { moves, header, previousScore, aiTeam, depth, gameState, handleNewGame, handleResign } = props;

  const [confirmResign, setConfirmResign] = useState(false);
  useEffect(() => {
    setConfirmResign(false);
  }, [gameState]);

  let moveIndex = moves.length - 1;

  // You don't want the AI moves to be evaluated, so if the most recent move was by the AI, skip it
  const mostRecentTeam = (moves.length % 2 === 0 ? "black" : "white") as Team;

  if (mostRecentTeam === aiTeam) moveIndex -= 1;
  if (moveIndex < 0) moveIndex = 0;

  const mostRecentMove = moves[moveIndex];

  const { nextBestMove, score } = useContext(ScoreContext);
  const mostRecentEvaluation = getMoveEvaluation(previousScore, score, mostRecentMove, nextBestMove, aiTeam !== "white");

  // Split the move lines into an array of arrays, where each subarray is a line of moves
  // (Split every 2nd move into a new array, to make styling much easier)
  const moveLines = moves.reduce((acc, move, index) => {
    if (index % 2 === 0) acc.push([]);

    acc[acc.length - 1].push(move);
    return acc;
  }, [] as string[][]);

  const prefix = prefixes[mostRecentEvaluation];
  const suffix = suffixes[mostRecentEvaluation];

  // Copy the moves to the clipboard
  const [notificationVisible, setNotificationVisible] = useState(false);
  const handleClipboardPress = () => {
    const movesString = moves.join(" ");
    setNotificationVisible(true);
    navigator.clipboard.writeText(movesString);
  };

  return (
    <div className="move-section">
      {header ? <h2>{header}</h2> : null}

      <div className="move-evaluation">
        {mostRecentMove ? (
          <>
            <strong>{mostRecentMove}</strong> is {prefix} <strong className={`${mostRecentEvaluation} eval`}>{mostRecentEvaluation}</strong> {suffix}
            <div>Depth: {depth}</div>
          </>
        ) : null}
      </div>
      <div className="move-list">
        {moveLines.map((line, index) => (
          <div key={index} className="move-line">
            {line.map((move, index) => (
              <span key={index}>{move} </span>
            ))}
          </div>
        ))}
      </div>

      {moves.length ? (
        <div className="copy-wrapper">
          <button onClick={handleClipboardPress} className="copy-button">
            <Svg name="clipboard" color="white" size={24} />
          </button>
          <Message visible={notificationVisible} setIsVisible={setNotificationVisible}>
            Copied to clipboard!
          </Message>
        </div>
      ) : null}

      <div className="resign-button-wrapper">
        {gameState === "in-progress" ? (
          <>
            {confirmResign ? (
              <>
                <button onClick={() => setConfirmResign(false)} className="resign-cancel">
                  Cancel
                </button>
                <button onClick={handleResign} className="resign-confirm">
                  Confirm
                </button>
              </>
            ) : (
              <button onClick={() => setConfirmResign(true)} className="resign-button">
                Resign
              </button>
            )}
          </>
        ) : (
          <button onClick={handleNewGame} className="resign-button-new">
            New Game
          </button>
        )}
      </div>
    </div>
  );
}
