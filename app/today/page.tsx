import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";

export default function TodayPage() {
  return (
    <>
      <PageHeader
        title="Today"
        description="A focused place for starting today's workout will live here soon."
      />

      <Card>
        <EmptyState
          title="No workout queued yet"
          description="Later, Setwise will surface your next session and the lifts that need attention."
        />
      </Card>
    </>
  );
}
