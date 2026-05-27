"use client";

import type { Exercise } from "@/lib/types";

type ExerciseEditorCardProps = {
  exercise: Exercise;
  onChange: (exercise: Exercise) => void;
  onMoveDown: () => void;
  onMoveUp: () => void;
  onRemove: () => void;
  canMoveDown: boolean;
  canMoveUp: boolean;
};

function toPositiveInteger(value: string, fallback: number): number {
  const parsedValue = Number.parseInt(value, 10);
  return Number.isFinite(parsedValue) ? Math.max(1, parsedValue) : fallback;
}

export function ExerciseEditorCard({
  exercise,
  onChange,
  onMoveDown,
  onMoveUp,
  onRemove,
  canMoveDown,
  canMoveUp,
}: ExerciseEditorCardProps) {
  return (
    <div className="rounded-3xl border border-border-soft bg-white/60 p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-foreground">Exercise</h3>
        <button
          className="min-h-10 rounded-full border border-red-200 bg-red-50 px-3 text-sm font-semibold text-red-700"
          onClick={() => {
            if (window.confirm(`Remove ${exercise.name || "this exercise"}?`)) {
              onRemove();
            }
          }}
          type="button"
        >
          Remove
        </button>
      </div>

      <div className="mt-4 space-y-3">
        <label className="block">
          <span className="text-sm font-medium text-foreground">Name</span>
          <input
            className="mt-1 min-h-12 w-full rounded-2xl border border-border-soft bg-surface px-4 text-base text-foreground outline-none focus:border-accent"
            onChange={(event) =>
              onChange({ ...exercise, name: event.target.value })
            }
            value={exercise.name}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-foreground">
            Muscle group
          </span>
          <input
            className="mt-1 min-h-12 w-full rounded-2xl border border-border-soft bg-surface px-4 text-base text-foreground outline-none focus:border-accent"
            onChange={(event) =>
              onChange({ ...exercise, muscleGroup: event.target.value })
            }
            value={exercise.muscleGroup ?? ""}
          />
        </label>

        <div className="grid grid-cols-3 gap-2">
          <label className="block">
            <span className="text-sm font-medium text-foreground">Sets</span>
            <input
              className="mt-1 min-h-12 w-full rounded-2xl border border-border-soft bg-surface px-3 text-base text-foreground outline-none focus:border-accent"
              min={1}
              onChange={(event) =>
                onChange({
                  ...exercise,
                  sets: toPositiveInteger(event.target.value, exercise.sets),
                })
              }
              type="number"
              value={exercise.sets}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-foreground">Min</span>
            <input
              className="mt-1 min-h-12 w-full rounded-2xl border border-border-soft bg-surface px-3 text-base text-foreground outline-none focus:border-accent"
              min={1}
              onChange={(event) => {
                const repMin = toPositiveInteger(
                  event.target.value,
                  exercise.repMin,
                );
                onChange({
                  ...exercise,
                  repMin,
                  repMax: Math.max(exercise.repMax, repMin),
                });
              }}
              type="number"
              value={exercise.repMin}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-foreground">Max</span>
            <input
              className="mt-1 min-h-12 w-full rounded-2xl border border-border-soft bg-surface px-3 text-base text-foreground outline-none focus:border-accent"
              min={exercise.repMin}
              onChange={(event) =>
                onChange({
                  ...exercise,
                  repMax: Math.max(
                    exercise.repMin,
                    toPositiveInteger(event.target.value, exercise.repMax),
                  ),
                })
              }
              type="number"
              value={exercise.repMax}
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-foreground">Notes</span>
          <textarea
            className="mt-1 min-h-24 w-full resize-none rounded-2xl border border-border-soft bg-surface px-4 py-3 text-base text-foreground outline-none focus:border-accent"
            onChange={(event) =>
              onChange({ ...exercise, notes: event.target.value })
            }
            value={exercise.notes ?? ""}
          />
        </label>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          className="min-h-11 flex-1 rounded-full border border-border-soft bg-surface px-3 text-sm font-semibold text-foreground disabled:opacity-40"
          disabled={!canMoveUp}
          onClick={onMoveUp}
          type="button"
        >
          Move Up
        </button>
        <button
          className="min-h-11 flex-1 rounded-full border border-border-soft bg-surface px-3 text-sm font-semibold text-foreground disabled:opacity-40"
          disabled={!canMoveDown}
          onClick={onMoveDown}
          type="button"
        >
          Move Down
        </button>
      </div>
    </div>
  );
}
