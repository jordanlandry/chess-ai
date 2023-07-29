import { Board, Team } from "../../../types";
import { Pieces } from "../../constants/piece";
import squareAttacked from "./squareAttacked";

export default function inCheck(board: Board, team: Team) {
  const king = team === "white" ? Pieces.WhiteKing : Pieces.BlackKing;
  return squareAttacked(board, board.pieces[king][0], team === "white" ? "black" : "white");
}
