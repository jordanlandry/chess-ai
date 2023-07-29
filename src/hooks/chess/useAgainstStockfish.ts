import { useEffect, useState } from "react";
import { AnalyticsType, GameState, ReactRef, ReadableBoard, SetState, Team } from "../../types";
import handleMakeMove from "../../functions/handleMakeMove";

type Props = {
  gameState: GameState;
  moveList: string[];
  aiTeam: Team;
  board: ReadableBoard;
  pieceRefs: ReactRef<(HTMLImageElement | null)[][]>;
  boardRef: ReactRef<HTMLDivElement>;
  setBoard: SetState<ReadableBoard>;
  onPieceMove: (move: string) => void;
  setMoveList: SetState<string[]>;

  reset: () => void;
  handleStartGame: () => void;
  setAiTeam: SetState<Team>;
};

export default function useAgainstStockfish({
  moveList,
  aiTeam,
  board,
  pieceRefs,
  boardRef,
  setBoard,
  onPieceMove,
  gameState,
  setMoveList,
  reset,
  handleStartGame,
  setAiTeam,
}: Props) {
  const turn = moveList.length % 2 === 0 ? "white" : "black";
  const [elo, setElo] = useState(300);
  const [games, setGames] = useState(0);

  const [results, setResults] = useState<AnalyticsType[]>([
    {
      elo: 250,
      winsAsWhite: 0,
      winsAsBlack: 0,
      drawsAsWhite: 0,
      drawsAsBlack: 0,
      lossesAsWhite: 0,
      lossesAsBlack: 0,
      games: [],
    },
  ]);

  useEffect(() => {
    // This means the game is over and we need to update the analytics
    if (typeof gameState !== "string") {
      setResults((prev) => {
        const lastResult = prev[prev.length - 1];

        const won = gameState.winner === aiTeam;
        const draw = gameState.drawBy !== undefined;
        setGames((prev) => prev + 1);

        return [
          ...prev.slice(0, prev.length - 1),
          {
            elo,
            winsAsWhite: lastResult.winsAsWhite + (won && aiTeam === "white" ? 1 : 0),
            winsAsBlack: lastResult.winsAsBlack + (won && aiTeam === "black" ? 1 : 0),
            drawsAsWhite: lastResult.drawsAsWhite + (draw && aiTeam === "white" ? 1 : 0),
            drawsAsBlack: lastResult.drawsAsBlack + (draw && aiTeam === "black" ? 1 : 0),
            lossesAsWhite: lastResult.lossesAsWhite + (!won && !draw && aiTeam === "white" ? 1 : 0),
            lossesAsBlack: lastResult.lossesAsBlack + (!won && !draw && aiTeam === "black" ? 1 : 0),
            games: [...lastResult.games, ...moveList],
          },
        ] as AnalyticsType[];
      });

      reset();
      handleStartGame();
      setAiTeam((prev) => (prev === "white" ? "black" : "white"));

      return;
    }

    if (turn === aiTeam) return;
    if (gameState === "not-started") return;

    const abortController = new AbortController();

    const fetchServer = async () => {
      const move = await fetch("http://127.0.0.1:5000/move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moves: moveList, elo }),
      }).then((res) => res.json());

      if (move) {
        handleMakeMove({
          board,
          move,
          pieceRefs,
          boardRef,
          setBoard,
          onPieceMove,
          flipped: aiTeam === "white",
        });

        setMoveList([...moveList, move]);
      }
    };

    fetchServer();

    return () => abortController.abort();
  }, [aiTeam, moveList, gameState, elo]);

  useEffect(() => {
    if (games && games % 100 === 0) setElo((prev) => prev + 100);
  }, [games]);

  return results;
}
