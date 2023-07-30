import { Pieces } from "./src/constants/piece";

// Allows a type to have a lower bound and an upper bound
type Enumerate<N extends number, Acc extends number[] = []> = Acc["length"] extends N ? Acc[number] : Enumerate<N, [...Acc, Acc["length"]]>;
type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;

// Board types
export type Team = "white" | "black" | "none";
export type Square = IntRange<0, 65>; // Square 64 is "None" (upperbound is none inclusive)

export type CastleRights = {
  whiteKing: boolean;
  whiteQueen: boolean;
  blackKing: boolean;
  blackQueen: boolean;
};

// Piece types
export type Piece = (typeof Pieces)[keyof typeof Pieces];

// prettier-ignore
// export type PieceName = "whitePawn" | "whiteKnight" | "whiteBishop" | "whiteRook" | "whiteQueen" | "whiteKing" | "blackPawn" | "blackKnight" | "blackBishop" | "blackRook" | "blackQueen" | "blackKing" | "none";

type PieceState = { [key in Piece]: Square[] };

export type Board = {
  pieces: PieceState; // Object where key is pieceName, and the value is an array of squares that the piece is on
  locations: Piece[]; // Array where index is square, and the value is the piece on that square
  enPassant: Square; // Square that the capturable pawn is on
  castle: CastleRights;
  turn: Team;
};

export type Move = {
  from: Square;
  to: Square;
  capture?: boolean;
  doublePawnPush?: boolean;
  promotion?: Piece;
  castleRookFrom?: Square;
  enPassantCaptureSquare?: Square;
  isCheck?: boolean;
};

export type MinimaxResult = {
  score: number;
  move?: Move;
  sequence: Move[];
  depth: number;
  time: number;
};

// This type looks funky but I think it's the best way to do it instead of having all be optional
export type Evaluation =
  | {
      centipawns: number;
      mateIn?: undefined;
      book?: false;
    }
  | {
      centipawns?: undefined;
      mateIn: {
        moves: number;
        team: Team;
      };
      book?: false;
    }
  | {
      centipawns?: undefined;
      mateIn?: undefined;
      book: true;
    };

export type BoardTest = {
  pieces: PieceState; // Object where key is pieceName, and the value is an array of squares that the piece is on
  locations: Piece[]; // Array where index is square, and the value is the piece on that square
  enPassant: Square; // Square that the capturable pawn is on
  castle: CastleRights;
  turn: Team;
  moves: (Move[] | null)[]; // Array of moves that are valid at a given square
};
