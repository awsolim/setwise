import type {
  Exercise,
  ExerciseLog,
  LoggedSet,
  Weekday,
  WorkoutDay,
  WorkoutSession,
  WeightUnit,
} from "@/lib/types";

export type ExerciseHistoryEntry = {
  log: ExerciseLog;
  session: WorkoutSession;
};

const weekdays: Weekday[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const weekPlanOrder: Weekday[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function getTodayWeekday(date = new Date()): Weekday {
  return weekdays[date.getDay()];
}

export function getCurrentDateLabel(date = new Date()): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function getShortWeekdayLabel(weekday: Weekday): string {
  return weekday.slice(0, 3);
}

export function getWorkoutForWeekday(
  workoutDays: WorkoutDay[],
  weekday: Weekday,
): WorkoutDay | undefined {
  return workoutDays.find((workoutDay) => workoutDay.dayOfWeek === weekday);
}

export function getExercisesForWorkout(
  workoutDay: WorkoutDay,
  exercises: Exercise[],
): Exercise[] {
  const exercisesById = new Map(
    exercises.map((exercise) => [exercise.id, exercise]),
  );

  return workoutDay.exerciseIds.flatMap((exerciseId) => {
    const exercise = exercisesById.get(exerciseId);
    return exercise ? [exercise] : [];
  });
}

export function getWorkoutsInWeekOrder(workoutDays: WorkoutDay[]): WorkoutDay[] {
  return weekPlanOrder.flatMap((weekday) => {
    const workoutDay = getWorkoutForWeekday(workoutDays, weekday);
    return workoutDay ? [workoutDay] : [];
  });
}

export function isRestDay(workoutDay: WorkoutDay): boolean {
  return workoutDay.exerciseIds.length === 0;
}

export function getTotalPlannedSetsForWorkout(
  workoutDay: WorkoutDay,
  exercises: Exercise[],
): number {
  return getExercisesForWorkout(workoutDay, exercises).reduce(
    (totalSets, exercise) => totalSets + exercise.sets,
    0,
  );
}

export function getExerciseCountLabel(count: number): string {
  return `${count} ${count === 1 ? "exercise" : "exercises"}`;
}

export function getLatestSessionForWorkout(
  workoutDayId: string,
  sessions: WorkoutSession[],
): WorkoutSession | undefined {
  return sessions
    .filter((session) => session.workoutDayId === workoutDayId)
    .toSorted((a, b) => b.date.localeCompare(a.date))[0];
}

export function getLatestLogForExercise(
  exerciseId: string,
  sessions: WorkoutSession[],
): ExerciseLog | undefined {
  return sessions
    .toSorted((a, b) => b.date.localeCompare(a.date))
    .flatMap((session) => session.exerciseLogs)
    .find((log) => log.exerciseId === exerciseId);
}

export function getExerciseHistory(
  exerciseId: string,
  sessions: WorkoutSession[],
): ExerciseHistoryEntry[] {
  return sessions
    .flatMap((session) =>
      session.exerciseLogs
        .filter((log) => log.exerciseId === exerciseId)
        .map((log) => ({ log, session })),
    )
    .toSorted((a, b) => b.session.date.localeCompare(a.session.date));
}

export function getLatestPerformanceForExercise(
  exerciseId: string,
  sessions: WorkoutSession[],
  unit: WeightUnit = "lb",
): string {
  const latestLog = getLatestLogForExercise(exerciseId, sessions);
  return latestLog ? formatLoggedSets(latestLog, unit) : "No sets logged";
}

export function getLatestSessionDateForExercise(
  exerciseId: string,
  sessions: WorkoutSession[],
): string | null {
  const latestEntry = getExerciseHistory(exerciseId, sessions)[0];
  return latestEntry ? latestEntry.session.date : null;
}

export function sortExercisesByLatestSession(
  exercises: Exercise[],
  sessions: WorkoutSession[],
): Exercise[] {
  return [...exercises].sort((a, b) => {
    const aDate = getLatestSessionDateForExercise(a.id, sessions) ?? "";
    const bDate = getLatestSessionDateForExercise(b.id, sessions) ?? "";
    return bDate.localeCompare(aDate) || a.name.localeCompare(b.name);
  });
}

export function createInitialExerciseLogsForWorkout(
  workoutDay: WorkoutDay,
  exercises: Exercise[],
  sessions: WorkoutSession[],
): ExerciseLog[] {
  return getExercisesForWorkout(workoutDay, exercises).map((exercise) => {
    const latestLog = getLatestLogForExercise(exercise.id, sessions);
    const latestCompletedSet = latestLog?.sets.find((set) => set.completed);
    const latestWeight = latestCompletedSet?.weight ?? 0;

    return {
      exerciseId: exercise.id,
      notes: "",
      sets: Array.from({ length: exercise.sets }, (_, index) => ({
        completed: false,
        reps: 0,
        setNumber: index + 1,
        weight: latestWeight,
      })),
    };
  });
}

export function hasAnyCompletedSet(exerciseLogs: ExerciseLog[]): boolean {
  return exerciseLogs.some((log) =>
    log.sets.some((set) => set.completed && set.reps > 0),
  );
}

export function validateLoggedSet(set: LoggedSet): string | null {
  if (set.weight < 0) {
    return "Weight must be 0 or greater.";
  }

  if (set.reps < 0) {
    return "Reps must be 0 or greater.";
  }

  if (set.completed && set.reps < 1) {
    return "Completed sets need at least 1 rep.";
  }

  return null;
}

export function validateWorkoutSession(
  session: WorkoutSession,
): string | null {
  if (!hasAnyCompletedSet(session.exerciseLogs)) {
    return "Log at least one completed set before finishing.";
  }

  for (const log of session.exerciseLogs) {
    for (const set of log.sets) {
      const error = validateLoggedSet(set);

      if (error) {
        return error;
      }
    }
  }

  return null;
}

export function getSessionCountForExercise(
  exerciseId: string,
  sessions: WorkoutSession[],
): number {
  return sessions.filter((session) =>
    session.exerciseLogs.some((log) => log.exerciseId === exerciseId),
  ).length;
}

export function getExercisesWithHistory(
  exercises: Exercise[],
  sessions: WorkoutSession[],
): Exercise[] {
  return exercises.filter((exercise) =>
    sessions.some((session) =>
      session.exerciseLogs.some((log) => log.exerciseId === exercise.id),
    ),
  );
}

export function getWorkoutSessionById(
  sessionId: string,
  sessions: WorkoutSession[],
): WorkoutSession | undefined {
  return sessions.find((session) => session.id === sessionId);
}

export function getWorkoutsThisWeek(sessions: WorkoutSession[]): number {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(now.getDate() - now.getDay());

  return sessions.filter((session) => {
    const sessionDate = new Date(session.date);
    return !Number.isNaN(sessionDate.getTime()) && sessionDate >= startOfWeek;
  }).length;
}

export function getBestCompletedSet(logs: ExerciseLog[]): LoggedSet | null {
  const completedSets = logs.flatMap((log) =>
    log.sets.filter((set) => set.completed && set.reps > 0),
  );

  return (
    completedSets.toSorted(
      (a, b) => b.weight - a.weight || b.reps - a.reps,
    )[0] ?? null
  );
}

export function getSessionVolume(log: ExerciseLog): number {
  return log.sets
    .filter((set) => set.completed)
    .reduce((total, set) => total + set.weight * set.reps, 0);
}

export function getExerciseTrendLabel(
  exerciseId: string,
  sessions: WorkoutSession[],
): string {
  const history = getExerciseHistory(exerciseId, sessions);
  const latest = history[0];
  const previous = history[1];

  if (!latest || !previous) {
    return "Needs another session";
  }

  const latestVolume = getSessionVolume(latest.log);
  const previousVolume = getSessionVolume(previous.log);

  if (latestVolume === previousVolume) {
    return "Even with previous";
  }

  const delta = Math.abs(latestVolume - previousVolume);
  return latestVolume > previousVolume
    ? `Up ${delta} volume`
    : `Down ${delta} volume`;
}

export function formatSetPerformance(
  set: LoggedSet,
  unit: WeightUnit = "lb",
): string {
  return `${set.weight} ${unit} x ${set.reps}`;
}

export function formatRepRange(exercise: Exercise): string {
  return `${exercise.sets} x ${exercise.repMin}-${exercise.repMax}`;
}

export function formatLoggedSets(
  log: ExerciseLog,
  unit: WeightUnit = "lb",
): string {
  const completedSets = log.sets.filter((set) => set.completed);
  const firstSet = completedSets[0];

  if (!firstSet) {
    return "No completed sets";
  }

  const allSetsMatch = completedSets.every(
    (set) => set.weight === firstSet.weight && set.reps === firstSet.reps,
  );

  if (allSetsMatch) {
    return `${firstSet.weight} ${unit}, ${completedSets.length} ${
      completedSets.length === 1 ? "set" : "sets"
    }, ${firstSet.reps} reps`;
  }

  return completedSets.map((set) => formatSetPerformance(set, unit)).join(", ");
}

export function formatSessionDate(date: string): string {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}
