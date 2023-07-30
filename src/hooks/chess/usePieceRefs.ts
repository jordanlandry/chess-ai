import { useEffect, useRef } from "react";

export default function usePieceRefs(flipped: boolean) {
  const pieceRefs = useRef<(HTMLImageElement | null)[][]>([
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ]);

  useEffect(() => {
    // Fix some pieces if they are flipped when they shouldn't be
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (pieceRefs.current[i][j]) pieceRefs.current[i][j]!.style.transform = flipped ? "rotate(180deg)" : "";
      }
    }
  }, [pieceRefs, flipped]);

  return pieceRefs;
}
