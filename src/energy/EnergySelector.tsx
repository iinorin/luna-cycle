import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ENERGY_LEVELS, EnergyLevel } from "./energyTypes";
import { saveEnergyForToday } from "./energyStorage";

export default function EnergySelector({ value, onChange }: { value?: EnergyLevel; onChange: (level: EnergyLevel) => void }) {
  const [selected, setSelected] = useState<EnergyLevel>(3);

  const handleSave = async () => {
    await saveEnergyForToday(selected);
    alert("Energy level saved! ✨");
  };

  const currentLevel = ENERGY_LEVELS[selected - 1];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Energy Mapping</Text>

      {/* 1. Body Visualizer Section */}
      <View style={styles.bodyContainer}>
        <Ionicons name="person-outline" size={180} color="rgba(255,255,255,0.1)" />
        {/* Fill Layer */}
        <View 
          style={[
            styles.bodyFill, 
            { 
              height: `${currentLevel.fillPercent}%`, 
              backgroundColor: currentLevel.color 
            }
          ]} 
        />
      </View>

      {/* 2. Percentage and Labels Row */}
      <View style={styles.statsRow}>
        {ENERGY_LEVELS.map((item) => (
          <View key={item.level} style={styles.statItem}>
            <Text style={[styles.percentText, { color: selected === item.level ? item.color : '#64748b' }]}>
              {item.fillPercent}%
            </Text>
          </View>
        ))}
      </View>

      {/* 3. Color Selectable Buttons */}
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
                borderColor: '#fff',
                transform: [{ scale: selected === item.level ? 1.1 : 1 }]
              }
            ]}
          />
        ))}
      </View>

      <Text style={[styles.statusLabel, { color: currentLevel.color }]}>
        {currentLevel.label}
      </Text>

      {/* 4. Save Button */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Save Daily Energy</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    marginVertical: 10,
  },
  title: { color: "#d8b4fe", fontSize: 12, fontWeight: "900", textTransform: 'uppercase', marginBottom: 20 },
  bodyContainer: {
    height: 200,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 20,
  },
  bodyFill: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    opacity: 0.4,
    borderRadius: 50,
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statItem: { width: '18%', alignItems: 'center' },
  percentText: { fontSize: 10, fontWeight: '800' },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  colorButton: {
    width: 45,
    height: 45,
    borderRadius: 12,
  },
  statusLabel: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  saveBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  saveText: { color: '#fff', fontWeight: 'bold' }
});