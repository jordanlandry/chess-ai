import { useContext } from "react";
import { StylesContext } from "../../App";
import { boardColors } from "../../boardStyles";
import { squareNamesForward } from "../../constants/squares";
import { Move } from "../../engine/types";
import useIsRefDefined from "../../hooks/useIsRefDefined";
import { Position, ReactRef, ReadableBoard, SetState } from "../../types";
import comparePositions from "../../util/comparePositions";
import { isLightSquare } from "../../util/isLightSquare";
import "../styles/board.scss";
import Piece from "./Piece";
import Arrow from "./Arrow";

type Props = {
  board: ReadableBoard;
  boardRef: ReactRef<HTMLDivElement>;
  pieceRefs: ReactRef<(HTMLImageElement | null)[][]>;
  selectedPosition: Position | null;
  hoveredPosition: Position | null;
  checkPosition: Position | null;
  availableMoves: Move[];
  lastMoveFrom: Position | null;
  lastMoveTo: Position | null;
  flipped: boolean;
  setIsSettingsOpened: SetState<boolean>;
};

export default function Board({
  board,
  boardRef,
  pieceRefs,
  selectedPosition,
  hoveredPosition,
  availableMoves,
  checkPosition,
  lastMoveFrom,
  lastMoveTo,
  flipped,
  setIsSettingsOpened,
}: Props) {
  const { boardStyle } = useContext(StylesContext);
  const style = boardColors[boardStyle] || boardColors["green"]; // Default to green if the colorStyle is invalid

  // If the boardRef is defined, then set the refDefined to true
  const boardRefDefined = useIsRefDefined(boardRef);

  // Using the squareName, it will return the style making it a light or dark square
  const getStyle = (squareName: string) => ({ backgroundColor: isLightSquare(squareName) ? style.light : style.dark });

  // -------------------- RENDER --------------------
  // It's a lot cleaner if I define the squareElements here, rather than in the return statement
  // This way I can create variaables and make it just so much cleaner
  const squareElements = board.pieces.flat().map((pieceName, index) => {
    if (!boardRefDefined) return null;

    const squareName = squareNamesForward[index];

    const x = index % 8;
    const y = Math.floor(index / 8);

    const pieceElement =
      pieceName !== " " ? <Piece piece={pieceName} position={{ x, y }} boardRef={boardRef} pieceRefs={pieceRefs} flipped={flipped} /> : null;

    const selectedIndex = selectedPosition ? selectedPosition?.x + selectedPosition?.y * 8 : null;
    const isHovered = comparePositions({ x, y }, hoveredPosition);
    const isSelected = comparePositions({ x, y }, selectedPosition);
    const isAvailableMove = availableMoves.some((move) => move.to === index && move.from === selectedIndex);
    const isAvailableCapture = availableMoves.some((move) => move.to === index && move.from === selectedIndex && move.capture);
    const isCheckSquare = comparePositions({ x, y }, checkPosition);
    const isFrom = comparePositions({ x, y }, lastMoveFrom);
    const isTo = comparePositions({ x, y }, lastMoveTo);

    return (
      <div key={squareName} className="square" data-x={x} data-y={y} data-hovered={isHovered} style={getStyle(squareName)}>
        {pieceElement}
        {isSelected ? <div className="square__selected" /> : null}
        {isAvailableMove && !isAvailableCapture ? <div className="square__available" /> : null}
        {isAvailableCapture ? <div className="square__capture" /> : null}
        {isCheckSquare ? <div className="square__check" /> : null}
        {isFrom ? <div className="square__prev-move" /> : null}
        {isTo ? <div className="square__prev-move" /> : null}
      </div>
    );
  });

  return (
    <div className="board-wrapper">
      <div className="board" ref={boardRef} data-flipped={flipped}>
        {squareElements}
        <button onClick={() => setIsSettingsOpened(true)}>Change Board</button>
      </div>
      {/* TODO: */}
      {/* <Arrow start={{ x: 100, y: 100 }} end={{ x: 300, y: 200 }} /> */}
    </div>
  );
}
