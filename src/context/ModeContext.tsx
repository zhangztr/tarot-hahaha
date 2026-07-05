import { createContext, useState, useCallback, type ReactNode } from "react";

interface ModeContextValue {
  funMode: boolean;
  setFunMode: (v: boolean) => void;
  toggleFunMode: () => void;
}

export const ModeContext = createContext<ModeContextValue | null>(null);

export function ModeProvider({ children }: { children: ReactNode }) {
  const [funMode, setFunModeState] = useState(() => {
    try {
      return localStorage.getItem("tarot-fun-mode") === "true";
    } catch {
      return false;
    }
  });

  const setFunMode = useCallback((v: boolean) => {
    setFunModeState(v);
    try {
      localStorage.setItem("tarot-fun-mode", String(v));
    } catch {}
  }, []);

  const toggleFunMode = useCallback(() => {
    setFunModeState((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("tarot-fun-mode", String(next));
      } catch {}
      return next;
    });
  }, []);

  return (
    <ModeContext.Provider value={{ funMode, setFunMode, toggleFunMode }}>
      {children}
    </ModeContext.Provider>
  );
}
