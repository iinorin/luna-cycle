export type EnergyLevel = 1 | 2 | 3 | 4 | 5;

export const ENERGY_LEVELS = [
  {
    level: 1,
    label: "Exhausted",
    image: require("@/assets/energy/energy-1.png"),
    color: "#ef4444",
  },
  {
    level: 2,
    label: "Low",
    image: require("@/assets/energy/energy-2.png"),
    color: "#f97316",
  },
  {
    level: 3,
    label: "Balanced",
    image: require("@/assets/energy/energy-3.png"),
    color: "#facc15",
  },
  {
    level: 4,
    label: "High",
    image: require("@/assets/energy/energy-4.png"),
    color: "#4ade80",
  },
  {
    level: 5,
    label: "Energized",
    image: require("@/assets/energy/energy-5.png"),
    color: "#16a34a",
  },
] as const;
