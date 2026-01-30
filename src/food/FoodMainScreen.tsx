import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  Dimensions,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { foodSuggestions, phaseFoodLogic, CyclePhase } from "./foodTypes";

const { width } = Dimensions.get("window");

// Science Data for the Modal
const PHASE_SCIENCE = {
  menstrual: "Prostaglandins are high, causing cramps. Estrogen is at its lowest, which can dip your energy. Focus on Iron to replenish loss and Magnesium to relax the uterus.",
  follicular: "Estrogen is rising, boosting your brain power and energy. Your metabolism is slightly slower now, so complex carbs provide the best fuel.",
  ovulation: "Estrogen and Testosterone peak. You may feel more energetic. Antioxidants support the liver in processing this hormone surge.",
  safe: "Hormones are stabilizing. This is a great time for clean proteins and fiber to maintain the energy levels built during ovulation.",
  luteal: "Progesterone rises, which can increase cravings. B-vitamins help stabilize mood and reduce PMS-related bloating and sugar crashes."
};

interface FoodMainScreenProps {
  phase: CyclePhase;
}

export default function FoodMainScreen({ phase }: FoodMainScreenProps) {
  const [eatenIds, setEatenIds] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Filter foods based on the user's current cycle phase
  const filteredFoods = useMemo(() => 
    foodSuggestions.filter(f => f.recommendedPhase.includes(phase)), 
  [phase]);

  const progress = filteredFoods.length > 0 
    ? (eatenIds.length / filteredFoods.length) * 100 
    : 0;

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
        
        {/* PHASE HEADER - INTERACTIVE */}
        <Pressable 
          onPress={() => {
            Haptics.selectionAsync();
            setShowModal(true);
          }} 
          style={styles.header}
        >
          <View style={styles.headerTopRow}>
            <Text style={styles.phaseLabel}>{phase.toUpperCase()} PHASE</Text>
            <View style={styles.infoIconCircle}>
                <Ionicons name="information" size={12} color="#ec4899" />
            </View>
          </View>
          <Text style={styles.title}>{phaseFoodLogic[phase].title}</Text>
          <View style={styles.focusBadge}>
            <Text style={styles.focusText}>Focus: {phaseFoodLogic[phase].focus}</Text>
          </View>
        </Pressable>

        {/* PROGRESS CARD */}
        <View style={styles.progressCard}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressTitle}>Nutrition Goal</Text>
            <Text style={styles.progressSubText}>{eatenIds.length} of {filteredFoods.length} items logged</Text>
          </View>
          <View style={[styles.progressCircle, { borderColor: progress === 100 ? '#22c55e' : '#ec4899' }]}>
             <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
          </View>
        </View>

        {/* FOOD LIST SECTION */}
        <Text style={styles.sectionHeading}>Daily Recommendations</Text>
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

        {/* PRO TIP BOX */}
        <LinearGradient colors={["#1E293B", "#0F172A"]} style={styles.tipCard}>
          <View style={styles.tipIconBg}>
            <Ionicons name="leaf" size={20} color="#22c55e" />
          </View>
          <Text style={styles.tipText}>
            Your body uses nutrients differently in the {phase} phase. These choices help balance your hormones naturally.
          </Text>
        </LinearGradient>
      </ScrollView>

      {/* SCIENCE MODAL */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <BlurView intensity={60} tint="dark" style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Phase Science 🧬</Text>
              <Pressable onPress={() => setShowModal(false)}>
                <Ionicons name="close-circle" size={32} color="#475569" />
              </Pressable>
            </View>

            <Text style={styles.phaseScienceTitle}>Internal Climate</Text>
            <Text style={styles.phaseDescription}>
              {PHASE_SCIENCE[phase]}
            </Text>

            <View style={styles.nutrientList}>
              <Text style={styles.nutrientHeading}>Critical Bio-Needs:</Text>
              <View style={styles.nutrientBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#ec4899" />
                <Text style={styles.nutrientText}>{phaseFoodLogic[phase].focus}</Text>
              </View>
            </View>

            <Pressable 
                style={styles.closeBtn} 
                onPress={() => setShowModal(false)}
            >
              <Text style={styles.closeBtnText}>I understand</Text>
            </Pressable>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  scrollContent: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  
  // Header
  header: { marginBottom: 30 },
  headerTopRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  phaseLabel: { color: "#ec4899", fontWeight: "900", letterSpacing: 1.5, fontSize: 13 },
  infoIconCircle: { width: 18, height: 18, borderRadius: 9, borderWidth: 1, borderColor: '#ec4899', justifyContent: 'center', alignItems: 'center' },
  title: { color: "#fff", fontSize: 34, fontWeight: "900", marginTop: 5 },
  focusBadge: { backgroundColor: "rgba(236, 72, 153, 0.1)", alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginTop: 12, borderWidth: 1, borderColor: 'rgba(236, 72, 153, 0.2)' },
  focusText: { color: "#ec4899", fontWeight: "800", fontSize: 13 },

  // Progress
  progressCard: { backgroundColor: "#1E293B", borderRadius: 28, padding: 22, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 35, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  progressInfo: { flex: 1 },
  progressTitle: { color: "#fff", fontSize: 18, fontWeight: "800" },
  progressSubText: { color: "#94A3B8", fontSize: 13, marginTop: 4 },
  progressCircle: { width: 65, height: 65, borderRadius: 32.5, borderWidth: 4, justifyContent: "center", alignItems: "center" },
  progressPercent: { color: "#fff", fontWeight: "900", fontSize: 16 },

  // Food List
  sectionHeading: { color: "#fff", fontSize: 20, fontWeight: "900", marginBottom: 18, marginLeft: 4 },
  foodCard: { backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 24, padding: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  foodCardEaten: { backgroundColor: "rgba(34, 197, 94, 0.08)", borderColor: "rgba(34, 197, 94, 0.2)" },
  foodInfo: { flexDirection: "row", alignItems: "center", flex: 1 },
  foodEmoji: { fontSize: 32, marginRight: 18 },
  foodTexts: { flex: 1 },
  foodName: { color: "#fff", fontSize: 17, fontWeight: "800" },
  textStrikethrough: { textDecorationLine: "line-through", color: "#64748B" },
  foodBenefit: { color: "#94A3B8", fontSize: 12, marginTop: 3, fontWeight: '500' },
  checkbox: { width: 28, height: 28, borderRadius: 10, borderWidth: 2, borderColor: "#334155", justifyContent: "center", alignItems: "center" },
  checkboxActive: { backgroundColor: "#22c55e", borderColor: "#22c55e" },

  // Tip Card
  tipCard: { marginTop: 25, padding: 20, borderRadius: 24, flexDirection: "row", alignItems: "center", gap: 18 },
  tipIconBg: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(34, 197, 94, 0.1)', justifyContent: 'center', alignItems: 'center' },
  tipText: { color: "#94A3B8", fontSize: 13, flex: 1, lineHeight: 20, fontWeight: '500' },

  // Modal Styles
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  modalContent: { width: '100%', backgroundColor: "#1E293B", borderRadius: 35, padding: 28, shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 10 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 25 },
  modalTitle: { color: "#fff", fontSize: 24, fontWeight: "900" },
  phaseScienceTitle: { color: "#ec4899", fontSize: 16, fontWeight: "800", marginBottom: 10, textTransform: 'uppercase' },
  phaseDescription: { color: "#CBD5E1", fontSize: 16, lineHeight: 24, fontWeight: '500' },
  nutrientList: { marginTop: 25, backgroundColor: "rgba(0,0,0,0.25)", padding: 20, borderRadius: 20 },
  nutrientHeading: { color: "#fff", fontSize: 14, fontWeight: "700", marginBottom: 10 },
  nutrientBadge: { flexDirection: "row", alignItems: "center", gap: 8 },
  nutrientText: { color: "#ec4899", fontWeight: "900", fontSize: 15 },
  closeBtn: { marginTop: 30, backgroundColor: "#ec4899", paddingVertical: 16, borderRadius: 20, alignItems: "center" },
  closeBtnText: { color: "#fff", fontWeight: "900", fontSize: 16 }
});