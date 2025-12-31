import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import StepCycleLength from "./steps/StepCycleLength";
import StepLastPeriod from "./steps/StepLastPeriod";
import StepPeriodDuration from "./steps/StepPeriodDuration";
import StepRegularity from "./steps/StepRegularity";
import StepSymptoms from "./steps/StepSymptoms";
import StepDone from "./steps/StepDone";
import StepSuccess from "./steps/StepSuccess";

import { Regularity } from "./types";
import { saveCycleData } from "./storage";

/**
 * TrackPeriodScreen
 * -----------------
 * Collects user cycle data step-by-step
 * Saves data to local storage on final submit
 */
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

  /**
   * SUCCESS STEP
   * Render full screen without content padding
   */
  if (step === 7) {
    return (
      <View style={styles.screen}>
        <StepSuccess
          onGoHome={() => {
            router.replace("/insights");
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        {/* STEP 1 – Cycle Length */}
        {step === 1 && (
          <StepCycleLength
            value={data.cycleLength}
            onNext={(value) => {
              setData((prev) => ({ ...prev, cycleLength: value }));
              setStep(2);
            }}
          />
        )}

        {/* STEP 2 – Last Period */}
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

        {/* STEP 3 – Period Duration */}
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

        {/* STEP 4 – Regularity */}
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

        {/* STEP 5 – Symptoms */}
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

        {/* STEP 6 – Review & Save */}
        {step === 6 && (
          <StepDone
            data={data}
            onEdit={(stepNumber) => setStep(stepNumber)}
            onSave={async () => {
              console.log("Saving cycle data:", data);

              // ✅ Persist data to local storage
              await saveCycleData({
                cycleLength: data.cycleLength,
                lastPeriod: data.lastPeriod.toISOString(),
                periodDuration: data.periodDuration,
                regularity: data.regularity,
                symptoms: data.symptoms,
              });

              setStep(7);
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
