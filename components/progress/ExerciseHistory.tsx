"use client";

import Link from "next/link";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { ExerciseHistoryEntry } from "@/components/progress/ExerciseHistoryEntry";
import { ExerciseStats } from "@/components/progress/ExerciseStats";
import {
  useAppSettings,
  useStoredPlan,
  useStoredWorkoutSessions,
} from "@/lib/storage";
import {
  formatRepRange,
  getExerciseHistory,
} from "@/lib/workout-utils";

type ExerciseHistoryProps = {
  exerciseId: string;
};

export function ExerciseHistory({ exerciseId }: ExerciseHistoryProps) {
  const { settings } = useAppSettings();
  const { plan } = useStoredPlan();
  const { sessions } = useStoredWorkoutSessions();
  const history = getExerciseHistory(exerciseId, sessions);
  const plannedExercise = plan.exercises.find((item) => item.id === exerciseId);
  const exercise =
    plannedExercise ??
    (history.length > 0
      ? {
          id: exerciseId,
          muscleGroup: "Archived",
          name: "Removed exercise",
          repMax: 1,
          repMin: 1,
          sets: 1,
        }
      : undefined);

  if (!exercise) {
    return (
      <Card>
        <EmptyState
          title="Exercise not found"
          description="This exercise is not part of the saved plan."
        />
        <Link
          className="mt-4 flex min-h-12 items-center justify-center rounded-2xl bg-surface-muted px-4 text-sm font-semibold text-foreground"
          href="/progress"
        >
          Back to Progress
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Link
        className="inline-flex min-h-9 items-center rounded-full px-1 text-sm font-semibold text-muted hover:text-foreground"
        href="/progress"
      >
        &lt; Progress
      </Link>

      <section className="rounded-[1.35rem] bg-[#173b32] px-5 py-5 text-white">
        {exercise.muscleGroup ? (
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/68">
            {exercise.muscleGroup}
          </p>
        ) : null}
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          {exercise.name}
        </h1>
        <p className="mt-3 text-sm font-semibold text-white/78">
          {plannedExercise ? `${formatRepRange(exercise)} reps · ` : ""}
          {history.length}{" "}
          {history.length === 1 ? "session" : "sessions"}
        </p>
      </section>

      {history.length === 0 ? (
        <Card>
          <EmptyState
            title="No history yet"
            description="Log this exercise in a workout and it will appear here."
          />
        </Card>
      ) : (
        <>
          <ExerciseStats
            exerciseId={exercise.id}
            sessions={sessions}
            unit={settings.weightUnit}
          />
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">History</h2>
            {history.map((entry) => (
              <ExerciseHistoryEntry
                entry={entry}
                key={`${entry.session.id}-${entry.log.exerciseId}`}
                unit={settings.weightUnit}
                workoutDay={plan.workoutDays.find(
                  (day) => day.id === entry.session.workoutDayId,
                )}
              />
            ))}
          </section>
        </>
      )}
    </div>
  );
}
