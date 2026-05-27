import type { Exercise, WorkoutDay, WorkoutSession } from "@/lib/types";

export const defaultWeightUnit = "lb";

export const exercises: Exercise[] = [
  {
    id: "incline-dumbbell-press",
    name: "Incline Dumbbell Press",
    muscleGroup: "Chest",
    sets: 3,
    repMin: 8,
    repMax: 12,
    notes: "Stop just shy of lockout and keep the bench at a moderate incline.",
  },
  {
    id: "machine-chest-press",
    name: "Machine Chest Press",
    muscleGroup: "Chest",
    sets: 3,
    repMin: 10,
    repMax: 15,
  },
  {
    id: "cable-lateral-raise",
    name: "Cable Lateral Raise",
    muscleGroup: "Shoulders",
    sets: 4,
    repMin: 12,
    repMax: 20,
    notes: "Lead with the elbow and pause briefly near shoulder height.",
  },
  {
    id: "triceps-pushdown",
    name: "Triceps Pushdown",
    muscleGroup: "Triceps",
    sets: 3,
    repMin: 10,
    repMax: 15,
  },
  {
    id: "lat-pulldown",
    name: "Lat Pulldown",
    muscleGroup: "Back",
    sets: 3,
    repMin: 8,
    repMax: 12,
  },
  {
    id: "chest-supported-row",
    name: "Chest-Supported Row",
    muscleGroup: "Back",
    sets: 3,
    repMin: 8,
    repMax: 12,
    notes: "Keep the torso planted and pull toward the lower ribs.",
  },
  {
    id: "seated-leg-curl",
    name: "Seated Leg Curl",
    muscleGroup: "Hamstrings",
    sets: 3,
    repMin: 10,
    repMax: 15,
  },
  {
    id: "leg-press",
    name: "Leg Press",
    muscleGroup: "Quads",
    sets: 4,
    repMin: 10,
    repMax: 15,
  },
  {
    id: "romanian-deadlift",
    name: "Romanian Deadlift",
    muscleGroup: "Hamstrings",
    sets: 3,
    repMin: 8,
    repMax: 10,
    notes: "Use a controlled eccentric and keep tension on the hamstrings.",
  },
  {
    id: "standing-calf-raise",
    name: "Standing Calf Raise",
    muscleGroup: "Calves",
    sets: 4,
    repMin: 10,
    repMax: 15,
  },
  {
    id: "dumbbell-shoulder-press",
    name: "Dumbbell Shoulder Press",
    muscleGroup: "Shoulders",
    sets: 3,
    repMin: 8,
    repMax: 12,
  },
  {
    id: "cable-row",
    name: "Cable Row",
    muscleGroup: "Back",
    sets: 3,
    repMin: 10,
    repMax: 15,
  },
];

export const workoutDays: WorkoutDay[] = [
  {
    id: "monday-push",
    dayOfWeek: "Monday",
    title: "Push",
    notes: "Chest, shoulders, and triceps with a stable pressing focus.",
    exerciseIds: [
      "incline-dumbbell-press",
      "machine-chest-press",
      "cable-lateral-raise",
      "triceps-pushdown",
    ],
  },
  {
    id: "tuesday-pull",
    dayOfWeek: "Tuesday",
    title: "Pull",
    notes: "Vertical and horizontal pulls with controlled upper-back volume.",
    exerciseIds: ["lat-pulldown", "chest-supported-row", "cable-row"],
  },
  {
    id: "wednesday-legs",
    dayOfWeek: "Wednesday",
    title: "Legs",
    notes: "Quad-biased lower work with hamstrings kept fresh for Saturday.",
    exerciseIds: ["leg-press", "seated-leg-curl", "standing-calf-raise"],
  },
  {
    id: "thursday-rest",
    dayOfWeek: "Thursday",
    title: "Rest",
    notes: "Recovery day. Easy walking and mobility are welcome.",
    exerciseIds: [],
  },
  {
    id: "friday-upper",
    dayOfWeek: "Friday",
    title: "Upper",
    notes: "Balanced upper-body volume without rushing the isolation work.",
    exerciseIds: [
      "machine-chest-press",
      "lat-pulldown",
      "dumbbell-shoulder-press",
      "cable-lateral-raise",
      "triceps-pushdown",
    ],
  },
  {
    id: "saturday-lower",
    dayOfWeek: "Saturday",
    title: "Lower",
    notes: "Posterior-chain focus with calves at the end.",
    exerciseIds: [
      "romanian-deadlift",
      "leg-press",
      "seated-leg-curl",
      "standing-calf-raise",
    ],
  },
  {
    id: "sunday-rest",
    dayOfWeek: "Sunday",
    title: "Rest",
    notes: "Full rest before the next Push day.",
    exerciseIds: [],
  },
];

export const workoutSessions: WorkoutSession[] = [
  {
    id: "session-2026-05-11-push",
    workoutDayId: "monday-push",
    date: "2026-05-11",
    exerciseLogs: [
      {
        exerciseId: "incline-dumbbell-press",
        sets: [
          { setNumber: 1, weight: 60, reps: 11, completed: true },
          { setNumber: 2, weight: 60, reps: 10, completed: true },
          { setNumber: 3, weight: 60, reps: 9, completed: true },
        ],
      },
      {
        exerciseId: "machine-chest-press",
        sets: [
          { setNumber: 1, weight: 140, reps: 13, completed: true },
          { setNumber: 2, weight: 140, reps: 12, completed: true },
          { setNumber: 3, weight: 140, reps: 11, completed: true },
        ],
      },
      {
        exerciseId: "cable-lateral-raise",
        sets: [
          { setNumber: 1, weight: 15, reps: 18, completed: true },
          { setNumber: 2, weight: 15, reps: 16, completed: true },
          { setNumber: 3, weight: 15, reps: 15, completed: true },
          { setNumber: 4, weight: 15, reps: 14, completed: true },
        ],
      },
    ],
  },
  {
    id: "session-2026-05-18-push",
    workoutDayId: "monday-push",
    date: "2026-05-18",
    exerciseLogs: [
      {
        exerciseId: "incline-dumbbell-press",
        sets: [
          { setNumber: 1, weight: 65, reps: 10, completed: true },
          { setNumber: 2, weight: 65, reps: 9, completed: true },
          { setNumber: 3, weight: 65, reps: 8, completed: true },
        ],
      },
      {
        exerciseId: "machine-chest-press",
        sets: [
          { setNumber: 1, weight: 145, reps: 12, completed: true },
          { setNumber: 2, weight: 145, reps: 11, completed: true },
          { setNumber: 3, weight: 145, reps: 10, completed: true },
        ],
      },
      {
        exerciseId: "triceps-pushdown",
        sets: [
          { setNumber: 1, weight: 55, reps: 14, completed: true },
          { setNumber: 2, weight: 55, reps: 13, completed: true },
          { setNumber: 3, weight: 55, reps: 12, completed: true },
        ],
      },
    ],
  },
  {
    id: "session-2026-05-19-pull",
    workoutDayId: "tuesday-pull",
    date: "2026-05-19",
    exerciseLogs: [
      {
        exerciseId: "lat-pulldown",
        sets: [
          { setNumber: 1, weight: 125, reps: 12, completed: true },
          { setNumber: 2, weight: 125, reps: 11, completed: true },
          { setNumber: 3, weight: 125, reps: 10, completed: true },
        ],
      },
      {
        exerciseId: "chest-supported-row",
        sets: [
          { setNumber: 1, weight: 95, reps: 11, completed: true },
          { setNumber: 2, weight: 95, reps: 10, completed: true },
          { setNumber: 3, weight: 95, reps: 9, completed: true },
        ],
      },
    ],
  },
  {
    id: "session-2026-05-20-legs",
    workoutDayId: "wednesday-legs",
    date: "2026-05-20",
    exerciseLogs: [
      {
        exerciseId: "leg-press",
        sets: [
          { setNumber: 1, weight: 360, reps: 15, completed: true },
          { setNumber: 2, weight: 380, reps: 12, completed: true },
          { setNumber: 3, weight: 380, reps: 11, completed: true },
          { setNumber: 4, weight: 380, reps: 10, completed: true },
        ],
      },
      {
        exerciseId: "seated-leg-curl",
        sets: [
          { setNumber: 1, weight: 95, reps: 14, completed: true },
          { setNumber: 2, weight: 95, reps: 13, completed: true },
          { setNumber: 3, weight: 95, reps: 12, completed: true },
        ],
      },
    ],
  },
  {
    id: "session-2026-05-23-lower",
    workoutDayId: "saturday-lower",
    date: "2026-05-23",
    exerciseLogs: [
      {
        exerciseId: "romanian-deadlift",
        sets: [
          { setNumber: 1, weight: 185, reps: 10, completed: true },
          { setNumber: 2, weight: 185, reps: 9, completed: true },
          { setNumber: 3, weight: 185, reps: 8, completed: true },
        ],
      },
      {
        exerciseId: "standing-calf-raise",
        sets: [
          { setNumber: 1, weight: 160, reps: 15, completed: true },
          { setNumber: 2, weight: 160, reps: 13, completed: true },
          { setNumber: 3, weight: 160, reps: 12, completed: true },
          { setNumber: 4, weight: 160, reps: 11, completed: true },
        ],
      },
    ],
  },
];
