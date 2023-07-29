import { ReadableBoard } from "../../../../types";
import { Board } from "../../../types";
import makeMove from "../../chess/makeMove";
import { Squares } from "../../constants/square";
import parseBoardArray from "../../util/parseBoardArray";
import parseUci from "../../util/parseUci";
import getBoardHash from "../boardHash";

// This function will go through all the moves in the database and create a board hash
// Then it will store the board hash and a list of good moves

const STARTING_BOARD = {
  pieces: [
    ["r", "n", "b", "q", "k", "b", "n", "r"],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    ["P", "P", "P", "P", "P", "P", "P", "P"],
    ["R", "N", "B", "Q", "K", "B", "N", "R"],
  ],
  turn: "white",
  enPassant: Squares.none,
  castle: {
    whiteKing: true,
    whiteQueen: true,
    blackKing: true,
    blackQueen: true,
  },
} as ReadableBoard;

export default function generateDatabase(database: string[]) {
  const bookMap = {} as { [key: number]: string[] };

  const len = database.length;
  let board: Board;
  // for (const moveList of database) {
  for (let j = 0; j < database.length; j++) {
    const moveList = database[j];

    // Reset the board
    board = parseBoardArray(STARTING_BOARD);

    // The moves are separated by spaces so we split the string
    const moves = moveList.split(" ");

    // Just to help show progress
    if (j % 10000 === 0) console.log(j + " / " + len);

    // Iterate though each move
    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];

      // Get board hash
      const hash = getBoardHash(board);

      // If the board hash exists, add the move to the list of moves
      if (bookMap[hash] && !bookMap[hash].includes(move)) bookMap[hash].push(move);
      else if (!bookMap[hash]) bookMap[hash] = [move];

      // Make the move (Will return an error if the move is invalid)
      // This way I can verify that my move generation works correctly
      const engineMove = parseUci(move, board);
      board = makeMove(board, engineMove);
    }
  }

  console.log(JSON.stringify(bookMap));
}
