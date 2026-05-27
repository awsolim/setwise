import Link from "next/link";
import type { WorkoutDay } from "@/lib/types";

type RestDayStateProps = {
  workoutDay?: WorkoutDay;
};

export function RestDayState({ workoutDay }: RestDayStateProps) {
  return (
    <section className="rounded-[1.35rem] border border-dashed border-border-soft bg-surface-muted/55 px-5 py-8 text-center">
      <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-accent-soft text-lg font-semibold text-accent">
        R
      </div>
      <h2 className="text-xl font-semibold text-foreground">Rest day</h2>
      <p className="mx-auto mt-2 max-w-64 text-sm leading-6 text-muted">
        {workoutDay?.notes ?? "No planned lifting today."}
      </p>
      {workoutDay ? (
        <Link
          className="mt-5 inline-flex min-h-11 items-center rounded-full bg-surface px-4 text-sm font-semibold text-foreground"
          href={`/plan/${workoutDay.id}`}
        >
          Change this day
        </Link>
      ) : null}
    </section>
  );
}
