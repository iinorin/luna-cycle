export type CyclePhase = "menstrual" | "follicular" | "ovulation" | "safe" | "luteal";

export interface FoodItem {
  id: string;
  name: string;
  icon: string;
  benefit: string;
  category: "Iron" | "Magnesium" | "Healthy Fats" | "Fiber" | "Comfort" | "Drinks";
  recommendedPhase: CyclePhase[];
  tip: string; // Now mandatory for all
}

export const foodSuggestions: FoodItem[] = [
  { id: "1", name: "Dark Chocolate", icon: "🍫", benefit: "Magnesium for muscle relaxation", category: "Magnesium", recommendedPhase: ["menstrual", "luteal"], tip: "Choose 70% cocoa or higher for the best results." },
  { id: "2", name: "Red Meat / Lentils", icon: "🥩", benefit: "Replenish iron lost during flow", category: "Iron", recommendedPhase: ["menstrual"], tip: "Pair with Vitamin C (like lemon) to absorb more iron!" },
  { id: "3", name: "Salmon / Walnuts", icon: "🐟", benefit: "Omega-3s for hormone support", category: "Healthy Fats", recommendedPhase: ["follicular", "ovulation"], tip: "Great for reducing inflammation before your period starts." },
  { id: "4", name: "Berries", icon: "🫐", benefit: "Antioxidants for egg health", category: "Fiber", recommendedPhase: ["ovulation", "safe"], tip: "Blueberries are great for brain fog today." },
  { id: "5", name: "Avocado", icon: "🥑", benefit: "Fats for progesterone support", category: "Healthy Fats", recommendedPhase: ["luteal", "safe"], tip: "Helps keep you full and reduces sugar cravings." },
  { id: "6", name: "Brown Rice", icon: "🌾", benefit: "B-Vitamins for steady energy", category: "Fiber", recommendedPhase: ["luteal", "follicular"], tip: "Complex carbs help keep your mood stable." },
  { id: "7", name: "Eggs", icon: "🥚", benefit: "Protein for hormone production", category: "Healthy Fats", recommendedPhase: ["follicular", "ovulation", "safe"], tip: "Don't skip the yolk; that's where the Vitamin D is!" },
  { id: "8", name: "Ginger Tea", icon: "☕", benefit: "Reduces period pain & nausea", category: "Magnesium", recommendedPhase: ["menstrual", "luteal"], tip: "Drink it warm to help soothe uterine contractions." },
  { id: "9", name: "Oats", icon: "🥣", benefit: "Fiber to clear excess estrogen", category: "Fiber", recommendedPhase: ["ovulation", "follicular"], tip: "Add a pinch of cinnamon to help balance blood sugar." },
  { id: "10", name: "Sweet Potato", icon: "🍠", benefit: "Vitamin A for hormone support", category: "Fiber", recommendedPhase: ["luteal"], tip: "A great natural way to satisfy a sweet craving." },
  { id: "11", name: "Pumpkin Seeds", icon: "🎃", benefit: "Zinc for mood and skin", category: "Magnesium", recommendedPhase: ["luteal", "menstrual"], tip: "A handful a day can help reduce hormonal acne." },
  { id: "12", name: "Golden Waffles", icon: "🧇", benefit: "Mood-boosting comfort carbs", category: "Comfort", recommendedPhase: ["luteal", "menstrual"], tip: "Top with berries to help with bloating!" },
  { id: "13", name: "Fruit Ice Cream", icon: "🍦", benefit: "Cooling relief for inflammation", category: "Comfort", recommendedPhase: ["ovulation", "luteal"], tip: "Try dairy-free to avoid extra cramps." },
  { id: "14", name: "Herbal Tea", icon: "🍵", benefit: "Hydration & muscle relaxation", category: "Drinks", recommendedPhase: ["menstrual", "luteal", "follicular", "ovulation", "safe"], tip: "Peppermint tea is amazing for period bloating." },
  { id: "15", name: "Berry Smoothie", icon: "🥤", benefit: "Fiber surge for estrogen detox", category: "Drinks", recommendedPhase: ["ovulation", "follicular"], tip: "Add spinach; you won't taste it but your body will love the iron." },
  { id: "16", name: "Warm Lemon Water", icon: "🍋", benefit: "Cleanses system & reduces bloating", category: "Drinks", recommendedPhase: ["menstrual", "safe"], tip: "Drink this first thing in the morning for best results." },
  { id: "17", name: "Cheesy Pizza", icon: "🍕", benefit: "Satisfies high-calorie luteal needs", category: "Comfort", recommendedPhase: ["luteal", "menstrual"], tip: "Opt for veggies toppings to reduce bloating." },
  { id: "18", name: "Juicy Burger", icon: "🍔", benefit: "Iron & protein boost for flow days", category: "Comfort", recommendedPhase: ["menstrual", "follicular"], tip: "A lettuce wrap can help if you're feeling sluggish." },
  { id: "19", name: "Spicy Noodles", icon: "🍜", benefit: "Instant mood lift & warmth", category: "Comfort", recommendedPhase: ["menstrual", "luteal"], tip: "Watch the salt levels to prevent water retention!" },
  { id: "20", name: "Crunchy Chips", icon: "🍿", benefit: "Quick salt fix", category: "Comfort", recommendedPhase: ["luteal", "menstrual"], tip: "Drink extra water to help flush the excess sodium." }
];

export const phaseFoodLogic: Record<CyclePhase, { title: string; focus: string }> = {
  menstrual: { title: "Rest & Restore", focus: "Iron & Magnesium" },
  follicular: { title: "Energize", focus: "Vitamin E & Zinc" },
  ovulation: { title: "Glow & Flow", focus: "Antioxidants & Fiber" },
  safe: { title: "Maintain Balance", focus: "Clean Protein & Fats" },
  luteal: { title: "Comfort & Mood", focus: "B6 & Slow Carbs" },
};