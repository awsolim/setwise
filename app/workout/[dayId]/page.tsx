import { PageHeader } from "@/components/PageHeader";
import { WorkoutLogger } from "@/components/workout/WorkoutLogger";

type WorkoutPageProps = {
  params: Promise<{
    dayId: string;
  }>;
};

export default async function WorkoutPage({ params }: WorkoutPageProps) {
  const { dayId } = await params;

  return (
    <>
      <PageHeader title="Log Workout" />
      <WorkoutLogger dayId={dayId} />
    </>
  );
}
