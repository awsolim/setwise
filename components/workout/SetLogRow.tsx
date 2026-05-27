"use client";

import type { LoggedSet } from "@/lib/types";

type SetLogRowProps = {
  placeholder?: {
    reps?: number;
    weight?: number;
  };
  set: LoggedSet;
  onChange: (set: LoggedSet) => void;
};

function parseNumberInput(value: string): number {
  if (!value.trim()) {
    return 0;
  }

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? Math.max(0, parsedValue) : 0;
}

export function SetLogRow({ placeholder, set, onChange }: SetLogRowProps) {
  return (
    <div
      className={[
        "grid grid-cols-[2.5rem_1fr_1fr_3rem] items-center gap-2 rounded-2xl border px-3 py-3",
        set.completed
          ? "border-accent bg-accent-soft"
          : "border-border-soft bg-surface",
      ].join(" ")}
    >
      <p className="text-sm font-semibold text-muted">#{set.setNumber}</p>
      <label className="block">
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-muted">
          Weight
        </span>
        <input
          className="mt-1 min-h-11 w-full rounded-xl border border-border-soft bg-white px-3 text-base font-semibold text-foreground outline-none focus:border-accent"
          inputMode="decimal"
          min={0}
          onChange={(event) =>
            onChange({ ...set, weight: parseNumberInput(event.target.value) })
          }
          placeholder={
            placeholder?.weight && placeholder.weight > 0
              ? String(placeholder.weight)
              : undefined
          }
          type="number"
          value={set.weight || ""}
        />
      </label>
      <label className="block">
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-muted">
          Reps
        </span>
        <input
          className="mt-1 min-h-11 w-full rounded-xl border border-border-soft bg-white px-3 text-base font-semibold text-foreground outline-none focus:border-accent"
          inputMode="numeric"
          min={0}
          onChange={(event) =>
            onChange({ ...set, reps: parseNumberInput(event.target.value) })
          }
          placeholder={
            placeholder?.reps && placeholder.reps > 0
              ? String(placeholder.reps)
              : undefined
          }
          type="number"
          value={set.reps || ""}
        />
      </label>
      <button
        aria-label={`Mark set ${set.setNumber} complete`}
        className={[
          "flex size-11 items-center justify-center rounded-xl border text-sm font-semibold",
          set.completed
            ? "border-accent bg-accent text-white"
            : "border-border-soft bg-white text-muted",
        ].join(" ")}
        onClick={() => onChange({ ...set, completed: !set.completed })}
        type="button"
      >
        ✓
      </button>
    </div>
  );
}
