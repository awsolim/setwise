"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { DaySwitcher } from "@/components/today/DaySwitcher";
import { ExerciseTodayCard } from "@/components/today/ExerciseTodayCard";
import { RestDayState } from "@/components/today/RestDayState";
import {
  useAppSettings,
  useStoredPlan,
  useStoredWorkoutSessions,
} from "@/lib/storage";
import type { Weekday } from "@/lib/types";
import {
  formatLoggedSets,
  getCurrentDateLabel,
  getExercisesForWorkout,
  getLatestLogForExercise,
  getTodayWeekday,
  getTotalPlannedSetsForWorkout,
  getWorkoutForWeekday,
  isRestDay,
} from "@/lib/workout-utils";

type LocalToday = {
  dateLabel: string;
  today: Weekday;
};

let cachedLocalToday: LocalToday | null = null;

function subscribeToLocalToday() {
  return () => {};
}

function getLocalTodaySnapshot(): LocalToday {
  if (!cachedLocalToday) {
    const now = new Date();
    cachedLocalToday = {
      dateLabel: getCurrentDateLabel(now),
      today: getTodayWeekday(now),
    };
  }

  return cachedLocalToday;
}

function getServerLocalTodaySnapshot(): LocalToday | null {
  return null;
}

export function TodayWorkout() {
  const { settings } = useAppSettings();
  const { hasHydrated, plan } = useStoredPlan();
  const { sessions } = useStoredWorkoutSessions();
  const localToday = useSyncExternalStore(
    subscribeToLocalToday,
    getLocalTodaySnapshot,
    getServerLocalTodaySnapshot,
  );
  const [selectedDay, setSelectedDay] = useState<Weekday | null>(null);
  const today = localToday?.today ?? "Monday";
  const dateLabel = localToday?.dateLabel ?? "Loading";
  const activeSelectedDay = selectedDay ?? today;
  const workoutDay = getWorkoutForWeekday(plan.workoutDays, activeSelectedDay);
  const workoutExercises = workoutDay
    ? getExercisesForWorkout(workoutDay, plan.exercises)
    : [];
  const totalSets = workoutDay
    ? getTotalPlannedSetsForWorkout(workoutDay, plan.exercises)
    : 0;
  const selectedIsToday = activeSelectedDay === today;
  const selectedIsRestDay = !workoutDay || isRestDay(workoutDay);

  return (
    <div className="space-y-4">
      <section className="-mx-5 bg-[#0f1b2d] px-5 pb-4 pt-4 text-white shadow-[0_12px_28px_rgba(15,27,45,0.2)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/68">
              {selectedIsToday ? "Today" : activeSelectedDay} · {dateLabel}
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
        selectedDay={activeSelectedDay}
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
                latestPerformance={(() => {
                  const latestLog = getLatestLogForExercise(
                    exercise.id,
                    sessions,
                  );
                  return latestLog
                    ? formatLoggedSets(latestLog, settings.weightUnit)
                    : "No history";
                })()}
              />
            ))}
          </section>
        </>
      )}

      <div className="space-y-3">
        {workoutDay && !selectedIsRestDay ? (
          <Link
            className="dark-action flex min-h-14 w-full items-center justify-center rounded-2xl bg-gradient-to-b from-[#293b58] via-[#192840] to-[#0f1b2d] px-5 text-base font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_14px_28px_rgba(15,27,45,0.24)] transition active:scale-[0.99]"
            href={`/workout/${workoutDay.id}`}
            onClick={(event) => {
              if (selectedIsToday) {
                return;
              }

              const confirmed = window.confirm(
                `Start ${activeSelectedDay}'s workout instead of today's workout?`,
              );

              if (!confirmed) {
                event.preventDefault();
              }
            }}
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
