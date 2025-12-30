import { useState } from "react";
import { View, StyleSheet } from "react-native";

import StepLastPeriod from "./steps/StepLastPeriod";
import StepCycleLength from "./steps/StepCycleLength";
import StepPeriodDuration from "./steps/StepPeriodDuration";
import StepRegularity from "./steps/StepRegularity";
import StepSymptoms from "./steps/StepSymptoms";
import StepDone from "./steps/StepDone";

export default function TrackPeriodScreen() {
  const [step, setStep] = useState(1);

  // ✅ Collected data
  const [lastPeriodDate, setLastPeriodDate] = useState<Date>(new Date());
  const [cycleLength, setCycleLength] = useState(28);
  const [periodDuration, setPeriodDuration] = useState(5);
  const [regularity, setRegularity] =
    useState<"regular" | "sometimes" | "irregular">("regular");
  const [symptoms, setSymptoms] = useState<string[]>([]);

  return (
    <View style={styles.container}>
      {/* STEP 1 */}
      {step === 1 && (
        <StepLastPeriod
          date={lastPeriodDate}
          onChange={setLastPeriodDate}
          onNext={() => setStep(2)}
        />
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <StepCycleLength
          value={cycleLength}
          onChange={setCycleLength}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <StepPeriodDuration
          value={periodDuration}
          onChange={setPeriodDuration}
          onNext={() => setStep(4)}
          onBack={() => setStep(2)}
        />
      )}

      {/* STEP 4 */}
      {step === 4 && (
        <StepRegularity
          value={regularity}
          onChange={setRegularity}
          onNext={() => setStep(5)}
          onBack={() => setStep(3)}
        />
      )}

      {/* STEP 5 */}
      {step === 5 && (
        <StepSymptoms
          value={symptoms}
          onChange={setSymptoms}
          onNext={() => setStep(6)}
          onBack={() => setStep(4)}
        />
      )}

      {/* STEP 6 – FINAL REPORT */}
      {step === 6 && (
        <StepDone
          data={{
            lastPeriodDate,
            cycleLength,
            periodDuration,
            regularity,
            symptoms,
          }}
          onEdit={(targetStep) => setStep(targetStep)}
        />
      )}
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
