type PageHeaderProps = {
  title: string;
  description?: string;
};

export function PageHeader({ title }: PageHeaderProps) {
  return (
    <header className="mb-5 flex min-h-10 items-center">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        {title}
      </h1>
    </header>
  );
}
