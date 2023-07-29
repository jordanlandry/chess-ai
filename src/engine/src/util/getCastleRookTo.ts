import { Square } from "../../types";
import { Squares } from "../constants/square";

export default function getCastleRookTo(castleRookFrom: Square) {
  if (castleRookFrom === Squares.a1) return Squares.a1;
  if (castleRookFrom === Squares.h1) return Squares.f1;
  if (castleRookFrom === Squares.a8) return Squares.d8;
  if (castleRookFrom === Squares.h8) return Squares.f8;
}
