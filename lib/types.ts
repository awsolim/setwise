export type Weekday =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type WorkoutDay = {
  id: string;
  dayOfWeek: Weekday;
  title: string;
  notes?: string;
  exerciseIds: string[];
};

export type Exercise = {
  id: string;
  name: string;
  muscleGroup?: string;
  isUnilateral?: boolean;
  sets: number;
  repMin: number;
  repMax: number;
  notes?: string;
};

export type SavedPlan = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  plan: {
    workoutDays: WorkoutDay[];
    exercises: Exercise[];
  };
};

export type WorkoutSession = {
  id: string;
  workoutDayId: string;
  date: string;
  notes?: string;
  exerciseLogs: ExerciseLog[];
};

export type ExerciseLog = {
  exerciseId: string;
  notes?: string;
  sets: LoggedSet[];
};

export type LoggedSet = {
  setNumber: number;
  weight: number;
  reps: number;
  completed: boolean;
};

export type WeightUnit = "lb" | "kg";

export type AppSettings = {
  weightUnit: WeightUnit;
};
