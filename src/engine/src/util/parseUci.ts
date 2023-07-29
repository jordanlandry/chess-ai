import { Board, Move, Square } from "../../types";
import { Pieces } from "../constants/piece";
import { Squares } from "../constants/square";

// Using information from the board, it converts a move in UCI format to a Move object
export default function parseUci(move: string, board: Board) {
  const from = Squares[move.slice(0, 2)] as Square;
  const to = Squares[move.slice(2, 4)] as Square;

  // Promotion pieces
  const queen = board.turn === "white" ? Pieces.WhiteQueen : Pieces.BlackQueen;
  const bishop = board.turn === "white" ? Pieces.WhiteBishop : Pieces.BlackBishop;
  const knight = board.turn === "white" ? Pieces.WhiteKnight : Pieces.BlackKnight;
  const rook = board.turn === "white" ? Pieces.WhiteRook : Pieces.BlackRook;

  const promotion = move.slice(4, 5);

  // Check if the move is a promotion
  let promotionPiece;
  if (promotion) {
    if (promotion === "q") promotionPiece = queen;
    if (promotion === "b") promotionPiece = bishop;
    if (promotion === "n") promotionPiece = knight;
    if (promotion === "r") promotionPiece = rook;
  }

  // Check if the move is a capture
  const isCapture = board.locations[to] !== Pieces.none;

  // Check if the move is an en passant capture
  // It's an En-passant when the pawn moves diagonally to an empty square
  // We can check if it's empty by checking if it doesn't think it's a capture
  const isPawnMove = board.locations[from] === Pieces.WhitePawn || board.locations[from] === Pieces.BlackPawn;
  const isEnPassant = Math.abs(from - to) % 8 !== 0 && !isCapture && isPawnMove;

  const enPassant = isEnPassant ? board.enPassant : undefined;

  // Check if the move is a castle (If the king moves a distance of 2)
  const isKing = board.locations[from] === Pieces.WhiteKing || board.locations[from] === Pieces.BlackKing;
  const isCastle = Math.abs(from - to) === 2 && isKing;

  let castleRookFrom;
  if (isCastle) {
    if (to === Squares.g1) castleRookFrom = Squares.h1;
    if (to === Squares.c1) castleRookFrom = Squares.a1;
    if (to === Squares.g8) castleRookFrom = Squares.h8;
    if (to === Squares.c8) castleRookFrom = Squares.a8;
  }

  // Check for double pawn push (If the pawn moves a distance of 16)
  const doublePawnPush = isPawnMove && Math.abs(from - to) === 16;

  // Move object
  const parsedMove: Move = {
    from,
    to,
    promotion: promotionPiece,
    capture: isCapture || isEnPassant,
    enPassantCaptureSquare: enPassant,
    castleRookFrom,
    doublePawnPush,
  };

  return parsedMove;
}
