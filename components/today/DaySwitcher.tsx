"use client";

import type { Weekday } from "@/lib/types";
import { weekPlanOrder } from "@/lib/workout-utils";

type DaySwitcherProps = {
  selectedDay: Weekday;
  today: Weekday;
  onSelectDay: (weekday: Weekday) => void;
};

const dayLabels: Record<Weekday, string> = {
  Monday: "M",
  Tuesday: "T",
  Wednesday: "W",
  Thursday: "T",
  Friday: "F",
  Saturday: "S",
  Sunday: "S",
};

export function DaySwitcher({
  selectedDay,
  today,
  onSelectDay,
}: DaySwitcherProps) {
  return (
    <div className="grid grid-cols-7 gap-1">
      {weekPlanOrder.map((weekday) => {
        const isSelected = weekday === selectedDay;
        const isToday = weekday === today;

        return (
          <button
            className={[
              "relative min-h-12 rounded-2xl border text-sm font-semibold transition",
              isSelected
                ? "border-[#0f1b2d] bg-[#0f1b2d] text-white"
                : isToday
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-transparent bg-surface-muted/60 text-muted",
            ].join(" ")}
            key={weekday}
            onClick={() => onSelectDay(weekday)}
            title={weekday}
            type="button"
          >
            {dayLabels[weekday]}
            {isToday ? (
              <span
                className={[
                  "absolute bottom-1.5 left-1/2 size-1 -translate-x-1/2 rounded-full",
                  isSelected ? "bg-white" : "bg-accent",
                ].join(" ")}
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
