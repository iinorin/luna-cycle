// Pie
import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import styles from '@/src/insights/components/styles';

const screenWidth = Dimensions.get("window").width;

interface PieDataItem {
  name: string;
  count: number;
  color: string;
}

interface BleedingDistributionProps {
  data: PieDataItem[];
}

const BleedingDistributionChart: React.FC<BleedingDistributionProps> = ({ data }) => {
  // We check if there's actual numerical data to show
  const hasData = data.length > 0 && data.some(item => item.count > 0);

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Distribution (This Month)</Text>

      {hasData ? (
        <PieChart
          data={data.map((d) => ({
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
          absolute // Shows the actual count instead of percentages
          chartConfig={{
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
        />
      ) : (
        <Text style={styles.emptyText}>No bleeding data for this month 🩸</Text>
      )}
    </View>
  );
};

export default BleedingDistributionChart;