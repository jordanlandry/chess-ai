import { Move } from "../../types";
import { SQUARE_NAMES } from "../constants/square";

export default function parseToPgn(moves: Move[]) {
  let pgn = "";
  for (const move of moves) {
    pgn += `${SQUARE_NAMES[move.from]}${SQUARE_NAMES[move.to]}`;
    if (move.promotedPiece) {
      pgn += move.promotedPiece;
    }
    pgn += " ";
  }

  return pgn;
}
