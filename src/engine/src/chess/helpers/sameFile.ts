import { Square } from "../../../types";

export default function sameFile(square1: Square, square2: Square) {
  return square1 % 8 === square2 % 8;
}
