import { useCallback, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  ScrollView,
} from "react-native";
import {
  LineChart,
  PieChart,
  BarChart,
} from "react-native-chart-kit";
import { useFocusEffect } from "expo-router";

import { getCycleData, CycleData } from "@/src/features/track-period/storage";
import { calculateCycleInfo } from "@/src/cycle/calculations";

import {
  getBleedingStore,
} from "@/src/features/bleeding/storage";


import {
  groupByMonth,
  getMonthlyPieData,
  getMonthlyBarValue,
} from "@/src/features/bleeding/utils";

import { getAllPainEntries } from "@/src/pain/painDetailsStorage";

import {
  getPainIntensityTimeline,
  getPainBodyPartCounts,
  getPainIntensityBuckets,
  getAveragePainIntensity,
} from "@/src/pain/utils";

import StreakCard from "@/src/pain/StreakCard";
import { MoodStorage } from "@/src/mood/moodStorage";

const screenWidth = Dimensions.get("window").width;

export default function InsightsScreen() {
  const [cycle, setCycle] = useState<CycleData | null>(null);
  const [cycleInfo, setCycleInfo] = useState<any>(null);
  const [bleedingStore, setBleedingStore] = useState<any>({});
  const [painStore, setPainStore] = useState<any>({});
  const [streakStats, setStreakStats] = useState({ current: 0, best: 0 });

  const progressAnim = useRef(new Animated.Value(0)).current;

  /**
   * 🔄 Refresh every time screen is focused
   */
  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  async function load() {
    const data = await getCycleData();
    const bleeding = await getBleedingStore();
    const pain = await getAllPainEntries();
    const streaks = await MoodStorage.getStreakStats();

    console.log("🩸 Bleeding data loaded in Insights:", bleeding);

    if (!data) {
      setCycle(null);
      setCycleInfo(null);
      return;
    }

    const info = calculateCycleInfo(data);
    setCycle(data);
    setCycleInfo(info);
    setBleedingStore(bleeding);
    setPainStore(pain);
    setStreakStats(streaks);

    progressAnim.setValue(0);
    Animated.timing(progressAnim, {
      toValue: info.cycleDay / data.cycleLength,
      duration: 900,
      useNativeDriver: false,
    }).start();

  }

  if (!cycle || !cycleInfo) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>No cycle data yet 🌸</Text>
      </View>
    );
  }

  /** Existing graph data */
  const days = Array.from(
    { length: cycle.cycleLength },
    (_, i) => i + 1
  );

  const phaseData = days.map((day) => {
    if (day <= cycle.periodDuration) return 2;
    if (
      day >= cycleInfo.fertileWindow.startDay &&
      day <= cycleInfo.fertileWindow.endDay
    )
      return 7;
    if (day === cycleInfo.ovulationDay) return 9;
    return 5;
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const lutealStartDay = cycle.cycleLength - 6; // last 7 days

  const currentPhase =
    cycleInfo.cycleDay <= cycle.periodDuration
      ? "🌸 Menstrual Phase — Rest & recharge"
      : cycleInfo.cycleDay < cycleInfo.fertileWindow.startDay
        ? "🌱 Follicular Phase — Energy rising"
        : cycleInfo.cycleDay <= cycleInfo.fertileWindow.endDay
          ? "🔥 Ovulation Phase — Peak confidence"
          : cycleInfo.cycleDay < lutealStartDay
            ? "🛡️ Safe Phase — Calm & balanced"
            : "🌙 Luteal Phase — Slow & reflect";


  /* =========================
     🩸 BLEEDING INSIGHTS DATA
     ========================= */

  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthData = bleedingStore[currentMonth] || {};

  const pieCounts = getMonthlyPieData(currentMonthData);

  const pieData = [
    { name: "None", count: pieCounts[0], color: "#e5e7eb" },
    { name: "Light", count: pieCounts[1], color: "#fecdd3" },
    { name: "Medium", count: pieCounts[2], color: "#fb7185" },
    { name: "Heavy", count: pieCounts[3], color: "#e11d48" },
  ].filter((d) => d.count > 0);

  const months = Object.keys(bleedingStore).sort();
  const barScores = months.map((m) =>
    getMonthlyBarValue(bleedingStore[m])
  );

  const hasPainData = Object.keys(painStore).length > 0;

  const painTimeline = getPainIntensityTimeline(painStore);
  const painBodyCounts = getPainBodyPartCounts(painStore);
  const painBuckets = getPainIntensityBuckets(painStore);
  const avgPain = getAveragePainIntensity(painStore);


  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>📊 Cycle Insights</Text>
      <Text style={styles.subtitle}>Understanding your rhythm ✨</Text>

      {/* 🌀 Cycle Progress Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🌀 Cycle Progress</Text>
        <Text style={styles.value}>
          Day {cycleInfo.cycleDay} of {cycle.cycleLength}
        </Text>
        <View style={styles.progressTrack}>
          <Animated.View
            style={[styles.progressFill, { width: progressWidth }]}
          />
        </View>
      </View>

      {/* 🩸 infoRow */}
      <View style={styles.infoRow}>
        <View style={[styles.card, styles.halfCard]}>
          <Text style={styles.cardTitle}>🩸 Next Period</Text>
          <Text style={styles.value}>
            {cycleInfo.nextPeriod.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </Text>
        </View>
        <View style={[styles.card, styles.halfCard]}>
          <Text style={styles.cardTitle}>🔥 Fertile Window</Text>
          <Text style={styles.value}>
            Day {cycleInfo.fertileWindow.startDay} – {cycleInfo.fertileWindow.endDay}
          </Text>
        </View>
      </View>

      {/* 📈 Cycle Overview */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📈 Cycle Overview</Text>
        <LineChart
          data={{
            labels: days.filter((d) => d % 5 === 0).map(String),
            datasets: [{ data: phaseData }],
          }}
          width={screenWidth - 64} // Fixed padding overflow
          height={180}
          bezier
          withInnerLines={false}
          withOuterLines={false}
          chartConfig={chartConfigDark}
          style={styles.chart}
        />
        <Text style={styles.legend}>
          🌸 Period • 🔥 Fertile • ⭐ Ovulation
        </Text>
      </View>

      <View style={[styles.card, styles.glassCard]}>
        <Text style={styles.cardTitle}>💫 Current Phase</Text>
        <Text style={styles.phaseText}>{currentPhase}</Text>
      </View>

      {/* 🩸 BLEEDING INSIGHTS */}
      <Text style={styles.sectionTitle}>🩸 Bleeding Insights</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Distribution (This Month)</Text>
        {pieData.length ? (
          <PieChart
            data={pieData.map((d) => ({
              name: d.name,
              population: d.count,
              color: d.color,
              legendFontColor: "#CBD5E1",
              legendFontSize: 11,
            }))}
            width={screenWidth - 64}
            height={180}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            chartConfig={chartConfigDark}
          />
        ) : (
          <Text style={styles.emptyText}>No data for this month</Text>
        )}
      </View>

      {/* 🩹 PAIN INSIGHTS */}
      <Text style={styles.sectionTitle}>🩹 Pain Insights</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Pain Intensity Timeline</Text>
        {hasPainData ? (
          <LineChart
            data={{
              labels: painTimeline.labels,
              datasets: [{ data: painTimeline.values }],
            }}
            width={screenWidth - 64}
            height={180}
            bezier
            chartConfig={chartConfigPain}
            style={styles.chart}
          />
        ) : (
          <Text style={styles.emptyText}>No pain data recorded yet</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Pain by Body Area</Text>
        {hasPainData ? (
          <BarChart
            data={{
              labels: Object.keys(painBodyCounts),
              datasets: [{ data: Object.values(painBodyCounts) }],
            }}
            width={screenWidth - 64}
            height={200}
            yAxisLabel=""
            yAxisSuffix=""
            fromZero
            chartConfig={chartConfigDark}
            style={styles.chart}
          />
        ) : (
          <Text style={styles.emptyText}>No areas logged</Text>
        )}
      </View>

      {/* 🔥 STREAKS */}
      <Text style={styles.sectionTitle}>🔥 Habit Insights</Text>
      <StreakCard />

      <View style={[styles.card, styles.glassCard, { marginBottom: 60 }]}>
        <Text style={styles.cardTitle}>💡 Consistency Tip</Text>
        <Text style={styles.meta}>
          Your current best is <Text style={{color: '#fff', fontWeight: 'bold'}}>{streakStats.best} days</Text>. 
          Keep logging daily to improve prediction accuracy!
        </Text>
      </View>
    </ScrollView>
  );
}

// Separate Chart Configs for cleaner code
const chartConfigDark = {
  backgroundGradientFrom: "#1e293b",
  backgroundGradientTo: "#1e293b",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(203, 213, 225, ${opacity})`,
  style: { borderRadius: 16 },
  propsForDots: { r: "4", strokeWidth: "2", stroke: "#ec4899" },
};

const chartConfigPain = {
  ...chartConfigDark,
  color: (opacity = 1) => `rgba(225, 29, 72, ${opacity})`,
  propsForDots: { r: "4", strokeWidth: "2", stroke: "#e11d48" },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#12002b",
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -0.5,
  },
  subtitle: {
    color: "#a78bfa",
    marginBottom: 24,
    fontSize: 15,
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
    marginTop: 24,
    marginBottom: 12,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.05)", // Glass effect
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden", // Prevents chart bleeding
  },
  glassCard: {
    backgroundColor: "rgba(139, 92, 246, 0.15)", // Subtle purple tint
    borderColor: "rgba(139, 92, 246, 0.3)",
  },
  halfCard: {
    width: "48%",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#d8b4fe",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  value: {
    fontSize: 17,
    fontWeight: "700",
    color: "#fff",
  },
  phaseText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#ddd6fe",
  },
  progressTrack: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    marginTop: 12,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#ec4899",
    borderRadius: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    paddingRight: 40, // Important for LineChart labels
  },
  legend: {
    fontSize: 11,
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 4,
  },
  emptyText: {
    color: "#64748b",
    fontSize: 13,
    textAlign: "center",
    marginVertical: 20,
  },
  meta: {
    fontSize: 14,
    color: "#cbd5e1",
    lineHeight: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#12002b",
  },
  empty: {
    color: "#d8b4fe",
    fontSize: 16,
  },
});