"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { SetLogRow } from "@/components/workout/SetLogRow";
import {
  useAppSettings,
  useStoredPlan,
  useStoredWorkoutSessions,
} from "@/lib/storage";
import type { ExerciseLog, LoggedSet, WorkoutSession } from "@/lib/types";
import {
  formatRepRange,
  formatSessionDate,
  getWorkoutSessionById,
  validateWorkoutSession,
} from "@/lib/workout-utils";

type SessionEditorProps = {
  sessionId: string;
};

function cloneSession(session: WorkoutSession): WorkoutSession {
  return JSON.parse(JSON.stringify(session)) as WorkoutSession;
}

export function SessionEditor({ sessionId }: SessionEditorProps) {
  const router = useRouter();
  const { settings } = useAppSettings();
  const { plan } = useStoredPlan();
  const { deleteSession, sessions, updateSession } = useStoredWorkoutSessions();
  const savedSession = getWorkoutSessionById(sessionId, sessions);
  const [draftSession, setDraftSession] = useState<WorkoutSession | null>(() =>
    savedSession ? cloneSession(savedSession) : null,
  );
  const [status, setStatus] = useState<string | null>(null);
  const session = savedSession ? (draftSession ?? savedSession) : null;
  const workoutDay = session
    ? plan.workoutDays.find((day) => day.id === session.workoutDayId)
    : undefined;

  function updateExerciseLog(nextLog: ExerciseLog) {
    if (!session) {
      return;
    }

    setDraftSession({
      ...session,
      exerciseLogs: session.exerciseLogs.map((log) =>
        log.exerciseId === nextLog.exerciseId ? nextLog : log,
      ),
    });
    setStatus(null);
  }

  function updateSet(log: ExerciseLog, nextSet: LoggedSet) {
    updateExerciseLog({
      ...log,
      sets: log.sets.map((set) =>
        set.setNumber === nextSet.setNumber ? nextSet : set,
      ),
    });
  }

  function updateSessionNotes(notes: string) {
    if (!session) {
      return;
    }

    setDraftSession({
      ...session,
      notes,
    });
    setStatus(null);
  }

  function updateLogNotes(log: ExerciseLog, notes: string) {
    updateExerciseLog({
      ...log,
      notes,
    });
  }

  function saveChanges() {
    if (!session) {
      return;
    }

    const validationError = validateWorkoutSession(session);

    if (validationError) {
      setStatus(validationError);
      return;
    }

    updateSession({
      ...session,
      notes: session.notes?.trim() || undefined,
      exerciseLogs: session.exerciseLogs.map((log) => ({
        ...log,
        notes: log.notes?.trim() || undefined,
      })),
    });
    setStatus("Saved");
  }

  function handleDelete() {
    if (
      !window.confirm(
        "Delete this workout session from your history? This cannot be undone.",
      )
    ) {
      return;
    }

    deleteSession(sessionId);
    router.push("/progress");
  }

  if (!session) {
    return (
      <Card>
        <EmptyState
          title="Session not found"
          description="This workout session is not saved on this device."
        />
        <Link
          className="mt-4 flex min-h-12 items-center justify-center rounded-2xl bg-surface-muted px-4 text-sm font-semibold text-foreground"
          href="/progress"
        >
          Back to Progress
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-4 pb-12">
      <Link
        className="inline-flex min-h-9 items-center rounded-full px-1 text-sm font-semibold text-muted hover:text-foreground"
        href="/progress"
      >
        &lt; Progress
      </Link>

      <section className="rounded-[1.35rem] bg-[#0f1b2d] px-5 py-5 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/68">
          {formatSessionDate(session.date)}
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          {workoutDay?.title ?? "Saved workout"}
        </h1>
        <p className="mt-3 text-sm font-semibold text-white/78">
          {session.exerciseLogs.length} exercises
        </p>
      </section>

      <Card>
        <label className="block">
          <span className="text-sm font-semibold text-foreground">
            Workout note
          </span>
          <textarea
            className="mt-2 min-h-24 w-full resize-none rounded-2xl border border-border-soft bg-white px-3 py-3 text-sm leading-6 text-foreground outline-none focus:border-accent"
            onChange={(event) => updateSessionNotes(event.target.value)}
            placeholder="Anything worth remembering from this workout?"
            value={session.notes ?? ""}
          />
        </label>
      </Card>

      {session.exerciseLogs.map((log) => {
        const exercise = plan.exercises.find((item) => item.id === log.exerciseId);

        return (
          <section
            className="rounded-[1.35rem] border border-border-soft bg-surface/70 px-4 py-4"
            key={log.exerciseId}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {exercise?.name ?? "Removed exercise"}
                </h2>
                {exercise ? (
                  <p className="mt-1 text-sm font-medium text-muted">
                    {formatRepRange(exercise)} reps
                  </p>
                ) : null}
              </div>
              {exercise?.muscleGroup ? (
                <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
                  {exercise.muscleGroup}
                </span>
              ) : null}
            </div>

            <div className="mt-4 space-y-2">
              {log.sets.map((set) => (
                <SetLogRow
                  key={set.setNumber}
                  onChange={(nextSet) => updateSet(log, nextSet)}
                  set={set}
                  unit={settings.weightUnit}
                />
              ))}
            </div>

            <label className="mt-3 block">
              <span className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-muted">
                Exercise note
              </span>
              <textarea
                className="mt-2 min-h-20 w-full resize-none rounded-2xl border border-border-soft bg-white px-3 py-3 text-sm leading-6 text-foreground outline-none focus:border-accent"
                onChange={(event) => updateLogNotes(log, event.target.value)}
                placeholder="Technique, setup, or anything useful."
                value={log.notes ?? ""}
              />
            </label>
          </section>
        );
      })}

      <div className="sticky bottom-28 z-10 space-y-2 rounded-[1.35rem] border border-border-soft bg-surface/95 p-3 shadow-[0_16px_36px_rgba(43,38,28,0.14)] backdrop-blur">
        {status ? (
          <p className="rounded-2xl bg-surface-muted px-3 py-2 text-sm font-semibold text-foreground">
            {status}
          </p>
        ) : null}
        <button
          className="dark-action min-h-14 w-full rounded-2xl bg-[#0f1b2d] px-5 text-base font-semibold"
          onClick={saveChanges}
          style={{ color: "#ffffff" }}
          type="button"
        >
          Save Changes
        </button>
        <button
          className="min-h-12 w-full rounded-2xl border border-red-200 bg-red-50 px-5 text-sm font-semibold text-red-700"
          onClick={handleDelete}
          type="button"
        >
          Delete Session
        </button>
      </div>
    </div>
  );
}
