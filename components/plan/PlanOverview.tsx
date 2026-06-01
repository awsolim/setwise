"use client";

import { PlanLibrary } from "@/components/plan/PlanLibrary";
import { WeeklyPlan } from "@/components/plan/WeeklyPlan";
import { useStoredPlan } from "@/lib/storage";
import type { Weekday } from "@/lib/types";

type PlanOverviewProps = {
  today: Weekday;
};

export function PlanOverview({ today }: PlanOverviewProps) {
  const { plan } = useStoredPlan();

  return (
    <div className="space-y-4">
      <PlanLibrary />

      <WeeklyPlan
        editable
        exercises={plan.exercises}
        today={today}
        workoutDays={plan.workoutDays}
      />
    </div>
  );
}
