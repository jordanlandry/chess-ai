import { useContext, useEffect, useRef } from "react";
import { Position, ReactRef } from "../../types";
import { StylesContext } from "../../App";

type Piece = "p" | "n" | "b" | "r" | "q" | "k" | "P" | "N" | "B" | "R" | "Q" | "K";

type Props = {
  piece: Piece;
  position: Position;
  boardRef: ReactRef<HTMLDivElement>;
  pieceRefs: ReactRef<(HTMLImageElement | null)[][]>;
  flipped: boolean;
};

const pieceMap = {
  p: "pawn",
  n: "knight",
  b: "bishop",
  r: "rook",
  q: "queen",
  k: "king",
} as { [key in Piece]: string };

export default function Piece({ piece, position, pieceRefs, flipped }: Props) {
  const { pieceStyle } = useContext(StylesContext);

  // Find the path of the image
  const color = piece === piece.toLowerCase() ? "black" : "white";
  const pieceName = pieceMap[piece.toLowerCase() as Piece];

  const path = `src/assets/images/${pieceStyle}/${color}/${pieceName}.png`;

  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    pieceRefs.current![position.y][position.x] = ref.current;
  }, [ref]);

  return <img draggable={false} className="piece" src={path} alt={pieceName} ref={ref} data-flipped={flipped} />;
}
