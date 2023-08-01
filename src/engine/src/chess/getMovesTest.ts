// import { BoardTest, Move, Piece, Square, Team } from "../../types";
// import { Pieces } from "../constants/piece";
// import { Squares } from "../constants/square";

// export function makeMoveTest(board: BoardTest, move: Move) {
//   // Create a copy of the board so you don't mutate the original
//   const newBoard = {
//     pieces: { ...board.pieces },
//     locations: [...board.locations],
//     castle: { ...board.castle },
//     enPassant: board.enPassant,
//     turn: board.turn,
//   };

//   // Update the pieceState
//   const movedPiece = board.locations[move.from];

//   // Remove the piece from the old square
//   newBoard.pieces[movedPiece] = newBoard.pieces[movedPiece].filter((square) => square !== move.from);

//   // If it's a promotion, you want to add the promoted piece to the new square, otherwise just move the piece
//   const promotedPiece = move.promotion;
//   if (promotedPiece) {
//     newBoard.pieces[promotedPiece] = newBoard.pieces[promotedPiece].filter((square) => square !== move.to);
//     newBoard.pieces[promotedPiece].push(move.to);
//   } else newBoard.pieces[movedPiece].push(move.to);

//   // Update castling rights
//   if (move.from === Squares.a1 || move.to === Squares.a1) newBoard.castle.whiteQueen = false;
//   else if (move.from === Squares.h1 || move.to === Squares.h1) newBoard.castle.whiteKing = false;
//   else if (move.from === Squares.a8 || move.to === Squares.a8) newBoard.castle.blackQueen = false;
//   else if (move.from === Squares.h8 || move.to === Squares.h8) newBoard.castle.blackKing = false;

//   // Update the captured piece
//   const isEnpassant = move.enPassantCaptureSquare && move.enPassantCaptureSquare !== Squares.none;
//   if (move.capture && !isEnpassant) {
//     const capturedPiece = board.locations[move.to];

//     newBoard.pieces[capturedPiece] = newBoard.pieces[capturedPiece].filter((square) => square !== move.to);
//     newBoard.locations[move.to] = Pieces.none;

//     // Update castling rights (In case you've taken a rook)
//     if (move.to === Squares.a1) newBoard.castle.whiteQueen = false;
//     else if (move.to === Squares.h1) newBoard.castle.whiteKing = false;
//     else if (move.to === Squares.a8) newBoard.castle.blackQueen = false;
//     else if (move.to === Squares.h8) newBoard.castle.blackKing = false;
//   }

//   // Update locations (Has to be after updating the captured piece so we don't overwrite this piece with Pieces.none)
//   newBoard.locations[move.from] = Pieces.none;
//   newBoard.locations[move.to] = promotedPiece ?? movedPiece;

//   // Handle castling (0 is a valid square so we have to check if it's undefined (Squares.a8 === 0))
//   if (move.castleRookFrom !== undefined) {
//     const rook = board.turn === "white" ? Pieces.WhiteRook : Pieces.BlackRook;
//     const rookToMap = {
//       [Squares.a1]: Squares.d1,
//       [Squares.h1]: Squares.f1,
//       [Squares.a8]: Squares.d8,
//       [Squares.h8]: Squares.f8,
//     };

//     newBoard.pieces[rook] = newBoard.pieces[rook].filter((square) => square !== move.castleRookFrom);

//     if (move.castleRookFrom === Squares.a1) newBoard.pieces[rook].push(Squares.d1);
//     else if (move.castleRookFrom === Squares.h1) newBoard.pieces[rook].push(Squares.f1);
//     else if (move.castleRookFrom === Squares.a8) newBoard.pieces[rook].push(Squares.d8);
//     else if (move.castleRookFrom === Squares.h8) newBoard.pieces[rook].push(Squares.f8);

//     newBoard.locations[move.castleRookFrom] = Pieces.none;
//     newBoard.locations[rookToMap[move.castleRookFrom]] = rook;
//   }

//   // Update castling rights
//   // White king moved
//   if (move.from === Squares.e1) {
//     newBoard.castle.whiteKing = false;
//     newBoard.castle.whiteQueen = false;
//   }

//   // White rook moved or captured
//   if (move.from === Squares.a1 || move.to === Squares.a1) newBoard.castle.whiteQueen = false;
//   if (move.from === Squares.h1 || move.to === Squares.h1) newBoard.castle.whiteKing = false;

//   // Black king moved
//   if (move.from === Squares.e8) {
//     newBoard.castle.blackKing = false;
//     newBoard.castle.blackQueen = false;
//   }

//   // Black rook moved or captured
//   if (move.from === Squares.a8 || move.to === Squares.a8) newBoard.castle.blackQueen = false;
//   if (move.from === Squares.h8 || move.to === Squares.h8) newBoard.castle.blackKing = false;

//   // Update en passant capture square
//   if (isEnpassant) {
//     const capturedPiece = board.locations[move.enPassantCaptureSquare!];
//     newBoard.pieces[capturedPiece] = newBoard.pieces[capturedPiece].filter((square) => square !== move.enPassantCaptureSquare);
//     newBoard.locations[move.enPassantCaptureSquare!] = Pieces.none;
//   }

//   // Update the en passant square
//   if (move.doublePawnPush) newBoard.enPassant = move.to;
//   else newBoard.enPassant = Squares.none;

//   // Update turn
//   newBoard.turn = board.turn === "white" ? "black" : "white";

//   // Update the available moves

//   // Remove the moves from the old position
//   board.moves[move.from] = null;

//   // Get the moves at the new position
//   board.moves[move.to] = getMovesTest(board, newBoard.locations[move.to], move.from);

//   // Get the effected locations
//   const effectedLocations = getEffectedLocations(board, move);

//   return newBoard;
// }

// /*
//   This function will work by checking if there are any pieces that need to be updated

//    For example
//     0 0 0 0
//     0 0 r 0
//     0 0 0 0
//     p 0 0 0

//     If I move the pawn up one, then there will be no effected rooks so don't bother looking
//     but if I move the pawn up two, then there will be an effected rook

//     when there is an effected rook, I will have to check from the piece to the rook for any occupancies,
//     if there are none, then we will regenerate the rook moves
// */

// const doLookForPiece = (locations: Square[], effectedSquares: Set<Square>) => locations.some((square) => effectedSquares.has(square));

// function getEffectedLocations(board: BoardTest, move: Move) {
//   const effectedLocations: Square[] = [];
//   const effectedRookSquares = new Set<Square>([]);
//   const effectedBishopSquares = new Set<Square>([]);
//   const effectedKnightSquares = new Set<Square>([]);
//   const effectedPawnSqauares = new Set<Square>([]);
//   const effectedKingSquares = new Set<Square>([]);

//   const rookLocations = [
//     ...board.pieces[Pieces.WhiteRook],
//     ...board.pieces[Pieces.BlackRook],
//     ...board.pieces[Pieces.WhiteQueen],
//     ...board.pieces[Pieces.BlackQueen],
//   ];

//   const doLookForRook = doLookForPiece(rookLocations, effectedRookSquares);

//   if (doLookForRook) {
//   }

//   return effectedLocations;
// }

// const moveFunctions = [
//   () => {},
//   (board: BoardTest, square: Square, moves: Move[]) => getPawnMoves(board, "white", square, moves),
//   (board: BoardTest, square: Square, moves: Move[]) => getKnightMoves(board, "black", square, moves),
// ];

// function getMovesTest(board: BoardTest, piece: Piece, square: Square) {
//   const moves: Move[] = [];
//   moveFunctions[piece](board, square, moves);
//   return moves;
// }

// function getPawnMoves(board: BoardTest, team: Team, square: Square, moves: Move[]) {}

// function getKnightMoves(board: BoardTest, team: Team, square: Square, moves: Move[]) {}
