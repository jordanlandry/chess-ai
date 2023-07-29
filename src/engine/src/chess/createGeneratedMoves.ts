import { Square } from "../../types";
import inBounds from "./helpers/inBounds";

export default function createGeneratedMoves() {
  generateKnightMoves();
  generateKingMoves();
}

// -------------------------- KNIGHT MOVES  -------------------------- //
export function generateKnightMoves() {
  function getKnightMoves(square: Square) {
    const toSquares: Square[] = [];

    const possibleMoves = [square - 17, square - 15, square - 10, square - 6, square + 6, square + 10, square + 15, square + 17];

    for (const toSquare of possibleMoves) {
      if (!inBounds(toSquare)) continue;

      // Make sure the knight doesn't wrap around the board
      if (square % 8 > 5 && toSquare % 8 < 2) continue;
      if (square % 8 < 2 && toSquare % 8 > 5) continue;

      toSquares.push(toSquare as Square);
    }

    return toSquares;
  }

  const squares: Square[][] = [];

  for (let i = 0; i < 64; i++) {
    squares.push(getKnightMoves(i as Square));
  }

  console.log(JSON.stringify(squares));
}

// -------------------------- KING MOVES  -------------------------- //
export function generateKingMoves() {
  function getKingMoves(square: Square) {
    const toSquares: Square[] = [];

    const possibleMoves = [square - 9, square - 8, square - 7, square - 1, square + 1, square + 7, square + 8, square + 9];

    for (const toSquare of possibleMoves) {
      if (!inBounds(toSquare)) continue;

      // Make sure the king doesn't wrap around the board
      if (square % 8 === 0 && toSquare % 8 === 7) continue;
      if (square % 8 === 7 && toSquare % 8 === 0) continue;

      toSquares.push(toSquare as Square);
    }

    return toSquares;
  }

  const squares: Square[][] = [];

  for (let i = 0; i < 64; i++) {
    squares.push(getKingMoves(i as Square));
  }

  console.log(JSON.stringify(squares));
}
