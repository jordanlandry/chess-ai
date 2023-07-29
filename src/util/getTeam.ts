import { PieceName, Team } from "../types";

export default function getTeam(piece: PieceName): Team {
  if (!piece) return "none";
  if (piece === " ") return "none";
  return piece === piece.toUpperCase() ? "white" : "black";
}

export function sameTeam(piece1: PieceName, piece2: PieceName) {
  return getTeam(piece1) === getTeam(piece2);
}
