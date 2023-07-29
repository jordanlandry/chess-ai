import { useEffect, useState } from "react";
import inCheck from "../../engine/src/chess/helpers/inCheck";
import { Pieces } from "../../engine/src/constants/piece";
import parseBoardArray from "../../engine/src/util/parseBoardArray";
import { Position, ReadableBoard } from "../../types";
import getPositionByIndex from "../../util/getPositionByIndex";

export default function useCheckPosition(board: ReadableBoard) {
  const [checkPosition, setCheckPosition] = useState<Position | null>(null);

  useEffect(() => {
    const engineBoard = parseBoardArray(board);
    if (!inCheck(engineBoard, board.turn)) return setCheckPosition(null);

    // Play audio
    // const audio = new Audio("/src/assets/audio/boom.mp3");
    // audio.play();

    const king = board.turn === "white" ? Pieces.WhiteKing : Pieces.BlackKing;
    const kingPosition = engineBoard.locations.find((piece) => piece === king);

    if (kingPosition) {
      const kingIndex = engineBoard.locations.indexOf(kingPosition);
      const kingPositionObject = getPositionByIndex(kingIndex);
      setCheckPosition(kingPositionObject);
    }
  }, [board]);

  return checkPosition;
}
