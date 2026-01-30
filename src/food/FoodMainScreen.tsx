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

const PHASE_SCIENCE = {
  menstrual: "Prostaglandins are high. Focus on Iron to replenish loss and Magnesium to relax the uterus.",
  follicular: "Estrogen is rising. Your metabolism is steady; focus on vibrant veggies and light proteins.",
  ovulation: "Hormones peak. Antioxidants support the liver in processing the hormone surge.",
  safe: "Transition window. Maintain energy with clean proteins and fiber.",
  luteal: "Progesterone rises. B-vitamins help stabilize mood and reduce bloating."
};

export default function FoodMainScreen({ phase }: { phase: CyclePhase }) {
  const [eatenIds, setEatenIds] = useState<string[]>([]);
  const [selectedComfortIds, setSelectedComfortIds] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showComfortPicker, setShowComfortPicker] = useState(false);

  // 1. Healthy Recommendations (Phase Specific)
  const healthyRecommendations = useMemo(() => 
    foodSuggestions.filter(f => 
      f.recommendedPhase.includes(phase) && 
      f.category !== "Comfort" && 
      f.category !== "Drinks"
    ), [phase]);

  // 2. Comfort Options for Picker
  const comfortOptions = useMemo(() => 
    foodSuggestions.filter(f => 
      f.recommendedPhase.includes(phase) && 
      (f.category === "Comfort" || f.category === "Drinks")
    ), [phase]);

  // 3. User Selected Cravings
  const activeComfortItems = useMemo(() => 
    comfortOptions.filter(f => selectedComfortIds.includes(f.id)), 
  [selectedComfortIds, comfortOptions]);

  // PROGRESS LOGIC: Tracks only the Healthy Recommendations
  const healthyEatenCount = healthyRecommendations.filter(f => eatenIds.includes(f.id)).length;
  const progress = healthyRecommendations.length > 0 
    ? (healthyEatenCount / healthyRecommendations.length) * 100 
    : 0;

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
        {/* PHASE HEADER */}
        <Pressable onPress={() => setShowModal(true)} style={styles.header}>
           <Text style={styles.phaseLabel}>{phase.toUpperCase()} PHASE</Text>
           <Text style={styles.title}>{phaseFoodLogic[phase].title} 🧬</Text>
           <Text style={styles.scienceLink}>Why these foods? Tap to learn</Text>
        </Pressable>

        {/* PROGRESS CARD (Healthy Progress) */}
        <View style={styles.progressCard}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressTitle}>Nutrition Goal</Text>
            <Text style={styles.progressSubText}>{healthyEatenCount} of {healthyRecommendations.length} power-foods logged</Text>
          </View>
          <View style={[styles.progressCircle, { borderColor: progress === 100 ? '#22c55e' : '#ec4899' }]}>
             <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
          </View>
        </View>

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
                  {/* RE-ADDED SCIENCE TIP */}
                  <Text style={styles.itemTip}>Science: {item.tip}</Text>
                </View>
              </View>
              <View style={[styles.checkbox, isEaten && styles.checkboxActive]}>
                {isEaten && <Ionicons name="checkmark" size={16} color="#fff" />}
              </View>
            </Pressable>
          );
        })}

        {/* ACTIVE CRAVINGS (Show only selected ones) */}
        {activeComfortItems.length > 0 && (
          <>
            <Text style={styles.sectionHeading}>Today's Cravings 🧸</Text>
            {activeComfortItems.map((item) => (
              <Pressable key={item.id} onPress={() => handleToggleEaten(item.id)} style={[styles.foodCard, styles.comfortActiveCard, eatenIds.includes(item.id) && styles.foodCardEaten]}>
                 <Text style={styles.foodEmoji}>{item.icon}</Text>
                 <View style={styles.foodTexts}>
                    <Text style={styles.foodName}>{item.name}</Text>
                    <Text style={styles.comfortTipText}>Pro-Tip: {item.tip}</Text>
                 </View>
                 <Pressable onPress={() => toggleComfortSelection(item.id)} style={styles.removeCrave}>
                    <Ionicons name="close-circle" size={22} color="#475569" />
                 </Pressable>
              </Pressable>
            ))}
          </>
        )}

        {/* CRAVING PICKER BUTTON */}
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

        {/* SCIENCE MODAL */}
        <Modal visible={showModal} transparent animationType="fade">
          <BlurView intensity={80} tint="dark" style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Biological Focus 🧪</Text>
              <Text style={styles.modalDesc}>{PHASE_SCIENCE[phase]}</Text>
              <Pressable style={styles.closeBtn} onPress={() => setShowModal(false)}><Text style={styles.closeBtnText}>I understand</Text></Pressable>
            </View>
          </BlurView>
        </Modal>

        {/* COMFORT PICKER BOTTOM SHEET */}
        <Modal visible={showComfortPicker} transparent animationType="slide">
          <BlurView intensity={95} tint="dark" style={styles.pickerOverlay}>
            <View style={styles.pickerContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Cravings</Text>
                <Pressable onPress={() => setShowComfortPicker(false)}>
                  <Ionicons name="chevron-down-circle" size={32} color="#475569" />
                </Pressable>
              </View>
              <ScrollView>
                {comfortOptions.map((item) => (
                  <Pressable 
                    key={item.id} 
                    onPress={() => toggleComfortSelection(item.id)}
                    style={[styles.pickerItem, selectedComfortIds.includes(item.id) && styles.pickerItemActive]}
                  >
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={styles.foodEmoji}>{item.icon}</Text>
                      <Text style={styles.foodName}>{item.name}</Text>
                    </View>
                    <Ionicons 
                      name={selectedComfortIds.includes(item.id) ? "checkmark-circle" : "add-circle-outline"} 
                      size={24} 
                      color={selectedComfortIds.includes(item.id) ? "#22c55e" : "#475569"} 
                    />
                  </Pressable>
                ))}
              </ScrollView>
              <Pressable style={styles.closeBtn} onPress={() => setShowComfortPicker(false)}>
                <Text style={styles.closeBtnText}>Add to Daily List</Text>
              </Pressable>
            </View>
          </BlurView>
        </Modal>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  scrollContent: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  header: { marginBottom: 30 },
  phaseLabel: { color: "#ec4899", fontWeight: "900", letterSpacing: 1.5, fontSize: 13 },
  title: { color: "#fff", fontSize: 34, fontWeight: "900", marginTop: 5 },
  scienceLink: { color: '#475569', fontSize: 13, textDecorationLine: 'underline', marginTop: 5 },
  sectionHeading: { color: "#fff", fontSize: 20, fontWeight: "900", marginBottom: 18, marginTop: 25 },

  // Progress
  progressCard: { backgroundColor: "#1E293B", borderRadius: 28, padding: 22, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  progressInfo: { flex: 1 },
  progressTitle: { color: "#fff", fontSize: 18, fontWeight: "800" },
  progressSubText: { color: "#94A3B8", fontSize: 13, marginTop: 4 },
  progressCircle: { width: 65, height: 65, borderRadius: 32.5, borderWidth: 4, justifyContent: "center", alignItems: "center" },
  progressPercent: { color: "#fff", fontWeight: "900", fontSize: 16 },

  // Cards
  foodCard: { backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 24, padding: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  foodCardEaten: { opacity: 0.5 },
  foodInfo: { flexDirection: "row", alignItems: "center", flex: 1 },
  foodEmoji: { fontSize: 32, marginRight: 15 },
  foodTexts: { flex: 1 },
  foodName: { color: "#fff", fontSize: 17, fontWeight: "800" },
  textStrikethrough: { textDecorationLine: "line-through", color: "#64748B" },
  foodBenefit: { color: "#94A3B8", fontSize: 12, marginTop: 3 },
  itemTip: { color: "#ec4899", fontSize: 11, marginTop: 6, fontWeight: '600' },
  checkbox: { width: 28, height: 28, borderRadius: 10, borderWidth: 2, borderColor: "#334155", justifyContent: "center", alignItems: "center" },
  checkboxActive: { backgroundColor: "#22c55e", borderColor: "#22c55e" },

  // Cravings/Comfort
  craveButton: { backgroundColor: '#1E293B', borderRadius: 24, paddingVertical: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20, borderWidth: 1, borderColor: '#ec4899' },
  craveButtonText: { color: '#fff', fontWeight: '900', fontSize: 16 },
  comfortActiveCard: { borderColor: 'rgba(236, 72, 153, 0.4)', backgroundColor: 'rgba(236, 72, 153, 0.05)' },
  comfortTipText: { color: '#94A3B8', fontSize: 11, marginTop: 4, fontStyle: 'italic' },
  removeCrave: { marginLeft: 10 },

  // MODAL STYLES (This fixes your error)
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  modalContent: { width: '100%', backgroundColor: "#1E293B", borderRadius: 35, padding: 28 },
  modalTitle: { color: "#fff", fontSize: 24, fontWeight: "900", marginBottom: 12 },
  modalDesc: { color: "#CBD5E1", fontSize: 16, lineHeight: 24, marginBottom: 20 },
  closeBtn: { backgroundColor: "#ec4899", paddingVertical: 18, borderRadius: 22, alignItems: "center" },
  closeBtnText: { color: "#fff", fontWeight: "900", fontSize: 16 },

  // Picker Styles
  pickerOverlay: { flex: 1, justifyContent: "flex-end" },
  pickerContent: { backgroundColor: "#1E293B", borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 25, paddingBottom: 50, height: height * 0.7 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  pickerItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 18, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 20, marginBottom: 12 },
  pickerItemActive: { borderColor: '#22c55e', borderWidth: 1, backgroundColor: 'rgba(34, 197, 94, 0.05)' }
});