import { useContext } from "react";
import { Team } from "../../types";
import Modal from "../Modal";
import { StylesContext } from "../../App";

type Props = {
  isPromoting: boolean;
  onSelect: (piece: string) => void;
  team: Team;
};

export default function PromotionTab({ isPromoting, onSelect, team }: Props) {
  const { pieceStyle } = useContext(StylesContext);

  return (
    <Modal open={isPromoting} className={`promotion promotion-${team}`}>
      <img src={`src/assets/images/${pieceStyle}/${team}/queen.png`} className="promotion-piece" alt="queen" onClick={() => onSelect("q")} />
      <img src={`src/assets/images/${pieceStyle}/${team}/rook.png`} className="promotion-piece" alt="rook" onClick={() => onSelect("r")} />
      <img src={`src/assets/images/${pieceStyle}/${team}/bishop.png`} className="promotion-piece" alt="bishop" onClick={() => onSelect("b")} />
      <img src={`src/assets/images/${pieceStyle}/${team}/knight.png`} className="promotion-piece" alt="knight" onClick={() => onSelect("n")} />
    </Modal>
  );
}
