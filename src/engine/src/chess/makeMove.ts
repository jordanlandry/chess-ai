import { Board, Move } from "../../types";
import { Pieces } from "../constants/piece";
import { Squares } from "../constants/square";

export default function makeMove(board: Board, move: Move) {
  // Create a copy of the board so you don't mutate the original
  const newBoard = {
    pieces: { ...board.pieces },
    locations: [...board.locations],
    castle: { ...board.castle },
    enPassant: board.enPassant,
    turn: board.turn,
  };

  // Update the pieceState
  const movedPiece = board.locations[move.from];

  // Remove the piece from the old square
  newBoard.pieces[movedPiece] = newBoard.pieces[movedPiece].filter((square) => square !== move.from);

  // If it's a promotion, you want to add the promoted piece to the new square, otherwise just move the piece
  const promotedPiece = move.promotion;
  if (promotedPiece) {
    newBoard.pieces[promotedPiece] = newBoard.pieces[promotedPiece].filter((square) => square !== move.to);
    newBoard.pieces[promotedPiece].push(move.to);
  } else newBoard.pieces[movedPiece].push(move.to);

  // Update castling rights
  if (move.from === Squares.a1 || move.to === Squares.a1) newBoard.castle.whiteQueen = false;
  else if (move.from === Squares.h1 || move.to === Squares.h1) newBoard.castle.whiteKing = false;
  else if (move.from === Squares.a8 || move.to === Squares.a8) newBoard.castle.blackQueen = false;
  else if (move.from === Squares.h8 || move.to === Squares.h8) newBoard.castle.blackKing = false;

  // Update the captured piece
  const isEnpassant = move.enPassantCaptureSquare && move.enPassantCaptureSquare !== Squares.none;
  if (move.capture && !isEnpassant) {
    const capturedPiece = board.locations[move.to];

    newBoard.pieces[capturedPiece] = newBoard.pieces[capturedPiece].filter((square) => square !== move.to);
    newBoard.locations[move.to] = Pieces.none;

    // Update castling rights (In case you've taken a rook)
    if (move.to === Squares.a1) newBoard.castle.whiteQueen = false;
    else if (move.to === Squares.h1) newBoard.castle.whiteKing = false;
    else if (move.to === Squares.a8) newBoard.castle.blackQueen = false;
    else if (move.to === Squares.h8) newBoard.castle.blackKing = false;
  }

  // Update locations (Has to be after updating the captured piece so we don't overwrite this piece with Pieces.none)
  newBoard.locations[move.from] = Pieces.none;
  newBoard.locations[move.to] = promotedPiece ?? movedPiece;

  // Handle castling (0 is a valid square so we have to check if it's undefined (Squares.a8 === 0))
  if (move.castleRookFrom !== undefined) {
    const rook = board.turn === "white" ? Pieces.WhiteRook : Pieces.BlackRook;
    const rookToMap = {
      [Squares.a1]: Squares.d1,
      [Squares.h1]: Squares.f1,
      [Squares.a8]: Squares.d8,
      [Squares.h8]: Squares.f8,
    };

    newBoard.pieces[rook] = newBoard.pieces[rook].filter((square) => square !== move.castleRookFrom);

    if (move.castleRookFrom === Squares.a1) newBoard.pieces[rook].push(Squares.d1);
    else if (move.castleRookFrom === Squares.h1) newBoard.pieces[rook].push(Squares.f1);
    else if (move.castleRookFrom === Squares.a8) newBoard.pieces[rook].push(Squares.d8);
    else if (move.castleRookFrom === Squares.h8) newBoard.pieces[rook].push(Squares.f8);

    newBoard.locations[move.castleRookFrom] = Pieces.none;
    newBoard.locations[rookToMap[move.castleRookFrom]] = rook;
  }

  // Update castling rights
  // White king moved
  if (move.from === Squares.e1) {
    newBoard.castle.whiteKing = false;
    newBoard.castle.whiteQueen = false;
  }

  // White rook moved or captured
  if (move.from === Squares.a1 || move.to === Squares.a1) newBoard.castle.whiteQueen = false;
  if (move.from === Squares.h1 || move.to === Squares.h1) newBoard.castle.whiteKing = false;

  // Black king moved
  if (move.from === Squares.e8) {
    newBoard.castle.blackKing = false;
    newBoard.castle.blackQueen = false;
  }

  // Black rook moved or captured
  if (move.from === Squares.a8 || move.to === Squares.a8) newBoard.castle.blackQueen = false;
  if (move.from === Squares.h8 || move.to === Squares.h8) newBoard.castle.blackKing = false;

  // Update en passant capture square
  if (isEnpassant) {
    const capturedPiece = board.locations[move.enPassantCaptureSquare!];
    newBoard.pieces[capturedPiece] = newBoard.pieces[capturedPiece].filter((square) => square !== move.enPassantCaptureSquare);
    newBoard.locations[move.enPassantCaptureSquare!] = Pieces.none;
  }

  // Update the en passant square
  if (move.doublePawnPush) newBoard.enPassant = move.to;
  else newBoard.enPassant = Squares.none;

  // Update turn
  newBoard.turn = board.turn === "white" ? "black" : "white";

  return newBoard;
}
