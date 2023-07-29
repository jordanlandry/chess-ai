import { useEffect, useState } from "react";
import parseBoardArray from "../../engine/src/util/parseBoardArray";
import parseUci from "../../engine/src/util/parseUci";
import { Position, ReadableBoard } from "../../types";
import getPositionByIndex from "../../util/getPositionByIndex";

export default function useLastMovePosition(board: ReadableBoard, moveList: string[]) {
  const [lastMoveFrom, setLastMoveFrom] = useState<Position | null>(null);
  const [lastMoveTo, setLastMoveTo] = useState<Position | null>(null);

  useEffect(() => {
    if (moveList.length === 0) return;
    const lastMove = moveList[moveList.length - 1];

    const engineBoard = parseBoardArray(board);
    const engineMove = parseUci(lastMove, engineBoard);

    const fromPosition = getPositionByIndex(engineMove.from);
    const toPosition = getPositionByIndex(engineMove.to);

    setLastMoveFrom(fromPosition);
    setLastMoveTo(toPosition);
  }, [moveList]);

  return { lastMoveFrom, lastMoveTo };
}
