import type { Exercise } from "@/lib/types";
import { formatRepRange } from "@/lib/workout-utils";

type ExercisePreviewListProps = {
  exercises: Exercise[];
  inverse?: boolean;
};

export function ExercisePreviewList({
  exercises,
  inverse = false,
}: ExercisePreviewListProps) {
  return (
    <ul
      className={[
        "mt-3 divide-y",
        inverse ? "divide-white/14" : "divide-border-soft",
      ].join(" ")}
    >
      {exercises.map((exercise) => (
        <li className="flex items-center gap-3 py-3" key={exercise.id}>
          <div className="min-w-0 flex-1">
            <p
              className={[
                "truncate text-sm font-medium",
                inverse ? "text-white" : "text-foreground",
              ].join(" ")}
            >
              {exercise.name}
            </p>
            {exercise.muscleGroup ? (
              <p
                className={[
                  "mt-0.5 text-xs",
                  inverse ? "text-white/68" : "text-muted",
                ].join(" ")}
              >
                {exercise.muscleGroup}
              </p>
            ) : null}
          </div>
          <span
            className={[
              "shrink-0 text-xs font-semibold",
              inverse ? "text-white/72" : "text-muted",
            ].join(" ")}
          >
            {formatRepRange(exercise)}
          </span>
        </li>
      ))}
    </ul>
  );
}
