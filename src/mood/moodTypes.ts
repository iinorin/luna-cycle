import { Ionicons } from "@expo/vector-icons";

/** ✅ Icon name type derived directly from Ionicons */
export type IoniconName = keyof typeof Ionicons.glyphMap;

export type MoodType = {
  id: string;
  label: string;
  icon: IoniconName;
  color: string;
};

export const MOODS: MoodType[] = [
  // POSITIVE & HIGH ENERGY
  { id: "happy", label: "Happy", icon: "sunny-outline", color: "#4ADE80" }, 
  { id: "playful", label: "Playful", icon: "sparkles-outline", color: "#FBBF24" }, 
  { id: "sexy", label: "Sexy", icon: "heart-outline", color: "#FB7185" }, 
  { id: "horny", label: "Spicy", icon: "flame-outline", color: "#F472B6" }, 

  // CONFIDENT & CHILL
  { id: "good", label: "Good", icon: "checkmark-circle-outline", color: "#38BDF8" }, 
  { id: "smug", label: "Smug", icon: "glasses-outline", color: "#A78BFA" }, 
  { id: "proud", label: "Proud", icon: "ribbon-outline", color: "#2DD4BF" }, 
  { id: "silly", label: "Silly", icon: "happy-outline", color: "#FCD34D" }, 

  // LOW ENERGY / NEGATIVE
  { id: "sad", label: "Sad", icon: "rainy-outline", color: "#60A5FA" }, 
  { id: "angry", label: "Angry", icon: "thunderstorm-outline", color: "#EF4444" }, 

  // VULNERABLE
  { id: "ashamed", label: "Down", icon: "cloud-outline", color: "#94A3B8" }, 
  { id: "tormented", label: "Stressed", icon: "pulse-outline", color: "#FB923C" }, 
  { id: "unsafe", label: "Unsafe", icon: "shield-outline", color: "#F87171" }, 

  // NEUTRAL / OTHERS
  { id: "bored", label: "Bored", icon: "ellipse-outline", color: "#64748B" }, 
  { id: "curious", label: "Curious", icon: "help-circle-outline", color: "#22D3EE" }, 
];