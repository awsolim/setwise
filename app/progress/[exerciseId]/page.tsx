import { PageHeader } from "@/components/PageHeader";
import { ExerciseHistory } from "@/components/progress/ExerciseHistory";

type ProgressExercisePageProps = {
  params: Promise<{
    exerciseId: string;
  }>;
};

export default async function ProgressExercisePage({
  params,
}: ProgressExercisePageProps) {
  const { exerciseId } = await params;

  return (
    <>
      <PageHeader title="Exercise History" />
      <ExerciseHistory exerciseId={exerciseId} />
    </>
  );
}
