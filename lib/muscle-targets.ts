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
  adductors: ["adductors-left", "adductors-right"],
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
  forearms: ["forearm-left", "forearm-right"],
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

function nameHasAny(name: string, terms: string[]): boolean {
  return terms.some((term) => name.includes(term));
}

export function getMuscleTargetsForExercise(exercise: Exercise): MuscleTargets {
  const name = exercise.name.toLowerCase();
  const muscleGroup = exercise.muscleGroup?.toLowerCase();

  if (
    nameHasAny(name, ["incline dumbbell press", "incline db press"]) ||
    (name.includes("incline") && name.includes("press"))
  ) {
    return targets("FRONT", ids.chestUpper, [...ids.frontDelts, ...ids.triceps]);
  }

  if (
    nameHasAny(name, ["flat dumbbell press", "flat db press"]) ||
    (name.includes("dumbbell press") && !name.includes("shoulder")) ||
    (name.includes("db press") && !name.includes("shoulder"))
  ) {
    return targets(
      "FRONT",
      [...ids.chestUpper, ...ids.chestLower],
      [...ids.frontDelts, ...ids.triceps],
    );
  }

  if (nameHasAny(name, ["chest fly", "chest flies", "pec deck", "machine fly"])) {
    return targets(
      "FRONT",
      [...ids.chestUpper, ...ids.chestLower],
      ids.frontDelts,
    );
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

  if (nameHasAny(name, ["rear delt fly", "rear delt flies", "reverse fly"])) {
    return targets("BACK", ids.rearDelts, [...ids.midBack, ...ids.traps]);
  }

  if (
    name.includes("shoulder press") ||
    name.includes("seated shoulder") ||
    (name.includes("db press") && name.includes("75"))
  ) {
    return targets("FRONT", ids.frontDelts, [...ids.sideDelts, ...ids.triceps]);
  }

  if (
    name.includes("pushdown") ||
    name.includes("push down") ||
    name.includes("katana")
  ) {
    return targets("BACK", ids.triceps, ids.frontDelts);
  }

  if (name.includes("pullup") || name.includes("pull-up")) {
    return targets("BACK", ids.lats, [...ids.biceps, ...ids.midBack]);
  }

  if (name.includes("pulldown") || name.includes("pull down")) {
    return targets("BACK", ids.lats, [...ids.biceps, ...ids.midBack]);
  }

  if (name.includes("row")) {
    return targets(
      "BACK",
      name.includes("neutral") || name.includes("unilateral")
        ? ids.lats
        : [...ids.midBack, ...ids.lats],
      [...ids.midBack, ...ids.rearDelts, ...ids.biceps],
    );
  }

  if (name.includes("hammer curl")) {
    return targets("FRONT", ids.forearms, ids.biceps);
  }

  if (name.includes("curl")) {
    return targets("FRONT", ids.biceps, ids.forearms);
  }

  if (name.includes("leg press")) {
    return targets("FRONT", ids.quads, ids.glutes);
  }

  if (name.includes("leg extension")) {
    return targets("FRONT", ids.quads);
  }

  if (name.includes("leg curl")) {
    return targets("BACK", ids.hamstrings, ids.calves);
  }

  if (name.includes("hack squat")) {
    return targets("FRONT", ids.quads, [...ids.glutes, ...ids.adductors]);
  }

  if (name.includes("bulgarian")) {
    if (name.includes("far") || name.includes("long")) {
      return targets("BACK", ids.glutes, [...ids.quads, ...ids.adductors]);
    }

    return targets("FRONT", ids.quads, [...ids.glutes, ...ids.adductors]);
  }

  if (name.includes("squat")) {
    return targets("FRONT", ids.quads, [...ids.glutes, ...ids.adductors]);
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

  if (
    nameHasAny(name, ["incline dumbbell press", "incline db press"]) ||
    (name.includes("incline") && name.includes("press"))
  ) {
    return { emphasis: "Upper chest", sideTarget: "Front delts" };
  }

  if (
    nameHasAny(name, ["flat dumbbell press", "flat db press"]) ||
    (name.includes("dumbbell press") && !name.includes("shoulder")) ||
    (name.includes("db press") && !name.includes("shoulder"))
  ) {
    return { emphasis: "Chest", sideTarget: "Front delts" };
  }

  if (nameHasAny(name, ["chest fly", "chest flies", "pec deck", "machine fly"])) {
    return { emphasis: "Chest", sideTarget: "Front delts" };
  }

  if (name.includes("chest press")) {
    return { emphasis: "Chest", sideTarget: "Triceps" };
  }

  if (name.includes("lateral raise")) {
    return { emphasis: "Side delts", sideTarget: "Front delts" };
  }

  if (nameHasAny(name, ["rear delt fly", "rear delt flies", "reverse fly"])) {
    return { emphasis: "Rear delts", sideTarget: "Mid back" };
  }

  if (
    name.includes("shoulder press") ||
    name.includes("seated shoulder") ||
    (name.includes("db press") && name.includes("75"))
  ) {
    return { emphasis: "Front delts", sideTarget: "Triceps" };
  }

  if (name.includes("katana")) {
    return { emphasis: "Triceps long head", sideTarget: "Front delts" };
  }

  if (name.includes("pushdown") || name.includes("push down")) {
    return { emphasis: "Triceps", sideTarget: "Front delts" };
  }

  if (name.includes("pullup") || name.includes("pull-up")) {
    return { emphasis: "Lats", sideTarget: "Biceps" };
  }

  if (name.includes("pulldown") || name.includes("pull down")) {
    return { emphasis: "Lats", sideTarget: "Biceps" };
  }

  if (name.includes("row")) {
    return name.includes("neutral") || name.includes("unilateral")
      ? { emphasis: "Lats", sideTarget: "Mid back" }
      : { emphasis: "Mid back", sideTarget: "Rear delts" };
  }

  if (name.includes("hammer curl")) {
    return { emphasis: "Brachialis", sideTarget: "Forearms" };
  }

  if (name.includes("curl")) {
    return { emphasis: "Biceps", sideTarget: "Forearms" };
  }

  if (name.includes("leg press")) {
    return { emphasis: "Quads", sideTarget: "Glutes" };
  }

  if (name.includes("leg extension")) {
    return { emphasis: "Quads", sideTarget: "Knee extension" };
  }

  if (name.includes("leg curl")) {
    return { emphasis: "Hamstrings", sideTarget: "Calves" };
  }

  if (name.includes("hack squat")) {
    return { emphasis: "Quads", sideTarget: "Glutes" };
  }

  if (name.includes("bulgarian")) {
    if (name.includes("far") || name.includes("long")) {
      return { emphasis: "Glutes", sideTarget: "Quads" };
    }

    return { emphasis: "Quads", sideTarget: "Glutes" };
  }

  if (name.includes("squat")) {
    return { emphasis: "Quads", sideTarget: "Glutes" };
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
