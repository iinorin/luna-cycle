import { foodSuggestions, CyclePhase } from "./foodTypes";

export const getFoodsForPhase = (phase: CyclePhase) => {
  return foodSuggestions.filter((food) => 
    food.recommendedPhase.includes(phase)
  );
};