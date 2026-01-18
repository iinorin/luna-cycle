export type EnergyLevel = 1 | 2 | 3 | 4 | 5;

export const ENERGY_LEVELS = [
  {
    level: 1,
    label: "Exhausted",
    fillPercent: 20,
    color: "#ef4444",
    image: require("@/assets/energy/energy-1.png"),
  },
  {
    level: 2,
    label: "Low",
    fillPercent: 40,
    color: "#f97316",
    image: require("@/assets/energy/energy-2.png"),
  },
  {
    level: 3,
    label: "Balanced",
    fillPercent: 60,
    color: "#eab308",
    image: require("@/assets/energy/energy-3.png"),
  },
  {
    level: 4,
    label: "High",
    fillPercent: 80,
    color: "#84cc16",
    image: require("@/assets/energy/energy-4.png"),
  },
  {
    level: 5,
    label: "Energized",
    fillPercent: 100,
    color: "#22c55e",
    image: require("@/assets/energy/energy-5.png"),
  },
] as const;
