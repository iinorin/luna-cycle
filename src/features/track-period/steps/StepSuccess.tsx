import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  onGoHome: () => void;
  isOverlay?: boolean;
};

export default function StepSuccess({ onGoHome, isOverlay = false }: Props) {
  return (
    <View style={[styles.container, isOverlay && styles.overlay]}>
      {/* 🎉 SUCCESS HEADER */}
      <Text style={styles.emoji}>💖</Text>
      <Text style={styles.title}>All Set!</Text>
      <Text style={styles.subtitle}>
        Your cycle data has been saved successfully.
      </Text>

      {/* 🧾 INFO CARDS */}
      <View style={styles.cardsWrap}>
        <InfoCard
          title="Cycle Updated"
          description="Your cycle insights will now reflect this data."
        />
        <InfoCard
          title="Smarter Predictions"
          description="We’ll use this to improve period & ovulation tracking."
        />
        <InfoCard
          title="You’re in Control"
          description="You can edit this anytime from the Insights tab."
        />
      </View>

      {/* 🚀 CTA */}
      <Pressable style={styles.button} onPress={onGoHome}>
        <Text style={styles.buttonText}>Go back to Cycle</Text>
      </Pressable>
    </View>
  );
}

/* 🔹 INFO CARD */
function InfoCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardText}>{description}</Text>
    </View>
  );
}

/* 🎨 STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#1E1B4B",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(30, 27, 75, 0.97)",
    zIndex: 999,
  },

  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 6,
  },

  subtitle: {
    color: "#C7D2FE",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 22,
  },

  /* 🧾 CARDS */
  cardsWrap: {
    width: "100%",
    marginBottom: 32,
    gap: 12,
  },

  card: {
    backgroundColor: "#020617",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#312E81",
  },

  cardTitle: {
    color: "#F9A8D4",
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 4,
  },

  cardText: {
    color: "#E5E7EB",
    fontSize: 14,
    lineHeight: 20,
  },

  /* 🚀 BUTTON */
  button: {
    backgroundColor: "#EC4899",
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 18,
    width: "100%",
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "800",
    fontSize: 16,
  },
});
