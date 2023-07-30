import { useContext } from "react";
import { Team } from "../../types";
import Modal from "../Modal";
import { StylesContext } from "../../App";
import { IMAGE_PATH } from "../../constants/paths";

type Props = {
  isPromoting: boolean;
  onSelect: (piece: string) => void;
  team: Team;
};

export default function PromotionTab({ isPromoting, onSelect, team }: Props) {
  const { pieceStyle } = useContext(StylesContext);

  return (
    <Modal open={isPromoting} className={`promotion promotion-${team}`}>
      <img src={`${IMAGE_PATH}/${pieceStyle}/${team}/queen.png`} className="promotion-piece" alt="queen" onClick={() => onSelect("q")} />
      <img src={`${IMAGE_PATH}/${pieceStyle}/${team}/rook.png`} className="promotion-piece" alt="rook" onClick={() => onSelect("r")} />
      <img src={`${IMAGE_PATH}/${pieceStyle}/${team}/bishop.png`} className="promotion-piece" alt="bishop" onClick={() => onSelect("b")} />
      <img src={`${IMAGE_PATH}/${pieceStyle}/${team}/knight.png`} className="promotion-piece" alt="knight" onClick={() => onSelect("n")} />
    </Modal>
  );
}
