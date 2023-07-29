import { ReadableBoard } from "../../../types";
import { Board, Piece, Square } from "../../types";
import { Pieces } from "../constants/piece";

export default function parseBoardArray(board: ReadableBoard) {
  const b: Board = {
    pieces: {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      7: [],
      8: [],
      9: [],
      10: [],
      11: [],
      12: [],
    },

    locations: [],
    turn: board.turn,
    castle: {
      whiteKing: board.castle?.whiteKing,
      whiteQueen: board.castle?.whiteQueen,
      blackKing: board.castle?.blackKing,
      blackQueen: board.castle?.blackQueen,
    },
    enPassant: board.enPassant,
  };

  const map = {
    p: Pieces.BlackPawn,
    n: Pieces.BlackKnight,
    b: Pieces.BlackBishop,
    r: Pieces.BlackRook,
    q: Pieces.BlackQueen,
    k: Pieces.BlackKing,
    P: Pieces.WhitePawn,
    N: Pieces.WhiteKnight,
    B: Pieces.WhiteBishop,
    R: Pieces.WhiteRook,
    Q: Pieces.WhiteQueen,
    K: Pieces.WhiteKing,
    " ": Pieces.none,
  } as { [key: string]: Piece };

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      b.locations.push(map[board.pieces[i][j]]);

      if (board.pieces[i][j] === " ") continue;

      const piece = board.pieces[i][j];

      if (piece === "p") b.pieces[Pieces.BlackPawn].push((i * 8 + j) as Square);
      else if (piece === "n") b.pieces[Pieces.BlackKnight].push((i * 8 + j) as Square);
      else if (piece === "b") b.pieces[Pieces.BlackBishop].push((i * 8 + j) as Square);
      else if (piece === "r") b.pieces[Pieces.BlackRook].push((i * 8 + j) as Square);
      else if (piece === "q") b.pieces[Pieces.BlackQueen].push((i * 8 + j) as Square);
      else if (piece === "k") b.pieces[Pieces.BlackKing].push((i * 8 + j) as Square);
      else if (piece === "P") b.pieces[Pieces.WhitePawn].push((i * 8 + j) as Square);
      else if (piece === "N") b.pieces[Pieces.WhiteKnight].push((i * 8 + j) as Square);
      else if (piece === "B") b.pieces[Pieces.WhiteBishop].push((i * 8 + j) as Square);
      else if (piece === "R") b.pieces[Pieces.WhiteRook].push((i * 8 + j) as Square);
      else if (piece === "Q") b.pieces[Pieces.WhiteQueen].push((i * 8 + j) as Square);
      else if (piece === "K") b.pieces[Pieces.WhiteKing].push((i * 8 + j) as Square);
    }
  }

  return b;
}
