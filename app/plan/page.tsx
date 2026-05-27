import { PageHeader } from "@/components/PageHeader";
import { PlanOverview } from "@/components/plan/PlanOverview";
import { getTodayWeekday } from "@/lib/workout-utils";

export const dynamic = "force-dynamic";

export default function PlanPage() {
  const today = getTodayWeekday();

  return (
    <>
      <PageHeader
        title="Plan"
        description="Review and edit the weekly split saved on this device."
      />

      <PlanOverview today={today} />
    </>
  );
}
