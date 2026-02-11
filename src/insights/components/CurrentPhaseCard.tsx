import React from "react";
import { View, Text } from "react-native";
import styles from "./styles";

interface CurrentPhaseProps {
  phaseKey: "menstrual" | "follicular" | "ovulation" | "safe" | "luteal";
}

type PhaseKey = CurrentPhaseProps["phaseKey"];

const PHASE_CONTENT: Record<
  PhaseKey,
  { title: string; advice: string }
> = {
  menstrual: {
    title: "🌸 Menstrual Phase",
    advice: "Focus on rest and recharge. Your body is doing hard work right now! ✨",
  },
  follicular: {
    title: "🌱 Follicular Phase",
    advice: "Energy is rising. A great time to start new projects or get active! 🚀",
  },
  ovulation: {
    title: "🔥 Ovulation Phase",
    advice: "You're at peak confidence and social energy. You're glowing! 🌟",
  },
  safe: {
    title: "🛡️ Safe Phase",
    advice: "Feeling calm and balanced. A perfect time for steady routines. 🧘",
  },
  luteal: {
    title: "🌙 Luteal Phase",
    advice: "Things might feel slower. Practice self-care and be kind to yourself. ☁️",
  },
};

const CurrentPhaseCard: React.FC<CurrentPhaseProps> = ({ phaseKey }) => {
  const content = PHASE_CONTENT[phaseKey];

  return (
    <View style={[styles.card, styles.glassCard]}>
      <Text style={styles.cardTitle}>💫 Current Phase</Text>
      <Text style={[styles.phaseText, { marginBottom: 4 }]}>
        {content.title}
      </Text>
      <Text style={styles.meta}>{content.advice}</Text>
    </View>
  );
};

export default React.memo(CurrentPhaseCard);
