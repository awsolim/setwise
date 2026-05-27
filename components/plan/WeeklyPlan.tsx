import { WorkoutDayCard } from "@/components/plan/WorkoutDayCard";
import type { Exercise, Weekday, WorkoutDay } from "@/lib/types";
import {
  getExercisesForWorkout,
  getWorkoutsInWeekOrder,
} from "@/lib/workout-utils";

type WeeklyPlanProps = {
  workoutDays: WorkoutDay[];
  exercises: Exercise[];
  today: Weekday;
  editable?: boolean;
};

export function WeeklyPlan({
  workoutDays,
  exercises,
  today,
  editable = false,
}: WeeklyPlanProps) {
  const orderedWorkoutDays = getWorkoutsInWeekOrder(workoutDays);

  return (
    <section className="space-y-3">
      {orderedWorkoutDays.map((workoutDay) => (
        <WorkoutDayCard
          exercises={getExercisesForWorkout(workoutDay, exercises)}
          editable={editable}
          isToday={workoutDay.dayOfWeek === today}
          key={workoutDay.id}
          workoutDay={workoutDay}
        />
      ))}
    </section>
  );
}
