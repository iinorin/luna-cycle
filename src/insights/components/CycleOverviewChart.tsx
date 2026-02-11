import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import type { ChartConfig } from "react-native-chart-kit/dist/HelperTypes";

import sharedStyles from "./styles";

const screenWidth = Dimensions.get("window").width;

interface Props {
  days: number[];
  phaseData: number[];
  chartConfig: ChartConfig;
}

const CycleOverviewChart: React.FC<Props> = ({
  days,
  phaseData,
  chartConfig,
}) => {
  // Safety: avoid rendering broken charts
  if (!days.length || days.length !== phaseData.length) {
    return null;
  }

  return (
    <View style={sharedStyles.card}>
      <Text style={sharedStyles.cardTitle}>📈 Cycle Overview</Text>

      <LineChart
        data={{
          labels: days.filter((d) => d % 5 === 0).map(String),
          datasets: [
            {
              data: phaseData,
              strokeWidth: 3,
            },
          ],
        }}
        width={screenWidth - 64}
        height={180}
        bezier
        withDots={false}
        withInnerLines={false}
        withOuterLines={false}
        chartConfig={chartConfig}
        style={localStyles.chart}
      />

      <View style={localStyles.legendBox}>
        <Text style={localStyles.legendText}>
          🌸 Period • 🔥 Fertile • ⭐ Ovulation
        </Text>
      </View>
    </View>
  );
};

// Only chart-specific tweaks live here
const localStyles = StyleSheet.create({
  chart: {
    marginVertical: 8,
  },
  legendBox: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
  },
  legendText: {
    fontSize: 11,
    color: "#94a3b8",
    textAlign: "center",
  },
});

export default React.memo(CycleOverviewChart);
