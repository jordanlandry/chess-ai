import { Position } from "../types";

export default function getIndexByPosition({ x, y }: Position) {
  return y * 8 + x;
}
