import { Position } from "../../../types";
import { Board, Piece } from "../../types";
import { Pieces } from "../constants/piece";

type GamePhase = "earlyGame" | "midGame" | "lateGame";

export function getGamePhase(board: Board) {
  const pieceCount = Object.values(board.pieces).reduce((acc, cur) => acc + cur.length, 0);

  if (pieceCount > 20) return "earlyGame";
  if (pieceCount > 10) return "midGame";
  return "lateGame";
}

export function getPieceScore(piece: Piece, position: Position, gamePhase: GamePhase) {
  const scoreMap = gamePhase === "lateGame" ? lateGameScoreMap : positionalScoreMap;

  if (piece === Pieces.WhitePawn) return scoreMap.pawn[position.y][position.x];
  if (piece === Pieces.WhiteKnight) return scoreMap.knight[position.y][position.x];
  if (piece === Pieces.WhiteBishop) return scoreMap.bishop[position.y][position.x];
  if (piece === Pieces.WhiteRook) return scoreMap.rook[position.y][position.x];
  if (piece === Pieces.WhiteQueen) return scoreMap.queen[position.y][position.x];
  if (piece === Pieces.WhiteKing) return scoreMap.king[position.y][position.x];

  // Black pieces are flipped
  if (piece === Pieces.BlackPawn) return -scoreMap.pawn[7 - position.y][position.x];
  if (piece === Pieces.BlackKnight) return -scoreMap.knight[7 - position.y][position.x];
  if (piece === Pieces.BlackBishop) return -scoreMap.bishop[7 - position.y][position.x];
  if (piece === Pieces.BlackRook) return -scoreMap.rook[7 - position.y][position.x];
  if (piece === Pieces.BlackQueen) return -scoreMap.queen[7 - position.y][position.x];
  if (piece === Pieces.BlackKing) return -scoreMap.king[7 - position.y][position.x];

  return 0;
}

// All of these are from the perspective of white
// We will use the same map for black, but we will flip the board
export const positionalScoreMap = {
  pawn: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5, 5, 10, 25, 25, 10, 5, 5],
    [0, 0, 0, 20, 20, 0, 0, 0],
    [5, 0, 0, 0, 0, 0, 0, 5],
    [-10, -10, -10, -20, -20, -10, -10, -10],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],

  knight: [
    [-50, -40, -30, -30, -30, -30, -40, -50],
    [-40, -20, 0, 0, 0, 0, -20, -40],
    [-30, 0, 10, 15, 15, 10, 0, -30],
    [-30, 5, 15, 20, 20, 15, 5, -30],
    [-30, 0, 15, 20, 20, 15, 0, -30],
    [-30, 5, 10, 15, 15, 10, 5, -30],
    [-40, -20, 0, 5, 5, 0, -20, -40],
    [-50, -40, -30, -30, -30, -30, -40, -50],
  ],

  bishop: [
    [-20, -10, -10, -10, -10, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 10, 10, 5, 0, -10],
    [-10, 5, 5, 10, 10, 5, 5, -10],
    [-10, 0, 10, 10, 10, 10, 0, -10],
    [-10, 10, 10, 10, 10, 10, 10, -10],
    [-10, 5, 0, 0, 0, 0, 5, -10],
    [-20, -10, -10, -10, -10, -10, -10, -20],
  ],
  rook: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [5, 10, 10, 10, 10, 10, 10, 5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 5, 5, 0, 0, -5],
  ],

  queen: [
    [-20, -10, -10, -5, -5, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 5, 5, 5, 0, -10],
    [-5, 0, 5, 5, 5, 5, 0, -5],
    [0, 0, 5, 5, 5, 5, 0, -5],
    [-10, 5, 5, 5, 5, 5, 0, -10],
    [-10, 0, 5, 0, 0, 0, 0, -10],
    [-20, -10, -10, -5, -5, -10, -10, -20],
  ],

  king: [
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-20, -30, -30, -40, -40, -30, -30, -20],
    [-10, -20, -20, -20, -20, -20, -20, -10],
    [-10, -20, -20, -20, -20, -20, -20, -10],
    [30, 50, 20, -10, -10, 20, 50, 30],
  ],

  passedPawn: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [80, 75, 75, 75, 75, 75, 75, 80],
    [50, 50, 50, 50, 50, 50, 50, 55],
    [30, 25, 25, 25, 25, 25, 25, 30],
    [20, 15, 15, 15, 15, 15, 15, 20],
    [10, 5, 5, 5, 5, 5, 5, 10],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
};

// Alternative scores for certain pieces towards the end of the game
export const lateGameScoreMap = {
  pawn: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5, 5, 10, 25, 25, 10, 5, 5],
    [0, 0, 0, 20, 20, 0, 0, 0],
    [5, -5, -10, 0, 0, -10, -5, 5],
    [5, 10, 10, -20, -20, 10, 10, 5],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],

  passedPawn: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [100, 90, 90, 90, 90, 90, 90, 100],
    [80, 80, 80, 80, 80, 80, 80, 80],
    [60, 60, 60, 60, 60, 60, 60, 60],
    [40, 40, 40, 40, 40, 40, 40, 40],
    [20, 20, 20, 20, 20, 20, 20, 20],
    [10, 10, 10, 10, 10, 10, 10, 10],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],

  knight: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],

  bishop: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],

  rook: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],

  queen: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],

  // During the endgame, a lot of the time the king can only be checkmated if it is on the edge of the board
  // Penalizing the king for being in those squares will help the ai force the king to the edge of the board
  // Where it can see the checkmate
  king: [
    [-20, -20, -20, -20, -20, -20, -20, -20],
    [-20, -10, -10, -10, -10, -10, -10, -20],
    [-20, -10, 0, 0, 0, 0, -10, -20],
    [-20, -10, 0, 0, 0, 0, -10, -20],
    [-20, -10, 0, 0, 0, 0, -10, -20],
    [-20, -10, 0, 0, 0, 0, -10, -20],
    [-20, -10, -10, -10, -10, -10, -10, -20],
    [-20, -20, -20, -20, -20, -20, -20, -20],
  ],
};
