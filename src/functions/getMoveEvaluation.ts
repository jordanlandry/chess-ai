import { Evaluation } from "../engine/types";

const moveThresholds = {
  blunder: -250,
  mistake: -150,
  inaccuracy: -50,
  good: 0,
  excellent: 100,
};

const getDifference = (score1: Evaluation, score2: Evaluation) => {
  let score1Number = 0;
  let score2Number = 0;

  if (score1.centipawns) score1Number = score1.centipawns;
  else if (score1.mateIn) score1Number = score1.mateIn.moves * 100_000;

  if (score2.centipawns) score2Number = score2.centipawns;
  else if (score2.mateIn) score2Number = score2.mateIn.moves * 100_000;

  return score2Number - score1Number;
};

export type MoveEvaluation = "blunder" | "mistake" | "inaccuracy" | "good" | "excellent" | "best" | "great" | "brilliant" | "book";
export default function getMoveEvaluation(
  prev: Evaluation,
  current: Evaluation,
  move: string,
  nextBestMove: string | null,
  isMaximizing: boolean
): MoveEvaluation {
  if (current.book) return "book";

  const difference = getDifference(prev, current);

  // if (isBrilliantMove(difference, move)) return "brilliant";
  // if (isGreatMove(difference, move)) return "great";
  if (isBestMove(move, nextBestMove)) return "best";

  if (isMaximizing) {
    if (difference >= moveThresholds.excellent) return "excellent";
    if (difference >= moveThresholds.good) return "good";
    if (difference >= moveThresholds.inaccuracy) return "inaccuracy";
    if (difference >= moveThresholds.mistake) return "mistake";
  } else {
    if (difference <= -moveThresholds.excellent) return "excellent";
    if (difference <= -moveThresholds.good) return "good";
    if (difference <= -moveThresholds.inaccuracy) return "inaccuracy";
    if (difference <= -moveThresholds.mistake) return "mistake";
  }

  return "blunder";
}

// When the AI returns their move, it will set the next move in the sequence to be the best move
// It will also generate the top 2 or 3 moves and if the top move is the only good move, then it's a great move,
// If the move is the best move, and also a piece sacrifice, then it's a brilliant move

// To determine if it's a sacrifice, it must be the capture value is less than the piece value
// For example a rook capturing a bishop, and the bishop also has to be defended by another piece
// And the rook must not be defended by another piece
// This way you have fully sacrificed a piece, but if it is the best move, then it's a brilliant move

// TODO: Implement this
// function isBrilliantMove(difference: number, move: string): boolean {
//   return false;
// }

// // TODO: Implement this
// function isGreatMove(difference: number, move: string): boolean {
//   return false;
// }

const isBestMove = (move: string, nextBestMove: string | null) => move === nextBestMove;
