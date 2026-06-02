"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { SetLogRow } from "@/components/workout/SetLogRow";
import type {
  Exercise,
  ExerciseBackupOption,
  ExerciseLog,
  LoggedSet,
  WeightUnit,
  WorkoutSession,
} from "@/lib/types";
import {
  formatLoggedSets,
  formatRepRange,
  formatSessionDate,
  getExerciseHistory,
} from "@/lib/workout-utils";

type ExerciseLogCardProps = {
  exercise: Exercise;
  log: ExerciseLog;
  sessions: WorkoutSession[];
  unit: WeightUnit;
  onChange: (log: ExerciseLog) => void;
};

export function ExerciseLogCard({
  exercise,
  log,
  sessions,
  unit,
  onChange,
}: ExerciseLogCardProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [backupIndex, setBackupIndex] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [showNotes, setShowNotes] = useState(Boolean(log.notes));
  const history = getExerciseHistory(exercise.id, sessions).slice(0, 3);
  const backupOptions = exercise.backupOptions ?? [];
  const selectedBackup = backupIndex > 0 ? backupOptions[backupIndex - 1] : null;
  const displayedExercise = getDisplayedExercise(exercise, selectedBackup);

  function cycleBackupOption() {
    if (backupOptions.length === 0) {
      return;
    }

    const nextBackupIndex =
      backupIndex >= backupOptions.length ? 0 : backupIndex + 1;
    const nextBackup =
      nextBackupIndex > 0 ? backupOptions[nextBackupIndex - 1] : null;

    setBackupIndex(nextBackupIndex);
    onChange({
      ...log,
      performedExerciseName: nextBackup ? nextBackup.name : undefined,
    });
  }

  function updateSet(nextSet: LoggedSet) {
    onChange({
      ...log,
      sets: log.sets.map((set) =>
        set.setNumber === nextSet.setNumber ? nextSet : set,
      ),
    });
  }

  function applyFirstSetToAll() {
    const firstSet = log.sets[0];

    if (!firstSet || (firstSet.weight === 0 && firstSet.reps === 0)) {
      return;
    }

    onChange({
      ...log,
      sets: log.sets.map((set) =>
        set.setNumber === 1
          ? set
          : {
              ...set,
              completed: firstSet.completed,
              reps: firstSet.reps,
              weight: firstSet.weight,
            },
      ),
    });
  }

  function updateNotes(notes: string) {
    onChange({
      ...log,
      notes,
    });
  }

  function addExtraSet() {
    const nextSetNumber =
      Math.max(0, ...log.sets.map((set) => set.setNumber)) + 1;

    onChange({
      ...log,
      sets: [
        ...log.sets,
        {
          completed: false,
          reps: 0,
          setNumber: nextSetNumber,
          weight: 0,
        },
      ],
    });
  }

  function removeExtraSet(setNumber: number) {
    if (setNumber <= exercise.sets) {
      return;
    }

    onChange({
      ...log,
      sets: log.sets.filter((set) => set.setNumber !== setNumber),
    });
  }

  return (
    <div className="relative pb-2">
      <section className="relative z-10 overflow-hidden rounded-[1.25rem] border border-border-soft bg-surface/70">
        <div className="flex items-center gap-3 px-4 py-3.5">
          <button
            aria-expanded={isOpen}
            className="min-h-14 min-w-0 flex-1 text-left"
            onClick={() => setIsOpen((open) => !open)}
            type="button"
          >
            <h2 className="text-base font-semibold leading-6 text-foreground">
              {displayedExercise.name}
            </h2>
            <p className="mt-1 text-sm font-medium text-muted">
              {formatRepRange(displayedExercise)} reps
            </p>
            {selectedBackup ? (
              <p className="mt-1 text-xs font-semibold text-accent">
                Backup for {exercise.name}
              </p>
            ) : null}
          </button>
          {displayedExercise.muscleGroup ? (
            <span className="hidden rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent min-[390px]:inline-flex">
              {displayedExercise.muscleGroup}
            </span>
          ) : null}
          <button
            aria-label={isOpen ? "Collapse exercise" : "Expand exercise"}
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-surface-muted hover:text-foreground"
            onClick={() => setIsOpen((open) => !open)}
            type="button"
          >
            <svg
              aria-hidden="true"
              className="size-5"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d={isOpen ? "m6 15 6-6 6 6" : "m6 9 6 6 6-6"}
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </button>
        </div>

        <div
          className={[
            "grid transition-[grid-template-rows] duration-300 ease-out",
            isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          ].join(" ")}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="border-t border-border-soft px-4 pb-4 pt-3">
              {displayedExercise.notes ? (
                <p className="mb-3 text-sm leading-6 text-muted">
                  {displayedExercise.notes}
                </p>
              ) : null}

              <div className="space-y-2">
                {log.sets.map((set) => (
                  <div className="space-y-1" key={set.setNumber}>
                    <SetLogRow
                      onChange={updateSet}
                      placeholder={history[0]?.log.sets.find(
                        (previousSet) =>
                          previousSet.setNumber === set.setNumber,
                      )}
                      set={set}
                      unit={unit}
                    />
                    {set.setNumber > exercise.sets ? (
                      <button
                        className="ml-auto block min-h-9 rounded-xl px-3 text-sm font-semibold text-red-700"
                        onClick={() => removeExtraSet(set.setNumber)}
                        type="button"
                      >
                        Remove extra set
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-center gap-2.5">
                <IconButton label="Apply set 1 to all" onClick={applyFirstSetToAll}>
                  <path d="M8 8h9v9H8z" />
                  <path d="M5 5h9" />
                  <path d="M5 5v9" />
                </IconButton>
                <IconButton label="Add set" onClick={addExtraSet}>
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </IconButton>
                <IconButton
                  active={showHistory}
                  label={showHistory ? "Hide history" : "View history"}
                  onClick={() => setShowHistory((value) => !value)}
                >
                  <path d="M4 12a8 8 0 1 0 2.35-5.65" />
                  <path d="M4 5v5h5" />
                  <path d="M12 8v4l3 2" />
                </IconButton>
                <IconButton
                  active={showNotes}
                  label={showNotes ? "Hide note" : "Add note"}
                  onClick={() => setShowNotes((value) => !value)}
                >
                  <path d="M6 5h12v14H6z" />
                  <path d="M9 9h6" />
                  <path d="M9 13h4" />
                </IconButton>
                {backupOptions.length > 0 ? (
                  <IconButton
                    active={backupIndex > 0}
                    label="Swap exercise"
                    onClick={cycleBackupOption}
                  >
                    <path d="M7 7h10l-2-2" />
                    <path d="M17 17H7l2 2" />
                    <path d="M17 7 7 17" />
                  </IconButton>
                ) : null}
              </div>

              {showNotes ? (
                <label className="mt-3 block">
                  <span className="sr-only">Exercise note</span>
                  <textarea
                    className="min-h-20 w-full resize-none rounded-2xl border border-border-soft bg-white px-3 py-3 text-sm leading-6 text-foreground outline-none focus:border-accent"
                    onChange={(event) => updateNotes(event.target.value)}
                    placeholder="Exercise note"
                    value={log.notes ?? ""}
                  />
                </label>
              ) : null}

              {showHistory ? (
                <div className="mt-3 rounded-2xl border border-border-soft bg-surface-muted/45 px-3 py-3">
                  {history.length > 0 ? (
                    <ul className="space-y-2">
                      {history.map((entry) => (
                        <li
                          className="flex items-start justify-between gap-3 text-sm"
                          key={entry.session.id}
                        >
                          <span className="shrink-0 font-semibold text-muted">
                            {formatSessionDate(entry.session.date)}
                          </span>
                          <span className="text-right font-medium leading-5 text-foreground">
                            {formatLoggedSets(entry.log, unit)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted">
                      No history for this exercise yet.
                    </p>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {!isOpen ? (
        <div
          aria-hidden="true"
          className="absolute inset-x-5 bottom-0 h-4 rounded-b-[1rem] border border-t-0 border-border-soft bg-surface-muted"
        >
          <div className="mx-auto mt-1 h-1 w-10 rounded-full bg-border-soft" />
        </div>
      ) : null}
    </div>
  );
}

function getDisplayedExercise(
  exercise: Exercise,
  selectedBackup: ExerciseBackupOption | null,
): Exercise {
  if (!selectedBackup) {
    return exercise;
  }

  return {
    ...exercise,
    isUnilateral: selectedBackup.isUnilateral ?? exercise.isUnilateral,
    muscleGroup: selectedBackup.muscleGroup ?? exercise.muscleGroup,
    name: selectedBackup.name,
    notes: selectedBackup.notes ?? exercise.notes,
  };
}

function IconButton({
  active = false,
  children,
  label,
  onClick,
}: {
  active?: boolean;
  children: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      className={[
        "flex size-9 items-center justify-center rounded-full transition",
        active
          ? "bg-accent-soft text-accent"
          : "bg-surface-muted/45 text-muted hover:bg-surface-muted hover:text-foreground",
      ].join(" ")}
      onClick={onClick}
      title={label}
      type="button"
    >
      <svg
        aria-hidden="true"
        className="size-[1.15rem]"
        fill="none"
        viewBox="0 0 24 24"
      >
        <g
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        >
          {children}
        </g>
      </svg>
    </button>
  );
}
