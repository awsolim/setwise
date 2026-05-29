import Link from "next/link";
import type { WorkoutDay } from "@/lib/types";
import {
  formatLoggedSets,
  formatSetPerformance,
  formatSessionDate,
  type ExerciseHistoryEntry as ExerciseHistoryEntryType,
} from "@/lib/workout-utils";
import type { WeightUnit } from "@/lib/types";

type ExerciseHistoryEntryProps = {
  entry: ExerciseHistoryEntryType;
  unit: WeightUnit;
  workoutDay?: WorkoutDay;
};

export function ExerciseHistoryEntry({
  entry,
  unit,
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
        <Link
          className="rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold text-foreground"
          href={`/progress/session/${entry.session.id}`}
        >
          Edit
        </Link>
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
                {formatSetPerformance(set, unit)}
              </span>
            </li>
          ))}
      </ul>
      {entry.log.notes ? (
        <p className="mt-3 text-sm leading-6 text-muted">{entry.log.notes}</p>
      ) : null}
      {entry.session.notes ? (
        <p className="mt-2 rounded-2xl bg-surface-muted/55 px-3 py-2 text-sm leading-6 text-muted">
          {entry.session.notes}
        </p>
      ) : null}
      <p className="mt-3 text-sm font-semibold text-muted">
        {formatLoggedSets(entry.log, unit)}
      </p>
    </article>
  );
}
