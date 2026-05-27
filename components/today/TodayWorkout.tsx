"use client";

import Link from "next/link";
import { useState } from "react";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { DaySwitcher } from "@/components/today/DaySwitcher";
import { ExerciseTodayCard } from "@/components/today/ExerciseTodayCard";
import { RestDayState } from "@/components/today/RestDayState";
import { useStoredPlan, useStoredWorkoutSessions } from "@/lib/storage";
import type { ExerciseLog, Weekday } from "@/lib/types";
import {
  getExercisesForWorkout,
  getLatestLogForExercise,
  getTotalPlannedSetsForWorkout,
  getWorkoutForWeekday,
  isRestDay,
} from "@/lib/workout-utils";

type TodayWorkoutProps = {
  dateLabel: string;
  today: Weekday;
};

function formatLatestPerformance(log?: ExerciseLog): string {
  if (!log) {
    return "No history";
  }

  const completedSets = log.sets.filter((set) => set.completed);
  const firstSet = completedSets[0];

  if (!firstSet) {
    return "No history";
  }

  const allSetsMatch = completedSets.every(
    (set) => set.weight === firstSet.weight && set.reps === firstSet.reps,
  );

  if (allSetsMatch) {
    return `${firstSet.weight} lbs, ${completedSets.length} sets, ${firstSet.reps} reps`;
  }

  return completedSets
    .map((set) => `${set.weight} lbs x ${set.reps}`)
    .join(", ");
}

export function TodayWorkout({ dateLabel, today }: TodayWorkoutProps) {
  const { hasHydrated, plan } = useStoredPlan();
  const { sessions } = useStoredWorkoutSessions();
  const [selectedDay, setSelectedDay] = useState<Weekday>(today);
  const workoutDay = getWorkoutForWeekday(plan.workoutDays, selectedDay);
  const workoutExercises = workoutDay
    ? getExercisesForWorkout(workoutDay, plan.exercises)
    : [];
  const totalSets = workoutDay
    ? getTotalPlannedSetsForWorkout(workoutDay, plan.exercises)
    : 0;
  const selectedIsToday = selectedDay === today;
  const selectedIsRestDay = !workoutDay || isRestDay(workoutDay);

  return (
    <div className="space-y-4">
      <section className="-mx-5 bg-[#173b32] px-5 pb-4 pt-4 text-white shadow-[0_12px_28px_rgba(23,59,50,0.2)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/68">
              {selectedIsToday ? "Today" : selectedDay} · {dateLabel}
            </p>
            <h2 className="mt-1 text-3xl font-semibold tracking-tight">
              {workoutDay?.title ?? "No plan"}
            </h2>
          </div>
          {selectedIsToday ? (
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-white">
              Current
            </span>
          ) : null}
        </div>
        {!selectedIsRestDay ? (
          <div className="mt-4 flex gap-2 text-sm font-semibold text-white/78">
            <span>{workoutExercises.length} exercises</span>
            <span aria-hidden="true">·</span>
            <span>{totalSets} working sets</span>
          </div>
        ) : null}
      </section>

      <DaySwitcher
        onSelectDay={setSelectedDay}
        selectedDay={selectedDay}
        today={today}
      />

      {!hasHydrated ? (
        <Card>
          <EmptyState
            title="Loading plan"
            description="Your saved local plan is being loaded on this device."
          />
        </Card>
      ) : selectedIsRestDay ? (
        <RestDayState workoutDay={workoutDay} />
      ) : (
        <>
          <section className="rounded-[1.35rem] border border-border-soft bg-surface/55 px-4 py-4">
            <div className="flex items-end justify-between gap-3">
              <h2 className="text-lg font-semibold text-foreground">
                Exercises
              </h2>
              <span className="text-sm font-semibold text-accent">
                {totalSets} working sets
              </span>
            </div>

            {workoutExercises.map((exercise) => (
              <ExerciseTodayCard
                exercise={exercise}
                key={exercise.id}
                latestPerformance={formatLatestPerformance(
                  getLatestLogForExercise(exercise.id, sessions),
                )}
              />
            ))}
          </section>
        </>
      )}

      <div className="space-y-3">
        {workoutDay && !selectedIsRestDay ? (
          <Link
            className="dark-action flex min-h-14 w-full items-center justify-center rounded-2xl bg-gradient-to-b from-[#4f8b72] via-[#2f6a55] to-[#173b32] px-5 text-base font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_14px_28px_rgba(23,59,50,0.24)] transition active:scale-[0.99]"
            href={`/workout/${workoutDay.id}`}
            style={{
              color: "#ffffff",
              textShadow: "0 1px 1px rgba(0,0,0,0.35)",
            }}
          >
            Start Workout
          </Link>
        ) : (
          <button
            className="min-h-14 w-full rounded-2xl bg-surface-muted px-5 text-base font-semibold text-muted"
            disabled
            type="button"
          >
            Rest day
          </button>
        )}
      </div>
    </div>
  );
}
