import { View, Text, StyleSheet, Pressable, Image, Dimensions } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Slider from "@react-native-community/slider";
import { StatusBar } from "expo-status-bar";

import { painBodyParts } from "./painBodyParts";

const { width } = Dimensions.get("window");

export default function PainDetails() {
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [painLevel, setPainLevel] = useState(0);

  const togglePart = (id: string) => {
    setSelectedParts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const isSliderDisabled = selectedParts.length === 0;

  // Function to calculate color based on pain level (0-10)
  // 0-3: Greenish, 4-7: Yellow/Orange, 8-10: Red
  const getMeterColor = (level: number) => {
    if (isSliderDisabled) return "#475569";
    const hue = ((10 - level) * 12).toString(10); // 120 is green, 0 is red
    return `hsl(${hue}, 80%, 60%)`;
  };

  const activeMeterColor = getMeterColor(painLevel);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <View style={styles.container}>
        
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.subHeading}>LOG SYMPTOMS</Text>
          <Text style={styles.heading}>Where does it hurt?</Text>
        </View>

        {/* Body part grid */}
        <View style={styles.grid}>
          {painBodyParts.map((part) => {
            const selected = selectedParts.includes(part.id);

            return (
              <Pressable
                key={part.id}
                onPress={() => togglePart(part.id)}
                style={({ pressed }) => [
                  styles.card,
                  pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] }
                ]}
              >
                <View style={[
                    styles.iconCircle, 
                    selected && { backgroundColor: activeMeterColor, borderColor: activeMeterColor }
                ]}>
                  <Image
                    source={part.image}
                    style={[styles.icon, selected && { tintColor: '#fff' }]}
                    resizeMode="contain"
                  />
                </View>
                <Text style={[styles.label, selected && styles.labelSelected]}>
                  {part.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Dynamic Intensity Meter */}
        <View style={[styles.sliderCard, isSliderDisabled && styles.disabledOpacity]}>
          <View style={styles.sliderHeader}>
            <Text style={styles.sliderTitle}>Intensity Meter</Text>
            <View style={[styles.badge, { borderColor: activeMeterColor + '40', backgroundColor: activeMeterColor + '20' }]}>
                <Text style={[styles.sliderValue, { color: activeMeterColor }]}>{painLevel}</Text>
            </View>
          </View>

          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={10}
            step={1}
            value={painLevel}
            disabled={isSliderDisabled}
            onValueChange={setPainLevel}
            minimumTrackTintColor={activeMeterColor} // Bar changes color
            maximumTrackTintColor="#334155"
            thumbTintColor={activeMeterColor} // Thumb changes color
          />
          
          <View style={styles.scaleLabels}>
            <Text style={[styles.scaleText, painLevel <= 3 && { color: activeMeterColor }]}>Low</Text>
            <Text style={[styles.scaleText, painLevel > 3 && painLevel <= 7 && { color: activeMeterColor }]}>Mid</Text>
            <Text style={[styles.scaleText, painLevel > 7 && { color: activeMeterColor }]}>High</Text>
          </View>
        </View>

        {/* Action Button */}
        <Pressable 
            style={[styles.saveButton, isSliderDisabled && styles.saveButtonDisabled]}
            disabled={isSliderDisabled}
        >
            <Text style={styles.saveButtonText}>Save Log</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  subHeading: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 8,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: (width - 68) / 4, 
    marginBottom: 20,
    alignItems: "center",
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 24,
    backgroundColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  icon: {
    width: 32,
    height: 32,
    tintColor: '#94A3B8',
  },
  label: {
    marginTop: 10,
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: '500',
    textAlign: "center",
  },
  labelSelected: {
    color: "#fff",
    fontWeight: "700",
  },
  sliderCard: {
    marginTop: 'auto',
    backgroundColor: '#1E293B',
    padding: 24,
    borderRadius: 32,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  sliderTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: '600',
  },
  sliderValue: {
    fontSize: 18,
    fontWeight: "900",
  },
  slider: {
    width: '100%',
    height: 40,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  scaleText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  disabledOpacity: {
    opacity: 0.3,
  },
  saveButton: {
    backgroundColor: '#fff',
    height: 64,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  saveButtonDisabled: {
    backgroundColor: '#334155',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
});