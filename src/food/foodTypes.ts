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
  category: "Iron" | "Magnesium" | "Healthy Fats" | "Fiber" | "Comfort" | "Drinks";
  recommendedPhase: CyclePhase[];
    tip?: string;
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
    category: "Fiber",
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
  },
  {
    id: "7",
    name: "Eggs",
    icon: "🥚",
    benefit: "Protein and healthy fats for hormone production",
    category: "Healthy Fats",
    recommendedPhase: ["follicular", "ovulation", "safe"],
  },
  {
    id: "8",
    name: "Ginger Tea",
    icon: "☕",
    benefit: "Anti-inflammatory to reduce period pain",
    category: "Magnesium",
    recommendedPhase: ["menstrual", "luteal"],
  },
  {
    id: "9",
    name: "Oats",
    icon: "🥣",
    benefit: "High fiber to help liver clear excess estrogen",
    category: "Fiber",
    recommendedPhase: ["ovulation", "follicular"],
  },
  {
    id: "10",
    name: "Sweet Potato",
    icon: "🍠",
    benefit: "Vitamin A for progesterone support",
    category: "Fiber",
    recommendedPhase: ["luteal"],
  },
  {
    id: "11",
    name: "Pumpkin Seeds",
    icon: "🎃",
    benefit: "Zinc and magnesium for mood and cramps",
    category: "Magnesium",
    recommendedPhase: ["luteal", "menstrual"],
  },
  {
    id: "12",
    name: "Golden Waffles",
    icon: "🧇",
    benefit: "Mood-boosting comfort carbs",
    category: "Comfort",
    recommendedPhase: ["luteal", "menstrual"],
    tip: "Top with berries to help with bloating!"
  },
  {
    id: "13",
    name: "Fruit Ice Cream",
    icon: "🍦",
    benefit: "Cooling relief for inflammation",
    category: "Comfort",
    recommendedPhase: ["ovulation", "luteal"],
    tip: "Try dairy-free to avoid extra cramps."
  },
  {
    id: "14",
    name: "Herbal Tea",
    icon: "🍵",
    benefit: "Hydration & muscle relaxation",
    category: "Drinks",
    recommendedPhase: ["menstrual", "luteal", "follicular", "ovulation", "safe"],
  },
  {
    id: "15",
    name: "Berry Smoothie",
    icon: "🥤",
    benefit: "Fiber surge for estrogen detox",
    category: "Drinks",
    recommendedPhase: ["ovulation", "follicular"],
  },
  {
    id: "16",
    name: "Warm Lemon Water",
    icon: "🍋",
    benefit: "Cleanses system & reduces bloating",
    category: "Drinks",
    recommendedPhase: ["menstrual", "safe"],
  }

];

export const phaseFoodLogic: Record<CyclePhase, { title: string; focus: string }> = {
  menstrual: { title: "Rest & Restore", focus: "Iron & Magnesium" },
  follicular: { title: "Energize", focus: "Vitamin E & Zinc" },
  ovulation: { title: "Glow & Flow", focus: "Antioxidants & Fiber" },
  safe: { title: "Maintain Balance", focus: "Clean Protein & Fats" },
  luteal: { title: "Comfort & Mood", focus: "B6 & Slow Carbs" },
};