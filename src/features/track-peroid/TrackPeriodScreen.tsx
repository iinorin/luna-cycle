import { useState } from "react";
import { View, StyleSheet } from "react-native";
import StepLastPeriod from "./steps/StepLastPeriod";
import StepCycleLength from "./steps/StepCycleLength";
import StepDone from "./steps/StepDone";

export default function TrackPeriodScreen() {
  const [step, setStep] = useState(1);
  const [lastPeriodDate, setLastPeriodDate] = useState<Date>(
    new Date()
  );
  const [cycleLength, setCycleLength] = useState(28);

  return (
    <View style={styles.container}>
      {step === 1 && (
        <StepLastPeriod
          date={lastPeriodDate}
          onChange={setLastPeriodDate}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <StepCycleLength
          value={cycleLength}
          onChange={setCycleLength}
          onNext={() => setStep(3)}
        />
      )}

      {step === 3 && <StepDone />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    padding: 20,
  },
});
