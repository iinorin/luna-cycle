import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import EnergySelector from "./EnergySelector";
import EnergySuccess from "./EnergySuccess";
import { loadTodayEnergy } from "./energyStorage";
import { EnergyLevel } from "./energyTypes";

export default function EnergyController() {
  const [loading, setLoading] = useState(true);
  const [hasEntry, setHasEntry] = useState(false);
  const [level, setLevel] = useState<EnergyLevel>(3);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    checkStorage();
  }, []);

  const checkStorage = async () => {
    const entry = await loadTodayEnergy();
    if (entry?.level) {
      setLevel(entry.level as EnergyLevel);
      setHasEntry(true);
    } else {
      setHasEntry(false);
    }
    setLoading(false);
  };

  const handleSaveDone = (newLevel: EnergyLevel) => {
    setLevel(newLevel);
    setHasEntry(true);
    setIsEditing(false); // Lock the screen again
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#000", justifyContent: "center" }}>
        <ActivityIndicator color="#fff" size="large" />
      </View>
    );
  }

  // If we haven't logged today, or we clicked 'Edit', show Selector
  if (!hasEntry || isEditing) {
    return (
      <EnergySelector 
        value={level} 
        onSaveComplete={handleSaveDone} 
      />
    );
  }

  // Otherwise, show the Success screen
  return (
    <EnergySuccess 
      level={level} 
      onEdit={() => setIsEditing(true)} 
    />
  );
}