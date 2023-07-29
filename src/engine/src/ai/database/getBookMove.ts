import { Board } from "../../../types";
import getBoardHash from "../boardHash";
import bookMap from "./map.json";

export function getBookMove(board: Board) {
  // If it's the starting position, we always want either e4, d4 just because these are generally considered the best moves
  // Just because I have the database for every starting move, doesn't mean every starting move is good.
  // For easier AI's I may introduce more starting moves.

  const boardHash = getBoardHash(board);
  const startBoardHash = 7.852784995605534;
  if (boardHash === startBoardHash) return Math.random() > 0.5 ? "e2e4" : "d2d4";

  // Get moves from the database
  // @ts-ignore
  const moves = bookMap[boardHash];

  // If there are no moves, return null
  if (!moves) return null;

  // Pick a random move from the list of moves
  const move = moves[Math.floor(Math.random() * moves.length)];
  return move;
}
