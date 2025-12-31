import { useRouter, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

import StepCycleLength from "./steps/StepCycleLength";
import StepLastPeriod from "./steps/StepLastPeriod";
import StepPeriodDuration from "./steps/StepPeriodDuration";
import StepRegularity from "./steps/StepRegularity";
import StepSymptoms from "./steps/StepSymptoms";
import StepDone from "./steps/StepDone";
import StepSuccess from "./steps/StepSuccess";

import { Regularity } from "./types";
import {
  saveCycleData,
  getCycleData,
  deleteCycleData,
} from "./storage";

import {
  shouldShowCycleGuard,
  markCycleGuardSeen,
  resetCycleGuard,
} from "./cycleGuardStorage";

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
   * 🔐 CYCLE GUARD (persistent, safe)
   */
  useFocusEffect(
    useCallback(() => {
      const runGuard = async () => {
        const existing = await getCycleData();
        if (!existing) return;

        const shouldShow = await shouldShowCycleGuard();
        if (!shouldShow) return;

        Alert.alert(
          "Cycle Data Found",
          "You already have cycle data saved. What would you like to do?",
          [
            {
              text: "Keep Existing",
              style: "cancel",
              onPress: async () => {
                await markCycleGuardSeen();
                router.replace("/insights");
              },
            },
            {
              text: "Update",
              onPress: async () => {
                await markCycleGuardSeen();
                setStep(1);
              },
            },
            {
              text: "Delete",
              style: "destructive",
              onPress: async () => {
                await deleteCycleData();
                await resetCycleGuard(); // allow fresh entry later
                setStep(1);
              },
            },
          ]
        );
      };

      runGuard();
    }, [])
  );

  /**
   * SUCCESS STEP
   */
  if (step === 7) {
    return (
      <View style={styles.screen}>
        <StepSuccess
          onGoHome={() => {
            router.replace("/cycle");
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
              setData((prev) => ({
                ...prev,
                periodDuration: value,
              }))
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

        {step === 6 && (
          <StepDone
            data={data}
            onEdit={(stepNumber) => setStep(stepNumber)}
            onSave={async () => {
              await saveCycleData({
                cycleLength: data.cycleLength,
                lastPeriod: data.lastPeriod.toISOString(),
                periodDuration: data.periodDuration,
                regularity: data.regularity,
                symptoms: data.symptoms,
              });

              // 🔑 reset guard ONLY after data mutation
              await resetCycleGuard();

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
