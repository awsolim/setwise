"use client";

import { useState } from "react";
import { SetLogRow } from "@/components/workout/SetLogRow";
import type { Exercise, ExerciseLog, LoggedSet, WorkoutSession } from "@/lib/types";
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
  onChange: (log: ExerciseLog) => void;
};

export function ExerciseLogCard({
  exercise,
  log,
  sessions,
  onChange,
}: ExerciseLogCardProps) {
  const [showHistory, setShowHistory] = useState(false);
  const history = getExerciseHistory(exercise.id, sessions).slice(0, 3);

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

  return (
    <section className="rounded-[1.35rem] border border-border-soft bg-surface/70 px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-foreground">
            {exercise.name}
          </h2>
          <p className="mt-1 text-sm font-medium text-muted">
            {formatRepRange(exercise)} reps
          </p>
        </div>
        {exercise.muscleGroup ? (
          <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
            {exercise.muscleGroup}
          </span>
        ) : null}
      </div>

      {exercise.notes ? (
        <p className="mt-3 text-sm leading-6 text-muted">{exercise.notes}</p>
      ) : null}

      <div className="mt-4 space-y-2">
        {log.sets.map((set) => (
          <SetLogRow
            key={set.setNumber}
            onChange={updateSet}
            placeholder={history[0]?.log.sets.find(
              (previousSet) => previousSet.setNumber === set.setNumber,
            )}
            set={set}
          />
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <button
          className="min-h-10 flex-1 rounded-2xl bg-surface-muted px-3 text-sm font-semibold text-foreground"
          onClick={applyFirstSetToAll}
          type="button"
        >
          Apply Set 1 to all
        </button>
        <button
          className="min-h-10 flex-1 rounded-2xl bg-surface-muted px-3 text-sm font-semibold text-foreground"
          onClick={() => setShowHistory((value) => !value)}
          type="button"
        >
          {showHistory ? "Hide history" : "View history"}
        </button>
      </div>

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
                    {formatLoggedSets(entry.log)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">No history for this exercise yet.</p>
          )}
        </div>
      ) : null}
    </section>
  );
}
