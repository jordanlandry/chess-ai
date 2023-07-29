import { Board, Square, Team } from "../../types";
import getTeam from "../chess/helpers/getTeam";
import inBounds from "../chess/helpers/inBounds";
import { Pieces } from "../constants/piece";
import { Squares } from "../constants/square";
import { getGamePhase, getPieceScore, lateGameScoreMap, positionalScoreMap } from "./positionalScoreMap";

// These scores are represented in centipawns (1/100th of a pawn)
const pieceScores = {
  wp: 100,
  wn: 300,
  wb: 300,
  wr: 500,
  wq: 900,

  bp: -100,
  bn: -300,
  bb: -300,
  br: -500,
  bq: -900,
} as const;

export function getScore(board: Board) {
  let score = 0;

  score += board.pieces[Pieces.WhitePawn].length * pieceScores.wp;
  score += board.pieces[Pieces.WhiteKnight].length * pieceScores.wn;
  score += board.pieces[Pieces.WhiteBishop].length * pieceScores.wb;
  score += board.pieces[Pieces.WhiteRook].length * pieceScores.wr;
  score += board.pieces[Pieces.WhiteQueen].length * pieceScores.wq;

  score += board.pieces[Pieces.BlackPawn].length * pieceScores.bp;
  score += board.pieces[Pieces.BlackKnight].length * pieceScores.bn;
  score += board.pieces[Pieces.BlackBishop].length * pieceScores.bb;
  score += board.pieces[Pieces.BlackRook].length * pieceScores.br;
  score += board.pieces[Pieces.BlackQueen].length * pieceScores.bq;

  // Add positional score
  // score += positionalScore(board);

  // Add king safety score
  let whiteKingScore = kingSafety(board, "white");
  let blackKingScore = kingSafety(board, "black");

  // If the king's safety score is bad, but they can still castle, then the king safety score is not as bad
  if (whiteKingScore < 0 && (board.castle.whiteKing || board.castle.whiteQueen)) whiteKingScore /= 2;
  if (blackKingScore < 0 && (board.castle.blackKing || board.castle.blackQueen)) blackKingScore /= 2;

  score += whiteKingScore;
  score -= blackKingScore;

  score += positionalScore(board);
  score += passedPawns(board);

  return score;
}

function positionalScore(board: Board) {
  let score = 0;

  const gamePhase = getGamePhase(board);

  // Loop through all pieces
  for (const piece of Object.values(Pieces)) {
    for (const position of board.pieces[piece]) {
      const x = position % 8;
      const y = Math.floor(position / 8);

      if (!inBounds({ x, y })) continue;

      // Add the positional score of the piece
      score += getPieceScore(piece, { x, y }, gamePhase);
    }
  }

  return score;
}

// If you have a passed pawn, it is worth more
function passedPawns(board: Board) {
  let score = 0;

  const isPassedPawn = (position: Square, team: Team) => {
    const x = position % 8;
    const y = Math.floor(position / 8);

    // Check if there are any enemy pawns in front or in the right or left file
    const enemyPawns = board.pieces[team === "white" ? Pieces.BlackPawn : Pieces.WhitePawn];
    const enemyPawnsInFront = enemyPawns.filter((enemyPawn) => {
      const enemyPawnX = enemyPawn % 8;
      const enemyPawnY = Math.floor(enemyPawn / 8);

      return enemyPawnY === y && Math.abs(enemyPawnX - x) <= 1;
    });

    return enemyPawnsInFront.length === 0;
  };

  // Loop through all white pawns
  // for (const position of board.pieces[Pieces.WhitePawn]) {
  //   const x = position % 8;
  //   const y = Math.floor(position / 8);

  //   if (isPassedPawn(position, "white")) score += positionalScoreMap.passedPawn[y][x];
  // }

  // // Loop through all black pawns
  // for (const position of board.pieces[Pieces.BlackPawn]) {
  //   const x = position % 8;
  //   const y = Math.floor(position / 8);
  //   if (isPassedPawn(position, "black")) score -= positionalScoreMap.passedPawn[7 - y][x];
  // }

  return score;
}

// The more of your own pieces that surround your king, the better
// The more enemy pieces that surround your king, the worse

// We will place the king in the bottom middle of a 3x3 grid of weights
// Each weight determines how much the king safety score is affected by that square
const kingSafetyWeights = {
  empty: [
    [0, 0, 0],
    [-1, -2, 0],
    [0, 0, 0],
  ],
  sameTeam: [
    [1, 1, 1],
    [4, 5, 2],
    [1, 0, 1],
  ],
  otherTeam: [
    [-4, -5, -4],
    [-5, -3, -3],
    [-3, 0, -2],
  ],
};

function kingSafety(board: Board, turn: Team) {
  let score = 0;

  // In the early game, king safety is not as important
  if (getGamePhase(board) === "earlyGame") return score;

  const kingPosition = board.pieces[board.turn === "white" ? Pieces.WhiteKing : Pieces.BlackKing][0];
  const kingX = kingPosition % 8;
  const kingY = Math.floor(kingPosition / 8);

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const x = kingX + i - 1;
      const y = kingY + j - 1;

      if (x < 0 || x > 7 || y < 0 || y > 7) continue;

      const square = (y * 8 + x) as Square;

      if (square === Squares.none) score += kingSafetyWeights.empty[j][i];
      else if (getTeam(board, square) === turn) score += kingSafetyWeights.sameTeam[j][i];
      else score += kingSafetyWeights.otherTeam[j][i];
    }
  }

  return score;
}
