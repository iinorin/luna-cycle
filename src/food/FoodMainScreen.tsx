import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  Dimensions,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { foodSuggestions, phaseFoodLogic, CyclePhase } from "./foodTypes";

const { width, height } = Dimensions.get("window");

export default function FoodMainScreen({ phase }: { phase: CyclePhase }) {
  const [eatenIds, setEatenIds] = useState<string[]>([]);
  const [selectedComfortIds, setSelectedComfortIds] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showComfortPicker, setShowComfortPicker] = useState(false);

  // 1. Daily Recommendations: Filter out Comfort/Drinks (Healthy only)
  const healthyRecommendations = useMemo(() => 
    foodSuggestions.filter(f => 
      f.recommendedPhase.includes(phase) && 
      f.category !== "Comfort" && 
      f.category !== "Drinks"
    ), [phase]);

  // 2. Picker Options: All available Comfort/Drinks for this phase
  const comfortOptions = useMemo(() => 
    foodSuggestions.filter(f => 
      f.recommendedPhase.includes(phase) && 
      (f.category === "Comfort" || f.category === "Drinks")
    ), [phase]);

  // 3. User Selected Comfort Items: Items the user "chose" to eat today
  const activeComfortItems = useMemo(() => 
    comfortOptions.filter(f => selectedComfortIds.includes(f.id)), 
  [selectedComfortIds, comfortOptions]);

  const handleToggleEaten = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setEatenIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleComfortSelection = (id: string) => {
    Haptics.selectionAsync();
    setSelectedComfortIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#0F172A", "#000"]} style={StyleSheet.absoluteFill} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* HEADER SECTION (Keep your existing header logic) */}
        <Pressable onPress={() => setShowModal(true)} style={styles.header}>
           <Text style={styles.phaseLabel}>{phase.toUpperCase()} PHASE</Text>
           <Text style={styles.title}>{phaseFoodLogic[phase].title}</Text>
        </Pressable>

        {/* HEALTHY RECOMMENDATIONS */}
        <Text style={styles.sectionHeading}>Daily Recommendations</Text>
        {healthyRecommendations.map((item) => {
          const isEaten = eatenIds.includes(item.id);
          return (
            <Pressable key={item.id} onPress={() => handleToggleEaten(item.id)} style={[styles.foodCard, isEaten && styles.foodCardEaten]}>
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

        {/* SELECTED COMFORT ITEMS (Only shows if items are picked) */}
        {activeComfortItems.length > 0 && (
          <>
            <Text style={styles.sectionHeading}>Today's Cravings</Text>
            {activeComfortItems.map((item) => (
              <Pressable key={item.id} onPress={() => handleToggleEaten(item.id)} style={[styles.foodCard, styles.comfortActiveCard, eatenIds.includes(item.id) && styles.foodCardEaten]}>
                 <Text style={styles.foodEmoji}>{item.icon}</Text>
                 <View style={styles.foodTexts}>
                    <Text style={styles.foodName}>{item.name}</Text>
                    <Text style={styles.itemTip}>Tip: {item.tip}</Text>
                 </View>
                 <Pressable onPress={() => toggleComfortSelection(item.id)}>
                    <Ionicons name="trash-outline" size={20} color="#ef4444" />
                 </Pressable>
              </Pressable>
            ))}
          </>
        )}

        {/* THE "WHAT DO YOU WANNA EAT" BUTTON */}
        <Pressable 
          style={styles.craveButton} 
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setShowComfortPicker(true);
          }}
        >
          <Ionicons name="restaurant" size={20} color="#fff" style={{marginRight: 10}} />
          <Text style={styles.craveButtonText}>What do you wanna eat today?</Text>
        </Pressable>

        {/* PRO TIP BOX */}
        <LinearGradient colors={["#1E293B", "#0F172A"]} style={styles.tipCard}>
           <Text style={styles.tipText}>Your body uses nutrients differently in the {phase} phase.</Text>
        </LinearGradient>
      </ScrollView>

      {/* COMFORT PICKER MODAL */}
      <Modal visible={showComfortPicker} transparent animationType="slide">
        <BlurView intensity={90} tint="dark" style={styles.pickerOverlay}>
          <View style={styles.pickerContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose Cravings 🧸</Text>
              <Pressable onPress={() => setShowComfortPicker(false)}>
                <Ionicons name="close-circle" size={30} color="#94A3B8" />
              </Pressable>
            </View>
            
            <ScrollView style={{maxHeight: height * 0.6}}>
              {comfortOptions.map((item) => (
                <Pressable 
                  key={item.id} 
                  onPress={() => toggleComfortSelection(item.id)}
                  style={[styles.pickerItem, selectedComfortIds.includes(item.id) && styles.pickerItemActive]}
                >
                  <Text style={styles.foodEmoji}>{item.icon}</Text>
                  <Text style={styles.foodName}>{item.name}</Text>
                  <Ionicons 
                    name={selectedComfortIds.includes(item.id) ? "checkbox" : "square-outline"} 
                    size={24} 
                    color={selectedComfortIds.includes(item.id) ? "#ec4899" : "#475569"} 
                  />
                </Pressable>
              ))}
            </ScrollView>

            <Pressable style={styles.closeBtn} onPress={() => setShowComfortPicker(false)}>
              <Text style={styles.closeBtnText}>Done</Text>
            </Pressable>
          </View>
        </BlurView>
      </Modal>

      {/* (Your existing Science Modal logic goes here) */}
    </View>
  );
}

const styles = StyleSheet.create({
  // ... (Keep your previous container, header, and card styles)
  container: { flex: 1, backgroundColor: '#000' },
  scrollContent: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  header: { marginBottom: 30 },
  phaseLabel: { color: "#ec4899", fontWeight: "900", letterSpacing: 1.5, fontSize: 13 },
  title: { color: "#fff", fontSize: 34, fontWeight: "900", marginTop: 5 },
  sectionHeading: { color: "#fff", fontSize: 20, fontWeight: "900", marginBottom: 18, marginTop: 20 },
  
  // Comfort Picker Button
  craveButton: {
    backgroundColor: '#ec4899',
    borderRadius: 20,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#ec4899',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  craveButtonText: { color: '#fff', fontWeight: '900', fontSize: 16 },

  // Active Comfort Cards
  comfortActiveCard: { backgroundColor: 'rgba(236, 72, 153, 0.1)', borderColor: 'rgba(236, 72, 153, 0.3)' },
  itemTip: { color: '#ec4899', fontSize: 12, fontStyle: 'italic' },

  // Picker Modal
  pickerOverlay: { flex: 1, justifyContent: 'flex-end' },
  pickerContent: { 
    backgroundColor: '#1E293B', 
    borderTopLeftRadius: 40, 
    borderTopRightRadius: 40, 
    padding: 25, 
    paddingBottom: 40 
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { color: '#fff', fontSize: 22, fontWeight: '900' },
  pickerItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 15, 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    borderRadius: 15, 
    marginBottom: 10,
    justifyContent: 'space-between'
  },
  pickerItemActive: { backgroundColor: 'rgba(236, 72, 153, 0.15)', borderWidth: 1, borderColor: '#ec4899' },
  closeBtn: { marginTop: 20, backgroundColor: '#ec4899', padding: 18, borderRadius: 20, alignItems: 'center' },
  closeBtnText: { color: '#fff', fontWeight: '900' },
  
  // Existing Card Styles
  foodCard: { backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 24, padding: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  foodCardEaten: { backgroundColor: "rgba(34, 197, 94, 0.08)", borderColor: "rgba(34, 197, 94, 0.2)" },
  foodInfo: { flexDirection: "row", alignItems: "center", flex: 1 },
  foodEmoji: { fontSize: 32, marginRight: 18 },
  foodTexts: { flex: 1 },
  foodName: { color: "#fff", fontSize: 17, fontWeight: "800" },
  textStrikethrough: { textDecorationLine: "line-through", color: "#64748B" },
  foodBenefit: { color: "#94A3B8", fontSize: 12, marginTop: 3 },
  checkbox: { width: 28, height: 28, borderRadius: 10, borderWidth: 2, borderColor: "#334155", justifyContent: "center", alignItems: "center" },
  checkboxActive: { backgroundColor: "#22c55e", borderColor: "#22c55e" },
  tipCard: { marginTop: 25, padding: 20, borderRadius: 24 },
  tipText: { color: "#94A3B8", fontSize: 13 },
});