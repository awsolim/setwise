"use client";

import { useState } from "react";
import {
  useSavedPlans,
  useStoredPlan,
  type StoredPlan,
} from "@/lib/storage";
import type { SavedPlan } from "@/lib/types";
import { isRestDay } from "@/lib/workout-utils";

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
        isActive
          ? "border-white/40 bg-white/18"
          : "border-white/12 bg-white/[0.07]",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-semibold text-white">
              {savedPlan.name}
            </h3>
            {isActive ? (
              <span className="shrink-0 rounded-full bg-white/18 px-2.5 py-0.5 text-[0.65rem] font-semibold text-white">
                Active
              </span>
            ) : null}
          </div>
          {savedPlan.description ? (
            <p className="mt-1 line-clamp-1 text-sm leading-5 text-white/68">
              {savedPlan.description}
            </p>
          ) : null}
        </div>
        <p className="shrink-0 text-xs font-semibold text-white/68">
          {stats.trainingDays} training days
        </p>
      </div>

      <div className="mt-3 flex justify-end">
        <button
          className="min-h-10 rounded-2xl bg-white px-4 text-sm font-semibold text-[#173b32] disabled:bg-white/12 disabled:text-white/45"
          disabled={isActive}
          onClick={() => onActivate(savedPlan)}
          type="button"
        >
          Use Plan
        </button>
      </div>
    </article>
  );
}

export function PlanLibrary() {
  const [isOpen, setIsOpen] = useState(false);
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
    <section className="overflow-hidden rounded-[1.35rem] border border-[#173b32] bg-[#173b32] text-white shadow-[0_14px_34px_rgba(23,59,50,0.18)]">
      <div className="flex items-center gap-2 px-4 py-3">
        <button
          aria-expanded={isOpen}
          className="min-h-12 min-w-0 flex-1 text-left"
          onClick={() => setIsOpen((open) => !open)}
          type="button"
        >
          <h2 className="text-lg font-semibold text-white">Plan Library</h2>
        </button>
        <button
          className="min-h-10 shrink-0 rounded-2xl bg-white/12 px-3 text-sm font-semibold text-white"
          onClick={handleSaveCurrent}
          type="button"
        >
          Save
        </button>
        <button
          aria-label={isOpen ? "Collapse plan library" : "Expand plan library"}
          className="flex size-10 shrink-0 items-center justify-center rounded-full text-white/74 transition hover:bg-white/10 hover:text-white"
          onClick={() => setIsOpen((open) => !open)}
          type="button"
        >
          <svg
            aria-hidden="true"
            className="size-5"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              d={isOpen ? "m6 15 6-6 6 6" : "m6 9 6 6 6-6"}
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </button>
      </div>

      <div
        className={[
          "grid transition-[grid-template-rows] duration-300 ease-out",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        ].join(" ")}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="space-y-2 border-t border-white/12 px-4 py-4">
            {savedPlans.map((savedPlan) => (
              <SavedPlanCard
                currentPlan={plan}
                key={savedPlan.id}
                onActivate={handleActivate}
                savedPlan={savedPlan}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
