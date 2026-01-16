import { View } from "react-native";
import { useState } from "react";
import { EnergySelector } from "@/src/energy/EnergySelector";
import { EnergyLevel } from "@/src/energy/energyTypes";

export default function EnergyBarScreen() {
  const [energy, setEnergy] = useState<EnergyLevel>();

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <EnergySelector value={energy} onChange={setEnergy} />
    </View>
  );
}
