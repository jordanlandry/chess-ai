import { AnalyticsType, ReactRef } from "../types";

import "./styles/analytics.scss";

type Props = {
  analytics: AnalyticsType[];
  boardRef: ReactRef<HTMLDivElement>;
};

export default function Analytics({ analytics, boardRef }: Props) {
  const test = analytics[0];
  const totalWins = test.winsAsWhite + test.winsAsBlack;
  const totalLosses = test.lossesAsWhite + test.lossesAsBlack;
  const totalDraws = test.drawsAsWhite + test.drawsAsBlack;

  const totalGames = totalWins + totalLosses + totalDraws;

  const width = boardRef.current ? boardRef.current.clientWidth : 0;

  return (
    <div className="analytics">
      <div className="analytics__bar" style={{ width: width + "px" }}>
        <div className="analytics__bar-win" style={{ width: (totalWins / totalGames) * 100 + "%" }}>
          {totalWins ? totalWins : ""}
        </div>
        <div className="analytics__bar-draw" style={{ width: (totalDraws / totalGames) * 100 + "%" }}>
          {totalDraws ? totalDraws : ""}
        </div>
        <div className="analytics__bar-loss" style={{ width: (totalLosses / totalGames) * 100 + "%" }}>
          {totalLosses ? totalLosses : ""}
        </div>
      </div>
    </div>
  );
}
