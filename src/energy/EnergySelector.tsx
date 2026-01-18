import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
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
    console.log("Saved energy level:", selected);
  };

  return (
    <View style={styles.root}>
      {/* STATUS BAR */}
      <StatusBar backgroundColor="#0f0e0e" barStyle="light-content" />

      <View style={styles.card}>
        <Text style={styles.question}>
          Which of these defines you in your best energy levels?
        </Text>

        <Text style={styles.title}>Energy Mapping</Text>

        {/* IMAGE */}
        <Image
          source={currentLevel.image}
          style={styles.energyImage}
          resizeMode="contain"
        />

        {/* PERCENTAGES */}
        <View style={styles.statsRow}>
          {ENERGY_LEVELS.map((item) => (
            <Text
              key={item.level}
              style={[
                styles.percentText,
                { color: selected === item.level ? item.color : "#64748b" },
              ]}
            >
              {item.fillPercent}%
            </Text>
          ))}
        </View>

        {/* BUTTONS */}
        <View style={styles.buttonRow}>
          {ENERGY_LEVELS.map((item) => (
            <TouchableOpacity
              key={item.level}
              onPress={() => handleSelect(item.level)}
              style={[
                styles.colorButton,
                {
                  backgroundColor: item.color,
                  borderWidth: selected === item.level ? 3 : 0,
                  transform: [{ scale: selected === item.level ? 1.1 : 1 }],
                },
              ]}
            />
          ))}
        </View>

        {/* LABEL */}
        <Text style={[styles.status, { color: currentLevel.color }]}>
          {currentLevel.label}
        </Text>

        {/* SAVE */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>Save Daily Energy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0f0e0e",
    justifyContent: "center",
  },

  card: {
    backgroundColor: "#f8fafc",
    marginHorizontal: 20,
    borderRadius: 32,
    padding: 24,
    alignItems: "center",
  },

  question: {
    backgroundColor: "#000",
    color: "#fff",
    padding: 16,
    borderRadius: 20,
    textAlign: "center",
    fontWeight: "700",
    marginBottom: 20,
  },

  title: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 16,
  },

  energyImage: {
    height: 220,
    width: 120,
    marginBottom: 20,
  },

  statsRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  percentText: {
    fontSize: 12,
    fontWeight: "900",
  },

  buttonRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  colorButton: {
    width: 46,
    height: 46,
    borderRadius: 14,
    borderColor: "#000",
  },

  status: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 24,
  },

  saveBtn: {
    backgroundColor: "#000",
    width: "100%",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
  },

  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
