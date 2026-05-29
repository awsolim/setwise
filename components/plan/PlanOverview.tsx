"use client";

import { WeeklyPlan } from "@/components/plan/WeeklyPlan";
import { useStoredPlan } from "@/lib/storage";
import type { Weekday } from "@/lib/types";

type PlanOverviewProps = {
  today: Weekday;
};

export function PlanOverview({ today }: PlanOverviewProps) {
  const { hasHydrated, plan, resetPlan } = useStoredPlan();

  function handleResetPlan() {
    if (window.confirm("Reset your weekly plan to the sample Setwise plan?")) {
      resetPlan();
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 border-b border-border-soft pb-4">
        <p className="text-sm text-muted">
          {hasHydrated ? "Saved locally on this device." : "Loading plan..."}
        </p>
        <button
          className="min-h-10 shrink-0 rounded-full bg-surface px-4 text-sm font-semibold text-foreground"
          onClick={handleResetPlan}
          type="button"
        >
          Reset
        </button>
      </div>

      <WeeklyPlan
        editable
        exercises={plan.exercises}
        today={today}
        workoutDays={plan.workoutDays}
      />
    </div>
  );
}
