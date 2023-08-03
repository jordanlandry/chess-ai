import { useEffect } from "react";
import { ReactRef } from "../types";

export default function useHideContextMenu(element: ReactRef<HTMLElement>) {
  useEffect(() => {
    if (!element.current) return;

    const onContextMenu = (e: MouseEvent) => e.preventDefault(); // Prevent the context menu from opening when the user right clicks
    element.current.addEventListener("contextmenu", onContextMenu);

    return () =>
      element.current
        ? element.current.removeEventListener("contextmenu", onContextMenu)
        : undefined;
  }, []);
}
