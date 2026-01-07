import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Slider from "@react-native-community/slider";

import { painBodyParts } from "./painBodyParts";

export default function PainDetails() {
  // STEP 1: multiple selection
  const [selectedParts, setSelectedParts] = useState<string[]>([]);

  // STEP 2: pain level
  const [painLevel, setPainLevel] = useState(0);

  const togglePart = (id: string) => {
    setSelectedParts((prev) =>
      prev.includes(id)
        ? prev.filter((p) => p !== id)
        : [...prev, id]
    );
  };

  const isSliderDisabled = selectedParts.length === 0;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <Text style={styles.heading}>Where does it hurt?</Text>

        {/* Body part grid */}
        <View style={styles.grid}>
          {painBodyParts.map((part) => {
            const selected = selectedParts.includes(part.id);

            return (
              <Pressable
                key={part.id}
                onPress={() => togglePart(part.id)}
                style={[
                  styles.card,
                  selected && styles.cardSelected,
                ]}
              >
                <Image
                  source={part.image}
                  style={[
                    styles.icon,
                    selected && styles.iconSelected,
                  ]}
                  resizeMode="contain"
                />
                <Text
                  style={[
                    styles.label,
                    selected && styles.labelSelected,
                  ]}
                >
                  {part.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Pain level slider */}
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderTitle}>
            Pain level:{" "}
            <Text style={styles.sliderValue}>{painLevel}</Text>
          </Text>

          <Slider
            minimumValue={0}
            maximumValue={10}
            step={1}
            value={painLevel}
            disabled={isSliderDisabled}
            onValueChange={setPainLevel}
            minimumTrackTintColor={
              isSliderDisabled ? "#444" : "#ff6b9f"
            }
            maximumTrackTintColor="#333"
            thumbTintColor={
              isSliderDisabled ? "#555" : "#ff6b9f"
            }
          />

          {isSliderDisabled && (
            <Text style={styles.sliderHint}>
              Select at least one body part
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24, // fixes “escaping from top”
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "22%",
    aspectRatio: 1,
    borderRadius: 20,
    backgroundColor: "#121826",
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cardSelected: {
    backgroundColor: "#1e2a44",
    shadowColor: "#ff6b9f",
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 6,
  },
  icon: {
    width: 36,
    height: 36,
    opacity: 0.85,
  },
  iconSelected: {
    opacity: 1,
  },
  label: {
    marginTop: 6,
    fontSize: 12,
    color: "#aaa",
    textAlign: "center",
  },
  labelSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  sliderContainer: {
    marginTop: 28,
  },
  sliderTitle: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 8,
  },
  sliderValue: {
    color: "#ff6b9f",
    fontWeight: "700",
  },
  sliderHint: {
    marginTop: 6,
    fontSize: 12,
    color: "#777",
  },
});
