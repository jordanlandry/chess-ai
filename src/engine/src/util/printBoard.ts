import { Board } from "../../types";
import parseEngineBoard from "./parseEngineBoard";

export function printBoard(board: Board) {
  const readableBoard = parseEngineBoard(board);
  console.log(readableBoard.pieces);

  return readableBoard.pieces;
}
