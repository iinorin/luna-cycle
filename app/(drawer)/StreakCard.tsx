import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MoodStorage } from '@/src/mood/moodStorage';

const { width } = Dimensions.get('window');

export default function StreakCard() {
  const [stats, setStats] = useState({ current: 0, best: 0 });
  const [recentActivity, setRecentActivity] = useState<boolean[]>([]);
  
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const s = await MoodStorage.getStreakStats();
    const history = await MoodStorage.getHistory();
    setStats(s);

    // Generate last 7 days activity dots
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dStr = d.toLocaleDateString();
      return history.some(entry => new Date(entry.date).toLocaleDateString() === dStr);
    }).reverse();
    
    setRecentActivity(last7Days);

    // Animate in
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 8, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 500, useNativeDriver: true })
    ]).start();
  };

  return (
    <Animated.View style={[styles.container, { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }]}>
      
      {/* HEADER SECTION */}
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <Text style={styles.subTitle}>CONSISTENCY</Text>
          <Text style={styles.mainTitle}>Mood Streak</Text>
        </View>
        <View style={styles.fireBadge}>
          <Ionicons name="flame" size={20} color="#FF9500" />
          <Text style={styles.fireText}>{stats.current}</Text>
        </View>
      </View>

      {/* STATS ROW */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>CURRENT</Text>
          <Text style={styles.statValue}>{stats.current} <Text style={styles.unit}>days</Text></Text>
        </View>
        
        <View style={styles.divider} />

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>ALL-TIME BEST</Text>
          <Text style={styles.statValue}>{stats.best} <Text style={styles.unit}>days</Text></Text>
        </View>
      </View>

      {/* MINI ACTIVITY MAP */}
      <View style={styles.activityContainer}>
        <Text style={styles.activityLabel}>LAST 7 DAYS</Text>
        <View style={styles.dotRow}>
          {recentActivity.map((active, i) => (
            <View key={i} style={styles.dotWrapper}>
               <View style={[styles.dot, active ? styles.dotActive : styles.dotInactive]} />
               <Text style={styles.dayText}>{['S','M','T','W','T','F','S'][(new Date().getDay() - (6-i) + 7) % 7]}</Text>
            </View>
          ))}
        </View>
      </View>

    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E293B',
    borderRadius: 28,
    padding: 20,
    width: width - 32,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    shadowColor: '#FF9500',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 5,
    marginVertical: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  titleGroup: { flex: 1 },
  subTitle: { color: '#38BDF8', fontSize: 10, fontWeight: '900', letterSpacing: 1.5, marginBottom: 4 },
  mainTitle: { color: '#FFF', fontSize: 20, fontWeight: '900' },
  fireBadge: {
    backgroundColor: 'rgba(255, 149, 0, 0.15)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 149, 0, 0.3)',
  },
  fireText: { color: '#FF9500', fontWeight: '900', marginLeft: 4, fontSize: 16 },
  
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(15, 23, 42, 0.3)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
  },
  statBox: { flex: 1, alignItems: 'center' },
  statLabel: { color: '#64748B', fontSize: 9, fontWeight: '800', marginBottom: 4 },
  statValue: { color: '#FFF', fontSize: 22, fontWeight: '900' },
  unit: { fontSize: 12, color: '#94A3B8', fontWeight: '600' },
  divider: { width: 1, height: '100%', backgroundColor: 'rgba(255,255,255,0.05)', marginHorizontal: 10 },

  activityContainer: { width: '100%' },
  activityLabel: { color: '#475569', fontSize: 9, fontWeight: '800', marginBottom: 12, textAlign: 'center' },
  dotRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 },
  dotWrapper: { alignItems: 'center' },
  dot: { width: 12, height: 12, borderRadius: 6, marginBottom: 6 },
  dotActive: { 
    backgroundColor: '#FF9500', 
    shadowColor: '#FF9500', 
    shadowOpacity: 0.8, 
    shadowRadius: 8,
    elevation: 4
  },
  dotInactive: { backgroundColor: 'rgba(255,255,255,0.1)' },
  dayText: { color: '#475569', fontSize: 10, fontWeight: '700' }
});