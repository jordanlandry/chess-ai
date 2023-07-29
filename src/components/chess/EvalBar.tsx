import { Evaluation } from "../../engine/types";
import { Team } from "../../types";
import clamp from "../../util/clamp";
import "../styles/evalbar.scss";

type Props = {
  score: Evaluation;
  flipped: boolean;
};

export default function EvalBar({ score, flipped }: Props) {
  // The 12 is kind of arbitrary, I just experimented with different numbers until I found one that felt right
  const maxScore = 12; // Max score to fill the bar
  // I want it to take exponentially more time to fill up the bar (I don't want it to look linear)

  const percentToFill = (centipawns: number) => {
    let score = centipawns / 100;
    return clamp(50 + 50 * Math.pow(Math.abs(score / maxScore), 0.5), 50, 100);
  };

  const isScorePositive = (score: Evaluation) => {
    if (score.book) return true;
    else if (score.mateIn) return score.mateIn.team === "white";
    else return score.centipawns! > 0;
  };

  const getStyle = (team: Team) => {
    let percent;

    if (score.book) percent = 50;
    else if (score.mateIn) percent = 100;
    else percent = percentToFill(score.centipawns!);

    const positive = isScorePositive(score);

    if (positive) {
      if (team === "white") return { height: `${percent}%` };
      else return { height: 100 - percent + "%" };
    }

    // Score is negative
    else {
      if (team === "white") return { height: 100 - percent + "%" };
      else return { height: `${percent}%` };
    }
  };

  const doShowScore = (score: Evaluation, team: Team) => {
    if (score.book) return true;

    const positive = isScorePositive(score);

    // If the score is positive, then show for white and not for black
    if (positive && team === "white") return true;
    if (!positive && team === "black") return true;

    return false;
  };

  // Round it to 1 decimal place
  const roundScore = (score: Evaluation) => {
    if (score.book) return 0;
    else if (score.mateIn) return "M" + score.mateIn.moves;
    return Math.abs(Math.round((score.centipawns! / 100) * 10) / 10);
  };

  return (
    <div className="eval-bar" data-flipped={flipped}>
      <div className="eval-bar__black bar" style={getStyle("black")} data-flipped={flipped}>
        {doShowScore(score, "black") ? <div>{roundScore(score)}</div> : null}
      </div>
      <div className="eval-bar__white bar" style={getStyle("white")} data-flipped={flipped}>
        {doShowScore(score, "white") ? <div>{roundScore(score)}</div> : null}
      </div>
    </div>
  );
}
