import { PieceName, ReadableBoard } from "../../../types";
import { Board } from "../../types";
import { Pieces } from "../constants/piece";

// This does the opposite of what parseBoardArray does
export default function parseEngineBoard(engineBoard: Board): ReadableBoard {
  const board = [
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
  ] as PieceName[][];

  for (let i = 0; i < engineBoard.locations.length; i++) {
    const x = i % 8;
    const y = Math.floor(i / 8);

    if (engineBoard.locations[i] === Pieces.none) continue;

    if (engineBoard.locations[i] === Pieces.WhitePawn) board[y][x] = "P";
    else if (engineBoard.locations[i] === Pieces.WhiteKnight) board[y][x] = "N";
    else if (engineBoard.locations[i] === Pieces.WhiteBishop) board[y][x] = "B";
    else if (engineBoard.locations[i] === Pieces.WhiteRook) board[y][x] = "R";
    else if (engineBoard.locations[i] === Pieces.WhiteQueen) board[y][x] = "Q";
    else if (engineBoard.locations[i] === Pieces.WhiteKing) board[y][x] = "K";
    else if (engineBoard.locations[i] === Pieces.BlackPawn) board[y][x] = "p";
    else if (engineBoard.locations[i] === Pieces.BlackKnight) board[y][x] = "n";
    else if (engineBoard.locations[i] === Pieces.BlackBishop) board[y][x] = "b";
    else if (engineBoard.locations[i] === Pieces.BlackRook) board[y][x] = "r";
    else if (engineBoard.locations[i] === Pieces.BlackQueen) board[y][x] = "q";
    else if (engineBoard.locations[i] === Pieces.BlackKing) board[y][x] = "k";
  }

  return {
    pieces: board,
    turn: engineBoard.turn === "white" ? "white" : "black",
    castle: engineBoard.castle,
    enPassant: engineBoard.enPassant,
  };
}
