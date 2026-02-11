import React, { useMemo } from "react";
import { View, Text, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";
import type { ChartConfig } from "react-native-chart-kit/dist/HelperTypes";
import styles from "@/src/insights/components/styles";

const screenWidth = Dimensions.get("window").width;

interface BleedingFrequencyProps {
  months: string[]; // Format: ["2024-01", "2024-02"]
  scores: number[];
  chartConfig: ChartConfig;
}

const BleedingFrequencyChart: React.FC<BleedingFrequencyProps> = ({
  months,
  scores,
  chartConfig,
}) => {
  const { displayMonths, displayScores } = useMemo(() => {
    const paired = months.map((month, index) => ({
      month,
      score: scores[index] ?? 0,
    }));

    const lastSix = paired.slice(-6);

    return {
      displayMonths: lastSix.map(({ month }) => {
        const monthIndex = parseInt(month.split("-")[1]) - 1;
        return new Intl.DateTimeFormat("en", { month: "short" }).format(
          new Date(2000, monthIndex)
        );
      }),
      displayScores: lastSix.map(({ score }) => score),
    };
  }, [months, scores]);

  const hasHistory = displayScores.length > 0;

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>
        📊 Flow Frequency by Month
      </Text>

      {hasHistory ? (
        <BarChart
          data={{
            labels: displayMonths,
            datasets: [{ data: displayScores }],
          }}
          width={screenWidth - 64}
          height={200}
          fromZero
          showValuesOnTopOfBars
          chartConfig={{
            ...chartConfig,
            fillShadowGradient: "#fb7185",
            fillShadowGradientOpacity: 1,
            barPercentage: 0.6,
          }}
          style={styles.chart}
        />
      ) : (
        <Text style={styles.emptyText}>
          No monthly history recorded yet 📉
        </Text>
      )}
    </View>
  );
};

export default React.memo(BleedingFrequencyChart);
