import Link from "next/link";
import { LatestPerformance } from "@/components/progress/LatestPerformance";
import type { Exercise, WorkoutSession } from "@/lib/types";
import {
  formatSessionDate,
  getLatestPerformanceForExercise,
  getLatestSessionDateForExercise,
  getSessionCountForExercise,
} from "@/lib/workout-utils";

type ProgressExerciseCardProps = {
  exercise: Exercise;
  sessions: WorkoutSession[];
};

export function ProgressExerciseCard({
  exercise,
  sessions,
}: ProgressExerciseCardProps) {
  const latestDate = getLatestSessionDateForExercise(exercise.id, sessions);
  const sessionCount = getSessionCountForExercise(exercise.id, sessions);

  return (
    <Link
      className="block rounded-[1.2rem] border border-border-soft bg-surface/65 px-4 py-4 transition active:scale-[0.99]"
      href={`/progress/${exercise.id}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-foreground">
            {exercise.name}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {sessionCount} {sessionCount === 1 ? "session" : "sessions"} logged
          </p>
        </div>
        {exercise.muscleGroup ? (
          <span className="shrink-0 rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
            {exercise.muscleGroup}
          </span>
        ) : null}
      </div>
      <LatestPerformance
        dateLabel={latestDate ? formatSessionDate(latestDate) : null}
        performance={getLatestPerformanceForExercise(exercise.id, sessions)}
      />
    </Link>
  );
}
