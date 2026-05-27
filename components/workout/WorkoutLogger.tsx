"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { ExerciseLogCard } from "@/components/workout/ExerciseLogCard";
import { FinishWorkoutBar } from "@/components/workout/FinishWorkoutBar";
import { useStoredPlan, useStoredWorkoutSessions } from "@/lib/storage";
import type { ExerciseLog, WorkoutSession } from "@/lib/types";
import {
  createInitialExerciseLogsForWorkout,
  getCurrentDateLabel,
  getExercisesForWorkout,
  hasAnyCompletedSet,
  isRestDay,
  validateWorkoutSession,
} from "@/lib/workout-utils";

type WorkoutLoggerProps = {
  dayId: string;
};

function createSessionId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `session-${Date.now()}`;
}

export function WorkoutLogger({ dayId }: WorkoutLoggerProps) {
  const router = useRouter();
  const { plan } = useStoredPlan();
  const { saveSession, sessions } = useStoredWorkoutSessions();
  const [error, setError] = useState<string | null>(null);
  const workoutDay = plan.workoutDays.find((day) => day.id === dayId);
  const workoutExercises = workoutDay
    ? getExercisesForWorkout(workoutDay, plan.exercises)
    : [];
  const initialLogs = workoutDay
    ? createInitialExerciseLogsForWorkout(workoutDay, plan.exercises, sessions)
    : [];
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[] | null>(null);
  const activeLogs = exerciseLogs ?? initialLogs;
  const date = new Date();
  const dateLabel = getCurrentDateLabel(date);

  function updateLog(nextLog: ExerciseLog) {
    setExerciseLogs(
      activeLogs.map((log) =>
        log.exerciseId === nextLog.exerciseId ? nextLog : log,
      ),
    );
    setError(null);
  }

  function finishWorkout() {
    if (!workoutDay) {
      return;
    }

    const session: WorkoutSession = {
      date: date.toISOString(),
      exerciseLogs: activeLogs,
      id: createSessionId(),
      workoutDayId: workoutDay.id,
    };
    const validationError = validateWorkoutSession(session);

    if (validationError) {
      setError(validationError);
      return;
    }

    saveSession(session);
    router.push("/progress");
  }

  if (!workoutDay) {
    return (
      <Card>
        <EmptyState
          title="Workout not found"
          description="This workout day is not part of the saved plan."
        />
      </Card>
    );
  }

  if (isRestDay(workoutDay)) {
    return (
      <Card>
        <EmptyState
          title="Rest day"
          description="There is no workout to log for this day."
        />
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link
            className="flex min-h-12 items-center justify-center rounded-2xl bg-surface-muted px-4 text-sm font-semibold text-foreground"
            href="/today"
          >
            Today
          </Link>
          <Link
            className="dark-action flex min-h-12 items-center justify-center rounded-2xl bg-accent px-4 text-sm font-semibold"
            href="/plan"
          >
            Plan
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4 pb-10">
      <section className="-mx-5 bg-[#173b32] px-5 pb-4 pt-4 text-white">
        <Link
          className="inline-flex min-h-9 items-center text-sm font-semibold text-white/72"
          href="/today"
        >
          &lt; Today
        </Link>
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-white/68">
          {dateLabel}
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          {workoutDay.title}
        </h1>
        <p className="mt-3 text-sm font-semibold text-white/78">
          {workoutExercises.length} exercises
        </p>
      </section>

      {workoutExercises.map((exercise) => {
        const log = activeLogs.find((entry) => entry.exerciseId === exercise.id);

        if (!log) {
          return null;
        }

        return (
          <ExerciseLogCard
            exercise={exercise}
            key={exercise.id}
            log={log}
            onChange={updateLog}
            sessions={sessions}
          />
        );
      })}

      <FinishWorkoutBar
        canFinish={hasAnyCompletedSet(activeLogs)}
        error={error}
        onFinish={finishWorkout}
      />
    </div>
  );
}
