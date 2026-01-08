import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal' | 'safe';

interface ThemeConfig {
  readonly colors: readonly [string, string, ...string[]]; 
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}

interface TipsSuggesterProps {
  phase: CyclePhase;
  currentDay: number;
}


const PHASE_THEMES: Record<CyclePhase, ThemeConfig> = {
  menstrual: { colors: ['#F472B6', '#9D174D'] as const, icon: 'water-outline', label: 'Self-Care' },
  follicular: { colors: ['#5EEAD4', '#0D9488'] as const, icon: 'flash-outline', label: 'Energy' },
  ovulation: { colors: ['#FBBF24', '#B45309'] as const, icon: 'heart-outline', label: 'Social' },
  luteal: { colors: ['#A78BFA', '#5B21B6'] as const, icon: 'moon-outline', label: 'Rest' },
  safe: { colors: ['#38BDF8', '#0369A1'] as const, icon: 'shield-checkmark-outline', label: 'Stable' },
};

export function TipsSuggester({ phase, currentDay }: TipsSuggesterProps) {
  const theme = PHASE_THEMES[phase] || PHASE_THEMES.luteal;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.12,
          duration: 2500,
          easing: Easing.out(Easing.sin), // Fixed Easing property name
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2500,
          easing: Easing.in(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Dynamic Background Glow */}
      <Animated.View 
        style={[
          styles.glow, 
          { backgroundColor: theme.colors[0], transform: [{ scale: pulseAnim }] }
        ]} 
      />

      <BlurView intensity={30} tint="light" style={styles.glassCard}>
        {/* Flare Gradient - Added 'as const' here too */}
        <LinearGradient
          colors={['rgba(255,255,255,0.2)', 'transparent'] as const}
          style={StyleSheet.absoluteFill}
        />
        
        <View style={styles.headerRow}>
          <LinearGradient colors={theme.colors} style={styles.iconBox}>
            <Ionicons name={theme.icon} size={18} color="white" />
          </LinearGradient>
          
          <View style={styles.textColumn}>
            <Text style={[styles.tag, { color: theme.colors[0] }]}>
              {theme.label.toUpperCase()}
            </Text>
            <Text style={styles.title}>Daily Insight • Day {currentDay}</Text>
          </View>
        </View>

        <Text style={styles.tipText}>
          Your {phase} energy is rising. This is the perfect time for high-intensity tasks and creative brainstorming.
        </Text>

        <View style={styles.footer}>
          <Text style={styles.actionText}>Read full guide</Text>
          <Ionicons name="chevron-forward" size={12} color="white" />
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    paddingHorizontal: 16,
    width: '100%',
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    width: '60%',
    height: 60,
    borderRadius: 100,
    opacity: 0.15,
    top: 20,
  },
  glassCard: {
    width: '100%',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  textColumn: {
    flex: 1,
  },
  tag: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
  },
  tipText: {
    fontSize: 14,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    opacity: 0.7,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700',
    marginRight: 4,
    color: '#FFF',
  }
});