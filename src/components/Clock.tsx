import { useEffect, useState } from "react";
import { Team } from "../types";
import getTimeString from "../util/getTimeString";
import "./styles/clock.scss";
import playAudio from "../functions/playAudio";

type Props = {
  time: number;
  color: Team;
  doWarning?: boolean;
};

export default function Clock({ color, time, doWarning = true }: Props) {
  const timeString = getTimeString(time);

  // Because I've given the components keys (in the parent component), the state will remain the same
  // This is why I'm able to hold the state in the component itself, and not in the parent
  // Even though it is re-rendered very often.
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [extraClassName, setExtraClassName] = useState("");

  const warningThreshold = 10;
  const clockAnimationTimeS = 0.8;
  const animationTimes = 3; // The number of times the animation will play

  if (time <= warningThreshold && !audioPlayed && doWarning) {
    setExtraClassName("clock-warning");

    playAudio("clock-low", 0.1);

    setAudioPlayed(true);
  }

  // In case you have a time control where you gain time after each move
  // This will reset the audioPlayed state, so the warning will play again when the time is low again
  useEffect(() => {
    if (time > warningThreshold) setAudioPlayed(false);
  }, [time]);

  // Remove the warning class when the time is above the threshold
  // This is so I can give it a CSS animation, and it will play only once
  useEffect(() => {
    if (extraClassName === "") return;

    // Remove the className after the animation is done
    const timeout = setTimeout(() => setExtraClassName(""), clockAnimationTimeS * 1000);
    return () => clearTimeout(timeout);
  }, [extraClassName]);

  return (
    <div className={`clock ${extraClassName}`} data-color={color} style={{ animationDuration: `${clockAnimationTimeS / animationTimes}s` }}>
      {timeString}
    </div>
  );
}
