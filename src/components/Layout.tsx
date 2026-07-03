import type { ReactNode } from "react";
import Header from "./Header";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-mystic-deep">
      <Header />
      <main className="flex-1 flex flex-col items-center px-6 pb-24">
        {children}
      </main>
    </div>
  );
}
