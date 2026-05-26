type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-border-soft bg-surface-muted/50 px-5 py-8 text-center">
      <div className="mb-5 flex size-12 items-center justify-center rounded-full bg-accent-soft text-lg font-semibold text-accent">
        S
      </div>
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="mt-2 max-w-64 text-sm leading-6 text-muted">
        {description}
      </p>
    </div>
  );
}
