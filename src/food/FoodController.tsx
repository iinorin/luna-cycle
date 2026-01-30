import React, { useState } from "react";
import FoodMainScreen from "./FoodMainScreen";
import { CyclePhase } from "./foodTypes";

export default function FoodController() {
  // In a real app, this phase would come fromcycle calculation logic
  const [currentPhase, setCurrentPhase] = useState<CyclePhase>("menstrual");

  return <FoodMainScreen phase={currentPhase} />;
}