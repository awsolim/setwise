import type { BodyState, MuscleId } from "body-muscles";
import type { Exercise } from "@/lib/types";

export type MuscleView = "FRONT" | "BACK";

export type MuscleTargets = {
  view: MuscleView;
  primaryIds: MuscleId[];
  secondaryIds: MuscleId[];
};

export type ExerciseTargetSummary = {
  emphasis: string;
  sideTarget: string;
};

const emptyTargets: MuscleTargets = {
  view: "FRONT",
  primaryIds: [],
  secondaryIds: [],
};

const ids = {
  biceps: ["biceps-left", "biceps-right"],
  calves: [
    "calves-gastroc-medial-left",
    "calves-gastroc-lateral-left",
    "calves-soleus-left",
    "calves-gastroc-medial-right",
    "calves-gastroc-lateral-right",
    "calves-soleus-right",
  ],
  chestLower: ["chest-lower-left", "chest-lower-right"],
  chestUpper: ["chest-upper-left", "chest-upper-right"],
  frontDelts: ["shoulder-front-left", "shoulder-front-right"],
  glutes: [
    "gluteus-medius-left",
    "gluteus-maximus-left",
    "gluteus-medius-right",
    "gluteus-maximus-right",
  ],
  hamstrings: [
    "hamstrings-medial-left",
    "hamstrings-lateral-left",
    "hamstrings-medial-right",
    "hamstrings-lateral-right",
  ],
  lats: [
    "lats-upper-left",
    "lats-mid-left",
    "lats-lower-left",
    "lats-upper-right",
    "lats-mid-right",
    "lats-lower-right",
  ],
  midBack: [
    "traps-mid-left",
    "traps-lower-left",
    "traps-mid-right",
    "traps-lower-right",
    "lower-back-erectors-left",
    "lower-back-erectors-right",
  ],
  quads: ["quads-left", "quads-right"],
  rearDelts: ["deltoid-rear-left", "deltoid-rear-right"],
  sideDelts: ["shoulder-side-left", "shoulder-side-right"],
  traps: ["traps-upper-left", "traps-upper-right"],
  triceps: [
    "triceps-long-left",
    "triceps-lateral-left",
    "triceps-long-right",
    "triceps-lateral-right",
  ],
} satisfies Record<string, MuscleId[]>;

function targets(
  view: MuscleView,
  primaryIds: MuscleId[],
  secondaryIds: MuscleId[] = [],
): MuscleTargets {
  return { view, primaryIds, secondaryIds };
}

export function getMuscleTargetsForExercise(exercise: Exercise): MuscleTargets {
  const name = exercise.name.toLowerCase();
  const muscleGroup = exercise.muscleGroup?.toLowerCase();

  if (name.includes("incline")) {
    return targets("FRONT", ids.chestUpper, [...ids.frontDelts, ...ids.triceps]);
  }

  if (name.includes("chest press")) {
    return targets(
      "FRONT",
      [...ids.chestUpper, ...ids.chestLower],
      [...ids.frontDelts, ...ids.triceps],
    );
  }

  if (name.includes("lateral raise")) {
    return targets("FRONT", ids.sideDelts, [...ids.frontDelts, ...ids.traps]);
  }

  if (name.includes("shoulder press")) {
    return targets("FRONT", [...ids.frontDelts, ...ids.sideDelts], ids.triceps);
  }

  if (name.includes("pushdown")) {
    return targets("BACK", ids.triceps, ids.frontDelts);
  }

  if (name.includes("pulldown")) {
    return targets("BACK", ids.lats, [...ids.biceps, ...ids.midBack]);
  }

  if (name.includes("row")) {
    return targets("BACK", [...ids.midBack, ...ids.lats], [...ids.rearDelts, ...ids.biceps]);
  }

  if (name.includes("leg press")) {
    return targets("FRONT", ids.quads, ids.glutes);
  }

  if (name.includes("leg curl")) {
    return targets("BACK", ids.hamstrings, ids.calves);
  }

  if (name.includes("romanian")) {
    return targets("BACK", [...ids.hamstrings, ...ids.glutes], ids.midBack);
  }

  if (name.includes("calf")) {
    return targets("BACK", ids.calves);
  }

  if (muscleGroup === "back") {
    return targets("BACK", [...ids.lats, ...ids.midBack], ids.rearDelts);
  }

  if (muscleGroup === "chest") {
    return targets("FRONT", [...ids.chestUpper, ...ids.chestLower], ids.frontDelts);
  }

  if (muscleGroup === "shoulders") {
    return targets("FRONT", ids.sideDelts, ids.frontDelts);
  }

  if (muscleGroup === "triceps") {
    return targets("BACK", ids.triceps, ids.frontDelts);
  }

  if (muscleGroup === "quads") {
    return targets("FRONT", ids.quads, ids.glutes);
  }

  if (muscleGroup === "hamstrings") {
    return targets("BACK", ids.hamstrings, ids.glutes);
  }

  if (muscleGroup === "calves") {
    return targets("BACK", ids.calves);
  }

  return emptyTargets;
}

export function getBodyStateForTargets(targetsForExercise: MuscleTargets): BodyState {
  const bodyState: BodyState = {};

  for (const id of targetsForExercise.secondaryIds) {
    bodyState[id] = { intensity: 4, selected: true };
  }

  for (const id of targetsForExercise.primaryIds) {
    bodyState[id] = { intensity: 8, selected: true };
  }

  return bodyState;
}

export function getExerciseTargetSummary(
  exercise: Exercise,
): ExerciseTargetSummary {
  const name = exercise.name.toLowerCase();
  const muscleGroup = exercise.muscleGroup?.toLowerCase();

  if (name.includes("incline")) {
    return { emphasis: "Upper chest", sideTarget: "Front delts" };
  }

  if (name.includes("chest press")) {
    return { emphasis: "Chest", sideTarget: "Triceps" };
  }

  if (name.includes("lateral raise")) {
    return { emphasis: "Side delts", sideTarget: "Front delts" };
  }

  if (name.includes("shoulder press")) {
    return { emphasis: "Front delts", sideTarget: "Triceps" };
  }

  if (name.includes("pushdown")) {
    return { emphasis: "Triceps", sideTarget: "Front delts" };
  }

  if (name.includes("pulldown")) {
    return { emphasis: "Lats", sideTarget: "Biceps" };
  }

  if (name.includes("row")) {
    return { emphasis: "Mid back", sideTarget: "Rear delts" };
  }

  if (name.includes("leg press")) {
    return { emphasis: "Quads", sideTarget: "Glutes" };
  }

  if (name.includes("leg curl")) {
    return { emphasis: "Hamstrings", sideTarget: "Calves" };
  }

  if (name.includes("romanian")) {
    return { emphasis: "Hamstrings", sideTarget: "Glutes" };
  }

  if (name.includes("calf")) {
    return { emphasis: "Calves", sideTarget: "Ankles" };
  }

  return {
    emphasis: exercise.muscleGroup ?? "Primary target",
    sideTarget: muscleGroup === "back" ? "Rear delts" : "Secondary target",
  };
}
