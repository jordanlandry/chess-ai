import { Position, ReactRef } from "../types";

export const getBoardPosition = (e: MouseEvent, flipped: boolean, boardRef: ReactRef<HTMLDivElement>) => {
  if (!boardRef.current) return null;

  const { left, top, width } = boardRef.current.getBoundingClientRect();
  const squareSize = width / 8;

  const x = flipped ? Math.floor((left + width - e.clientX) / squareSize) : Math.floor((e.clientX - left) / squareSize);
  const y = flipped ? Math.floor((top + width - e.clientY) / squareSize) : Math.floor((e.clientY - top) / squareSize);

  if (x < 0 || x > 7 || y < 0 || y > 7) return null;

  return { x, y } as Position;
};
