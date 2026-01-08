import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons'; // Make sure to have icons

const { width } = Dimensions.get('window');

const PHASE_THEMES = {
  menstrual: { colors: ['#F472B6', '#9D174D'], icon: 'water-outline', label: 'Self-Care' },
  follicular: { colors: ['#5EEAD4', '#0D9488'], icon: 'flash-outline', label: 'Energy' },
  ovulation: { colors: ['#FBBF24', '#B45309'], icon: 'heart-outline', label: 'Social' },
  luteal: { colors: ['#A78BFA', '#5B21B6'], icon: 'moon-outline', label: 'Rest' },
  safe: { colors: ['#38BDF8', '#0369A1'], icon: 'shield-checkmark-outline', label: 'Stable' },
};

export const TipsSuggester = ({ phase, currentDay }) => {
  const theme = PHASE_THEMES[phase] || PHASE_THEMES.luteal;

  return (
    <View style={styles.container}>
      {/* Background Gradient Glow */}
      <View style={[styles.glow, { backgroundColor: theme.colors[0] }]} />

      <BlurView intensity={40} tint="dark" style={styles.glassCard}>
        <LinearGradient
          colors={['rgba(255,255,255,0.1)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        
        <View style={styles.row}>
          <View style={[styles.iconBox, { backgroundColor: theme.colors[0] }]}>
            <Ionicons name={theme.icon} size={20} color="white" />
          </View>
          <View>
            <Text style={styles.tag}>{theme.label.toUpperCase()}</Text>
            <Text style={styles.title}>Daily Focus • Day {currentDay}</Text>
          </View>
        </View>

        <Text style={styles.tipText}>
          {/* You would pull your actual tips here */}
          Your {phase} energy is rising. It's the perfect time for high-intensity workouts and social meetings.
        </Text>

        <View style={styles.footer}>
          <Text style={styles.actionText}>Learn more</Text>
          <Ionicons name="arrow-forward" size={14} color={theme.colors[0]} />
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    width: '40%',
    height: 60,
    borderRadius: 50,
    opacity: 0.3,
    top: 20,
    filter: 'blur(30px)', // Only works on some platforms, use shadow for others
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 40,
  },
  glassCard: {
    width: width - 32,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  tag: {
    fontSize: 10,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '400',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700',
    marginRight: 5,
    color: '#FFF',
  }
});