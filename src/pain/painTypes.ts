import {
  HeartPulse,
  Activity,
  Flame,
  Zap,
  Droplet,
  CircleDot,
  Bone,
  Wind,
} from "lucide-react-native";

export const painTypes = [
  { id: "cramps", label: "Cramps", icon: Flame },
  { id: "head", label: "Head", icon: CircleDot },
  { id: "back", label: "Back", icon: Activity },
  { id: "legs", label: "Legs", icon: Bone },
  { id: "breast", label: "Breast", icon: HeartPulse },
  { id: "fatigue", label: "Fatigue", icon: Wind },
  { id: "nausea", label: "Nausea", icon: Droplet },
  { id: "sharp", label: "Sharp", icon: Zap },
];
