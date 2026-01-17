import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
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

  /**
   * 🔁 Keep local state in sync with parent
   * (important for editing history / insights)
   */
  useEffect(() => {
    setSelected(value);
  }, [value]);

  /**
   * 🛡️ Safe lookup
   */
  const currentLevel =
    ENERGY_LEVELS.find((l) => l.level === selected) ?? ENERGY_LEVELS[2];

  const handleSave = async () => {
    await saveEnergyForToday(selected);
    onChange?.(selected);
    alert("Energy level saved! ✨");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Energy Mapping</Text>

      {/* 🧍 ENERGY BODY IMAGE */}
      <View style={styles.imageWrapper}>
        <Image
          source={currentLevel.image}
          style={styles.energyImage}
          resizeMode="contain"
        />
      </View>

      {/* 📊 PERCENTAGE ROW */}
      <View style={styles.statsRow}>
        {ENERGY_LEVELS.map((item) => (
          <View key={item.level} style={styles.statItem}>
            <Text
              style={[
                styles.percentText,
                { color: selected === item.level ? item.color : "#64748b" },
              ]}
            >
              {item.fillPercent}%
            </Text>
          </View>
        ))}
      </View>

      {/* 🎨 ENERGY LEVEL BUTTONS */}
      <View style={styles.buttonRow}>
        {ENERGY_LEVELS.map((item) => (
          <TouchableOpacity
            key={item.level}
            onPress={() => setSelected(item.level)}
            style={[
              styles.colorButton,
              {
                backgroundColor: item.color,
                borderWidth: selected === item.level ? 3 : 0,
                borderColor: "#fff",
                transform: [{ scale: selected === item.level ? 1.1 : 1 }],
              },
            ]}
            activeOpacity={0.85}
          />
        ))}
      </View>

      {/* 🏷️ STATUS LABEL */}
      <Text style={[styles.statusLabel, { color: currentLevel.color }]}>
        {currentLevel.label}
      </Text>

      {/* 💾 SAVE */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Save Daily Energy</Text>
      </TouchableOpacity>
    </View>
  );
}

