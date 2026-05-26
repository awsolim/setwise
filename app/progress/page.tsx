import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";

export default function ProgressPage() {
  return (
    <>
      <PageHeader
        title="Progress"
        description="Exercise history and training progress will be tracked here later."
      />

      <Card>
        <EmptyState
          title="History starts after logging"
          description="Future phases will show recent sessions, performance trends, and useful lift notes."
        />
      </Card>
    </>
  );
}
