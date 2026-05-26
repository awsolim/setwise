type PageHeaderProps = {
  title: string;
  description?: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="mb-7">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-accent">
        Setwise
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        {title}
      </h1>
      {description ? (
        <p className="mt-3 max-w-sm text-base leading-7 text-muted">
          {description}
        </p>
      ) : null}
    </header>
  );
}
