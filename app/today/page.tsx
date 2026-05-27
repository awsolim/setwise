import { PageHeader } from "@/components/PageHeader";
import { TodayWorkout } from "@/components/today/TodayWorkout";
import { getCurrentDateLabel, getTodayWeekday } from "@/lib/workout-utils";

export const dynamic = "force-dynamic";

export default function TodayPage() {
  const now = new Date();
  const today = getTodayWeekday(now);
  const dateLabel = getCurrentDateLabel(now);

  return (
    <>
      <PageHeader
        title="Today"
        description="Your saved plan for the day, with a quick weekly preview."
      />

      <TodayWorkout dateLabel={dateLabel} today={today} />
    </>
  );
}
