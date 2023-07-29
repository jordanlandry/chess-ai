import { SetStateAction, useRef, useState } from "react";
import { Squares } from "../../engine/src/constants/square";
import usePieceRefs from "../../hooks/chess/usePieceRefs";
import { ReadableBoard } from "../../types";
import Chess from "../chess/Chess";

type Props = {};

export default function PuzzlePage({}: Props) {
  const [board, setBoard] = useState<ReadableBoard>({
    pieces: [
      ["r", "n", "b", "q", "k", "b", "n", "r"],
      ["p", "p", "p", "p", "p", "p", "p", "p"],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      ["P", "P", "P", "P", "P", "P", "P", "P"],
      ["R", "N", "B", "Q", "K", "B", "N", "R"],
    ],
    turn: "white",
    enPassant: Squares.none,
    castle: {
      whiteKing: true,
      whiteQueen: true,
      blackKing: true,
      blackQueen: true,
    },
  });

  const boardRef = useRef<HTMLDivElement>(null);

  const pieceRefs = usePieceRefs();

  const onPieceMove = (move: string) => {};

  // TODO: Update based on the puzzle
  const isFlipped = false;

  return (
    <div>
      {/* <Chess board={board} setBoard={setBoard} boardRef={boardRef} pieceRefs={pieceRefs} onPieceMove={onPieceMove} flipped={isFlipped} moves={[]} setMoves={function (value: SetStateAction<string[]>): void {
        throw new Error("Function not implemented.");
      } } running={false} /> */}
    </div>
  );
}
