import { useEffect, useRef, useState } from "react";
import { ReadableBoard, Team, TimeControl } from "../../types";

type Props = {
  board: ReadableBoard;
  timeControl: TimeControl;

  onTimeUp: (team: Team) => void;
  onTick?: (time: number, color: Team) => void;
  isRunning: boolean;
};

export default function useClock({ board, onTimeUp = () => {}, onTick = () => {}, isRunning, timeControl }: Props) {
  const { blackTime: initialBlackTime, whiteTime: initialWhiteTime, blackIncrement, whiteIncrement } = timeControl;

  const [whiteTime, setWhiteTime] = useState(initialWhiteTime);
  const [blackTime, setBlackTime] = useState(initialBlackTime);

  // In Milliseconds
  const whiteIntervalRef = useRef(10);
  const blackIntervalRef = useRef(10);

  useEffect(() => {
    if (!isRunning) return;

    const { turn } = board;
    if (turn === "none") return;

    // Increase the timer after the opponent finishes their move.
    if (whiteIncrement && turn === "black") setWhiteTime((prevTime) => prevTime + whiteIncrement);
    if (blackIncrement && turn === "white") setBlackTime((prevTime) => prevTime + blackIncrement);

    // Variables depending on the team
    const intervalRef = turn === "white" ? whiteIntervalRef : blackIntervalRef;
    const setTime = turn === "white" ? setWhiteTime : setBlackTime;

    // Delta time handler
    let lastUpdateTime = 0;

    // Update the timer
    const interval = setInterval(() => {
      const now = performance.now();
      setTime((prevTime) => {
        const newTime = prevTime - lastUpdateTime / 1000 - intervalRef.current / 1000;
        onTick(newTime, turn);
        return newTime;
      });

      // Update the delta time
      lastUpdateTime = performance.now() - now;
    }, intervalRef.current);

    // Cleanup
    return () => clearInterval(interval);
  }, [board, isRunning, timeControl]);

  useEffect(() => {
    setWhiteTime(initialWhiteTime);
    setBlackTime(initialBlackTime);
  }, [timeControl]);

  useEffect(() => {
    if (!isRunning) return;

    // Check if the timer has run out
    if (whiteTime <= 0) onTimeUp("white");
    if (blackTime <= 0) onTimeUp("black");
  }, [whiteTime, blackTime, isRunning]);

  return { whiteTime, blackTime };
}
