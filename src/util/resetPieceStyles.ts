import { Position, ReactRef } from "../types";

export const resetPieceStyles = (pieceRefs: ReactRef<(HTMLImageElement | null)[][]>, position: Position, flipped: boolean) => {
  if (!pieceRefs.current) return;

  const piece = pieceRefs.current[position.y][position.x];

  if (!piece) return;

  if (flipped) piece.style.transform = "translate(0px, 0px) rotate(180deg)";
  else piece.style.transform = "translate(0px, 0px)";
  piece.style.zIndex = "2";
};
