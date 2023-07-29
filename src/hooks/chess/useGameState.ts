import { useEffect, useRef } from "react";
import { getAllMoves } from "../../engine/src/chess/getMoves";
import inCheck from "../../engine/src/chess/helpers/inCheck";
import { Pieces } from "../../engine/src/constants/piece";
import parseBoardArray from "../../engine/src/util/parseBoardArray";
import parseUci from "../../engine/src/util/parseUci";
import { GameState, ReadableBoard, SetState, Team } from "../../types";

type Props = {
  whiteTime: number;
  blackTime: number;
  board: ReadableBoard;
  runClocks: boolean;
  setRunClocks: SetState<boolean>;
  setGameState: SetState<GameState>;
  moveList: string[];
};

export default function useGameState({ whiteTime, blackTime, runClocks, board, setRunClocks, setGameState, moveList }: Props) {
  const lastPawnMoveRef = useRef(0);

  // ------------------ Checkmate / Stalemate ------------------
  useEffect(() => {
    const { turn } = board;
    const otherTeam = turn === "white" ? "black" : ("white" as Team);

    if (turn === "none") return;

    const engineBoard = parseBoardArray(board);
    const moves = getAllMoves(engineBoard, turn);

    // If you have no moves, and you're in check, it's checkmate
    // If you have no moves, and you're not in check, it's stalemate
    if (moves.length === 0) {
      if (inCheck(engineBoard, turn)) setGameState({ winner: otherTeam, wonBy: "checkmate" });
      else setGameState({ drawBy: "stalemate" });

      setRunClocks(false);
    }
  }, [board]);

  // ------------------ Time ------------------
  useEffect(() => {
    if (whiteTime || blackTime || !runClocks) return;

    // If black runs out of time, and white doesn't have enough material to checkmate, it's a draw and vice versa
    // TODO: Check for insufficient material

    if (whiteTime <= 0) setGameState({ winner: "black", wonBy: "timeout" });
    if (blackTime <= 0) setGameState({ winner: "white", wonBy: "timeout" });
    setRunClocks(false);
  }, [whiteTime, blackTime, runClocks]);

  // Check if in the last 75 moves, there has been no pawn move or capture
  useEffect(() => {
    if (moveList.length === 0) return;

    const lastMove = moveList[moveList.length - 1];
    const engineBoard = parseBoardArray(board);
    const engineMove = parseUci(lastMove, engineBoard);

    // Check if the to position of the engine move is a pawn
    const movedPiece = engineBoard.locations[engineMove.to];
    if (movedPiece === Pieces.WhitePawn || movedPiece === Pieces.BlackPawn) lastPawnMoveRef.current = 0;
    else lastPawnMoveRef.current++;
  }, [moveList, board]);

  useEffect(() => {
    if (lastPawnMoveRef.current >= 50) setGameState({ drawBy: "50move" });
  }, [lastPawnMoveRef.current]);
}
