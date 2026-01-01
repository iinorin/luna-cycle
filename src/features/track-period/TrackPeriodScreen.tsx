import { useRouter, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";

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

/** ✅ FIXED IMPORT (file actually exists) */
import {
  shouldShowCycleGuard,
  markCycleGuardSeen,
  resetCycleGuard,
} from "./cycleGuard";

/** 🧩 UI MODAL */
import CycleDataGuardModal from "./components/CycleDataGuardModal";

export default function TrackPeriodScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showGuard, setShowGuard] = useState(false);

  const [data, setData] = useState({
    cycleLength: 28,
    lastPeriod: new Date(),
    periodDuration: 5,
    regularity: "regular" as Regularity,
    symptoms: [] as string[],
  });

  /**
   * 🔐 CYCLE GUARD
   */
  useFocusEffect(
    useCallback(() => {
      const runGuard = async () => {
        await resetCycleGuard();

        const existing = await getCycleData();
        if (!existing) return;

        const shouldShow = await shouldShowCycleGuard();
        if (!shouldShow) return;

        setShowGuard(true);
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

              await resetCycleGuard();
              setStep(7);
            }}
          />
        )}
      </View>

      {/* 🧊 MODAL UI */}
      <CycleDataGuardModal
        visible={showGuard}
        onKeep={async () => {
          await markCycleGuardSeen();
          setShowGuard(false);
          router.replace("/insights");
        }}
        onUpdate={async () => {
          await markCycleGuardSeen();
          setShowGuard(false);
          setStep(1);
        }}
        onDelete={async () => {
          await deleteCycleData();
          await resetCycleGuard();
          setShowGuard(false);
          setStep(1);
        }}
      />
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
