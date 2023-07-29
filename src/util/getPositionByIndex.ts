import { Position } from "../types";

export default function getPositionByIndex(index: number): Position {
  const x = index % 8;
  const y = Math.floor(index / 8);

  return { x, y };
}
