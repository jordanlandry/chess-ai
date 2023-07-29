import { Board, Move, Square, Team } from "../../types";
import { Pieces } from "../constants/piece";
import { Squares } from "../constants/square";
import { KING_MOVES, KNIGHT_MOVES } from "./generatedMoves";
import getTeam from "./helpers/getTeam";
import inBounds from "./helpers/inBounds";
import inCheck from "./helpers/inCheck";
import sameRank from "./helpers/sameRank";
import squareAttacked from "./helpers/squareAttacked";
import makeMove from "./makeMove";

export function getAllMoves(board: Board, turn: Team) {
  const moves: Move[] = [];

  // Queen moves are included in bishop and rook moves
  getPawnMoves(board, turn, moves);
  getKnightMoves(board, turn, moves);
  getBishopMoves(board, turn, moves);
  getRookMoves(board, turn, moves);
  getKingMoves(board, turn, moves);

  // Remove illegal moves
  // TODO: Use a better method
  for (let i = moves.length - 1; i >= 0; i--) {
    const move = moves[i];
    const newBoard = makeMove(board, move);

    if (inCheck(newBoard, turn)) moves.splice(i, 1);
  }

  return moves;
}

// ------------------ Pawn ------------------
function getPawnMoves(board: Board, turn: Team, moves: Move[]) {
  const pawnSquares = turn === "white" ? board.pieces[Pieces.WhitePawn] : board.pieces[Pieces.BlackPawn];
  const otherTeam = turn === "white" ? "black" : "white";
  const promotionRank = turn === "white" ? Squares.a7 : Squares.a2; // Not a8 and a1 because it's the square the pawn is on, not the square it's moving to

  // Promotion Pieces
  const queen = turn === "white" ? Pieces.WhiteQueen : Pieces.BlackQueen;
  const rook = turn === "white" ? Pieces.WhiteRook : Pieces.BlackRook;
  const bishop = turn === "white" ? Pieces.WhiteBishop : Pieces.BlackBishop;
  const knight = turn === "white" ? Pieces.WhiteKnight : Pieces.BlackKnight;

  for (const square of pawnSquares) {
    const pushOne = turn === "white" ? ((square - 8) as Square) : ((square + 8) as Square);
    const pushOneTeam = getTeam(board, pushOne);

    const pushTwo = turn === "white" ? ((square - 16) as Square) : ((square + 16) as Square);
    const pushTwoTeam = getTeam(board, pushTwo);

    const minPushTwo = turn === "white" ? Squares.a2 : Squares.a7;
    const maxPushTwo = turn === "white" ? Squares.h2 : Squares.h7;

    if (inBounds(pushOne) && pushOneTeam === "none") {
      const isPromotion = sameRank(square, promotionRank);
      if (isPromotion) {
        moves.push({ from: square, to: pushOne, promotion: queen });
        moves.push({ from: square, to: pushOne, promotion: rook });
        moves.push({ from: square, to: pushOne, promotion: bishop });
        moves.push({ from: square, to: pushOne, promotion: knight });
      } else moves.push({ from: square, to: pushOne });

      // Double pawn push
      if (pushTwoTeam === "none" && square >= minPushTwo && square <= maxPushTwo) {
        const move: Move = { from: square, to: pushTwo, doublePawnPush: true };
        moves.push(move);
      }
    }

    // Pawn captures
    const canCapLeft = turn === "white" ? square % 8 !== 0 : square % 8 !== 7;
    const leftCapture = turn === "white" ? ((square - 9) as Square) : ((square + 9) as Square);
    const leftCaptureTeam = getTeam(board, leftCapture);

    if (inBounds(leftCapture) && canCapLeft && leftCaptureTeam === otherTeam) {
      const isPromotion = sameRank(square, promotionRank);
      if (isPromotion) {
        moves.push({ from: square, to: leftCapture, capture: true, promotion: queen });
        moves.push({ from: square, to: leftCapture, capture: true, promotion: rook });
        moves.push({ from: square, to: leftCapture, capture: true, promotion: bishop });
        moves.push({ from: square, to: leftCapture, capture: true, promotion: knight });
      } else moves.push({ from: square, to: leftCapture, capture: true });
    }

    const canCapRight = turn === "white" ? square % 8 !== 7 : square % 8 !== 0;
    const rightCapture = turn === "white" ? ((square - 7) as Square) : ((square + 7) as Square);
    const rightCaptureTeam = getTeam(board, rightCapture);

    if (inBounds(rightCapture) && canCapRight && rightCaptureTeam === otherTeam) {
      const isPromotion = sameRank(square, promotionRank);
      if (isPromotion) {
        moves.push({ from: square, to: rightCapture, capture: true, promotion: queen });
        moves.push({ from: square, to: rightCapture, capture: true, promotion: rook });
        moves.push({ from: square, to: rightCapture, capture: true, promotion: bishop });
        moves.push({ from: square, to: rightCapture, capture: true, promotion: knight });
      } else moves.push({ from: square, to: rightCapture, capture: true });
    }
  }

  // En passant
  const { enPassant } = board;
  if (enPassant !== Squares.none) {
    const rightOne = (enPassant + 1) as Square;
    const leftOne = (enPassant - 1) as Square;

    const rightTo = (turn === "white" ? enPassant - 8 : enPassant + 8) as Square;
    const leftTo = (turn === "white" ? enPassant - 8 : enPassant + 8) as Square;

    const currentTurnPawn = turn === "white" ? Pieces.WhitePawn : Pieces.BlackPawn;

    // Right en passant
    if (board.locations[rightOne] === currentTurnPawn && sameRank(board.enPassant, rightOne)) {
      moves.push({ from: rightOne, to: rightTo, capture: true, enPassantCaptureSquare: enPassant });
    }

    // Left en passant
    if (board.locations[leftOne] === currentTurnPawn && sameRank(board.enPassant, leftOne)) {
      moves.push({ from: leftOne, to: leftTo, capture: true, enPassantCaptureSquare: enPassant });
    }
  }
}

// ------------------ Knight ------------------
function getKnightMoves(board: Board, turn: Team, moves: Move[]) {
  const knightSquares = turn === "white" ? board.pieces[Pieces.WhiteKnight] : board.pieces[Pieces.BlackKnight];

  for (const square of knightSquares) {
    for (const toSquare of KNIGHT_MOVES[square]) {
      const toSquareTeam = getTeam(board, toSquare);

      if (toSquareTeam === turn) continue;

      const move: Move = {
        from: square,
        to: toSquare,
        capture: toSquareTeam !== "none",
      };

      moves.push(move);
    }
  }
}

// ------------------ Rook ------------------
function getRookMoves(board: Board, turn: Team, moves: Move[]) {
  const rookSquares =
    turn === "white"
      ? [...board.pieces[Pieces.WhiteRook], ...board.pieces[Pieces.WhiteQueen]]
      : [...board.pieces[Pieces.BlackRook], ...board.pieces[Pieces.BlackQueen]];

  for (const square of rookSquares) {
    // North
    for (let i = square - 8; i >= 0; i -= 8) {
      const toSquare = i as Square;
      const toSquareTeam = getTeam(board, toSquare);

      if (!inBounds(toSquare) || toSquareTeam === turn) break;

      let capture = toSquareTeam !== "none";

      const move: Move = { from: square, to: toSquare, capture };

      moves.push(move);

      // If it's a capture you can't move past it
      if (capture) break;
    }

    // South
    for (let i = square + 8; i < 64; i += 8) {
      const toSquare = i as Square;
      const toSquareTeam = getTeam(board, toSquare);

      if (!inBounds(toSquare) || toSquareTeam === turn) break;

      let capture = toSquareTeam !== "none";

      const move: Move = { from: square, to: toSquare, capture };

      moves.push(move);

      // If it's a capture you can't move past it
      if (capture) break;
    }

    // East
    for (let i = square + 1; i % 8 !== 0; i++) {
      const toSquare = i as Square;
      const toSquareTeam = getTeam(board, toSquare);

      if (!inBounds(toSquare) || toSquareTeam === turn) break;

      let capture = toSquareTeam !== "none";

      const move: Move = {
        from: square,
        to: toSquare,
        capture,
      };

      moves.push(move);

      // If it's a capture you can't move past it
      if (capture) break;
    }

    // West
    for (let i = square - 1; i % 8 !== 7; i--) {
      const toSquare = i as Square;
      const toSquareTeam = getTeam(board, toSquare);

      if (!inBounds(toSquare) || toSquareTeam === turn) break;

      let capture = toSquareTeam !== "none";

      const move: Move = {
        from: square,
        to: toSquare,
        capture,
      };

      moves.push(move);

      // If it's a capture you can't move past it
      if (capture) break;
    }
  }
}

// ------------------ Bishop ------------------
function getBishopMoves(board: Board, turn: Team, moves: Move[]) {
  const bishopSquares =
    turn === "white"
      ? [...board.pieces[Pieces.WhiteBishop], ...board.pieces[Pieces.WhiteQueen]]
      : [...board.pieces[Pieces.BlackBishop], ...board.pieces[Pieces.BlackQueen]];

  for (const square of bishopSquares) {
    // North East
    for (let i = square - 7; i >= 0; i -= 7) {
      const toSquare = i as Square;
      const toSquareTeam = getTeam(board, toSquare);

      if (!inBounds(toSquare) || toSquareTeam === turn) break;

      // Make sure it doesn't go off the right edge and wrap around
      if (toSquare % 8 === 0) break;

      let capture = toSquareTeam !== "none";

      const move: Move = {
        from: square,
        to: toSquare,
        capture,
      };

      moves.push(move);

      // If it's a capture you can't move past it
      if (capture) break;
    }

    // North West
    for (let i = square - 9; i >= 0; i -= 9) {
      const toSquare = i as Square;
      const toSquareTeam = getTeam(board, toSquare);

      if (!inBounds(toSquare) || toSquareTeam === turn) break;

      // Make sure it doesn't go off the left edge and wrap around
      if (toSquare % 8 === 7) break;

      let capture = toSquareTeam !== "none";

      const move: Move = {
        from: square,
        to: toSquare,
        capture,
      };

      moves.push(move);

      // If it's a capture you can't move past it
      if (capture) break;
    }

    // South East
    for (let i = square + 9; i < 64; i += 9) {
      const toSquare = i as Square;
      const toSquareTeam = getTeam(board, toSquare);

      if (!inBounds(toSquare) || toSquareTeam === turn) break;

      // Make sure it doesn't go off the right edge and wrap around
      if (toSquare % 8 === 0) break;

      let capture = toSquareTeam !== "none";

      const move: Move = {
        from: square,
        to: toSquare,
        capture,
      };

      moves.push(move);

      // If it's a capture you can't move past it
      if (capture) break;
    }

    // South West
    for (let i = square + 7; i < 64; i += 7) {
      const toSquare = i as Square;
      const toSquareTeam = getTeam(board, toSquare);

      if (!inBounds(toSquare) || toSquareTeam === turn) break;

      // Make sure it doesn't go off the left edge and wrap around
      if (toSquare % 8 === 7) break;

      let capture = toSquareTeam !== "none";

      const move: Move = {
        from: square,
        to: toSquare,
        capture,
      };

      moves.push(move);

      // If it's a capture you can't move past it
      if (capture) break;
    }
  }
}

// ------------------ King ------------------
function getKingMoves(board: Board, turn: Team, moves: Move[]) {
  const kingSquares = turn === "white" ? board.pieces[Pieces.WhiteKing] : board.pieces[Pieces.BlackKing];

  for (const square of kingSquares) {
    for (const toSquare of KING_MOVES[square]) {
      const toSquareTeam = getTeam(board, toSquare);

      if (toSquareTeam === turn) continue;

      const move: Move = {
        from: square,
        to: toSquare,
        capture: toSquareTeam !== "none",
      };

      moves.push(move);
    }

    // Castling
    if (turn === "white") {
      if (inCheck(board, "white")) continue;

      // Check castling rights
      if (board.castle.whiteKing) {
        let canCastle = true; // Temporary flag to check if the king can castle

        // Make sure the squares aren't attacked
        if (squareAttacked(board, Squares.g1, "black")) canCastle = false;
        else if (squareAttacked(board, Squares.f1, "black")) canCastle = false;

        // Make sure the squares aren't occupied
        if (board.locations[Squares.f1] !== Pieces.none) canCastle = false;
        else if (board.locations[Squares.g1] !== Pieces.none) canCastle = false;

        // Add the move
        if (canCastle) moves.push({ from: square, to: Squares.g1, castleRookFrom: Squares.h1 });
      }

      // Check rights
      if (board.castle.whiteQueen) {
        let canCastle = true;

        if (squareAttacked(board, Squares.b1, "black")) canCastle = false;
        else if (squareAttacked(board, Squares.c1, "black")) canCastle = false;

        // Make sure the squares aren't occupied
        if (board.locations[Squares.b1] !== Pieces.none) canCastle = false;
        else if (board.locations[Squares.c1] !== Pieces.none) canCastle = false;
        else if (board.locations[Squares.d1] !== Pieces.none) canCastle = false;

        if (canCastle) moves.push({ from: square, to: Squares.c1, castleRookFrom: Squares.a1 });
      }
    }

    // Check for black castling rights
    else {
      if (board.castle.blackKing) {
        if (inCheck(board, "black")) continue;

        let canCastle = true; // Temporary flag to check if the king can castle

        // Make sure the squares aren't attacked
        if (squareAttacked(board, Squares.g8, "white")) canCastle = false;
        else if (squareAttacked(board, Squares.f8, "white")) canCastle = false;

        // Make sure the squares aren't occupied
        if (board.locations[Squares.f8] !== Pieces.none) canCastle = false;
        else if (board.locations[Squares.g8] !== Pieces.none) canCastle = false;

        // Add the move
        if (canCastle) moves.push({ from: square, to: Squares.g8, castleRookFrom: Squares.h8 });
      }

      // Check rights
      if (board.castle.blackQueen) {
        let canCastle = true;

        if (squareAttacked(board, Squares.b8, "white")) canCastle = false;
        else if (squareAttacked(board, Squares.c8, "white")) canCastle = false;

        // Make sure the squares aren't occupied
        if (board.locations[Squares.b8] !== Pieces.none) canCastle = false;
        else if (board.locations[Squares.c8] !== Pieces.none) canCastle = false;
        else if (board.locations[Squares.d8] !== Pieces.none) canCastle = false;

        if (canCastle) moves.push({ from: square, to: Squares.c8, castleRookFrom: Squares.a8 });
      }
    }
  }
}
