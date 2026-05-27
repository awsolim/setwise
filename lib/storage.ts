"use client";

import { useSyncExternalStore } from "react";
import {
  exercises as sampleExercises,
  workoutDays as sampleWorkoutDays,
} from "@/lib/mock-data";
import type { Exercise, LoggedSet, WorkoutDay, WorkoutSession } from "@/lib/types";

const planStorageKey = "setwise.plan.v1";
const planChangeEventName = "setwise-plan-change";
const sessionStorageKey = "setwise.sessions.v1";
const sessionChangeEventName = "setwise-sessions-change";

export type StoredPlan = {
  workoutDays: WorkoutDay[];
  exercises: Exercise[];
};

let cachedPlan: StoredPlan | null = null;
let cachedSessions: WorkoutSession[] | null = null;
const serverSamplePlan = getSamplePlan();
const serverWorkoutSessions: WorkoutSession[] = [];

function clonePlan(plan: StoredPlan): StoredPlan {
  return JSON.parse(JSON.stringify(plan)) as StoredPlan;
}

export function getSamplePlan(): StoredPlan {
  return clonePlan({
    workoutDays: sampleWorkoutDays,
    exercises: sampleExercises,
  });
}

function isWorkoutDay(value: unknown): value is WorkoutDay {
  if (!value || typeof value !== "object") {
    return false;
  }

  const workoutDay = value as Partial<WorkoutDay>;
  return (
    typeof workoutDay.id === "string" &&
    typeof workoutDay.dayOfWeek === "string" &&
    typeof workoutDay.title === "string" &&
    Array.isArray(workoutDay.exerciseIds) &&
    workoutDay.exerciseIds.every((exerciseId) => typeof exerciseId === "string")
  );
}

function isExercise(value: unknown): value is Exercise {
  if (!value || typeof value !== "object") {
    return false;
  }

  const exercise = value as Partial<Exercise>;
  return (
    typeof exercise.id === "string" &&
    typeof exercise.name === "string" &&
    typeof exercise.sets === "number" &&
    typeof exercise.repMin === "number" &&
    typeof exercise.repMax === "number"
  );
}

function isLoggedSet(value: unknown): value is LoggedSet {
  if (!value || typeof value !== "object") {
    return false;
  }

  const set = value as Partial<LoggedSet>;
  return (
    typeof set.setNumber === "number" &&
    typeof set.weight === "number" &&
    typeof set.reps === "number" &&
    typeof set.completed === "boolean"
  );
}

function isWorkoutSession(value: unknown): value is WorkoutSession {
  if (!value || typeof value !== "object") {
    return false;
  }

  const session = value as Partial<WorkoutSession>;
  return (
    typeof session.id === "string" &&
    typeof session.workoutDayId === "string" &&
    typeof session.date === "string" &&
    Array.isArray(session.exerciseLogs) &&
    session.exerciseLogs.every(
      (log) =>
        log &&
        typeof log === "object" &&
        typeof log.exerciseId === "string" &&
        Array.isArray(log.sets) &&
        log.sets.every(isLoggedSet),
    )
  );
}

function isStoredPlan(value: unknown): value is StoredPlan {
  if (!value || typeof value !== "object") {
    return false;
  }

  const plan = value as Partial<StoredPlan>;
  return (
    Array.isArray(plan.workoutDays) &&
    Array.isArray(plan.exercises) &&
    plan.workoutDays.every(isWorkoutDay) &&
    plan.exercises.every(isExercise)
  );
}

export function loadStoredPlan(): StoredPlan {
  if (typeof window === "undefined") {
    return getSamplePlan();
  }

  const storedValue = window.localStorage.getItem(planStorageKey);

  if (!storedValue) {
    return getSamplePlan();
  }

  try {
    const parsedValue = JSON.parse(storedValue) as unknown;
    return isStoredPlan(parsedValue) ? parsedValue : getSamplePlan();
  } catch {
    return getSamplePlan();
  }
}

export function saveStoredPlan(plan: StoredPlan): void {
  cachedPlan = plan;
  window.localStorage.setItem(planStorageKey, JSON.stringify(plan));
  window.dispatchEvent(new Event(planChangeEventName));
}

export function resetStoredPlan(): StoredPlan {
  const samplePlan = getSamplePlan();
  saveStoredPlan(samplePlan);
  return samplePlan;
}

export function loadStoredWorkoutSessions(): WorkoutSession[] {
  if (typeof window === "undefined") {
    return [];
  }

  const storedValue = window.localStorage.getItem(sessionStorageKey);

  if (!storedValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(storedValue) as unknown;
    return Array.isArray(parsedValue) && parsedValue.every(isWorkoutSession)
      ? parsedValue
      : [];
  } catch {
    return [];
  }
}

export function saveStoredWorkoutSessions(sessions: WorkoutSession[]): void {
  cachedSessions = sessions;
  window.localStorage.setItem(sessionStorageKey, JSON.stringify(sessions));
  window.dispatchEvent(new Event(sessionChangeEventName));
}

export function saveWorkoutSession(session: WorkoutSession): WorkoutSession[] {
  const sessions = loadStoredWorkoutSessions();
  const nextSessions = [...sessions, session];
  saveStoredWorkoutSessions(nextSessions);
  return nextSessions;
}

function subscribeToStoredPlan(onStoreChange: () => void): () => void {
  function handleStorageChange() {
    cachedPlan = loadStoredPlan();
    onStoreChange();
  }

  window.addEventListener(planChangeEventName, onStoreChange);
  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener(planChangeEventName, onStoreChange);
    window.removeEventListener("storage", handleStorageChange);
  };
}

function getStoredPlanSnapshot(): StoredPlan {
  if (!cachedPlan) {
    cachedPlan = loadStoredPlan();
  }

  return cachedPlan;
}

function getServerPlanSnapshot(): StoredPlan {
  return serverSamplePlan;
}

function subscribeToStoredWorkoutSessions(onStoreChange: () => void): () => void {
  function handleStorageChange() {
    cachedSessions = loadStoredWorkoutSessions();
    onStoreChange();
  }

  window.addEventListener(sessionChangeEventName, onStoreChange);
  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener(sessionChangeEventName, onStoreChange);
    window.removeEventListener("storage", handleStorageChange);
  };
}

function getStoredWorkoutSessionsSnapshot(): WorkoutSession[] {
  if (!cachedSessions) {
    cachedSessions = loadStoredWorkoutSessions();
  }

  return cachedSessions;
}

function getServerWorkoutSessionsSnapshot(): WorkoutSession[] {
  return serverWorkoutSessions;
}

export function useStoredPlan() {
  const plan = useSyncExternalStore(
    subscribeToStoredPlan,
    getStoredPlanSnapshot,
    getServerPlanSnapshot,
  );

  return {
    hasHydrated: true,
    plan,
    resetPlan: () => {
      const nextPlan = resetStoredPlan();
      return nextPlan;
    },
    savePlan: (nextPlan: StoredPlan) => {
      saveStoredPlan(nextPlan);
    },
  };
}

export function useStoredWorkoutSessions() {
  const sessions = useSyncExternalStore(
    subscribeToStoredWorkoutSessions,
    getStoredWorkoutSessionsSnapshot,
    getServerWorkoutSessionsSnapshot,
  );

  return {
    saveSession: (session: WorkoutSession) => saveWorkoutSession(session),
    sessions,
  };
}
