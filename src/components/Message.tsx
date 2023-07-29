import { ReactNode } from "react";
import useDisappear from "../hooks/useDisappear";
import { SetState } from "../types";

type Props = {
  children: ReactNode;
  delay?: number;
  visible: boolean;
  setIsVisible: SetState<boolean>;
};

export default function Message({ children, delay = 3000, visible, setIsVisible }: Props) {
  const isVisible = useDisappear(visible, setIsVisible, delay);
  return <>{isVisible ? children : null}</>;
}
