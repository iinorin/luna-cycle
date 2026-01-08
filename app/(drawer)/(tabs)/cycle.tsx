import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// 1. TYPE DEFINITIONS (Fixes TypeScript "Implicit Any" errors)
type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal' | 'safe';

interface ThemeConfig {
  colors: string[];
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}

interface TipsSuggesterProps {
  phase: CyclePhase;
  currentDay: number;
}

const { width } = Dimensions.get('window');

// 2. THEME CONFIGURATION (Centralized UI logic)
const PHASE_THEMES: Record<CyclePhase, ThemeConfig> = {
  menstrual: { colors: ['#F472B6', '#9D174D'], icon: 'water-outline', label: 'Self-Care' },
  follicular: { colors: ['#5EEAD4', '#0D9488'], icon: 'flash-outline', label: 'Energy' },
  ovulation: { colors: ['#FBBF24', '#B45309'], icon: 'heart-outline', label: 'Social' },
  luteal: { colors: ['#A78BFA', '#5B21B6'], icon: 'moon-outline', label: 'Rest' },
  safe: { colors: ['#38BDF8', '#0369A1'], icon: 'shield-checkmark-outline', label: 'Stable' },
};

export function TipsSuggester({ phase, currentDay }: TipsSuggesterProps) {
  const theme = PHASE_THEMES[phase] || PHASE_THEMES.luteal;
  
  // 3. ANIMATION LOGIC (Breathing Pulse Effect)
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* 🌬️ BREATHING GLOW (Syncs with phase color) */}
      <Animated.View 
        style={[
          styles.glow, 
          { backgroundColor: theme.colors[0], transform: [{ scale: pulseAnim }] }
        ]} 
      />

      {/* 🧊 GLASS CARD CONTAINER */}
      <BlurView intensity={25} tint="light" style={styles.glassCard}>
        {/* Subtle Lens Flare Overlay */}
        <LinearGradient
          colors={['rgba(255,255,255,0.15)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        
        <View style={styles.headerRow}>
          <LinearGradient
            colors={theme.colors}
            style={styles.iconBox}
          >
            <Ionicons name={theme.icon} size={18} color="white" />
          </LinearGradient>
          
          <View>
            <Text style={[styles.tag, { color: theme.colors[0] }]}>
              {theme.label.toUpperCase()}
            </Text>
            <Text style={styles.title}>Daily Insight • Day {currentDay}</Text>
          </View>
        </View>

        <Text style={styles.tipText}>
          Your {phase} phase is here! Focus on nourishing your body with warm meals and prioritizing extra rest today to maintain your glow.
        </Text>

        <View style={styles.footer}>
          <Text style={styles.actionText}>Read full guide</Text>
          <Ionicons name="chevron-forward" size={12} color="rgba(255,255,255,0.5)" />
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    alignItems: 'center',
    paddingHorizontal: 16,
    width: '100%',
  },
  glow: {
    position: 'absolute',
    width: '70%',
    height: 60,
    borderRadius: 100,
    opacity: 0.2,
    top: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 40,
    elevation: 10,
  },
  glassCard: {
    width: '100%',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
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
  tag: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    opacity: 0.6,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700',
    marginRight: 4,
    color: '#FFFFFF',
  }
});