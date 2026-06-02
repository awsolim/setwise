import { PageHeader } from "@/components/PageHeader";
import { TodayWorkout } from "@/components/today/TodayWorkout";

export const dynamic = "force-dynamic";

export default function TodayPage() {
  return (
    <>
      <PageHeader
        title="Today"
        description="Your saved plan for the day, with a quick weekly preview."
      />

      <TodayWorkout />
    </>
  );
}
