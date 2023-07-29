import { createContext } from "react";
import GamePage from "./components/pages/GamePage";
import useLocalStorage from "./hooks/useLocalStorage";
import { SetState } from "./types";

type StylesContext = {
  boardStyle: string;
  pieceStyle: string;
  setBoardStyle: SetState<string>;
  setPieceStyle: SetState<string>;
};

export const StylesContext = createContext<StylesContext>({} as StylesContext);

function App() {
  const [boardStyle, setBoardStyle] = useLocalStorage<string>("chess_boardColor", "green");
  const [pieceStyle, setPieceStyle] = useLocalStorage<string>("chess_pieceStyle", "cartoon");

  return (
    <StylesContext.Provider value={{ boardStyle, pieceStyle, setBoardStyle, setPieceStyle }}>
      <GamePage />
    </StylesContext.Provider>
  );
}

export default App;
