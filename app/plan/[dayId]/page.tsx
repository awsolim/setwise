import { PageHeader } from "@/components/PageHeader";
import { WorkoutDayEditor } from "@/components/plan/WorkoutDayEditor";

type PlanDayPageProps = {
  params: Promise<{
    dayId: string;
  }>;
};

export default async function PlanDayPage({ params }: PlanDayPageProps) {
  const { dayId } = await params;

  return (
    <>
      <PageHeader
        title="Edit Day"
        description="Update this workout day and save it locally on this device."
      />

      <WorkoutDayEditor dayId={dayId} />
    </>
  );
}
