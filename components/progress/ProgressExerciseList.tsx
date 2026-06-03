"use client";

import Link from "next/link";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { ProgressExerciseCard } from "@/components/progress/ProgressExerciseCard";
import { ProgressSummary } from "@/components/progress/ProgressSummary";
import {
  useAppSettings,
  useStoredPlan,
  useStoredWorkoutSessions,
} from "@/lib/storage";
import {
  getExercisesWithHistory,
  sortExercisesByLatestSession,
} from "@/lib/workout-utils";
import type { Exercise, WorkoutSession } from "@/lib/types";

function getArchivedExercises(
  currentExercises: Exercise[],
  sessions: WorkoutSession[],
): Exercise[] {
  const currentExerciseIds = new Set(
    currentExercises.map((exercise) => exercise.id),
  );
  const historicalExerciseIds = new Set(
    sessions.flatMap((session) =>
      session.exerciseLogs.map((log) => log.exerciseId),
    ),
  );

  return [...historicalExerciseIds]
    .filter((exerciseId) => !currentExerciseIds.has(exerciseId))
    .map((exerciseId) => ({
      id: exerciseId,
      muscleGroup: "Archived",
      name: "Removed exercise",
      repMax: 1,
      repMin: 1,
      sets: 1,
    }));
}

export function ProgressExerciseList() {
  const { settings } = useAppSettings();
  const { plan } = useStoredPlan();
  const { sessions } = useStoredWorkoutSessions();
  const visibleExercises = [
    ...getExercisesWithHistory(plan.exercises, sessions),
    ...getArchivedExercises(plan.exercises, sessions),
  ];
  const exercisesWithHistory = sortExercisesByLatestSession(
    visibleExercises,
    sessions,
  );

  if (sessions.length === 0 || exercisesWithHistory.length === 0) {
    return (
      <Card>
        <EmptyState
          title="No workouts logged yet"
          description="Log a workout from Today and your exercise history will appear here."
        />
        <Link
          className="dark-action mt-4 flex min-h-12 items-center justify-center rounded-2xl bg-[#0f1b2d] px-4 text-sm font-semibold"
          href="/today"
          style={{ color: "#ffffff" }}
        >
          Go to Today
        </Link>
      </Card>
    );
  }

  return (
    <section className="space-y-3">
      <ProgressSummary exercises={plan.exercises} sessions={sessions} />
      {exercisesWithHistory.map((exercise) => (
        <ProgressExerciseCard
          exercise={exercise}
          key={exercise.id}
          sessions={sessions}
          unit={settings.weightUnit}
        />
      ))}
    </section>
  );
}
