"use client";

type FinishWorkoutBarProps = {
  canFinish: boolean;
  error?: string | null;
  onFinish: () => void;
};

export function FinishWorkoutBar({
  canFinish,
  error,
  onFinish,
}: FinishWorkoutBarProps) {
  return (
    <div className="sticky bottom-28 z-10 space-y-2 rounded-[1.35rem] border border-border-soft bg-surface/95 p-3 shadow-[0_16px_36px_rgba(43,38,28,0.14)] backdrop-blur">
      {error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm leading-5 text-red-700">
          {error}
        </p>
      ) : null}
      <button
        className="dark-action min-h-14 w-full rounded-2xl bg-[#173b32] px-5 text-base font-semibold disabled:bg-surface-muted disabled:!text-muted"
        disabled={!canFinish}
        onClick={onFinish}
        style={canFinish ? { color: "#ffffff" } : undefined}
        type="button"
      >
        Finish Workout
      </button>
    </div>
  );
}
