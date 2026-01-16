export type EnergyLevel = 1 | 2 | 3 | 4 | 5;

export const ENERGY_LEVELS: {
  level: EnergyLevel;
  label: string;
  color: string;
  fillPercent: number;
}[] = [
  { level: 1, label: "Exhausted", color: "#e53935", fillPercent: 20 },
  { level: 2, label: "Low",       color: "#fb8c00", fillPercent: 35 },
  { level: 3, label: "Okay",      color: "#fdd835", fillPercent: 55 },
  { level: 4, label: "Good",      color: "#8bc34a", fillPercent: 75 },
  { level: 5, label: "Energetic", color: "#43a047", fillPercent: 100 },
];
