import { MuscleTarget } from "@/components/MuscleTarget";
import {
  getExerciseTargetSummary,
  getMuscleTargetsForExercise,
} from "@/lib/muscle-targets";
import type { Exercise } from "@/lib/types";
import { formatRepRange } from "@/lib/workout-utils";

type ExerciseTodayCardProps = {
  exercise: Exercise;
  latestPerformance?: string;
};

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-muted">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

export function ExerciseTodayCard({
  exercise,
  latestPerformance = "No history",
}: ExerciseTodayCardProps) {
  const targetSummary = getExerciseTargetSummary(exercise);

  return (
    <article className="flex gap-4 border-t border-border-soft py-4 first:border-t-0">
      <MuscleTarget targets={getMuscleTargetsForExercise(exercise)} />
      <div className="min-w-0 flex-1 self-start">
        <h3 className="text-base font-semibold text-foreground">
          {exercise.name}
        </h3>
        <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
          <Detail label="Emphasis" value={targetSummary.emphasis} />
          <Detail label="Side Target" value={targetSummary.sideTarget} />
          <Detail label="Sets" value={String(exercise.sets)} />
          <Detail label="Reps" value={formatRepRange(exercise).split(" x ")[1]} />
          <div className="col-span-2">
            <Detail label="Last" value={latestPerformance} />
          </div>
        </div>
      </div>
    </article>
  );
}
