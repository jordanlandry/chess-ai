import { useEffect } from "react";
import { SetState } from "../types";

export default function useDisappear(isVisible: boolean, setVisible: SetState<boolean>, delay: number) {
  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), delay);
    return () => clearTimeout(timer);
  }, [isVisible, delay]);

  return isVisible;
}
