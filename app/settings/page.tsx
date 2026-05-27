import { Card } from "@/components/Card";
import { PageHeader } from "@/components/PageHeader";
import { defaultWeightUnit } from "@/lib/mock-data";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Static placeholders for preferences that will become editable later."
      />

      <Card>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Default weight unit
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted">
              Used by mock workout history for now.
            </p>
          </div>
          <span className="rounded-full bg-accent-soft px-4 py-2 text-sm font-semibold text-accent">
            {defaultWeightUnit}
          </span>
        </div>
      </Card>
    </>
  );
}
