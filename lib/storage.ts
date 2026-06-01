"use client";

import { useSyncExternalStore } from "react";
import {
  exercises as sampleExercises,
  savedPlanTemplates,
  workoutDays as sampleWorkoutDays,
} from "@/lib/mock-data";
import type {
  AppSettings,
  Exercise,
  LoggedSet,
  SavedPlan,
  Weekday,
  WeightUnit,
  WorkoutDay,
  WorkoutSession,
} from "@/lib/types";

const planStorageKey = "setwise.plan.v1";
const planChangeEventName = "setwise-plan-change";
const sessionStorageKey = "setwise.sessions.v1";
const sessionChangeEventName = "setwise-sessions-change";
const settingsStorageKey = "setwise.settings.v1";
const settingsChangeEventName = "setwise-settings-change";
const savedPlansStorageKey = "setwise.saved-plans.v1";
const savedPlansChangeEventName = "setwise-saved-plans-change";

export type StoredPlan = {
  workoutDays: WorkoutDay[];
  exercises: Exercise[];
};

let cachedPlan: StoredPlan | null = null;
let cachedSessions: WorkoutSession[] | null = null;
let cachedSettings: AppSettings | null = null;
let cachedSavedPlans: SavedPlan[] | null = null;
const serverSamplePlan = getSamplePlan();
const serverWorkoutSessions: WorkoutSession[] = [];
const serverSavedPlans = getDefaultSavedPlans();
const defaultSettings: AppSettings = {
  weightUnit: "lb",
};
const validWeekdays: Weekday[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function clonePlan(plan: StoredPlan): StoredPlan {
  return JSON.parse(JSON.stringify(plan)) as StoredPlan;
}

function cloneSavedPlans(plans: SavedPlan[]): SavedPlan[] {
  return JSON.parse(JSON.stringify(plans)) as SavedPlan[];
}

export function getSamplePlan(): StoredPlan {
  const defaultTemplate = savedPlanTemplates.find(
    (savedPlan) => savedPlan.id === "weekday-five-day-split",
  );

  return clonePlan(
    defaultTemplate?.plan ?? {
      workoutDays: sampleWorkoutDays,
      exercises: sampleExercises,
    },
  );
}

export function getDefaultSavedPlans(): SavedPlan[] {
  return cloneSavedPlans(savedPlanTemplates);
}

function isWeekday(value: unknown): value is Weekday {
  return validWeekdays.includes(value as Weekday);
}

function normalizeLoggedSet(value: unknown): LoggedSet | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const set = value as Partial<LoggedSet>;
  const setNumber = Number(set.setNumber);
  const weight = Number(set.weight);
  const reps = Number(set.reps);

  if (
    !Number.isFinite(setNumber) ||
    !Number.isFinite(weight) ||
    !Number.isFinite(reps)
  ) {
    return null;
  }

  return {
    completed: Boolean(set.completed),
    reps: Math.max(0, reps),
    setNumber: Math.max(1, Math.round(setNumber)),
    weight: Math.max(0, weight),
  };
}

function normalizeWorkoutSession(value: unknown): WorkoutSession | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const session = value as Partial<WorkoutSession>;

  if (
    typeof session.id !== "string" ||
    typeof session.workoutDayId !== "string" ||
    typeof session.date !== "string" ||
    !Array.isArray(session.exerciseLogs)
  ) {
    return null;
  }

  const exerciseLogs = session.exerciseLogs.flatMap((log) => {
    if (
      !log ||
      typeof log !== "object" ||
      typeof log.exerciseId !== "string" ||
      !Array.isArray(log.sets)
    ) {
      return [];
    }

    const sets = log.sets.flatMap((set) => {
      const normalizedSet = normalizeLoggedSet(set);
      return normalizedSet ? [normalizedSet] : [];
    });

    if (sets.length === 0) {
      return [];
    }

    return [
      {
        exerciseId: log.exerciseId,
        notes: typeof log.notes === "string" ? log.notes : undefined,
        sets,
      },
    ];
  });

  return {
    date: session.date,
    exerciseLogs,
    id: session.id,
    notes: typeof session.notes === "string" ? session.notes : undefined,
    workoutDayId: session.workoutDayId,
  };
}

function isWeightUnit(value: unknown): value is WeightUnit {
  return value === "lb" || value === "kg";
}

function isAppSettings(value: unknown): value is AppSettings {
  if (!value || typeof value !== "object") {
    return false;
  }

  const settings = value as Partial<AppSettings>;
  return isWeightUnit(settings.weightUnit);
}

function normalizeExercise(value: unknown): Exercise | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const exercise = value as Partial<Exercise>;
  const sets = Number(exercise.sets);
  const repMin = Number(exercise.repMin);
  const repMax = Number(exercise.repMax);

  if (
    typeof exercise.id !== "string" ||
    typeof exercise.name !== "string" ||
    !Number.isFinite(sets) ||
    !Number.isFinite(repMin) ||
    !Number.isFinite(repMax)
  ) {
    return null;
  }

  const normalizedRepMin = Math.max(1, Math.round(repMin));

  return {
    id: exercise.id,
    isUnilateral: Boolean(exercise.isUnilateral),
    muscleGroup:
      typeof exercise.muscleGroup === "string" ? exercise.muscleGroup : "",
    name: exercise.name.trim() || "Untitled Exercise",
    notes: typeof exercise.notes === "string" ? exercise.notes : "",
    repMax: Math.max(normalizedRepMin, Math.round(repMax)),
    repMin: normalizedRepMin,
    sets: Math.max(1, Math.round(sets)),
  };
}

function normalizeSavedPlan(value: unknown): SavedPlan | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const savedPlan = value as Partial<SavedPlan>;
  const normalizedPlan = normalizeStoredPlan(savedPlan.plan);

  if (
    typeof savedPlan.id !== "string" ||
    typeof savedPlan.name !== "string" ||
    !normalizedPlan
  ) {
    return null;
  }

  return {
    createdAt:
      typeof savedPlan.createdAt === "string"
        ? savedPlan.createdAt
        : new Date().toISOString(),
    description:
      typeof savedPlan.description === "string" ? savedPlan.description : "",
    id: savedPlan.id,
    name: savedPlan.name.trim() || "Untitled Plan",
    plan: normalizedPlan,
    updatedAt:
      typeof savedPlan.updatedAt === "string"
        ? savedPlan.updatedAt
        : new Date().toISOString(),
  };
}

function normalizeWorkoutDay(value: unknown): WorkoutDay | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const workoutDay = value as Partial<WorkoutDay>;

  if (
    typeof workoutDay.id !== "string" ||
    !isWeekday(workoutDay.dayOfWeek) ||
    typeof workoutDay.title !== "string" ||
    !Array.isArray(workoutDay.exerciseIds)
  ) {
    return null;
  }

  return {
    dayOfWeek: workoutDay.dayOfWeek,
    exerciseIds: workoutDay.exerciseIds.filter(
      (exerciseId): exerciseId is string => typeof exerciseId === "string",
    ),
    id: workoutDay.id,
    notes: typeof workoutDay.notes === "string" ? workoutDay.notes : "",
    title: workoutDay.title.trim() || "Untitled Day",
  };
}

function normalizeStoredPlan(value: unknown): StoredPlan | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const plan = value as Partial<StoredPlan>;

  if (!Array.isArray(plan.workoutDays) || !Array.isArray(plan.exercises)) {
    return null;
  }

  const exercises = plan.exercises.flatMap((exercise) => {
    const normalizedExercise = normalizeExercise(exercise);
    return normalizedExercise ? [normalizedExercise] : [];
  });
  const exerciseIds = new Set(exercises.map((exercise) => exercise.id));
  const workoutDays = plan.workoutDays.flatMap((day) => {
    const normalizedDay = normalizeWorkoutDay(day);
    return normalizedDay
      ? [
          {
            ...normalizedDay,
            exerciseIds: normalizedDay.exerciseIds.filter((exerciseId) =>
              exerciseIds.has(exerciseId),
            ),
          },
        ]
      : [];
  });

  if (workoutDays.length === 0) {
    return null;
  }

  return {
    exercises,
    workoutDays,
  };
}

function readStorageValue(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorageValue(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Keep the in-memory snapshot usable even if the browser blocks storage.
  }
}

function removeStorageValue(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore storage failures; subscribers still receive the local change.
  }
}

export function loadStoredPlan(): StoredPlan {
  if (typeof window === "undefined") {
    return getSamplePlan();
  }

  const storedValue = readStorageValue(planStorageKey);

  if (!storedValue) {
    return getSamplePlan();
  }

  try {
    const parsedValue = JSON.parse(storedValue) as unknown;
    return normalizeStoredPlan(parsedValue) ?? getSamplePlan();
  } catch {
    return getSamplePlan();
  }
}

export function saveStoredPlan(plan: StoredPlan): void {
  cachedPlan = plan;
  writeStorageValue(planStorageKey, JSON.stringify(plan));
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

  const storedValue = readStorageValue(sessionStorageKey);

  if (!storedValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(storedValue) as unknown;
    return Array.isArray(parsedValue)
      ? parsedValue.flatMap((session) => {
          const normalizedSession = normalizeWorkoutSession(session);
          return normalizedSession ? [normalizedSession] : [];
        })
      : [];
  } catch {
    return [];
  }
}

export function saveStoredWorkoutSessions(sessions: WorkoutSession[]): void {
  cachedSessions = sessions;
  writeStorageValue(sessionStorageKey, JSON.stringify(sessions));
  window.dispatchEvent(new Event(sessionChangeEventName));
}

export function saveWorkoutSession(session: WorkoutSession): WorkoutSession[] {
  const sessions = loadStoredWorkoutSessions();
  const nextSessions = [...sessions, session];
  saveStoredWorkoutSessions(nextSessions);
  return nextSessions;
}

export function updateWorkoutSession(session: WorkoutSession): WorkoutSession[] {
  const sessions = loadStoredWorkoutSessions();
  const nextSessions = sessions.map((savedSession) =>
    savedSession.id === session.id ? session : savedSession,
  );
  saveStoredWorkoutSessions(nextSessions);
  return nextSessions;
}

export function deleteWorkoutSession(sessionId: string): WorkoutSession[] {
  const sessions = loadStoredWorkoutSessions();
  const nextSessions = sessions.filter((session) => session.id !== sessionId);
  saveStoredWorkoutSessions(nextSessions);
  return nextSessions;
}

export function clearStoredWorkoutSessions(): void {
  cachedSessions = [];
  removeStorageValue(sessionStorageKey);
  window.dispatchEvent(new Event(sessionChangeEventName));
}

export function loadAppSettings(): AppSettings {
  if (typeof window === "undefined") {
    return defaultSettings;
  }

  const storedValue = readStorageValue(settingsStorageKey);

  if (!storedValue) {
    return defaultSettings;
  }

  try {
    const parsedValue = JSON.parse(storedValue) as unknown;
    return isAppSettings(parsedValue) ? parsedValue : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export function saveAppSettings(settings: AppSettings): void {
  cachedSettings = settings;
  writeStorageValue(settingsStorageKey, JSON.stringify(settings));
  window.dispatchEvent(new Event(settingsChangeEventName));
}

export function loadSavedPlans(): SavedPlan[] {
  if (typeof window === "undefined") {
    return getDefaultSavedPlans();
  }

  const storedValue = readStorageValue(savedPlansStorageKey);

  if (!storedValue) {
    return getDefaultSavedPlans();
  }

  try {
    const parsedValue = JSON.parse(storedValue) as unknown;
    const normalizedPlans = Array.isArray(parsedValue)
      ? parsedValue.flatMap((plan) => {
          const normalizedPlan = normalizeSavedPlan(plan);
          return normalizedPlan ? [normalizedPlan] : [];
        })
      : [];

    return normalizedPlans.length > 0 ? normalizedPlans : getDefaultSavedPlans();
  } catch {
    return getDefaultSavedPlans();
  }
}

export function saveSavedPlans(plans: SavedPlan[]): void {
  cachedSavedPlans = plans;
  writeStorageValue(savedPlansStorageKey, JSON.stringify(plans));
  window.dispatchEvent(new Event(savedPlansChangeEventName));
}

export function savePlanToLibrary(
  name: string,
  description: string,
  plan: StoredPlan,
): SavedPlan[] {
  const now = new Date().toISOString();
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `saved-plan-${Date.now()}`;
  const savedPlan: SavedPlan = {
    createdAt: now,
    description,
    id,
    name: name.trim() || "Untitled Plan",
    plan: clonePlan(plan),
    updatedAt: now,
  };
  const plans = loadSavedPlans();
  const nextPlans = [savedPlan, ...plans];
  saveSavedPlans(nextPlans);
  return nextPlans;
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

function subscribeToAppSettings(onStoreChange: () => void): () => void {
  function handleStorageChange() {
    cachedSettings = loadAppSettings();
    onStoreChange();
  }

  window.addEventListener(settingsChangeEventName, onStoreChange);
  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener(settingsChangeEventName, onStoreChange);
    window.removeEventListener("storage", handleStorageChange);
  };
}

function getAppSettingsSnapshot(): AppSettings {
  if (!cachedSettings) {
    cachedSettings = loadAppSettings();
  }

  return cachedSettings;
}

function getServerAppSettingsSnapshot(): AppSettings {
  return defaultSettings;
}

function subscribeToSavedPlans(onStoreChange: () => void): () => void {
  function handleStorageChange() {
    cachedSavedPlans = loadSavedPlans();
    onStoreChange();
  }

  window.addEventListener(savedPlansChangeEventName, onStoreChange);
  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener(savedPlansChangeEventName, onStoreChange);
    window.removeEventListener("storage", handleStorageChange);
  };
}

function getSavedPlansSnapshot(): SavedPlan[] {
  if (!cachedSavedPlans) {
    cachedSavedPlans = loadSavedPlans();
  }

  return cachedSavedPlans;
}

function getServerSavedPlansSnapshot(): SavedPlan[] {
  return serverSavedPlans;
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
    clearSessions: clearStoredWorkoutSessions,
    deleteSession: (sessionId: string) => deleteWorkoutSession(sessionId),
    saveSession: (session: WorkoutSession) => saveWorkoutSession(session),
    sessions,
    updateSession: (session: WorkoutSession) => updateWorkoutSession(session),
  };
}

export function useAppSettings() {
  const settings = useSyncExternalStore(
    subscribeToAppSettings,
    getAppSettingsSnapshot,
    getServerAppSettingsSnapshot,
  );

  return {
    saveSettings: (nextSettings: AppSettings) => saveAppSettings(nextSettings),
    settings,
  };
}

export function useSavedPlans() {
  const savedPlans = useSyncExternalStore(
    subscribeToSavedPlans,
    getSavedPlansSnapshot,
    getServerSavedPlansSnapshot,
  );

  return {
    saveCurrentPlan: (
      name: string,
      description: string,
      plan: StoredPlan,
    ) => savePlanToLibrary(name, description, plan),
    savedPlans,
  };
}
