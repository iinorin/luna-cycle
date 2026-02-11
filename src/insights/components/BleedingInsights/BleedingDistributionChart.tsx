import React, { useMemo } from "react";
import { View, Text, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";
import styles from "@/src/insights/components/styles";

const screenWidth = Dimensions.get("window").width;

interface PieDataItem {
  name: string;
  count: number;
  color: string;
}

interface BleedingDistributionProps {
  data: PieDataItem[];
}

const chartConfig = {
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
};

const BleedingDistributionChart: React.FC<BleedingDistributionProps> = ({
  data,
}) => {
  const hasData =
    data.length > 0 && data.some((item) => item.count > 0);

  const chartData = useMemo(() => {
    return data.map((d) => ({
      name: d.name,
      population: d.count,
      color: d.color,
      legendFontColor: "#CBD5E1",
      legendFontSize: 11,
    }));
  }, [data]);

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>
        Distribution (This Month)
      </Text>

      {hasData ? (
        <PieChart
          data={chartData}
          width={screenWidth - 64}
          height={180}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
          chartConfig={chartConfig}
        />
      ) : (
        <Text style={styles.emptyText}>
          No bleeding data for this month 🩸
        </Text>
      )}
    </View>
  );
};

export default React.memo(BleedingDistributionChart);

// pie
