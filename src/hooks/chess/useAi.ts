import { useEffect, useRef, useState } from "react";
import getUci from "../../engine/src/util/getUci";
import parseBoardArray from "../../engine/src/util/parseBoardArray";
import { Evaluation, MinimaxResult } from "../../engine/types";
import handleMakeMove from "../../functions/handleMakeMove";
import { GameState, ReactRef, ReadableBoard, SetState, Team } from "../../types";

import worker from "../../engine/src/ai/minimax?worker";

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

  gameState: GameState;
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
  gameState,
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
    if (gameState !== "in-progress") return;
    const aiWorker = new worker();

    previousScoreRef.current = score;

    aiWorker.onmessage = handleWorkerMessage;
    aiWorker.postMessage({ board: engineBoard, time, timeLimit, prevScore: score });

    return () => {
      aiWorker.terminate();
    };
  }, [board, gameState]);

  return { nextBestMove, previousScoreRef };
}
