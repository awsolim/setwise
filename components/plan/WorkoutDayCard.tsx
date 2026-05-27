"use client";

import Link from "next/link";
import { useState } from "react";
import { ExercisePreviewList } from "@/components/plan/ExercisePreviewList";
import type { Exercise, WorkoutDay } from "@/lib/types";
import {
  getExerciseCountLabel,
  getTotalPlannedSetsForWorkout,
  isRestDay,
} from "@/lib/workout-utils";

type WorkoutDayCardProps = {
  workoutDay: WorkoutDay;
  exercises: Exercise[];
  isToday: boolean;
  editable?: boolean;
};

export function WorkoutDayCard({
  workoutDay,
  exercises,
  isToday,
  editable = false,
}: WorkoutDayCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const restDay = isRestDay(workoutDay);
  const totalSets = getTotalPlannedSetsForWorkout(workoutDay, exercises);

  return (
    <div className="relative pb-2">
      <article
        className={[
          "relative z-10 overflow-hidden rounded-[1.2rem] border bg-surface/70",
          isToday ? "border-accent" : "border-border-soft",
        ].join(" ")}
      >
        <div className="flex items-center gap-2 px-4 py-3">
          <button
            aria-expanded={isOpen}
            className="min-h-12 min-w-0 flex-1 text-left"
            onClick={() => setIsOpen((open) => !open)}
            type="button"
          >
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-accent">
                {workoutDay.dayOfWeek}
              </p>
              {isToday ? (
                <span className="rounded-full bg-accent px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-white">
                  Today
                </span>
              ) : null}
            </div>
            <div className="mt-1 flex items-end justify-between gap-3">
              <h2 className="truncate text-lg font-semibold text-foreground">
                {workoutDay.title}
              </h2>
              <p className="shrink-0 text-xs font-semibold text-muted">
                {restDay
                  ? "Rest"
                  : `${getExerciseCountLabel(exercises.length)} · ${totalSets} sets`}
              </p>
            </div>
          </button>

          {editable ? (
            <Link
              aria-label={`Edit ${workoutDay.dayOfWeek}`}
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-muted text-accent"
              href={`/plan/${workoutDay.id}`}
            >
              <svg
                aria-hidden="true"
                className="size-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="M5 19h3.5L18.7 8.8a2.1 2.1 0 0 0-3-3L5.5 16H5v3Z"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </Link>
          ) : null}

          <button
            aria-label={isOpen ? "Collapse day" : "Expand day"}
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
            <div className="border-t border-border-soft px-4 pb-2">
              {restDay ? (
                <p className="py-4 text-sm leading-6 text-muted">
                  No planned lifting today.
                </p>
              ) : (
                <ExercisePreviewList exercises={exercises} />
              )}
            </div>
          </div>
        </div>
      </article>

      {!isOpen ? (
        <div
          aria-hidden="true"
          className={[
            "absolute inset-x-5 bottom-0 h-4 rounded-b-[1rem] border border-t-0",
            isToday
              ? "border-accent/40 bg-accent-soft"
              : "border-border-soft bg-surface-muted",
          ].join(" ")}
        >
          <div className="mx-auto mt-1 h-1 w-10 rounded-full bg-border-soft" />
        </div>
      ) : null}
    </div>
  );
}
