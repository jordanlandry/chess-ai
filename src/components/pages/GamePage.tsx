import { createContext, useContext, useEffect, useRef, useState } from "react";
import { StylesContext } from "../../App";
import { IMAGE_PATH } from "../../constants/paths";
import { timeControlPresets } from "../../constants/timeControlPresets";
import { STARTING_BOARD } from "../../engine/src/constants/startingBoard";
import { Evaluation } from "../../engine/types";
import getAiElo from "../../functions/getAiElo";
import useAi from "../../hooks/chess/useAi";
import useClock from "../../hooks/chess/useClock";
import useGameState from "../../hooks/chess/useGameState";
import usePieceRefs from "../../hooks/chess/usePieceRefs";
import { GameState, ReadableBoard, SetState, Team, TimeControl } from "../../types";
import clamp from "../../util/clamp";
import Clock from "../Clock";
import Modal from "../Modal";
import Svg, { IconName } from "../Svg";
import Chess from "../chess/Chess";
import EvalBar from "../chess/EvalBar";
import "../styles/gamePage.scss";
import GameOverScreen from "./GameOverScreen";
import MoveSection from "./MoveSection";

type ScoreContext = {
  score: Evaluation;
  setScore: SetState<Evaluation>;
  nextBestMove: string | null;
};

export const ScoreContext = createContext<ScoreContext>({} as ScoreContext);
export default function GamePage() {
  const [score, setScore] = useState<Evaluation>({ book: true });

  const { pieceStyle } = useContext(StylesContext);

  // I am going to use this format of board, even though the AI uses a different format
  // This is way easier to write and read, and I have a parser function to convert it to the AI format
  const [selectedTeam, setSelectedTeam] = useState<Team>("white");
  const [aiTeam, setAiTeam] = useState<Team>("black");

  const [board, setBoard] = useState<ReadableBoard>(JSON.parse(JSON.stringify(STARTING_BOARD)));

  // This is the index of the board that is currently being displayed
  // This is because you're able to go back in moves to see the board at that point in time

  const [depth, setDepth] = useState(0);

  // Holds the references to each piece
  const isFlipped = aiTeam === "white";
  const pieceRefs = usePieceRefs(isFlipped);
  const boardRef = useRef<HTMLDivElement>(null);

  // TODO: Update moves when promotion happens
  const [moves, setMoves] = useState<string[]>([]);

  const onPieceMove = (move: string) => {
    if (board.turn !== aiTeam) nextBestMoveRef.current = nextBestMove;
    else setMoves((prevMoves) => [...prevMoves, move]);
  };

  // I can't store the game state in the useGameState hook because
  // I need access to setGameState in onTimeUp, and I need the time
  // Inside of the useGameState hook
  const [gameState, setGameState] = useState<GameState>("not-started");

  // ----- TIME CONTROL -----
  const onTimeUp = (team: Team) => {
    setGameState({
      winner: team === "white" ? "black" : "white",
      wonBy: "timeout",
    });

    setRunClocks(false);
  };

  const handleNoTimeControl = () => {
    setTimeControl({
      blackTime: Infinity,
      whiteTime: Infinity,
      blackIncrement: 0,
      whiteIncrement: 0,
    });

    setAiTimeLimit(2000);
  };

  const handleTimeControlChange = (key: string) => {
    setTimeControlKey(key);

    // TODO: Custom time control
    if (key === "custom") return;
    if (key === "none") return handleNoTimeControl();

    // Don't give the AI a set time limit if you have time controls
    setAiTimeLimit(null);

    // Find the time control with that key
    const timeControl = timeControlPresets.find((timeControl) => timeControl.key === key);
    if (!timeControl) return;

    setTimeControl({
      blackTime: timeControl.time,
      whiteTime: timeControl.time,
      blackIncrement: timeControl.increment,
      whiteIncrement: timeControl.increment,
    });
  };

  const [timeControlKey, setTimeControlKey] = useState("3+2");
  const [timeControl, setTimeControl] = useState<TimeControl>({} as TimeControl);
  const [runClocks, setRunClocks] = useState(gameState === "in-progress");

  useEffect(() => {
    handleTimeControlChange(timeControlKey);
  }, [timeControlKey]);

  const { whiteTime, blackTime } = useClock({ board, onTimeUp, isRunning: runClocks, timeControl });

  // ----- AI -----
  const minAiTime = 500; // Half a second
  const maxAiTime = 100000; // 100 seconds
  const [aiTimeLimit, setAiTimeLimit] = useState<number | null>(null);
  const aiTotalTime = aiTeam === "black" ? timeControl.blackTime * 1000 : timeControl.whiteTime * 1000;

  // This is just assuming every game is around 30 moves total
  const avgAiTime = (aiTotalTime + (aiTeam === "black" ? timeControl.blackIncrement * 1000 : timeControl.whiteIncrement * 1000)) / 30;

  const aiTime = aiTimeLimit ? aiTimeLimit : avgAiTime;
  const estimatedAiElo = getAiElo(aiTime);

  const onAiTimeBlur = () => {
    if (typeof aiTimeLimit !== "number") return;
    setAiTimeLimit(clamp(aiTimeLimit, minAiTime, maxAiTime));
  };

  const { nextBestMove, previousScoreRef } = useAi({
    board,
    aiTeam,
    setBoard,
    setScore,
    setDepth,
    pieceRefs,
    boardRef,
    onPieceMove,
    score,
    time: {
      time: aiTeam === "black" ? blackTime : whiteTime,
      increment: aiTeam === "black" ? timeControl.blackIncrement : timeControl.whiteIncrement,
    },
    timeLimit: aiTimeLimit,
    flipped: isFlipped,
    gameState,
  });

  const nextBestMoveRef = useRef(nextBestMove);

  // Game State Functions
  useGameState({ whiteTime, blackTime, board, runClocks, setRunClocks, setGameState, moveList: moves });

  const handleStartGame = () => {
    setGameState("in-progress");
    setRunClocks(true);
    setAiTeam(selectedTeam === "white" ? "black" : "white");
    setBoard((prevBoard) => ({ ...prevBoard, turn: "white" }));
  };

  function reset() {
    setBoard(JSON.parse(JSON.stringify(STARTING_BOARD)));
    setDepth(0);
    setMoves([]);
    setScore({ book: true });
    setGameState("not-started");
    setTimeControlKey("3+2");
  }

  function closeEndGameScreen() {
    setGameState("game-over");
    setRunClocks(false);
  }

  function handleResign() {
    setGameState({
      winner: selectedTeam === "white" ? "black" : "white",
      wonBy: "resignation",
    });

    setRunClocks(false);
  }

  // For testing the AI's performance against stockfish
  // const analytics = useAgainstStockfish({
  //   gameState,
  //   moveList: moves,
  //   aiTeam,
  //   board,
  //   pieceRefs,
  //   boardRef,
  //   setBoard,
  //   onPieceMove,
  //   setMoveList: setMoves,
  //   reset,
  //   handleStartGame,
  //   setAiTeam,
  // });

  return (
    <div className="game-page">
      <div className="clock-wrapper" data-flipped={isFlipped}>
        <Clock time={blackTime} color="black" key="black" doWarning={aiTeam !== "black"} />
        <Clock time={whiteTime} color="white" key="white" doWarning={aiTeam !== "white"} />
      </div>

      <Modal open={gameState === "not-started"} className="game-page__menu">
        <h1>Play Chess</h1>
        <div className="menu-time-control">
          <h2>Time control</h2>
          <div className="menu-time-control-presets">
            {timeControlPresets.map((preset) => (
              <button key={preset.key} data-selected={preset.key === timeControlKey} onClick={() => handleTimeControlChange(preset.key)}>
                {preset.name}
                <Svg name={preset.iconName as IconName} color={preset.iconColor} size={24} />
                {Math.floor(preset.time / 60)} + {preset.increment}
              </button>
            ))}
            {/* TODO:<button data-selected={timeControlKey === "custom"} onClick={() => handleTimeControlChange("custom")}>
                Custom
              </button> */}
            <button data-selected={timeControlKey === "none"} onClick={() => handleTimeControlChange("none")}>
              None
            </button>
          </div>

          {timeControlKey === "none" ? (
            <div className="ai-time-limit">
              <h2>AI Time Limit Per Move (Ms)</h2>
              <div className="ai-time-limit-input-wrapper">
                <input
                  onBlur={onAiTimeBlur}
                  min={500}
                  value={aiTimeLimit as number}
                  type="number"
                  onChange={(e) => setAiTimeLimit(parseInt(e.target.value))}
                />
              </div>
              <div>ms</div>
              <div>({getAiElo(aiTimeLimit as number)} Elo)</div>
            </div>
          ) : null}
        </div>
        <h2>Play as</h2>
        <div className="menu-team">
          <button className="menu-team-btn" onClick={() => setSelectedTeam("white")} data-selected={selectedTeam === "white"}>
            <img draggable={false} src={`${IMAGE_PATH}/${pieceStyle}/white/king.png`} alt="White King" />
          </button>

          <button className="menu-team-btn" onClick={() => setSelectedTeam("black")} data-selected={selectedTeam === "black"}>
            <img draggable={false} src={`${IMAGE_PATH}/${pieceStyle}/black/king.png`} alt="Black King" />
          </button>
        </div>
        <button className="menu-play-btn" onClick={handleStartGame}>
          Play
        </button>
      </Modal>

      <GameOverScreen gameState={gameState} aiTeam={aiTeam} handleRematch={reset} handleClose={closeEndGameScreen} />

      <EvalBar score={score} flipped={isFlipped} />

      <ScoreContext.Provider value={{ score, setScore, nextBestMove: nextBestMoveRef.current }}>
        <MoveSection
          header={`Chess AI ${estimatedAiElo} Elo`}
          moves={moves}
          aiTeam={aiTeam}
          previousScore={previousScoreRef.current}
          depth={depth}
          gameState={gameState}
          handleNewGame={reset}
          handleResign={handleResign}
        />

        <Chess
          board={board}
          setBoard={setBoard}
          onPieceMove={onPieceMove}
          boardRef={boardRef}
          pieceRefs={pieceRefs}
          moves={moves}
          setMoves={setMoves}
          running={gameState === "in-progress"}
          aiTeam={aiTeam}
          flipped={isFlipped}
        />
      </ScoreContext.Provider>
    </div>
  );
}
