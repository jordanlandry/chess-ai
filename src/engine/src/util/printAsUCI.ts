import { Move } from "../../types";
import { SQUARE_NAMES } from "../constants/square";

export default function printAsUci(moves: Move[]) {
  console.log(moves.map((move) => `${SQUARE_NAMES[move.from]}${SQUARE_NAMES[move.to]}`).join(" "));
}
