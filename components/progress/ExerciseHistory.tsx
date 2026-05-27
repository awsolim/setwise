"use client";

import Link from "next/link";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { ExerciseHistoryEntry } from "@/components/progress/ExerciseHistoryEntry";
import { LatestPerformance } from "@/components/progress/LatestPerformance";
import { useStoredPlan, useStoredWorkoutSessions } from "@/lib/storage";
import {
  formatRepRange,
  formatSessionDate,
  getExerciseHistory,
  getLatestPerformanceForExercise,
  getLatestSessionDateForExercise,
} from "@/lib/workout-utils";

type ExerciseHistoryProps = {
  exerciseId: string;
};

export function ExerciseHistory({ exerciseId }: ExerciseHistoryProps) {
  const { plan } = useStoredPlan();
  const { sessions } = useStoredWorkoutSessions();
  const exercise = plan.exercises.find((item) => item.id === exerciseId);
  const history = getExerciseHistory(exerciseId, sessions);
  const latestDate = getLatestSessionDateForExercise(exerciseId, sessions);

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
          {formatRepRange(exercise)} reps · {history.length}{" "}
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
          <Card>
            <LatestPerformance
              dateLabel={latestDate ? formatSessionDate(latestDate) : null}
              performance={getLatestPerformanceForExercise(
                exercise.id,
                sessions,
              )}
            />
          </Card>
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">History</h2>
            {history.map((entry) => (
              <ExerciseHistoryEntry
                entry={entry}
                key={`${entry.session.id}-${entry.log.exerciseId}`}
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
