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

interface EnergySelectorProps {
  value?: EnergyLevel; // The level from storage (if editing)
  onSaveComplete: (level: EnergyLevel) => void; // Tell the Brain we are done
}

export default function EnergySelector({
  value,
  onSaveComplete,
}: EnergySelectorProps) {
  // Set initial state to the stored value or default to 3 (Balanced)
  const [selected, setSelected] = useState<EnergyLevel>(value ?? 3);

  // Sync state if the value prop changes (e.g., when clicking "Edit")
  useEffect(() => {
    if (value !== undefined) {
      setSelected(value);
    }
  }, [value]);

  const currentLevel =
    ENERGY_LEVELS.find((l) => l.level === selected) ?? ENERGY_LEVELS[2];

  const handleSelect = (level: EnergyLevel) => {
    setSelected(level);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSave = async () => {
    try {
      await saveEnergyForToday(selected);
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // ✅ CRITICAL: Instead of router.push, we call the parent callback
      onSaveComplete(selected);
      
    } catch (e) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor="#000" barStyle="light-content" />

      <View style={styles.card}>
        <View style={styles.badge}>
           <Text style={styles.question}>
            Which of these defines you in your best energy levels?
          </Text>
        </View>

        <Text style={styles.title}>Energy Mapping</Text>

        <Image
          source={currentLevel.image}
          style={styles.energyImage}
          resizeMode="contain"
        />

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
                  transform: [
                    { scale: selected === item.level ? 1.15 : 1 },
                  ],
                },
              ]}
            />
          ))}
        </View>

        <Text style={[styles.status, { color: currentLevel.color }]}>
          {currentLevel.label}
        </Text>

        <TouchableOpacity
          style={[
            styles.saveBtn,
            // Disable only if the current selection matches what's already in storage
            selected === value && { opacity: 0.5 },
          ]}
          disabled={selected === value}
          onPress={handleSave}
        >
          <Text style={styles.saveText}>Save Daily Energy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "90%",
    backgroundColor: "#fff", // Matches your premium white-on-black theme
    borderRadius: 35,
    padding: 24,
    alignItems: "center",
  },
  badge: {
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 20,
    marginBottom: 20,
    width: '100%',
  },
  question: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 14,
  },
  title: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 16,
    color: "#64748b",
    textTransform: 'uppercase',
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
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 24,
  },
  saveBtn: {
    backgroundColor: "#000",
    width: "100%",
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});