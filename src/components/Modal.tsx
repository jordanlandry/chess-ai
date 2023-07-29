import { useEffect } from "react";
import { createPortal } from "react-dom";

type Props = {
  children: React.ReactNode;
  open: boolean;
  className?: string;
  customStyles?: React.CSSProperties;
  onClose?: () => void;
};

export default function Modal({ children, open, className, customStyles, onClose }: Props) {
  className = className ?? ""; // This is to prevent giving undefined as a className

  const MODAL_STYLES: React.CSSProperties = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxHeight: "90dvh",
    borderRadius: "8px",
    zIndex: 1000,
    ...customStyles,
  };

  const OVERLAY_STYLES: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, .7)",
    zIndex: 1000,
  };

  useEffect(() => {
    if (!onClose || !open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!open) return null;
  return createPortal(
    <>
      <div style={OVERLAY_STYLES}></div>
      <div className={`modal ${className}`} style={MODAL_STYLES}>
        {children}
      </div>
    </>,
    document.getElementById("modal")!
  );
}
