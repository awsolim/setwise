"use client";

import { Card } from "@/components/Card";
import { useAppSettings, useStoredPlan, useStoredWorkoutSessions } from "@/lib/storage";
import type { WeightUnit } from "@/lib/types";

const unitOptions: WeightUnit[] = ["lb", "kg"];

export function SettingsPanel() {
  const { settings, saveSettings } = useAppSettings();
  const { resetPlan } = useStoredPlan();
  const { clearSessions, sessions } = useStoredWorkoutSessions();

  function updateUnit(weightUnit: WeightUnit) {
    saveSettings({ ...settings, weightUnit });
  }

  function handleResetPlan() {
    if (window.confirm("Reset your weekly plan to the sample Setwise plan?")) {
      resetPlan();
    }
  }

  function handleClearHistory() {
    if (
      window.confirm(
        "Delete all saved workout history from this device? This cannot be undone.",
      )
    ) {
      clearSessions();
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="text-base font-semibold text-foreground">
          Preferred unit
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {unitOptions.map((unit) => (
            <button
              className={[
                "min-h-12 rounded-2xl border px-4 text-sm font-semibold transition",
                settings.weightUnit === unit
                  ? "border-accent bg-accent text-white"
                  : "border-border-soft bg-surface-muted text-foreground",
              ].join(" ")}
              key={unit}
              onClick={() => updateUnit(unit)}
              style={settings.weightUnit === unit ? { color: "#ffffff" } : undefined}
              type="button"
            >
              {unit}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm leading-6 text-muted">
          Stored weights are shown as the selected unit. Setwise does not convert
          older history yet.
        </p>
      </Card>

      <Card>
        <h2 className="text-base font-semibold text-foreground">
          Install Setwise
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Add Setwise to your home screen from your browser share or menu button
          for a standalone app experience.
        </p>
      </Card>

      <Card>
        <h2 className="text-base font-semibold text-foreground">App info</h2>
        <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl bg-surface-muted px-3 py-3">
            <dt className="font-semibold uppercase tracking-[0.08em] text-muted">
              Storage
            </dt>
            <dd className="mt-1 font-semibold text-foreground">This device</dd>
          </div>
          <div className="rounded-2xl bg-surface-muted px-3 py-3">
            <dt className="font-semibold uppercase tracking-[0.08em] text-muted">
              History
            </dt>
            <dd className="mt-1 font-semibold text-foreground">
              {sessions.length} {sessions.length === 1 ? "session" : "sessions"}
            </dd>
          </div>
        </dl>
      </Card>

      <Card>
        <h2 className="text-base font-semibold text-foreground">Danger zone</h2>
        <div className="mt-3 space-y-2">
          <button
            className="min-h-12 w-full rounded-2xl border border-border-soft bg-surface-muted px-4 text-sm font-semibold text-foreground"
            onClick={handleResetPlan}
            type="button"
          >
            Reset plan to sample
          </button>
          <button
            className="min-h-12 w-full rounded-2xl border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-700 disabled:opacity-45"
            disabled={sessions.length === 0}
            onClick={handleClearHistory}
            type="button"
          >
            Clear workout history
          </button>
        </div>
      </Card>
    </div>
  );
}
