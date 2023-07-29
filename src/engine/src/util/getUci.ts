import { Move } from "../../types";
import { Pieces } from "../constants/piece";
import { SQUARE_NAMES } from "../constants/square";

export default function getUci(move: Move) {
  const { from, to, promotion } = move;

  let uci = SQUARE_NAMES[from] + SQUARE_NAMES[to];

  if (promotion) {
    if (promotion === Pieces.WhiteQueen || promotion === Pieces.BlackQueen) uci += "q";
    else if (promotion === Pieces.WhiteRook || promotion === Pieces.BlackRook) uci += "r";
    else if (promotion === Pieces.WhiteBishop || promotion === Pieces.BlackBishop) uci += "b";
    else if (promotion === Pieces.WhiteKnight || promotion === Pieces.BlackKnight) uci += "n";
  }

  return uci;
}
