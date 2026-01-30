import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { CheckCircle2, Flame, Brain, Zap, Heart } from "lucide-react-native";
import * as Haptics from "expo-haptics";

// Mock Data - You can later connect this to your cycle phase!
const SUGGESTED_FOODS = [
  { id: "1", name: "Dark Chocolate", benefit: "Cramp Relief", icon: "🍫", category: "Mood", color: "#fbbf24" },
  { id: "2", name: "Spinach Smoothie", benefit: "Iron Boost", icon: "🥤", category: "Energy", color: "#22c55e" },
  { id: "3", name: "Banana & Nuts", benefit: "Bloat Reduction", icon: "🍌", category: "Comfort", color: "#60a5fa" },
  { id: "4", name: "Salmon / Avocado", benefit: "Healthy Fats", icon: "🥑", category: "Energy", color: "#f87171" },
];

export default function FoodScreen() {
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [completedFoods, setCompletedFoods] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedFoods(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const markAsEaten = (id: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCompletedFoods(prev => [...prev, id]);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#1e1b4b", "#000000"]} style={styles.background} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Feed Your Flow 🍉</Text>
          <Text style={styles.subtitle}>Suggestions based on your current phase</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Cravings</Text>
          <View style={styles.grid}>
            {SUGGESTED_FOODS.map((food) => {
              const isSelected = selectedFoods.includes(food.id);
              const isEaten = completedFoods.includes(food.id);

              return (
                <Pressable 
                  key={food.id} 
                  onPress={() => !isEaten && toggleSelection(food.id)}
                  style={[
                    styles.foodCard, 
                    isSelected && { borderColor: food.color, borderWidth: 2 },
                    isEaten && { opacity: 0.5, transform: [{scale: 0.95}] }
                  ]}
                >
                  <Text style={styles.foodEmoji}>{food.icon}</Text>
                  <Text style={styles.foodName}>{food.name}</Text>
                  <Text style={styles.foodBenefit}>{food.benefit}</Text>
                  
                  {isSelected && !isEaten && (
                    <Pressable 
                      style={styles.doneBtn} 
                      onPress={() => markAsEaten(food.id)}
                    >
                      <Text style={styles.doneBtnText}>I ate this!</Text>
                    </Pressable>
                  )}

                  {isEaten && (
                    <View style={styles.eatenBadge}>
                      <CheckCircle2 size={16} color="#fff" />
                      <Text style={styles.eatenText}>Yum!</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* FUN TRIVIA CARD */}
        <LinearGradient colors={["#ec4899", "#8b5cf6"]} style={styles.triviaCard}>
           <Brain color="#fff" size={32} />
           <View style={{ flex: 1, marginLeft: 15 }}>
             <Text style={styles.triviaTitle}>Pro Tip:</Text>
             <Text style={styles.triviaText}>Dark chocolate with 70% cocoa helps relax muscles and reduce prostaglandin levels (less cramps!).</Text>
           </View>
        </LinearGradient>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  background: { ...StyleSheet.absoluteFillObject },
  scrollContent: { padding: 20, paddingTop: 60 },
  header: { marginBottom: 30 },
  title: { fontSize: 28, fontWeight: "900", color: "#fff" },
  subtitle: { fontSize: 14, color: "#9ca3af", marginTop: 5 },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#fff", marginBottom: 15, marginLeft: 5 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  foodCard: { 
    width: "48%", 
    backgroundColor: "#111827", 
    borderRadius: 24, 
    padding: 20, 
    marginBottom: 15,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent"
  },
  foodEmoji: { fontSize: 40, marginBottom: 10 },
  foodName: { color: "#fff", fontWeight: "800", fontSize: 16, textAlign: "center" },
  foodBenefit: { color: "#9ca3af", fontSize: 12, marginTop: 4, textAlign: "center" },
  doneBtn: { 
    marginTop: 15, 
    backgroundColor: "#fff", 
    paddingVertical: 8, 
    paddingHorizontal: 15, 
    borderRadius: 12 
  },
  doneBtnText: { color: "#000", fontWeight: "900", fontSize: 12 },
  eatenBadge: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginTop: 15, 
    backgroundColor: "#22c55e", 
    padding: 6, 
    borderRadius: 10 
  },
  eatenText: { color: "#fff", fontSize: 12, fontWeight: "900", marginLeft: 4 },
  triviaCard: { 
    flexDirection: "row", 
    padding: 20, 
    borderRadius: 25, 
    alignItems: "center",
    marginTop: 10 
  },
  triviaTitle: { color: "#fff", fontWeight: "900", fontSize: 18 },
  triviaText: { color: "#fff", fontSize: 13, opacity: 0.9, lineHeight: 18 },
});