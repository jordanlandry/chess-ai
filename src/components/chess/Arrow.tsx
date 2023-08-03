import { useRef } from "react";
import useHideContextMenu from "../../hooks/useHideContextMenu";
import useResize from "../../hooks/useResize";
import { Position, ReactRef } from "../../types";

type Props = {
  start: Position;
  end: Position;
  color: string;
  boardRef: ReactRef<HTMLDivElement>;
};

export default function Arrow({ start, end, color, boardRef }: Props) {
  const arrowRef = useRef(null);
  useHideContextMenu(arrowRef);

  useResize(); // This re-renders the component when the window is resized to make sure the arrow is in the correct position

  const {
    top: boardTop,
    left: boardLeft,
    width: boardSize,
  } = boardRef.current!.getBoundingClientRect();
  const squareSize = boardSize / 8;

  const angle = Math.atan2(end.y - start.y, end.x - start.x) * (180 / Math.PI);

  // Calculate the length based on the distance between the start and end positions and the angle
  const length =
    Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)) *
      squareSize +
    squareSize / 8;

  const stemThickness = squareSize / 4;
  const arrowHeadSize = stemThickness * 2;

  const triangle = (
    <polygon
      points={`0,0 0,${arrowHeadSize} ${arrowHeadSize * 0.75},${
        arrowHeadSize / 2
      }`}
      fill={color}
      style={{
        transform: `translate(${length - arrowHeadSize}px, ${
          stemThickness / 2
        }px)`,
      }}
    />
  );

  const rect = (
    <rect
      width={length - arrowHeadSize}
      height={stemThickness}
      fill={color}
      style={{ transform: `translate(0, ${arrowHeadSize / 2}px)` }}
    />
  );

  const top = boardTop + start.y * squareSize + squareSize / 8;
  const left = boardLeft + start.x * squareSize + squareSize / 2;

  return (
    <svg
      ref={arrowRef}
      width={length}
      height={stemThickness + arrowHeadSize}
      style={{
        position: "absolute",
        top: `${top}px`,
        left: `${left}px`,
        transform: `rotate(${angle}deg)`,
        transformOrigin: "left center",
        zIndex: 10,
      }}
    >
      {rect}
      {triangle}
    </svg>
  );
}
