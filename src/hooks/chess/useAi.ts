import { useEffect, useRef, useState } from "react";
import { aiWorker } from "../../engine/src/ai/worker";
import getUci from "../../engine/src/util/getUci";
import parseBoardArray from "../../engine/src/util/parseBoardArray";
import { Evaluation, MinimaxResult } from "../../engine/types";
import handleMakeMove from "../../functions/handleMakeMove";
import { ReactRef, ReadableBoard, SetState, Team } from "../../types";

type Props = {
  board: ReadableBoard;
  aiTeam: Team;
  score: Evaluation;

  setScore: SetState<Evaluation>;
  setBoard: SetState<ReadableBoard>;
  setDepth: SetState<number>;

  boardRef: ReactRef<HTMLDivElement>;
  pieceRefs: ReactRef<(HTMLImageElement | null)[][]>;

  onPieceMove: (move: string) => void;

  time: { time: number; increment: number };
  timeLimit: number | null;
  flipped: boolean;
};

type WorkerMessage = { data: MinimaxResult };
export default function useAi({
  board,
  aiTeam,
  boardRef,
  setBoard,
  setScore,
  setDepth,
  pieceRefs,
  onPieceMove,
  score,
  time,
  timeLimit,
  flipped,
}: Props) {
  const [nextBestMove, setNextBestMove] = useState<string | null>(null);
  const previousScoreRef = useRef(score);

  // Since the engine works with a different datatype, we need to convert it
  const engineBoard = parseBoardArray(board);

  // The message from the worker
  const handleWorkerMessage = ({ data }: WorkerMessage) => {
    if (data.score && typeof data.score !== "number") setScore(data.score); // Checking typeof so it doesn't use the score from the minimax result
    if (data.depth) setDepth(data.depth);
    if (data.move) {
      handleMakeMove({ board, move: data.move, pieceRefs, boardRef, setBoard, onPieceMove, flipped });
      if (data.sequence[1]) setNextBestMove(getUci(data.sequence[1]));
    }
  };

  // Post message to worker when it's the AI's turn
  useEffect(() => {
    if (board.turn !== aiTeam) return;

    previousScoreRef.current = score;

    aiWorker.addEventListener("message", handleWorkerMessage);
    aiWorker.postMessage({ board: engineBoard, time, timeLimit, prevScore: score });

    // Since this re-renders quite a bit, it will be very bad if we don't clean up the event listener
    return () => aiWorker.removeEventListener("message", handleWorkerMessage);
  }, [board]);

  return { nextBestMove, previousScoreRef };
}
