import type { WorkoutDay } from "@/lib/types";
import {
  formatLoggedSets,
  formatSessionDate,
  type ExerciseHistoryEntry as ExerciseHistoryEntryType,
} from "@/lib/workout-utils";

type ExerciseHistoryEntryProps = {
  entry: ExerciseHistoryEntryType;
  workoutDay?: WorkoutDay;
};

export function ExerciseHistoryEntry({
  entry,
  workoutDay,
}: ExerciseHistoryEntryProps) {
  return (
    <article className="rounded-[1.2rem] border border-border-soft bg-surface/65 px-4 py-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-base font-semibold text-foreground">
            {formatSessionDate(entry.session.date)}
          </p>
          {workoutDay ? (
            <p className="mt-1 text-sm text-muted">{workoutDay.title}</p>
          ) : null}
        </div>
      </div>
      <ul className="mt-3 space-y-2 border-t border-border-soft pt-3">
        {entry.log.sets
          .filter((set) => set.completed)
          .map((set) => (
            <li
              className="flex items-center justify-between rounded-2xl bg-surface-muted/55 px-3 py-2 text-sm"
              key={set.setNumber}
            >
              <span className="font-medium text-muted">Set {set.setNumber}</span>
              <span className="font-semibold text-foreground">
                {set.weight} lb x {set.reps}
              </span>
            </li>
          ))}
      </ul>
      <p className="mt-3 text-sm font-semibold text-muted">
        {formatLoggedSets(entry.log)}
      </p>
    </article>
  );
}
