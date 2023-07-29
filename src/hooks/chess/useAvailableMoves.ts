import { useEffect, useState } from "react";
import { getAllMoves } from "../../engine/src/chess/getMoves";
import parseBoardArray from "../../engine/src/util/parseBoardArray";
import { Move } from "../../engine/types";
import { Position, ReadableBoard } from "../../types";
import getIndexByPosition from "../../util/getIndexByPosition";

type props = {
  board: ReadableBoard;
  selectedPosition: Position | null;
};

export default function useAvailableMoves({ board, selectedPosition }: props) {
  const [availableMoves, setAvailableMoves] = useState<Move[]>([]);

  useEffect(() => {
    if (!selectedPosition) {
      setAvailableMoves([]);
      return;
    }

    const engineBoard = parseBoardArray(board);
    const moves = getAllMoves(engineBoard, board.turn);

    const pieceIndex = getIndexByPosition(selectedPosition);

    setAvailableMoves(moves.filter((move) => move.from === pieceIndex));
  }, [board, selectedPosition]);

  return availableMoves;
}
