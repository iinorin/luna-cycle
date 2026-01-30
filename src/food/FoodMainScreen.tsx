import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Animated, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { foodSuggestions, phaseFoodLogic, CyclePhase } from "./foodTypes";

const { width } = Dimensions.get("window");

export default function FoodMainScreen({ phase }: { phase: CyclePhase }) {
  const [eatenIds, setEatenIds] = useState<string[]>([]);
  
  // Filter foods based on the current phase
  const filteredFoods = useMemo(() => 
    foodSuggestions.filter(f => f.recommendedPhase.includes(phase)), 
  [phase]);

  const progress = (eatenIds.length / filteredFoods.length) * 100;

  const handleToggleEaten = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setEatenIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#0F172A", "#000"]} style={StyleSheet.absoluteFill} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* PHASE HEADER */}
        <View style={styles.header}>
          <Text style={styles.phaseLabel}>{phase.toUpperCase()} PHASE</Text>
          <Text style={styles.title}>{phaseFoodLogic[phase].title}</Text>
          <View style={styles.focusBadge}>
            <Text style={styles.focusText}>Focus: {phaseFoodLogic[phase].focus}</Text>
          </View>
        </View>

        {/* PROGRESS SECTION */}
        <View style={styles.progressCard}>
          <View>
            <Text style={styles.progressTitle}>Daily Goal</Text>
            <Text style={styles.progressSubText}>{eatenIds.length} of {filteredFoods.length} items consumed</Text>
          </View>
          <View style={styles.progressCircle}>
             <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
          </View>
        </View>

        {/* FOOD LIST */}
        <Text style={styles.sectionHeading}>Recommended for You</Text>
        {filteredFoods.map((item) => {
          const isEaten = eatenIds.includes(item.id);
          return (
            <Pressable 
              key={item.id} 
              onPress={() => handleToggleEaten(item.id)}
              style={[styles.foodCard, isEaten && styles.foodCardEaten]}
            >
              <View style={styles.foodInfo}>
                <Text style={styles.foodEmoji}>{item.icon}</Text>
                <View style={styles.foodTexts}>
                  <Text style={[styles.foodName, isEaten && styles.textStrikethrough]}>{item.name}</Text>
                  <Text style={styles.foodBenefit}>{item.benefit}</Text>
                </View>
              </View>
              
              <View style={[styles.checkbox, isEaten && styles.checkboxActive]}>
                {isEaten && <Ionicons name="checkmark" size={16} color="#fff" />}
              </View>
            </Pressable>
          );
        })}

        {/* PRO TIP FOOTER */}
        <LinearGradient colors={["#1E293B", "#0F172A"]} style={styles.tipCard}>
          <Ionicons name="bulb" size={24} color="#FBBF24" />
          <Text style={styles.tipText}>
            Eating {phaseFoodLogic[phase].focus.split(' ')[0]} rich foods now helps manage symptoms before they start.
          </Text>
        </LinearGradient>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  header: { marginBottom: 30 },
  phaseLabel: { color: "#ec4899", fontWeight: "800", letterSpacing: 1.5, fontSize: 12 },
  title: { color: "#fff", fontSize: 32, fontWeight: "900", marginTop: 5 },
  focusBadge: { backgroundColor: "rgba(236, 72, 153, 0.15)", alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, marginTop: 10 },
  focusText: { color: "#ec4899", fontWeight: "700", fontSize: 13 },
  
  progressCard: { backgroundColor: "#1E293B", borderRadius: 24, padding: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 30 },
  progressTitle: { color: "#fff", fontSize: 18, fontWeight: "800" },
  progressSubText: { color: "#94A3B8", fontSize: 13, marginTop: 4 },
  progressCircle: { width: 60, height: 60, borderRadius: 30, borderWidth: 4, borderColor: "#ec4899", justifyContent: "center", alignItems: "center" },
  progressPercent: { color: "#fff", fontWeight: "900", fontSize: 14 },

  sectionHeading: { color: "#fff", fontSize: 18, fontWeight: "800", marginBottom: 15 },
  foodCard: { backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 20, padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  foodCardEaten: { backgroundColor: "rgba(34, 197, 94, 0.1)", borderColor: "rgba(34, 197, 94, 0.3)" },
  foodInfo: { flexDirection: "row", alignItems: "center", flex: 1 },
  foodEmoji: { fontSize: 30, marginRight: 15 },
  foodTexts: { flex: 1 },
  foodName: { color: "#fff", fontSize: 17, fontWeight: "700" },
  textStrikethrough: { textDecorationLine: "line-through", color: "#94A3B8" },
  foodBenefit: { color: "#94A3B8", fontSize: 12, marginTop: 2 },
  
  checkbox: { width: 26, height: 26, borderRadius: 8, borderWidth: 2, borderColor: "#475569", justifyContent: "center", alignItems: "center" },
  checkboxActive: { backgroundColor: "#22c55e", borderColor: "#22c55e" },

  tipCard: { marginTop: 20, padding: 20, borderRadius: 20, flexDirection: "row", alignItems: "center", gap: 15 },
  tipText: { color: "#94A3B8", fontSize: 13, flex: 1, lineHeight: 18 }
});