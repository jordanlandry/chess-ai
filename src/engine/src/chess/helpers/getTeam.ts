import { Board, Square, Team } from "../../../types";

export default function getTeam(board: Board, square: Square): Team {
  if (board.locations[square] >= 1 && board.locations[square] <= 6) return "white";
  else if (board.locations[square] >= 7 && board.locations[square] <= 12) return "black";
  return "none";
}
