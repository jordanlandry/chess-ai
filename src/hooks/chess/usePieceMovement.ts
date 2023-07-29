import { useEffect, useRef, useState } from "react";
import { SQUARE_NAMES } from "../../engine/src/constants/square";
import handleMakeMove from "../../functions/handleMakeMove";
import { Position, ReactRef, ReadableBoard, SetState, Team } from "../../types";
import getIndexByPosition from "../../util/getIndexByPosition";
import getTeam from "../../util/getTeam";
import { resetPieceStyles } from "../../util/resetPieceStyles";
import { Move } from "../../engine/types";

type Props = {
  board: ReadableBoard;
  setBoard: SetState<ReadableBoard>;
  pieceRefs: ReactRef<(HTMLImageElement | null)[][]>;
  boardRef: ReactRef<HTMLDivElement>;
  onPieceMove: (move: string) => void;
  setPromotionMove: SetState<string>;
  availableMoves: Move[];

  selectedPosition: Position | null;
  setSelectedPosition: SetState<Position | null>;

  aiTeam?: Team;

  running: boolean;
  flipped: boolean;
};

export default function usePieceMovement(props: Props) {
  const {
    board,
    setBoard,
    pieceRefs,
    boardRef,
    onPieceMove,
    setPromotionMove,
    availableMoves,
    selectedPosition,
    setSelectedPosition,
    aiTeam,
    running,
    flipped,
  } = props;

  const firstClickRef = useRef(true);
  const isMouseDownRef = useRef(false);

  const [hoveredPosition, setHoveredPosition] = useState<Position | null>(null);

  const getBoardPosition = (e: MouseEvent, flipped: boolean) => {
    if (!boardRef.current) return null;

    const { left, top, width } = boardRef.current.getBoundingClientRect();
    const squareSize = width / 8;

    const x = flipped ? Math.floor((left + width - e.clientX) / squareSize) : Math.floor((e.clientX - left) / squareSize);
    const y = flipped ? Math.floor((top + width - e.clientY) / squareSize) : Math.floor((e.clientY - top) / squareSize);

    if (x < 0 || x > 7 || y < 0 || y > 7) return null;

    return { x, y };
  };

  useEffect(() => {
    if (!boardRef.current) return;
    if (!pieceRefs.current) return;

    if (board.turn === aiTeam || board.turn === "none") return;
    if (!running) {
      setHoveredPosition(null);
      setSelectedPosition(null);
      return;
    }

    // For selecting pieces or making moves
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return; // Make sure it's a left-click

      isMouseDownRef.current = true;
      const position = getBoardPosition(e, flipped);

      if (!position) {
        setSelectedPosition(null);
        firstClickRef.current = true;
        return;
      }

      // Reset firstClickRef
      if (JSON.stringify(position) !== JSON.stringify(selectedPosition)) firstClickRef.current = true;

      const piece = board.pieces[position.y][position.x];
      const team = getTeam(piece);

      // If the piece you click on is on your team, select it
      if (team === board.turn) {
        setSelectedPosition(position);
        return;
      }

      // You can either click on the other team, or an empty square to make a move
      if (selectedPosition) {
        const idx = getIndexByPosition(selectedPosition);
        const move = SQUARE_NAMES[idx] + SQUARE_NAMES[getIndexByPosition(position)];

        handleMakeMove({ board, move, pieceRefs, boardRef, setBoard, onPieceMove, setPromotionMove, availableMoves, flipped });
        setSelectedPosition(null);
        firstClickRef.current = true;
      }
    };

    // For dropping pieces de-selecting them
    const handleMouseUp = (e: MouseEvent) => {
      if (e.button !== 0) return; // Make sure it's a left-click

      isMouseDownRef.current = false;
      setHoveredPosition(null);

      if (!selectedPosition) return;

      // If you let go of your mouse on an already selected piece, then deselect it (If it's not your first time clicking on it)
      const position = getBoardPosition(e, flipped);
      if (!position) resetPieceStyles(pieceRefs, selectedPosition, flipped);
      // If you let go on the same square you clicked on, then deselect it if it's not your first time clicking on it
      // Because if it is your first time clicking on it, then you're just selecting it
      else if (JSON.stringify(position) === JSON.stringify(selectedPosition)) {
        if (!firstClickRef.current) setSelectedPosition(null);
        else firstClickRef.current = false;

        // Reset the transform property on the piece you just let go of
        resetPieceStyles(pieceRefs, position, flipped);
      }

      // If you let go on a square with a selected piece, then make a move
      else if (selectedPosition) {
        const idx = getIndexByPosition(selectedPosition);
        const move = SQUARE_NAMES[idx] + SQUARE_NAMES[getIndexByPosition(position)];

        handleMakeMove({ board, move, pieceRefs, boardRef, setBoard, onPieceMove, setPromotionMove, availableMoves, flipped });
        setSelectedPosition(null);
        firstClickRef.current = true;
      }
    };

    // Dragging pieces
    const handleMouseMove = (e: MouseEvent) => {
      if (!isMouseDownRef.current) return;
      if (!selectedPosition || !pieceRefs.current || !boardRef.current) return;

      const position = getBoardPosition(e, flipped);

      const piece = pieceRefs.current[selectedPosition.y][selectedPosition.x];
      if (!piece) return;

      setHoveredPosition(position);

      // Move the piece with the mouse
      piece.style.position = "absolute";
      piece.style.zIndex = "1000";

      // The parent is set to position relative so we can't use the window's coordinates as top and left
      // We can use the board's coordinates to add a translation to the piece instead

      // Calculate the original pixel position of the piece based on the board position
      const { left: boardLeft, top: boardTop, width: boardSize } = boardRef.current!.getBoundingClientRect();
      const squareSize = boardSize / 8;

      let pieceLeft = selectedPosition.x * squareSize + boardLeft;
      let pieceTop = selectedPosition.y * squareSize + boardTop;

      if (flipped) {
        pieceLeft = (7 - selectedPosition.x) * squareSize + boardLeft;
        pieceTop = (7 - selectedPosition.y) * squareSize + boardTop;
      }

      let mouseX = e.clientX;
      let mouseY = e.clientY;

      // Make sure you're within the bounds of the board
      if (mouseX < boardLeft) mouseX = boardLeft;
      if (mouseX > boardLeft + boardSize) mouseX = boardLeft + boardSize;
      if (mouseY < boardTop) mouseY = boardTop;
      if (mouseY > boardTop + boardSize) mouseY = boardTop + boardSize;

      // Calculate the difference between the mouse position and the piece's original position
      let diffX = mouseX - pieceLeft - squareSize / 2;
      let diffY = mouseY - pieceTop - squareSize / 2;

      // If the piece is flipped, then the difference is the opposite
      if (flipped) {
        diffX = pieceLeft - mouseX + squareSize / 2;
        diffY = pieceTop - mouseY + squareSize / 2;
      }

      // Set the piece's position to the mouse's position minus the difference
      piece.style.transform = `translate(${diffX}px, ${diffY}px) scale(1.1) ${flipped ? "rotate(180deg)" : ""}`;
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [selectedPosition, board, availableMoves, running]);

  /*
    By first thought it seems like you can make a useEffect for the selectedPosition 
    where everytime it is null, reset the firstClickRef
    But there are certain cases where you want to keep the firstClickRef where doing that wouldn't work.
  */

  return { selectedPosition, hoveredPosition };
}
