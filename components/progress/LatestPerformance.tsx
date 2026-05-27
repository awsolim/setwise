type LatestPerformanceProps = {
  dateLabel?: string | null;
  performance: string;
};

export function LatestPerformance({
  dateLabel,
  performance,
}: LatestPerformanceProps) {
  return (
    <div className="mt-3 border-t border-border-soft pt-3">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-muted">
        Latest
      </p>
      <p className="mt-1 text-sm font-semibold leading-6 text-foreground">
        {performance}
      </p>
      {dateLabel ? (
        <p className="mt-1 text-xs font-medium text-muted">{dateLabel}</p>
      ) : null}
    </div>
  );
}
