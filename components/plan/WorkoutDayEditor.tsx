"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { ExerciseEditorCard } from "@/components/plan/ExerciseEditorCard";
import { useStoredPlan, type StoredPlan } from "@/lib/storage";
import type { Exercise, WorkoutDay } from "@/lib/types";
import { getExercisesForWorkout } from "@/lib/workout-utils";

type WorkoutDayEditorProps = {
  dayId: string;
};

type SaveStatus = "clean" | "dirty" | "saved";

function createExercise(): Exercise {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `exercise-${Date.now()}`;

  return {
    id,
    name: "New Exercise",
    muscleGroup: "",
    sets: 3,
    repMin: 8,
    repMax: 12,
    notes: "",
  };
}

function replaceWorkoutDay(
  plan: StoredPlan,
  workoutDay: WorkoutDay,
): StoredPlan {
  return {
    ...plan,
    workoutDays: plan.workoutDays.map((day) =>
      day.id === workoutDay.id ? workoutDay : day,
    ),
  };
}

export function WorkoutDayEditor({ dayId }: WorkoutDayEditorProps) {
  const { hasHydrated, plan, savePlan } = useStoredPlan();
  const [draftPlan, setDraftPlan] = useState<StoredPlan | null>(null);
  const [status, setStatus] = useState<SaveStatus>("clean");
  const [error, setError] = useState<string | null>(null);
  const activePlan = draftPlan ?? plan;

  const workoutDay = activePlan.workoutDays.find((day) => day.id === dayId);
  const workoutExercises = useMemo(() => {
    if (!workoutDay) {
      return [];
    }

    return getExercisesForWorkout(workoutDay, activePlan.exercises);
  }, [activePlan.exercises, workoutDay]);

  function markDirty(nextPlan: StoredPlan) {
    setDraftPlan(nextPlan);
    setStatus("dirty");
    setError(null);
  }

  function updateWorkoutDay(nextWorkoutDay: WorkoutDay) {
    markDirty(replaceWorkoutDay(activePlan, nextWorkoutDay));
  }

  function updateExercise(nextExercise: Exercise) {
    markDirty({
      ...activePlan,
      exercises: activePlan.exercises.map((exercise) =>
        exercise.id === nextExercise.id ? nextExercise : exercise,
      ),
    });
  }

  function addExercise() {
    if (!workoutDay) {
      return;
    }

    const exercise = createExercise();
    markDirty({
      ...replaceWorkoutDay(activePlan, {
        ...workoutDay,
        title: workoutDay.title === "Rest" ? "Training Day" : workoutDay.title,
        exerciseIds: [...workoutDay.exerciseIds, exercise.id],
      }),
      exercises: [...activePlan.exercises, exercise],
    });
  }

  function removeExercise(exerciseId: string) {
    if (!workoutDay) {
      return;
    }

    markDirty({
      ...replaceWorkoutDay(activePlan, {
        ...workoutDay,
        exerciseIds: workoutDay.exerciseIds.filter((id) => id !== exerciseId),
      }),
      exercises: activePlan.exercises.filter(
        (exercise) => exercise.id !== exerciseId,
      ),
    });
  }

  function moveExercise(exerciseId: string, direction: -1 | 1) {
    if (!workoutDay) {
      return;
    }

    const currentIndex = workoutDay.exerciseIds.indexOf(exerciseId);
    const nextIndex = currentIndex + direction;

    if (
      currentIndex < 0 ||
      nextIndex < 0 ||
      nextIndex >= workoutDay.exerciseIds.length
    ) {
      return;
    }

    const nextExerciseIds = [...workoutDay.exerciseIds];
    [nextExerciseIds[currentIndex], nextExerciseIds[nextIndex]] = [
      nextExerciseIds[nextIndex],
      nextExerciseIds[currentIndex],
    ];

    updateWorkoutDay({ ...workoutDay, exerciseIds: nextExerciseIds });
  }

  function setRestDay(isRest: boolean) {
    if (!workoutDay) {
      return;
    }

    updateWorkoutDay({
      ...workoutDay,
      title: isRest
        ? "Rest"
        : workoutDay.title === "Rest"
          ? "Training Day"
          : workoutDay.title,
      exerciseIds: isRest ? [] : workoutDay.exerciseIds,
    });
  }

  function validatePlan(): string | null {
    if (!workoutDay) {
      return "Workout day was not found.";
    }

    if (!workoutDay.title.trim()) {
      return "Workout title is required.";
    }

    const invalidExercise = workoutExercises.find(
      (exercise) =>
        !exercise.name.trim() ||
        exercise.sets < 1 ||
        exercise.repMin < 1 ||
        exercise.repMax < exercise.repMin,
    );

    if (invalidExercise) {
      return "Each exercise needs a name, at least 1 set, and a valid rep range.";
    }

    return null;
  }

  function handleSave() {
    const validationError = validatePlan();

    if (validationError) {
      setError(validationError);
      return;
    }

    savePlan(activePlan);
    setDraftPlan(null);
    setStatus("saved");
  }

  if (!hasHydrated) {
    return (
      <Card>
        <EmptyState
          title="Loading plan"
          description="Your saved local plan is being loaded on this device."
        />
      </Card>
    );
  }

  if (!workoutDay) {
    return (
      <Card>
        <EmptyState
          title="Day not found"
          description="This workout day is not part of the current weekly plan."
        />
      </Card>
    );
  }

  const isRest = workoutDay.exerciseIds.length === 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <Link
          className="inline-flex min-h-9 items-center rounded-full px-1 text-sm font-semibold text-muted hover:text-foreground"
          href="/plan"
        >
          &lt; Plan
        </Link>
        <span className="text-sm font-medium text-muted">
          {status === "dirty"
            ? "Unsaved changes"
            : status === "saved"
              ? "Saved"
              : "Saved locally"}
        </span>
      </div>

      <Card className="space-y-4">
        <div>
          <p className="text-sm font-semibold text-accent">
            {workoutDay.dayOfWeek}
          </p>
          <h2 className="mt-1 text-xl font-semibold text-foreground">
            Day details
          </h2>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-foreground">
            Workout title
          </span>
          <input
            className="mt-1 min-h-12 w-full rounded-2xl border border-border-soft bg-surface px-4 text-base text-foreground outline-none focus:border-accent"
            onChange={(event) =>
              updateWorkoutDay({ ...workoutDay, title: event.target.value })
            }
            value={workoutDay.title}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-foreground">Notes</span>
          <textarea
            className="mt-1 min-h-24 w-full resize-none rounded-2xl border border-border-soft bg-surface px-4 py-3 text-base text-foreground outline-none focus:border-accent"
            onChange={(event) =>
              updateWorkoutDay({ ...workoutDay, notes: event.target.value })
            }
            value={workoutDay.notes ?? ""}
          />
        </label>

        <div className="rounded-2xl border border-border-soft bg-surface-muted/45 p-3">
          <p className="text-sm font-medium text-foreground">Day type</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              className={[
                "min-h-12 rounded-2xl border px-3 text-sm font-semibold",
                !isRest
                  ? "border-accent bg-accent text-white"
                  : "border-border-soft bg-white/65 text-muted",
              ].join(" ")}
              onClick={() => setRestDay(false)}
              type="button"
            >
              Training
            </button>
            <button
              className={[
                "min-h-12 rounded-2xl border px-3 text-sm font-semibold",
                isRest
                  ? "border-accent bg-accent text-white"
                  : "border-border-soft bg-white/65 text-muted",
              ].join(" ")}
              onClick={() => setRestDay(true)}
              type="button"
            >
              Rest
            </button>
          </div>
        </div>
      </Card>

      {isRest ? (
        <Card>
          <EmptyState
            title="Rest day"
            description="No planned lifting today. Switch back to Training to add exercises."
          />
        </Card>
      ) : (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-foreground">
              Exercises
            </h2>
            <button
              className="min-h-11 rounded-full bg-accent px-4 text-sm font-semibold text-white"
              onClick={addExercise}
              type="button"
            >
              Add Exercise
            </button>
          </div>

          {workoutExercises.map((exercise, index) => (
            <ExerciseEditorCard
              canMoveDown={index < workoutExercises.length - 1}
              canMoveUp={index > 0}
              exercise={exercise}
              key={exercise.id}
              onChange={updateExercise}
              onMoveDown={() => moveExercise(exercise.id, 1)}
              onMoveUp={() => moveExercise(exercise.id, -1)}
              onRemove={() => removeExercise(exercise.id)}
            />
          ))}
        </section>
      )}

      {error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
          {error}
        </p>
      ) : null}

      <button
        className="min-h-14 w-full rounded-2xl bg-accent px-5 text-base font-semibold text-white disabled:opacity-50"
        disabled={status !== "dirty"}
        onClick={handleSave}
        type="button"
      >
        Save Plan
      </button>
    </div>
  );
}
