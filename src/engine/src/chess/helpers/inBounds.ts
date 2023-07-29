import { Position } from "../../../../types";

export default function inBounds(square: number | Position) {
  if (typeof square === "number") return square >= 0 && square < 64;
  else return square.x <= 7 && square.x >= 0 && square.y <= 7 && square.y >= 0;
}
