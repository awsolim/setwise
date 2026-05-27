"use client";

import { BodyChart, ViewSide } from "body-muscles";
import { useEffect, useMemo, useRef } from "react";
import {
  getBodyStateForTargets,
  type MuscleTargets,
} from "@/lib/muscle-targets";

type MuscleTargetProps = {
  targets: MuscleTargets;
};

export function MuscleTarget({ targets }: MuscleTargetProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<BodyChart | null>(null);
  const bodyState = useMemo(() => getBodyStateForTargets(targets), [targets]);
  const view = targets.view === "BACK" ? ViewSide.BACK : ViewSide.FRONT;

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    chartRef.current = new BodyChart(containerRef.current, {
      ariaLabel:
        targets.view === "BACK"
          ? "Posterior muscle target map"
          : "Anterior muscle target map",
      bodyState,
      enableTransitions: true,
      showViewLabel: false,
      view,
    });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [bodyState, targets.view, view]);

  return (
    <div className="shrink-0">
      <div
        className="h-36 w-24 overflow-hidden rounded-2xl bg-[#f7f2ea] [&_.body-chart-container]:p-1.5 [&_.body-chart-svg]:drop-shadow-none"
        ref={containerRef}
      />
      <p className="mt-1 text-center text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-muted">
        {targets.view === "BACK" ? "Back" : "Front"}
      </p>
    </div>
  );
}
