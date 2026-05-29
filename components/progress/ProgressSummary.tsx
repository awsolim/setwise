"use client";

import { Card } from "@/components/Card";
import type { Exercise, WorkoutSession } from "@/lib/types";
import { getExercisesWithHistory, getWorkoutsThisWeek } from "@/lib/workout-utils";

type ProgressSummaryProps = {
  exercises: Exercise[];
  sessions: WorkoutSession[];
};

export function ProgressSummary({ exercises, sessions }: ProgressSummaryProps) {
  const trackedExercises = getExercisesWithHistory(exercises, sessions).length;
  const workoutsThisWeek = getWorkoutsThisWeek(sessions);

  return (
    <Card>
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-2xl bg-surface-muted px-3 py-3">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-muted">
            Workouts
          </p>
          <p className="mt-1 text-xl font-semibold text-foreground">
            {sessions.length}
          </p>
        </div>
        <div className="rounded-2xl bg-surface-muted px-3 py-3">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-muted">
            Tracked
          </p>
          <p className="mt-1 text-xl font-semibold text-foreground">
            {trackedExercises}
          </p>
        </div>
        <div className="rounded-2xl bg-surface-muted px-3 py-3">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-muted">
            This week
          </p>
          <p className="mt-1 text-xl font-semibold text-foreground">
            {workoutsThisWeek}
          </p>
        </div>
      </div>
    </Card>
  );
}
