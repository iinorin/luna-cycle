import { View } from "react-native";
import { useState } from "react";
import PainTypeGrid from "./PainTypeGrid";
import PainLevelBar from "./PainLevelBar";
import { PainType } from "./painTypes";

export default function PainScreen() {
  const [hasPain, setHasPain] = useState(true);
  const [selectedPain, setSelectedPain] = useState<PainType | null>(null);
  const [level, setLevel] = useState(0);

  return (
    <View>
      {hasPain && (
        <>
          {/* BODY PART / PAIN TYPE */}
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
