import { Card } from "@/components/Card";
import type { WeightUnit, WorkoutSession } from "@/lib/types";
import {
  formatSetPerformance,
  formatSessionDate,
  getBestCompletedSet,
  getExerciseHistory,
  getExerciseTrendLabel,
  getLatestPerformanceForExercise,
  getLatestSessionDateForExercise,
} from "@/lib/workout-utils";

type ExerciseStatsProps = {
  exerciseId: string;
  sessions: WorkoutSession[];
  unit: WeightUnit;
};

export function ExerciseStats({ exerciseId, sessions, unit }: ExerciseStatsProps) {
  const history = getExerciseHistory(exerciseId, sessions);
  const latestDate = getLatestSessionDateForExercise(exerciseId, sessions);
  const bestSet = getBestCompletedSet(history.map((entry) => entry.log));
  const stats: Array<{ label: string; value: string }> = [
    {
      label: "Latest",
      value: getLatestPerformanceForExercise(exerciseId, sessions, unit),
    },
    {
      label: "Best set",
      value: bestSet ? formatSetPerformance(bestSet, unit) : "No completed sets",
    },
    {
      label: "Sessions",
      value: String(history.length),
    },
    {
      label: "Last trained",
      value: latestDate ? formatSessionDate(latestDate) : "Not logged",
    },
    {
      label: "Trend",
      value: getExerciseTrendLabel(exerciseId, sessions),
    },
  ];

  return (
    <Card>
      <div className="grid grid-cols-2 gap-2">
        {stats.map((stat) => (
          <div
            className="rounded-2xl bg-surface-muted px-3 py-3 last:col-span-2"
            key={stat.label}
          >
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-muted">
              {stat.label}
            </p>
            <p className="mt-1 text-sm font-semibold leading-5 text-foreground">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
