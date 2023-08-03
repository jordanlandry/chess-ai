import { useEffect, useRef, useState } from "react";
import { Position, ReactRef } from "../../types";
import { getBoardPosition } from "../../util/getBoardPosition";
import { Move } from "../../engine/types";
import useHideContextMenu from "../useHideContextMenu";

type Props = {
  boardRef: ReactRef<HTMLDivElement>;
  flipped: boolean;
  availableMoves: Move[];
};

export default function useArrow({ boardRef, flipped, availableMoves }: Props) {
  const startPositionRef = useRef<Position | null>(null);
  const [arrowPaths, setArrowPaths] = useState<
    { from: Position; to: Position }[]
  >([]);

  useHideContextMenu(boardRef);

  useEffect(() => {
    if (!boardRef.current) return;

    setArrowPaths([]); // Reset the arrow paths when the available moves change
    const rightClick = 2;
    const leftClick = 0;

    const onMouseDown = (e: MouseEvent) => {
      if (e.button === leftClick) setArrowPaths([]); // Reset the arrow paths when the user clicks the left mouse button
      if (e.button !== rightClick) return;

      const position = getBoardPosition(e, flipped, boardRef);
      if (!position) return;

      const { x, y } = position;
      startPositionRef.current = { x, y };
    };

    const onMouseUp = (e: MouseEvent) => {
      if (e.button !== rightClick) {
        startPositionRef.current = null;
        return;
      }

      // If you don't have a start position, then don't do anything
      if (!startPositionRef.current) return;

      // Get the x and y on the board
      const position = getBoardPosition(e, flipped, boardRef);
      if (!position) return;

      // Don't allow arrows to be drawn to the same square
      if (JSON.stringify(position) === JSON.stringify(startPositionRef.current))
        return;

      const newArrow = { from: startPositionRef.current, to: position };

      // Add the arrow
      setArrowPaths((prev) => {
        // Remove the arrow if it already exists
        const arrowIndex = prev.findIndex(
          (arrow) =>
            arrow.from.x === newArrow.from.x &&
            arrow.from.y === newArrow.from.y &&
            arrow.to.x === newArrow.to.x &&
            arrow.to.y === newArrow.to.y
        );

        // Add it if it doesn't exist already
        if (arrowIndex === -1) return [...prev, newArrow];

        const newArrowPaths = [...prev];
        newArrowPaths.splice(arrowIndex, 1);
        return newArrowPaths;
      });
    };

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [availableMoves]);

  return arrowPaths;
}
