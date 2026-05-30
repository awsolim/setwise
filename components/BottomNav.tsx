"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNavItems } from "@/lib/constants";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-[430px] px-4 pb-[max(env(safe-area-inset-bottom),0.85rem)] pt-8"
    >
      <div className="absolute inset-x-0 bottom-0 h-32 bg-background/55 backdrop-blur-2xl [mask-image:linear-gradient(to_top,black_72%,transparent)]" />
      <div className="pointer-events-auto relative grid grid-cols-4 gap-1.5 rounded-[1.65rem] border border-border-soft bg-surface/88 p-1.5 shadow-[0_-12px_34px_rgba(43,38,28,0.12)] backdrop-blur-xl">
        {mainNavItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href === "/plan" && pathname.startsWith("/plan/"));

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              className={[
                "flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-2xl px-2 text-xs font-medium transition",
                isActive
                  ? "bg-accent !text-white"
                  : "text-muted hover:bg-surface-muted hover:text-foreground",
              ].join(" ")}
              href={item.href}
              key={item.href}
              style={isActive ? { color: "#ffffff" } : undefined}
            >
              <span
                aria-hidden="true"
                className={[
                  "flex size-6 items-center justify-center rounded-full text-[0.7rem] font-semibold",
                  isActive
                    ? "bg-white/18 text-white"
                    : "bg-surface-muted text-muted",
                ].join(" ")}
              >
                {item.icon}
              </span>
              <span className={isActive ? "text-white" : undefined}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
