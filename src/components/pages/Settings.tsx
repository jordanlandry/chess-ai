import { useContext, useState } from "react";
import { StylesContext } from "../../App";
import { boardColors, pieceStyles } from "../../boardStyles";
import { SetState } from "../../types";
import Modal from "../Modal";
import BoardDisplay from "../chess/BoardDisplay";
import "../styles/settings.scss";
import { IMAGE_PATH } from "../../constants/paths";

type Props = {
  isOpen: boolean;
  setIsOpen: SetState<boolean>;
};

export default function Settings({ isOpen, setIsOpen }: Props) {
  const { boardStyle, setBoardStyle, pieceStyle, setPieceStyle } = useContext(StylesContext);

  // TODO: Make the default style be the one that is currently selected
  const [selectedBoardStyle, setSelectedBoardStyle] = useState<string>(boardStyle);
  const [selectedPieceStyle, setSelectedPieceStyle] = useState<string>(pieceStyle);

  const handleCancel = () => setIsOpen(false);
  const handleSave = () => {
    setBoardStyle(selectedBoardStyle);
    setPieceStyle(selectedPieceStyle);
    setIsOpen(false);
  };

  return (
    <Modal open={isOpen} onClose={() => setIsOpen(false)}>
      <div className="settings-wrapper">
        <h1>Settings</h1>

        <h2>Board Colors</h2>
        <div className="board-display-wrapper">
          {Object.keys(boardColors).map((key) => {
            return (
              <BoardDisplay
                key={key}
                boardStyle={boardColors[key]}
                selected={selectedBoardStyle === key}
                onClick={() => setSelectedBoardStyle(key)}
              />
            );
          })}
        </div>
        <h2>Piece Styles</h2>
        <div className="board-display-wrapper">
          {pieceStyles.map((style) => {
            return (
              <div key={style} className="piece-container" onClick={() => setSelectedPieceStyle(style)}>
                <h3>{style}</h3>
                <div className="img-container" data-selected={selectedPieceStyle === style}>
                  <img src={`${IMAGE_PATH}/${style}/white/king.png`} alt="king" />
                  <img src={`${IMAGE_PATH}/${style}/white/queen.png`} alt="queen" />
                  <img src={`${IMAGE_PATH}/${style}/white/rook.png`} alt="rook" />
                  <img src={`${IMAGE_PATH}/${style}/white/knight.png`} alt="knight" />
                  <img src={`${IMAGE_PATH}/${style}/white/bishop.png`} alt="bishop" />
                  <img src={`${IMAGE_PATH}/${style}/white/pawn.png`} alt="pawn" />

                  <img src={`${IMAGE_PATH}/${style}/black/king.png`} alt="king" />
                  <img src={`${IMAGE_PATH}/${style}/black/queen.png`} alt="queen" />
                  <img src={`${IMAGE_PATH}/${style}/black/rook.png`} alt="rook" />
                  <img src={`${IMAGE_PATH}/${style}/black/knight.png`} alt="knight" />
                  <img src={`${IMAGE_PATH}/${style}/black/bishop.png`} alt="bishop" />
                  <img src={`${IMAGE_PATH}/${style}/black/pawn.png`} alt="pawn" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="settings__button-wrapper">
          <button onClick={handleSave} className="save">
            Save
          </button>
          <button onClick={handleCancel} className="cancel">
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
