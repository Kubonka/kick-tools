import { useEffect } from "react";

export function useTabListener(onTabPressed: () => void) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault(); // optional, remove if you want normal tab behavior
        onTabPressed();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onTabPressed]);
}
