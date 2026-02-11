import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import styles from '../../styles'; // Umbrella styles

const screenWidth = Dimensions.get("window").width;

interface BleedingFrequencyProps {
  months: string[]; // Format: ["2024-01", "2024-02"]
  scores: number[];
  chartConfig: any;
}

const BleedingFrequencyChart: React.FC<BleedingFrequencyProps> = ({ 
  months, 
  scores, 
  chartConfig 
}) => {
  // Improvement: Show up to last 6 months instead of just 3 for better context
  const displayMonths = months.slice(-6).map(m => {
    const monthIndex = parseInt(m.split('-')[1]) - 1;
    return new Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(2000, monthIndex));
  });
  
  const displayScores = scores.slice(-6);

  const hasHistory = displayScores.length > 0;

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>📊 Flow Frequency by Month</Text>
      
      {hasHistory ? (
        <BarChart
          data={{
            labels: displayMonths,
            datasets: [{ data: displayScores }],
          }}
          width={screenWidth - 64}
          height={200}
          yAxisLabel=""
          yAxisSuffix=""
          fromZero
          showValuesOnTopOfBars // Improvement: easier to read exact scores
          chartConfig={{
            ...chartConfig,
            fillShadowGradient: "#fb7185", // Matching your bleeding theme
            fillShadowGradientOpacity: 1,
            barPercentage: 0.6,
          }}
          style={styles.chart}
        />
      ) : (
        <Text style={styles.emptyText}>No monthly history recorded yet 📉</Text>
      )}
    </View>
  );
};

export default BleedingFrequencyChart;