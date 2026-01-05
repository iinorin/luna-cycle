import { View, StyleSheet } from "react-native";
import { useState } from "react";

import PainToggle from "./PainToggle";
import PainTypeGrid from "./PainTypeGrid";
import PainLevelBar from "./PainLevelBar";
import { PainType } from "./painTypes";

export default function PainScreen() {
  const [hasPain, setHasPain] = useState<boolean | null>(null);
  const [selectedPain, setSelectedPain] = useState<PainType | null>(null);
  const [level, setLevel] = useState(0);

  return (
    <View style={styles.container}>
      {/* PAIN / NO PAIN TOGGLE */}
      <PainToggle value={hasPain} onChange={setHasPain} />

      {/* NO PAIN STATE */}
      {hasPain === false && (
        <View style={styles.goodCard}>
          {/* You can put happy image / companion here */}
        </View>
      )}

      {/* PAIN FLOW */}
      {hasPain === true && (
        <>
          {/* BODY PART / PAIN TYPE GRID */}
          <PainTypeGrid
            selected={selectedPain}
            onSelect={setSelectedPain}
          />

          {/* PAIN LEVEL */}
          {selectedPain && (
            <PainLevelBar value={level} onChange={setLevel} />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  goodCard: {
    marginTop: 24,
    borderRadius: 16,
    padding: 24,
    backgroundColor: "#E8FFF3",
  },
});
