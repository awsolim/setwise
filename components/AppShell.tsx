import type { ReactNode } from "react";
import { BottomNav } from "@/components/BottomNav";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-surface shadow-[0_0_80px_rgba(43,38,28,0.08)]">
        <main className="flex-1 px-5 pb-32 pt-6">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
