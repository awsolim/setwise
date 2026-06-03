"use client";

import type { Exercise, ExerciseBackupOption } from "@/lib/types";

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

function createBackupOption() {
  return {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `backup-${Date.now()}`,
    name: "Backup Exercise",
  };
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
  const backupOptions = exercise.backupOptions ?? [];

  function updateBackupOption(
    backupOptionId: string,
    updates: Partial<ExerciseBackupOption>,
  ) {
    onChange({
      ...exercise,
      backupOptions: backupOptions.map((backupOption) =>
        backupOption.id === backupOptionId
          ? { ...backupOption, ...updates }
          : backupOption,
      ),
    });
  }

  function removeBackupOption(backupOptionId: string) {
    onChange({
      ...exercise,
      backupOptions: backupOptions.filter(
        (backupOption) => backupOption.id !== backupOptionId,
      ),
    });
  }

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

        <label className="flex min-h-12 items-center justify-between gap-3 rounded-2xl border border-border-soft bg-surface px-4">
          <span>
            <span className="block text-sm font-medium text-foreground">
              Each side
            </span>
            <span className="block text-xs leading-5 text-muted">
              Use for unilateral exercises.
            </span>
          </span>
          <input
            checked={Boolean(exercise.isUnilateral)}
            className="size-5 accent-[#0f1b2d]"
            onChange={(event) =>
              onChange({ ...exercise, isUnilateral: event.target.checked })
            }
            type="checkbox"
          />
        </label>

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

        <section className="rounded-2xl border border-border-soft bg-surface-muted/35 p-3">
          <div className="flex items-center justify-between gap-3">
            <h4 className="text-sm font-semibold text-foreground">Backups</h4>
            <button
              className="min-h-9 rounded-full bg-surface px-3 text-sm font-semibold text-foreground"
              onClick={() =>
                onChange({
                  ...exercise,
                  backupOptions: [...backupOptions, createBackupOption()],
                })
              }
              type="button"
            >
              Add
            </button>
          </div>

          {backupOptions.length > 0 ? (
            <div className="mt-3 space-y-2">
              {backupOptions.map((backupOption) => (
                <div
                  className="rounded-2xl border border-border-soft bg-surface px-3 py-3"
                  key={backupOption.id}
                >
                  <div className="flex items-start gap-2">
                    <label className="min-w-0 flex-1">
                      <span className="sr-only">Backup exercise name</span>
                      <input
                        className="min-h-11 w-full rounded-xl border border-border-soft bg-white px-3 text-sm font-semibold text-foreground outline-none focus:border-accent"
                        onChange={(event) =>
                          updateBackupOption(backupOption.id, {
                            name: event.target.value,
                          })
                        }
                        value={backupOption.name}
                      />
                    </label>
                    <button
                      className="flex size-11 shrink-0 items-center justify-center rounded-full text-red-700"
                      onClick={() => removeBackupOption(backupOption.id)}
                      type="button"
                    >
                      ×
                    </button>
                  </div>
                  <label className="mt-2 flex min-h-10 items-center justify-between gap-3 rounded-xl bg-surface-muted px-3">
                    <span className="text-xs font-medium text-muted">
                      Each side
                    </span>
                    <input
                      checked={Boolean(backupOption.isUnilateral)}
                      className="size-4 accent-[#0f1b2d]"
                      onChange={(event) =>
                        updateBackupOption(backupOption.id, {
                          isUnilateral: event.target.checked,
                        })
                      }
                      type="checkbox"
                    />
                  </label>
                </div>
              ))}
            </div>
          ) : null}
        </section>
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
