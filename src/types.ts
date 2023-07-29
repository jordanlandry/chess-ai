import { CastleRights, Square } from "./engine/types";

export type PieceName = "p" | "n" | "b" | "r" | "q" | "k" | "P" | "N" | "B" | "R" | "Q" | "K" | " ";
export type Team = "white" | "black" | "none";

export type ReadableBoard = {
  pieces: PieceName[][];
  turn: Team;
  castle: CastleRights;
  enPassant: Square;
};

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
export type ReactRef<T> = React.MutableRefObject<T | null>;

export type Position = { x: number; y: number };

export type TimeControl = {
  blackTime: number;
  blackIncrement: number;
  whiteTime: number;
  whiteIncrement: number;
};

export type GameState =
  | "not-started"
  | "in-progress"
  | "game-over"
  | {
      drawBy: "stalemate" | "material" | "repitition" | "agreement" | "50move";
      winner?: undefined;
      wonBy?: undefined;
    }
  | {
      drawBy?: undefined;
      winner: Team;
      wonBy: "checkmate" | "resignation" | "timeout";
    };

export type AnalyticsType = {
  elo: number;
  winsAsWhite: number;
  winsAsBlack: number;
  drawsAsWhite: number;
  drawsAsBlack: number;
  lossesAsWhite: number;
  lossesAsBlack: number;

  games: string[][];
};
