import { Board, Evaluation, MinimaxResult, Move } from "../../types";
import { getAllMoves } from "../chess/getMoves";
import inCheck from "../chess/helpers/inCheck";
import makeMove from "../chess/makeMove";
import parseUci from "../util/parseUci";
import getBoardHash from "./boardHash";
import { getBookMove } from "./database/getBookMove";
import orderMoves from "./orderMoves";
import { getScore } from "./score";
import { TranspositionTable } from "./transposition";

// Web-worker
self.addEventListener("message", (event) => {
  const { board, time, timeLimit, prevScore } = event.data;

  const updateScoreAndDepth = (score: Evaluation, depth: number) => {
    self.postMessage({ score, depth });
  };

  // We don't want to take less time than the amount we gain after each move. If it's 0, then
  const increment = time.increment * 1000;
  const minimumTime = Math.max(10, increment);
  const maxTime = timeLimit ?? (time.time * 1000) / 15; // Allow the AI to stil be able to make 15 moves in the time limit

  const result = getBestMove(board, minimumTime, maxTime, updateScoreAndDepth, prevScore);
  self.postMessage(result);
});

export function getBestMove(
  board: Board,
  minTime: number,
  maxTime: number,
  updateScoreAndDepth: (score: Evaluation, depth: number) => void,
  prevScore: number
) {
  // First check the database for the best move
  const move = getBookMove(board);
  if (move) {
    updateScoreAndDepth({ book: true }, 0);
    const parsedMove = parseUci(move, board);
    const result: MinimaxResult = { score: 0, move: parsedMove, sequence: [parsedMove], depth: 0, time: 0 };

    return result;
  }

  const startTime = Date.now();
  let depth = 1;

  let result;

  const table = new TranspositionTable(16, "mb");

  // Update the timeLimit based on the number of moves (The more moves, the higher the time limit)
  const movesCount = getAllMoves(board, board.turn).length;
  const timeLimitMs = Math.min(maxTime, minTime + movesCount * 1000);

  // Iterative deepening - keep increasing the depth until we run out of time
  while (Date.now() - startTime < timeLimitMs) {
    const alpha = -Infinity;
    const beta = Infinity;
    const isMax = board.turn === "white";

    // Reset the transposition table
    table.clear();

    // Keep the previous best move so we can use it as the first move in the next iteration
    // To help prune the tree if this move is still the best
    const previousBestMove = result?.move;

    const nextIter = minimax({
      board,
      depth,
      alpha,
      beta,
      isMax,
      sequence: [],
      startTime,
      timeLimit: timeLimitMs,
      previousBestMove,
      table,
      aspirationWindow: 50,
    });

    if (!nextIter) break;

    // Check if we have checkmate
    if (nextIter.score === Infinity || nextIter.score === -Infinity) {
      const team = nextIter.score === Infinity ? "white" : "black";

      // If it doesn't have a move, it's undefined, and so the end of the sequence will sometimes be undefined
      const definedSequence = nextIter.sequence.filter((move) => move !== undefined) as Move[];
      let mateIn = Math.floor(definedSequence.length / 2); // Divide by 2 because each move is a turn

      updateScoreAndDepth({ mateIn: { moves: mateIn, team } }, depth);
      return nextIter;
    }

    result = nextIter;
    updateScoreAndDepth({ centipawns: result.score }, result.depth);

    depth++;
  }

  // If we haven't found a move in time, then we will have to return the previous move
  if (!result) {
    const moves = getAllMoves(board, board.turn);
    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    return {
      score: prevScore,
      move: randomMove,
      sequence: [randomMove],
      depth: 0,
    } as MinimaxResult;
  }

  return result as MinimaxResult;
}

type MinimaxProps = {
  board: Board;
  depth: number;
  alpha: number;
  beta: number;
  isMax: boolean;
  sequence: Move[];
  startTime: number;
  timeLimit: number;
  table: TranspositionTable;
  previousBestMove?: Move;
  aspirationWindow: number;
};

function minimax({
  board,
  depth,
  alpha,
  beta,
  isMax,
  sequence,
  startTime,
  timeLimit,
  previousBestMove,
  table,
  aspirationWindow,
}: MinimaxProps): MinimaxResult | null {
  const moves = getAllMoves(board, isMax ? "white" : "black");

  const time = Date.now();

  // Check transposition table
  // TODO: Fix the transposition table
  const hash = getBoardHash(board) * depth;
  const cached = table.get(hash);

  if (cached) return cached;

  // Check the time limit
  if (Date.now() - startTime > timeLimit) return null;

  // Terminal node
  if (depth === 0) {
    const result = {
      score: getScore(board),
      sequence,
      depth,
      time: Date.now() - time,
    };

    // Add to transposition table
    // table.set(hash, result);

    return result;
  }

  // Define the needed variables
  let bestMove: Move | undefined;
  let bestScore = isMax ? -Infinity : Infinity;
  let bestSequence: Move[] = [];

  // Order the moves
  const orderedMoves = orderMoves(board, moves, previousBestMove);
  const moveLength = orderedMoves.length;

  // Late Move Reduction
  const reductionDepth = Math.max(0, depth - 2);

  // Reduce the depth if the move is not in the first half since the order moves function should have the best moves first
  // If there aren't very many legal moves, we want the minimum number of max depth moves to be 4
  const reductionThreshold = Math.max(Math.floor(moveLength / 2), 4);

  // If you have no moves left, you're either in checkmate or stalemate
  if (moveLength === 0) {
    const isInCheck = inCheck(board, board.turn);
    if (!isInCheck) bestScore = 0;
    else bestScore = isMax ? -Infinity : Infinity;
  }

  // Loop through all moves
  for (let i = 0; i < moveLength; i++) {
    const move = orderedMoves[i];
    const newBoard = makeMove(board, move);

    // If the next move ends up being -Infinity or Infinity, it will never have updated the move
    // So we need to update it here
    if (!bestMove) bestMove = move;

    // Aspiration window
    if (isMax) alpha = Math.max(alpha, bestScore - aspirationWindow);
    else beta = Math.min(beta, bestScore + aspirationWindow);

    // Check if the move is worth checking
    if (isMax && alpha >= beta) break;
    else if (!isMax && beta <= alpha) break;

    // Get the next iteration
    let result: MinimaxResult | null = null;

    // Late Move Reduction - If the move is not in the top moves, reduce the depth
    // In order for the AI to play sensible moves, we need to have a very good ordering function
    const newDepth = i < reductionThreshold ? depth - 1 : reductionDepth;

    result = minimax({
      board: newBoard,
      depth: newDepth,
      alpha,
      beta,
      isMax: !isMax,
      sequence,
      startTime,
      timeLimit,
      previousBestMove,
      table,
      aspirationWindow,
    });

    if (!result) return null;

    // Update the best values
    if (isMax && result.score > bestScore) {
      bestScore = result.score;
      bestMove = move;
      bestSequence = result.sequence;
    } else if (!isMax && result.score < bestScore) {
      bestScore = result.score;
      bestMove = move;
      bestSequence = result.sequence;
    }

    // Add to transposition table
    const hash = getBoardHash(board) * depth;
    table.set(hash, result);

    // Update Alpha-Beta
    if (isMax) alpha = Math.max(alpha, result.score);
    else beta = Math.min(beta, result.score);

    // Prune
    if (alpha >= beta) break;
  }

  const result = {
    score: bestScore,
    move: bestMove,
    sequence: [...sequence, bestMove, ...bestSequence] as Move[],
    depth,
    time: Date.now() - time,
  };

  return result;
}
