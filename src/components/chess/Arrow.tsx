import { Position } from "../../types";

type Props = {
  start: Position;
  end: Position;
};

export default function Arrow({ start, end }: Props) {
  const length = Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y));
  const angle = Math.atan2(end.y - start.y, end.x - start.x) * (180 / Math.PI);
  const arrowSize = 10; // The size of the arrowhead
  const thickness = 5; // The thickness of the arrow

  const arrowPath = `M0,${thickness / 2} L${length - arrowSize},${thickness / 2} L${length - arrowSize},${thickness / 4} L${length},${
    thickness / 2
  } L${length - arrowSize},${(3 * thickness) / 4} L${length - arrowSize},${thickness / 2}`;

  return (
    <svg
      width={length}
      height={thickness}
      viewBox={`0 0 ${length} ${thickness}`}
      style={{
        position: "absolute",
        top: `${Math.min(start.y, end.y)}px`,
        left: `${Math.min(start.x, end.x)}px`,
        transform: `rotate(${angle}deg)`,
        transformOrigin: "left center",
      }}
    >
      <path d={arrowPath} />
    </svg>
  );
}
