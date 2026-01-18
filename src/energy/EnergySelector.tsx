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
