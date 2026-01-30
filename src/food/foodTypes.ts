export type CyclePhase =
  | "menstrual"
  | "follicular"
  | "ovulation"
  | "safe"
  | "luteal";

export interface FoodItem {
  id: string;
  name: string;
  icon: string;
  benefit: string;
  category: "Iron" | "Magnesium" | "Healthy Fats" | "Fiber" | "Antioxidants";
  recommendedPhase: CyclePhase[];
}

export const foodSuggestions: FoodItem[] = [
  {
    id: "1",
    name: "Dark Chocolate",
    icon: "🍫",
    benefit: "Magnesium to relax uterine muscles",
    category: "Magnesium",
    recommendedPhase: ["menstrual", "luteal"],
  },
  {
    id: "2",
    name: "Red Meat / Lentils",
    icon: "🥩",
    benefit: "Replenish iron lost during flow",
    category: "Iron",
    recommendedPhase: ["menstrual"],
  },
  {
    id: "3",
    name: "Salmon / Walnuts",
    icon: "🐟",
    benefit: "Omega-3s to support rising hormones",
    category: "Healthy Fats",
    recommendedPhase: ["follicular", "ovulation"],
  },
  {
    id: "4",
    name: "Berries",
    icon: "🫐",
    benefit: "Antioxidants for egg health & skin",
    category: "Antioxidants",
    recommendedPhase: ["ovulation", "safe"],
  },
  {
    id: "5",
    name: "Avocado",
    icon: "🥑",
    benefit: "Healthy fats for progesterone support",
    category: "Healthy Fats",
    recommendedPhase: ["luteal", "safe"],
  },
  {
    id: "6",
    name: "Brown Rice",
    icon: "🌾",
    benefit: "B-Vitamins for steady energy",
    category: "Fiber",
    recommendedPhase: ["luteal", "follicular"],
  }
];

export const phaseFoodLogic: Record<CyclePhase, { title: string; focus: string }> = {
  menstrual: { title: "Rest & Restore", focus: "Iron & Magnesium" },
  follicular: { title: "Energize", focus: "Vitamin E & Zinc" },
  ovulation: { title: "Glow & Flow", focus: "Antioxidants & Fiber" },
  safe: { title: "Maintain Balance", focus: "Clean Protein & Fats" },
  luteal: { title: "Comfort & Mood", focus: "B6 & Slow Carbs" },
};