import { Position } from "../types";

export default function comparePositions(position1: Position | null, position2: Position | null) {
  if (!position1 || !position2) return false;
  return position1.x === position2.x && position1.y === position2.y;
}
