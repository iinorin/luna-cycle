import React from "react";
import { View, Text, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";
import styles from "@/src/insights/components/styles";

const screenWidth = Dimensions.get("window").width;

interface BleedingFrequencyProps {
  labels: string[];
  values: number[];
}

const BleedingFrequencyChart: React.FC<BleedingFrequencyProps> = ({
  labels,
  values,
}) => {
  const hasHistory =
    labels.length > 0 && values.length > 0 && values.some((v) => v > 0);

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>📊 Flow Frequency by Month</Text>

      {hasHistory ? (
        <BarChart
          data={{
            labels,
            datasets: [
              {
                data: values,
              },
            ],
          }}
          width={screenWidth - 64}
          height={220}
          fromZero
          showValuesOnTopOfBars
          yAxisLabel=""   // Required by types
          yAxisSuffix=""  // Required by types
          chartConfig={{
            backgroundGradientFrom: "#1E1E1E",
            backgroundGradientTo: "#1E1E1E",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 105, 180, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(203, 213, 225, ${opacity})`,
            fillShadowGradient: "#FF69B4",
            fillShadowGradientOpacity: 1,
            barPercentage: 0.6,
            propsForBackgroundLines: {
              stroke: "#2A2A2A",
            },
          }}

          style={styles.chart}

        />
      ) : (
        <Text style={styles.emptyText}>
          No bleeding history available yet 🩸
        </Text>
      )}
    </View>
  );
};

export default BleedingFrequencyChart;
