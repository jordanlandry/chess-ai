import { Position, ReactRef } from "../types";

type Props = {
  from: Position;
  to: Position;
  pieceRef: HTMLImageElement;
  boardRef: ReactRef<HTMLDivElement>;
  flipped: boolean;
};

export default async function animatePiece({ from, to, pieceRef, boardRef, flipped }: Props) {
  const animationTimeMs = 100;

  // Translate the piece to the new position
  const piece = pieceRef;
  const board = boardRef.current;

  if (!piece || !board) return;

  const { left, top, width } = board.getBoundingClientRect();
  const squareSize = width / 8;

  const fromX = from.x * squareSize + left;
  const fromY = from.y * squareSize + top;

  const toX = to.x * squareSize + left;
  const toY = to.y * squareSize + top;

  const xDiff = toX - fromX;
  const yDiff = toY - fromY;

  return new Promise<void>((resolve) => {
    piece.style.transition = `transform ${animationTimeMs}ms ease-in-out`;
    piece.style.transform = `translate(${xDiff}px, ${yDiff}px) ${flipped ? "rotate(180deg)" : ""}`;
    piece.style.zIndex = "1000";

    const animationEndHandler = () => {
      // If I remove the style properties, sometimes it will jump back to the original position right before the anim is done
      // Since the entire piece component gets unmounted after the anim is done, I don't need to worry about changing the properties back
      piece.removeEventListener("transitionend", animationEndHandler);
      resolve();
    };

    piece.addEventListener("transitionend", animationEndHandler);

    // If for whatever reason the transitionend event doesn't fire, resolve the promise
    setTimeout(() => animationEndHandler(), animationTimeMs + 10);
  });
}
