"use client";

import Link from "next/link";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { ProgressExerciseCard } from "@/components/progress/ProgressExerciseCard";
import { useStoredPlan, useStoredWorkoutSessions } from "@/lib/storage";
import {
  getExercisesWithHistory,
  sortExercisesByLatestSession,
} from "@/lib/workout-utils";

export function ProgressExerciseList() {
  const { plan } = useStoredPlan();
  const { sessions } = useStoredWorkoutSessions();
  const exercisesWithHistory = sortExercisesByLatestSession(
    getExercisesWithHistory(plan.exercises, sessions),
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
          className="dark-action mt-4 flex min-h-12 items-center justify-center rounded-2xl bg-[#173b32] px-4 text-sm font-semibold"
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
      <div className="border-b border-border-soft pb-4">
        <p className="text-sm font-semibold text-muted">
          {sessions.length} {sessions.length === 1 ? "session" : "sessions"}{" "}
          saved locally
        </p>
      </div>
      {exercisesWithHistory.map((exercise) => (
        <ProgressExerciseCard
          exercise={exercise}
          key={exercise.id}
          sessions={sessions}
        />
      ))}
    </section>
  );
}
