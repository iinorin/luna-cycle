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
  icon: LucideIcon;
};

export const PAIN_TYPES: PainType[] = [
  {
    id: "cramps",
    label: "Cramps",
    icon: Activity,
  },
  {
    id: "back",
    label: "Back",
    icon: Zap,
  },
  {
    id: "head",
    label: "Head",
    icon: CircleDot,
  },
  {
    id: "joint",
    label: "Joint",
    icon: Flame,
  },
];
