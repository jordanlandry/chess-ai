import { Board, Square, Team } from "../../../types";
import { Pieces } from "../../constants/piece";
import { KING_MOVES, KNIGHT_MOVES } from "../generatedMoves";
import sameRank from "./sameRank";

export default function squareAttacked(board: Board, square: Square, attackedBy: Team) {
  // Check for knights
  // For knights, it is faster to generate all knight moves and check if the square is in the list
  const knight = attackedBy === "white" ? Pieces.WhiteKnight : Pieces.BlackKnight;
  for (const knightSquare of board.pieces[knight]) {
    if (KNIGHT_MOVES[knightSquare].includes(square)) return true;
  }

  const rook = attackedBy === "white" ? Pieces.WhiteRook : Pieces.BlackRook;
  const bishop = attackedBy === "white" ? Pieces.WhiteBishop : Pieces.BlackBishop;
  const queen = attackedBy === "white" ? Pieces.WhiteQueen : Pieces.BlackQueen;

  // Check for rooks and queens
  // I don't need to check for the same file for up and down because it's going up by 8 and will always be the same
  // With going up by 1, it can go from 7 to 8, which is a different file

  // Up
  for (let i = square + 8; i < 64; i += 8) {
    const piece = board.locations[i];
    if (piece === rook || piece === queen) return true;
    if (piece !== Pieces.none) break;
  }

  // Down
  for (let i = square - 8; i >= 0; i -= 8) {
    const piece = board.locations[i];
    if (piece === rook || piece === queen) return true;
    if (piece !== Pieces.none) break;
  }

  // Left
  for (let i = square - 1; i >= square - 8; i--) {
    // Check if the square is on the same row
    if (!sameRank(square, i as Square)) break;

    const piece = board.locations[i];
    if (piece === rook || piece === queen) return true;
    if (piece !== Pieces.none) break;
  }

  // Right
  for (let i = square + 1; i < square + 8; i++) {
    // Check if the square is on the same row
    if (!sameRank(square, i as Square)) break;

    const piece = board.locations[i];
    if (piece === rook || piece === queen) return true;
    if (piece !== Pieces.none) break;
  }

  // Check for bishops and queens
  // North-East
  for (let i = square - 7; i >= 0; i -= 7) {
    if (i % 8 === 0) break; // Make sure it doesn't go off the board and wrap around

    const piece = board.locations[i];
    if (piece === bishop || piece === queen) return true;
    if (piece !== Pieces.none) break;
  }

  // North-West
  for (let i = square - 9; i >= 0; i -= 9) {
    if (i % 8 === 7) break; // Make sure it doesn't go off the board and wrap around

    const piece = board.locations[i];
    if (piece === bishop || piece === queen) return true;
    if (piece !== Pieces.none) break;
  }

  // South-East
  for (let i = square + 9; i < 64; i += 9) {
    if (i % 8 === 0) break; // Make sure it doesn't go off the board and wrap around

    const piece = board.locations[i];
    if (piece === bishop || piece === queen) return true;
    if (piece !== Pieces.none) break;
  }

  // South-West
  for (let i = square + 7; i < 64; i += 7) {
    if (i % 8 === 7) break; // Make sure it doesn't go off the board and wrap around

    const piece = board.locations[i];
    if (piece === bishop || piece === queen) return true;
    if (piece !== Pieces.none) break;
  }

  // Check for pawns
  const pawn = attackedBy === "white" ? Pieces.WhitePawn : Pieces.BlackPawn;
  const pawnLeft = (attackedBy === "white" ? 9 : -9) as Square;
  const pawnRight = (attackedBy === "white" ? 7 : -7) as Square;

  // Check for pawns on the left
  // Make sure the y value has a difference of 1
  if (board.locations[square + pawnLeft] === pawn) {
    const squareY = Math.floor(square / 8);
    const pawnY = Math.floor((square + pawnLeft) / 8);

    if (Math.abs(squareY - pawnY) === 1) return true;
  }

  // Check for pawns on the right
  // Make sure the y value has a difference of 1
  if (board.locations[square + pawnRight] === pawn) {
    const squareY = Math.floor(square / 8);
    const pawnY = Math.floor((square + pawnRight) / 8);

    if (Math.abs(squareY - pawnY) === 1) return true;
  }

  // Check for kings
  const kingLocation = attackedBy === "white" ? board.pieces[Pieces.WhiteKing][0] : board.pieces[Pieces.BlackKing][0];
  const kingMoves = KING_MOVES[kingLocation];

  if (kingMoves && kingMoves.includes(square)) return true;

  return false;
}
