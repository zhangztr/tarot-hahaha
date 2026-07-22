import type { ReactNode } from "react";
import Header from "./Header";
import StarfieldBackground from "./StarfieldBackground";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-mystic-deep relative">
      <StarfieldBackground />
      <div className="relative z-[1] flex flex-col flex-1">
        <Header />
        <main className="flex-1 flex flex-col items-center px-6 pb-24">
          {children}
        </main>
      </div>
    </div>
  );
}
