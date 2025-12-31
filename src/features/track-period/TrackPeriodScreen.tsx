import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import StepCycleLength from "./steps/StepCycleLength";
import StepDone from "./steps/StepDone";
import StepLastPeriod from "./steps/StepLastPeriod";
import StepPeriodDuration from "./steps/StepPeriodDuration";
import StepRegularity from "./steps/StepRegularity";
import StepSuccess from "./steps/StepSuccess";
import StepSymptoms from "./steps/StepSymptoms";

import { Regularity } from "./types";

export default function TrackPeriodScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [data, setData] = useState({
    cycleLength: 28,
    lastPeriod: new Date(),
    periodDuration: 5,
    regularity: "regular" as Regularity,
    symptoms: [] as string[],
  });

  // SUCCESS STEP - render outside the content padding
  if (step === 7) {
    return (
      <View style={styles.screen}>
        <StepSuccess
          onGoHome={() => {
            router.replace("/(tabs)/insights" as any);
            console.log("SAVE PRESSED");
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        {step === 1 && (
          <StepCycleLength
            value={data.cycleLength}
            onNext={(value) => {
              setData((prev) => ({ ...prev, cycleLength: value }));
              setStep(2);
            }}
          />
        )}

        {step === 2 && (
          <StepLastPeriod
            value={data.lastPeriod}
            onBack={() => setStep(1)}
            onNext={(value) => {
              setData((prev) => ({ ...prev, lastPeriod: value }));
              setStep(3);
            }}
          />
        )}

        {step === 3 && (
          <StepPeriodDuration
            value={data.periodDuration}
            onBack={() => setStep(2)}
            onNext={() => setStep(4)}
            onChange={(value) =>
              setData((prev) => ({ ...prev, periodDuration: value }))
            }
          />
        )}

        {step === 4 && (
          <StepRegularity
            value={data.regularity}
            onBack={() => setStep(3)}
            onNext={(value) => {
              setData((prev) => ({ ...prev, regularity: value }));
              setStep(5);
            }}
          />
        )}

        {step === 5 && (
          <StepSymptoms
            value={data.symptoms}
            onBack={() => setStep(4)}
            onNext={() => setStep(6)}
            onChange={(value) =>
              setData((prev) => ({ ...prev, symptoms: value }))
            }
          />
        )}

        {/* REVIEW STEP */}
        {step === 6 && (
          <StepDone
            data={data}
            onEdit={(stepNumber) => setStep(stepNumber)}
            onSave={() => {
              // ✅ SAVE LOGIC GOES HERE (later)
              setStep(7); // move to success
            }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#2d10e9ff",
  },
  content: {
    paddingTop: 150,
    paddingHorizontal: 16,
  },
});
