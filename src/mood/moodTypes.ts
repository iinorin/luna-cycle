import { Ionicons } from "@expo/vector-icons";

export type MoodType = {
  id: string;
  label: string;
  icon: string
  color: string;
};

export const MOODS: MoodType[] = [
  { id: "happy", label: "Happy", icon: "happy-outline", color: "#22c55e" },
  { id: "playful", label: "Playful", icon: "sparkles-outline", color: "#f59e0b" },
  { id: "sexy", label: "Sexy", icon: "heart-outline", color: "#ec4899" },
  { id: "horny", label: "Horny", icon: "heart-circle-outline", color: "#f43f5e" },

  { id: "good", label: "Good", icon: "thumbs-up-outline", color: "#3b82f6" },
  { id: "smug", label: "Smug", icon: "cool-outline", color: "#6366f1" },
  { id: "proud", label: "Proud", icon: "trophy-outline", color: "#a855f7" },
  { id: "silly", label: "Silly", icon: "happy-outline", color: "#10b981" },

  { id: "sad", label: "Sad", icon: "sad-outline", color: "#60a5fa" },
  { id: "angry", label: "Angry", icon: "flame-outline", color: "#ef4444" },

  { id: "bored", label: "Bored", icon: "remove-circle-outline", color: "#94a3b8" },
  { id: "curious", label: "Curious", icon: "eye-outline", color: "#38bdf8" },

  { id: "ashamed", label: "Ashamed", icon: "sad-outline", color: "#64748b" },
  { id: "tormented", label: "Tormented", icon: "alert-circle-outline", color: "#b91c1c" },
  { id: "unsafe", label: "Unsafe", icon: "warning-outline", color: "#dc2626" },
];
