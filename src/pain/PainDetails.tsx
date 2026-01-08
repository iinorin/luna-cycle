import { View, Text, StyleSheet, Pressable, Image, Dimensions, Modal, Animated } from "react-native";
import { useState, useRef, useEffect, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Slider from "@react-native-community/slider";
import { StatusBar } from "expo-status-bar";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

import { painBodyParts } from "./painBodyParts";
import { loadTodayPainDetails, savePainDetails } from "./painDetailsStorage";

const { width } = Dimensions.get("window");

export default function PainDetails() {
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [painLevel, setPainLevel] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false); // New Mode State
  const [showSuccess, setShowSuccess] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      const saved = await loadTodayPainDetails();
      if (saved) {
        setSelectedParts(saved.bodyParts);
        setPainLevel(saved.level);
        setLastUpdated(saved.updatedAt || "Just now");
        setIsEditing(false); // Start in Read-Only if data exists
      } else {
        setIsEditing(true); // Start in Edit mode if no data
      }
    })();
  }, []);

  const activeMeterColor = useMemo(() => {
    if (selectedParts.length === 0) return "#475569";
    const hue = Math.max(0, 120 - painLevel * 12);
    return `hsl(${hue}, 80%, 55%)`;
  }, [painLevel, selectedParts]);

  const togglePart = (id: string) => {
    if (!isEditing) return; // Lock interaction
    Haptics.selectionAsync();
    setSelectedParts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleConfirm = async () => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    await savePainDetails({
      bodyParts: selectedParts,
      level: painLevel,
      updatedAt: now,
    });

    setLastUpdated(now);
    setShowSuccess(true);
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();

    setTimeout(() => {
      setShowSuccess(false);
      router.replace("/insights");
    }, 2200);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <View style={styles.container}>
        
        {/* HEADER SECTION */}
        <View style={styles.headerSection}>
          <Text style={styles.subHeading}>SYMPTOM TRACKER</Text>
          <Text style={styles.heading}>{isEditing ? "Where does it hurt?" : "Today's Log"}</Text>
          
          {lastUpdated && (
            <Text style={styles.timestamp}>Last updated at {lastUpdated}</Text>
          )}
        </View>

        {/* BODY GRID */}
        <View style={[styles.grid, !isEditing && styles.readOnlyGrid]}>
          {painBodyParts.map((part) => {
            const selected = selectedParts.includes(part.id);
            return (
              <Pressable
                key={part.id}
                onPress={() => togglePart(part.id)}
                disabled={!isEditing}
                style={({ pressed }) => [
                  styles.card,
                  isEditing && pressed && { transform: [{ scale: 0.92 }] },
                  !isEditing && !selected && { opacity: 0.3 } // Dim unselected in read-only
                ]}
              >
                <View style={[
                    styles.iconCircle, 
                    selected && { backgroundColor: activeMeterColor, borderColor: activeMeterColor, shadowColor: activeMeterColor }
                ]}>
                  <Image source={part.image} style={[styles.icon, selected && { tintColor: '#fff' }]} resizeMode="contain" />
                </View>
                <Text style={[styles.label, selected && styles.labelSelected]}>{part.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* INTENSITY METER */}
        <View style={[styles.meterCard, !isEditing && styles.readOnlyMeter]}>
          <View style={styles.meterHeader}>
             <Text style={styles.meterTitle}>Intensity</Text>
             <View style={[styles.valueBadge, { backgroundColor: activeMeterColor }]}>
                <Text style={styles.valueText}>{painLevel}</Text>
             </View>
          </View>

          <Slider
            style={styles.sliderOverlay}
            minimumValue={0}
            maximumValue={10}
            step={1}
            value={painLevel}
            disabled={!isEditing}
            onValueChange={setPainLevel}
            minimumTrackTintColor={activeMeterColor}
            maximumTrackTintColor="#0F172A"
            thumbTintColor={isEditing ? "#FFFFFF" : "transparent"}
          />
        </View>

        {/* DYNAMIC BUTTON GROUP */}
        <View style={styles.buttonGroup}>
          {isEditing ? (
            <Pressable 
              style={[styles.saveButton, selectedParts.length === 0 && styles.saveButtonDisabled]}
              onPress={handleConfirm}
              disabled={selectedParts.length === 0}
            >
              <Text style={styles.saveButtonText}>Confirm Entry</Text>
            </Pressable>
          ) : (
            <Pressable 
              style={styles.editButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setIsEditing(true);
              }}
            >
              <Ionicons name="pencil" size={18} color="#fff" style={{marginRight: 8}} />
              <Text style={styles.editButtonText}>Edit Entry</Text>
            </Pressable>
          )}

          <Pressable 
            style={styles.backButton}
            onPress={() => router.replace("/insights")}
          >
            <Text style={styles.backButtonText}>Back to Insights</Text>
          </Pressable>
        </View>
      </View>

      {/* SUCCESS MODAL */}
      <Modal transparent visible={showSuccess} animationType="none">
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
            <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={[styles.successCircle, { backgroundColor: activeMeterColor }]}>
                <Ionicons name="checkmark" size={40} color="#fff" />
            </View>
            <Text style={styles.successTitle}>Entry Saved</Text>
            <Text style={styles.successSub}>Going back to insights...</Text>
          </Animated.View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0F172A" },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 10 },
  headerSection: { alignItems: 'center', marginBottom: 24 },
  subHeading: { color: '#64748B', fontSize: 10, fontWeight: '900', letterSpacing: 2, marginBottom: 4 },
  heading: { fontSize: 26, fontWeight: "800", color: "#fff" },
  timestamp: { color: '#475569', fontSize: 12, marginTop: 4, fontWeight: '500' },
  
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  readOnlyGrid: { pointerEvents: 'none' },
  card: { width: (width - 68) / 4, marginBottom: 18, alignItems: "center" },
  iconCircle: { width: 62, height: 62, borderRadius: 22, backgroundColor: "#1E293B", alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.05)' },
  icon: { width: 28, height: 28, tintColor: '#94A3B8' },
  label: { marginTop: 8, fontSize: 11, color: "#64748B", fontWeight: '600' },
  labelSelected: { color: "#fff" },

  meterCard: { marginTop: 'auto', backgroundColor: '#1E293B', padding: 20, borderRadius: 24, marginBottom: 20 },
  readOnlyMeter: { opacity: 0.8 },
  meterHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  meterTitle: { color: "#fff", fontSize: 16, fontWeight: '700' },
  valueBadge: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  valueText: { color: '#fff', fontSize: 16, fontWeight: "900" },
  sliderOverlay: { width: '100%', height: 40 },

  buttonGroup: { marginBottom: 10 },
  saveButton: { backgroundColor: '#fff', height: 58, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  saveButtonDisabled: { backgroundColor: '#334155' },
  saveButtonText: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  
  editButton: { backgroundColor: 'rgba(255,255,255,0.1)', height: 58, borderRadius: 18, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  editButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  backButton: { height: 50, alignItems: 'center', justifyContent: 'center' },
  backButtonText: { fontSize: 14, fontWeight: '600', color: '#64748B' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: width * 0.7, padding: 30, borderRadius: 32, alignItems: 'center', overflow: 'hidden' },
  successCircle: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  successTitle: { color: '#fff', fontSize: 20, fontWeight: '800', marginBottom: 4 },
  successSub: { color: '#94A3B8', fontSize: 13, fontWeight: '500' },
});