import { getRank } from "../engine/src/chess/helpers/sameRank";
import makeMove from "../engine/src/chess/makeMove";
import { Pieces } from "../engine/src/constants/piece";
import getCastleRookTo from "../engine/src/util/getCastleRookTo";
import getUci from "../engine/src/util/getUci";
import parseBoardArray from "../engine/src/util/parseBoardArray";
import parseEngineBoard from "../engine/src/util/parseEngineBoard";
import parseUci from "../engine/src/util/parseUci";
import { Move, Square } from "../engine/types";
import { ReactRef, ReadableBoard, SetState } from "../types";
import getPositionByIndex from "../util/getPositionByIndex";
import { resetPieceStyles } from "../util/resetPieceStyles";
import animatePiece from "./animatePiece";

type Props = {
  board: ReadableBoard;
  move: string | Move;
  pieceRefs: ReactRef<(HTMLImageElement | null)[][]>;
  boardRef: ReactRef<HTMLDivElement>;
  setBoard: SetState<ReadableBoard>;
  onPieceMove: (move: string) => void;
  setPromotionMove?: SetState<string>;
  availableMoves?: Move[];
  flipped: boolean;
};

export default async function handleMakeMove({
  board,
  move,
  pieceRefs,
  boardRef,
  setBoard,
  onPieceMove,
  setPromotionMove,
  availableMoves,
  flipped,
}: Props) {
  if (!pieceRefs.current || !boardRef.current) return;

  const engineBoard = parseBoardArray(board);
  const engineMove = typeof move === "string" ? parseUci(move, engineBoard) : move;

  const from = getPositionByIndex(engineMove.from);
  const to = getPositionByIndex(engineMove.to);
  const pieceRef = pieceRefs.current[from.y][from.x];

  // Check if the move is valid
  if (availableMoves && !availableMoves.find((m) => m.from === engineMove.from && m.to === engineMove.to)) {
    resetPieceStyles(pieceRefs, from, flipped);
    return;
  }

  // Play audio
  const audioName = engineMove.capture ? "capture" : "move";
  const audio = new Audio(`/assets/audio/${audioName}.mp3`);
  audio.play();

  // Handle castling
  // 0 is a valid index, so we need to check if it's undefined (Squares.A1 === 0)
  if (engineMove.castleRookFrom !== undefined) {
    const rookTo = getCastleRookTo(engineMove.castleRookFrom);

    const toPosition = getPositionByIndex(rookTo as Square);
    const fromPosition = getPositionByIndex(engineMove.castleRookFrom);
    const rookRef = pieceRefs.current[fromPosition.y][fromPosition.x];

    // Don't want to await here because this just animates the rook
    // We always want to await on just the king so that we wait before making the move on the board (and updating the state)
    if (rookRef) animatePiece({ pieceRef: rookRef, from: fromPosition, to: toPosition, boardRef, flipped });
  }

  if (!pieceRef) return;

  await animatePiece({ pieceRef, from, to, boardRef, flipped });

  // Handle Promotion (After animation is done)
  // If a pawn's rank is 0 or 7, it's being promoted
  if (setPromotionMove) {
    const isPawn = engineBoard.locations[engineMove.from] === Pieces.WhitePawn || engineBoard.locations[engineMove.from] === Pieces.BlackPawn;
    const isPromoting = isPawn && (getRank(engineMove.to) === 0 || getRank(engineMove.to) === 7);

    if (isPromoting) {
      setPromotionMove(getUci(engineMove));
      return;
    }
  }

  // Make the move on the board
  const newEngineBoard = makeMove(engineBoard, engineMove);
  const newBoard = parseEngineBoard(newEngineBoard);

  setBoard(newBoard);

  const uci = getUci(engineMove);
  if (onPieceMove) onPieceMove(uci);
}

// Don't need to handle animation because it will be handled by the handleMakeMove function
export function handleMakePromotionMove(board: ReadableBoard, uci: string, piece: string) {
  const engineBoard = parseBoardArray(board);
  const engineMove = parseUci(uci + piece, engineBoard);
  const newEngineBoard = makeMove(engineBoard, engineMove);

  return parseEngineBoard(newEngineBoard);
}
