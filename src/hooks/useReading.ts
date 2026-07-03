import { useContext } from "react";
import { ReadingContext } from "../context/ReadingContext";

export function useReading() {
  const ctx = useContext(ReadingContext);
  if (!ctx) {
    throw new Error("useReading must be used within a ReadingProvider");
  }
  return ctx;
}
