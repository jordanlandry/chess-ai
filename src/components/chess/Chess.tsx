import { useState } from "react";
import { handleMakePromotionMove } from "../../functions/handleMakeMove";
import useAvailableMoves from "../../hooks/chess/useAvailableMoves";
import useCheckPosition from "../../hooks/chess/useCheckPosition";
import useLastMovePosition from "../../hooks/chess/useLastMovePosition";
import usePieceMovement from "../../hooks/chess/usePieceMovement";
import { Position, ReactRef, ReadableBoard, SetState, Team } from "../../types";
import Settings from "../pages/Settings";
import Board from "./Board";
import PromotionTab from "./PromotionTab";

type Props = {
  board: ReadableBoard;
  setBoard: SetState<ReadableBoard>;
  onPieceMove: (move: string) => void;
  pieceRefs: ReactRef<(HTMLImageElement | null)[][]>;
  boardRef: ReactRef<HTMLDivElement>;
  aiTeam?: Team;
  moves: string[];
  setMoves: SetState<string[]>;
  running: boolean;
  flipped: boolean;
};

// The reason board and setBoard aren't context (Even though they nest down to this component's child)
// is because if I have multiple different pages calling this component, it will be a pain to create
// custom contexts for each page. Instead, I can just pass the board and setBoard as props.
export default function Chess({
  board,
  setBoard,
  onPieceMove,
  pieceRefs,
  boardRef,
  aiTeam,
  moves,
  setMoves,
  running,
  flipped,
}: Props) {
  const [promotionMove, setPromotionMove] = useState<string>(""); // The UCI move set from makeMove when you are on a promotion square
  const onPromotion = (piece: string) => {
    setBoard(handleMakePromotionMove(board, promotionMove, piece));
    setMoves((prevMoves) => [...prevMoves, promotionMove + piece]);
    setPromotionMove("");
  };

  const onMove = (move: string) => {
    setMoves((prevMoves) => [...prevMoves, move]);
    onPieceMove(move);
  };

  const [isSettingsOpened, setIsSettingsOpened] = useState<boolean>(false);

  const [selectedPosition, setSelectedPosition] = useState<Position | null>(
    null
  );
  const { lastMoveFrom, lastMoveTo } = useLastMovePosition(board, moves);

  const availableMoves = useAvailableMoves({ board, selectedPosition });
  const { hoveredPosition } = usePieceMovement({
    board,
    aiTeam,
    setBoard,
    boardRef,
    pieceRefs,
    onPieceMove: onMove,
    setPromotionMove,
    availableMoves,
    selectedPosition,
    setSelectedPosition,
    running: running && !isSettingsOpened,
    flipped,
  });

  const checkPosition = useCheckPosition(board);

  return (
    <>
      <Board
        board={board}
        boardRef={boardRef}
        pieceRefs={pieceRefs}
        selectedPosition={selectedPosition}
        hoveredPosition={hoveredPosition}
        availableMoves={availableMoves}
        checkPosition={checkPosition}
        lastMoveFrom={lastMoveFrom}
        lastMoveTo={lastMoveTo}
        flipped={flipped}
        setIsSettingsOpened={setIsSettingsOpened}
      />

      <PromotionTab
        isPromoting={promotionMove !== ""}
        onSelect={onPromotion}
        team={board.turn}
      />

      <Settings isOpen={isSettingsOpened} setIsOpen={setIsSettingsOpened} />
    </>
  );
}
