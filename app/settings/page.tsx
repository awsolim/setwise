import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Preferences and app-level choices will be collected here when they are needed."
      />

      <Card>
        <EmptyState
          title="Nothing to configure yet"
          description="Setwise will keep this calm until there are real preferences worth changing."
        />
      </Card>
    </>
  );
}
