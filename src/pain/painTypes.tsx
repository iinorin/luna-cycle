import {
  Activity,
  Zap,
  Flame,
  CircleDot,
} from "lucide-react-native";

import type { LucideIcon } from "lucide-react-native";

export type PainType = {
  id: string;
  label: string;
  icon: LucideIcon; // ✅ FIX HERE
};

export const PAIN_TYPES: PainType[] = [
  {
    id: "cramps",
    label: "Cramps",
    icon: Activity,
  },
  {
    id: "sharp",
    label: "Sharp Pain",
    icon: Zap,
  },
  {
    id: "burning",
    label: "Burning",
    icon: Flame,
  },
  {
    id: "spotting",
    label: "Spotting",
    icon: CircleDot,
  },
];
