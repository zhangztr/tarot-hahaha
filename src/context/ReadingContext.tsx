import { createContext, useState, useCallback, type ReactNode } from "react";
import type { Reading } from "../types/tarot";

interface ReadingContextValue {
  reading: Reading | null;
  setReading: (r: Reading) => void;
  clearReading: () => void;
}

export const ReadingContext = createContext<ReadingContextValue | null>(null);

export function ReadingProvider({ children }: { children: ReactNode }) {
  const [reading, setReadingState] = useState<Reading | null>(null);

  const setReading = useCallback((r: Reading) => {
    setReadingState(r);
  }, []);

  const clearReading = useCallback(() => {
    setReadingState(null);
  }, []);

  return (
    <ReadingContext.Provider value={{ reading, setReading, clearReading }}>
      {children}
    </ReadingContext.Provider>
  );
}
