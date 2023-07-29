import { Board, Move } from "../../types";
import { Pieces } from "../constants/piece";

type OrderedMove = Move & {
  confidence: number;
};

export default function orderMoves(board: Board, moves: Move[], previousBestMove: Move | undefined) {
  const orderedMoves: OrderedMove[] = [];

  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];

    if (previousBestMove && move.from === previousBestMove.from && move.to === previousBestMove.to) {
      orderedMoves.push({ ...move, confidence: 100 });
      continue;
    }

    let confidence = 0;

    // If the move is a capture, add confidence
    // The less valuable the piece captured, the more confidence added
    if (move.capture) {
      confidence += 10;
      const capturedPiece = board.locations[move.to];
      const movedPiece = board.locations[move.from];

      if (capturedPiece === Pieces.BlackQueen || capturedPiece === Pieces.WhiteQueen) confidence += 15;
      else if (capturedPiece === Pieces.BlackRook || capturedPiece === Pieces.WhiteRook) confidence += 10;
      else if (capturedPiece === Pieces.BlackBishop || capturedPiece === Pieces.WhiteBishop) confidence += 5;
      else if (capturedPiece === Pieces.BlackKnight || capturedPiece === Pieces.WhiteKnight) confidence += 5;
      else if (capturedPiece === Pieces.BlackPawn || capturedPiece === Pieces.WhitePawn) confidence += 2;

      // If you take with a low value piece, increase confidence (because you're not losing a valuable piece)
      if (movedPiece === Pieces.BlackPawn || movedPiece === Pieces.WhitePawn) confidence += 5;
      else if (movedPiece === Pieces.BlackKnight || movedPiece === Pieces.WhiteKnight) confidence += 3;
      else if (movedPiece === Pieces.BlackBishop || movedPiece === Pieces.WhiteBishop) confidence += 3;
      else if (movedPiece === Pieces.BlackRook || movedPiece === Pieces.WhiteRook) confidence += 2;
      else if (movedPiece === Pieces.BlackQueen || movedPiece === Pieces.WhiteQueen) confidence += 1;
    }

    // If the move is a promotion, add confidence
    if (move.promotion) {
      confidence += 25;
      const promotedPiece = move.promotion;
      if (promotedPiece === Pieces.BlackQueen || promotedPiece === Pieces.WhiteQueen) confidence += 25;
      else if (promotedPiece === Pieces.BlackRook || promotedPiece === Pieces.WhiteRook) confidence += 10;
      else if (promotedPiece === Pieces.BlackBishop || promotedPiece === Pieces.WhiteBishop) confidence += 5;
      else if (promotedPiece === Pieces.BlackKnight || promotedPiece === Pieces.WhiteKnight) confidence += 5;
    }

    // Castling is usually a good move
    if (move.castleRookFrom) confidence += 5;

    orderedMoves.push({ ...move, confidence });
  }

  orderedMoves.sort((a, b) => b.confidence - a.confidence);

  // Remove the confidence property
  return orderedMoves.map((move) => {
    const { confidence, ...rest } = move;
    return rest;
  });
}
