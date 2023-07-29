import { Squares } from "./square";

export const STARTING_BOARD = {
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
  turn: "none",
  enPassant: Squares.none,
  castle: {
    whiteKing: true,
    whiteQueen: true,
    blackKing: true,
    blackQueen: true,
  },
};
