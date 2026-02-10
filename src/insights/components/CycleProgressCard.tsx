import React from "react";
import { View, Text, Animated } from "react-native";
import styles from "./styles";
import { CycleProgressProps } from "../types";

const CycleProgressCard: React.FC<CycleProgressProps> = ({
  cycleDay,
  cycleLength,
  progressWidth,
  nextPeriod,
  fertileWindow,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🌀 Cycle Progress</Text>
        <Text style={styles.value}>
          Day {cycleDay} of {cycleLength}
        </Text>

        <View style={styles.progressTrack}>
          <Animated.View
            style={[styles.progressFill, { width: progressWidth }]}
          />
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={[styles.card, styles.halfCard]}>
          <Text style={styles.cardTitle}>🩸 Next Period</Text>
          <Text style={styles.value}>
            {nextPeriod
              ? nextPeriod.toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })
              : "—"}
          </Text>
        </View>

        <View style={[styles.card, styles.halfCard]}>
          <Text style={styles.cardTitle}>🔥 Fertile Window</Text>
          <Text style={styles.value}>
            Day {fertileWindow?.start} - {fertileWindow?.end}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default React.memo(CycleProgressCard);
