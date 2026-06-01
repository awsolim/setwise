"use client";

import {
  useSavedPlans,
  useStoredPlan,
  type StoredPlan,
} from "@/lib/storage";
import type { SavedPlan } from "@/lib/types";
import {
  isRestDay,
} from "@/lib/workout-utils";

function getPlanFingerprint(plan: StoredPlan): string {
  return JSON.stringify({
    exercises: plan.exercises,
    workoutDays: plan.workoutDays,
  });
}

function getPlanStats(plan: StoredPlan) {
  const trainingDays = plan.workoutDays.filter((day) => !isRestDay(day)).length;
  return {
    exerciseCount: plan.exercises.length,
    trainingDays,
  };
}

function SavedPlanCard({
  currentPlan,
  savedPlan,
  onActivate,
}: {
  currentPlan: StoredPlan;
  savedPlan: SavedPlan;
  onActivate: (savedPlan: SavedPlan) => void;
}) {
  const isActive =
    getPlanFingerprint(currentPlan) === getPlanFingerprint(savedPlan.plan);
  const stats = getPlanStats(savedPlan.plan);

  return (
    <article
      className={[
        "rounded-[1.15rem] border px-4 py-3.5",
        isActive ? "border-accent bg-accent-soft" : "border-border-soft bg-surface/65",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-semibold text-foreground">
              {savedPlan.name}
            </h3>
            {isActive ? (
              <span className="shrink-0 rounded-full bg-accent px-2.5 py-0.5 text-[0.65rem] font-semibold text-white">
                Active
              </span>
            ) : null}
          </div>
          {savedPlan.description ? (
            <p className="mt-1 line-clamp-1 text-sm leading-5 text-muted">
              {savedPlan.description}
            </p>
          ) : null}
        </div>
        <p className="shrink-0 text-xs font-semibold text-muted">
          {stats.trainingDays} training days
        </p>
      </div>

      <div className="mt-3 flex justify-end">
        <button
          className="dark-action min-h-10 rounded-2xl bg-[#173b32] px-4 text-sm font-semibold disabled:bg-surface-muted disabled:!text-muted"
          disabled={isActive}
          onClick={() => onActivate(savedPlan)}
          style={!isActive ? { color: "#ffffff" } : undefined}
          type="button"
        >
          Use Plan
        </button>
      </div>
    </article>
  );
}

export function PlanLibrary() {
  const { plan, savePlan } = useStoredPlan();
  const { savedPlans, saveCurrentPlan } = useSavedPlans();

  function handleActivate(savedPlan: SavedPlan) {
    if (
      window.confirm(
        `Switch to "${savedPlan.name}"? Your current weekly plan will be replaced.`,
      )
    ) {
      savePlan(savedPlan.plan);
    }
  }

  function handleSaveCurrent() {
    const name = window.prompt("Name this saved plan:", "My Plan");

    if (!name) {
      return;
    }

    saveCurrentPlan(name, "Saved from your current weekly plan.", plan);
  }

  return (
    <section className="rounded-[1.35rem] border border-border-soft bg-surface/75 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-foreground">Plan Library</h2>
        <button
          className="min-h-10 shrink-0 rounded-2xl bg-surface-muted px-3 text-sm font-semibold text-foreground"
          onClick={handleSaveCurrent}
          type="button"
        >
          Save
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {savedPlans.map((savedPlan) => (
          <SavedPlanCard
            currentPlan={plan}
            key={savedPlan.id}
            onActivate={handleActivate}
            savedPlan={savedPlan}
          />
        ))}
      </div>
    </section>
  );
}
