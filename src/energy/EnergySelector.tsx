import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
} from "react-native";
import * as Haptics from "expo-haptics";
import { ENERGY_LEVELS, EnergyLevel } from "./energyTypes";
import { saveEnergyForToday } from "./energyStorage";

export default function EnergySelector({
  value = 3,
  onChange,
}: {
  value?: EnergyLevel;
  onChange?: (level: EnergyLevel) => void;
}) {
  const [selected, setSelected] = useState<EnergyLevel>(value);

  useEffect(() => {
    setSelected(value);
  }, [value]);

  const currentLevel =
    ENERGY_LEVELS.find((l) => l.level === selected) ?? ENERGY_LEVELS[2];

  const handleSelect = (level: EnergyLevel) => {
    setSelected(level);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSave = async () => {
    await saveEnergyForToday(selected);
    onChange?.(selected);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // Replaced alert with console log or custom logic; usually better to use a Toast
    console.log("Saved energy level:", selected);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* COOL HEADING SECTION */}
        <View style={styles.headerBadge}>
          <Text style={styles.headerQuestion}>
            Which of these defines you in your best energy levels?
          </Text>
        </View>

        <Text style={styles.title}>Energy Mapping</Text>

        {/* ENERGY BODY IMAGE */}
        <View style={styles.imageWrapper}>
          <Image
            source={currentLevel.image}
            style={styles.energyImage}
            resizeMode="contain"
          />
        </View>

        {/* PERCENTAGE ROW */}
        <View style={styles.statsRow}>
          {ENERGY_LEVELS.map((item) => (
            <View key={item.level} style={styles.statItem}>
              <Text
                style={[
                  styles.percentText,
                  { color: selected === item.level ? item.color : "#475569" },
                ]}
              >
                {item.fillPercent}%
              </Text>
            </View>
          ))}
        </View>

        {/* ENERGY LEVEL BUTTONS */}
        <View style={styles.buttonRow}>
          {ENERGY_LEVELS.map((item) => (
            <TouchableOpacity
              key={item.level}
              onPress={() => handleSelect(item.level)}
              accessibilityLabel={`Energy level ${item.fillPercent} percent`}
              accessibilityRole="button"
              activeOpacity={0.85}
              style={[
                styles.colorButton,
                {
                  backgroundColor: item.color,
                  borderWidth: selected === item.level ? 3 : 0,
                  borderColor: "#000", // Darker border for the black theme
                  transform: [{ scale: selected === item.level ? 1.15 : 1 }],
                },
              ]}
            />
          ))}
        </View>

        {/* STATUS LABEL */}
        <Text style={[styles.statusLabel, { color: currentLevel.color }]}>
          {currentLevel.label}
        </Text>

        {/* SAVE */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>Save Daily Energy</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    marginTop: 40, 
    backgroundColor: "#f8fafc", 
    borderRadius: 32,
    padding: 24,
    alignItems: "center",
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  headerBadge: {
    backgroundColor: "#000", // Black background as requested
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 20,
    marginBottom: 25,
    width: '100%',
  },
  headerQuestion: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 22,
  },
  title: {
    color: "#000",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    marginBottom: 20,
    letterSpacing: 2,
  },
  imageWrapper: {
    height: 240,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  energyImage: {
    height: 240,
    width: 110,
  },
  statsRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statItem: {
    width: "18%",
    alignItems: "center",
  },
  percentText: {
    fontSize: 11,
    fontWeight: "900",
  },
  buttonRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  colorButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
  },
  statusLabel: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 25,
  },
  saveBtn: {
    backgroundColor: "#000", // Button changed to black
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});