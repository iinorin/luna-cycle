import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '@/src/insights/components/styles';

interface AvgBleedingProps {
  avgScore: string | number;
}

const AvgBleedingCard: React.FC<AvgBleedingProps> = ({ avgScore }) => {
  return (
    <View style={[styles.card, styles.rowBetween]}>
      <View>
        <Text style={styles.cardTitle}>Avg. Flow Intensity</Text>
        <Text style={[styles.value, { fontSize: 24 }]}>
          {avgScore}
        </Text>
      </View>
      
      <View style={styles.trendBadge}>
        <Ionicons name="water" size={20} color="#fb7185" />
        <Text style={styles.trendText}>Monthly Avg</Text>
      </View>
    </View>
  );
};

export default AvgBleedingCard;