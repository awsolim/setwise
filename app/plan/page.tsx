import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";

export default function PlanPage() {
  return (
    <>
      <PageHeader
        title="Plan"
        description="Build and review your weekly split here in a later phase."
      />

      <Card>
        <EmptyState
          title="Weekly split coming soon"
          description="This space will become the home for training days, muscle groups, and exercise structure."
        />
      </Card>
    </>
  );
}
