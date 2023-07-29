import { Square } from "../../../types";

export function getRank(square: Square) {
  return Math.floor(square / 8);
}

export default function sameRank(square1: Square, square2: Square) {
  return getRank(square1) === getRank(square2);
}
