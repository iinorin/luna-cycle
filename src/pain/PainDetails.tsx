import { View, Text, StyleSheet, Pressable, Image, Dimensions, Modal, Animated } from "react-native";
import { useState, useRef, useEffect, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Slider from "@react-native-community/slider";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

import { painBodyParts } from "./painBodyParts";
import { loadTodayPainDetails, savePainDetails } from "./painDetailsStorage";

const { width } = Dimensions.get("window");

interface PainDetailsProps {
  onBack: () => void;
}

export default function PainDetails({ onBack }: PainDetailsProps) {
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [painLevel, setPainLevel] = useState(0);
  const [isEditing, setIsEditing] = useState(true); 
  const [showSuccess, setShowSuccess] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      const saved = await loadTodayPainDetails();
      if (saved) {
        setSelectedParts(saved.bodyParts);
        setPainLevel(saved.level);
        setIsEditing(false); // Start in Read-Only if data exists
      }
    })();
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  const activeMeterColor = useMemo(() => {
    const hue = Math.max(0, 120 - painLevel * 12);
    return `hsl(${hue}, 80%, 55%)`;
  }, [painLevel]);

  const togglePart = (id: string) => {
    if (!isEditing) return;
    Haptics.selectionAsync();
    setSelectedParts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleConfirm = async () => {
    if (selectedParts.length === 0) return;
    await savePainDetails({
      bodyParts: selectedParts,
      level: painLevel,
      updatedAt: new Date().toLocaleTimeString(),
    });
    setIsEditing(false); // Switch back to view mode after saving
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#0F172A' }]} />
      
      <View style={styles.container}>
        <View style={styles.headerSection}>
          <Text style={styles.heading}>{isEditing ? "Where does it hurt?" : "Your Pain Map"}</Text>
        </View>

        {/* BODY GRID */}
        <View style={[styles.grid, !isEditing && { opacity: 0.8 }]}>
          {painBodyParts.map((part) => {
            const selected = selectedParts.includes(part.id);
            return (
              <Pressable
                key={part.id}
                onPress={() => togglePart(part.id)}
                disabled={!isEditing}
                style={[
                  styles.card,
                  !isEditing && !selected && { opacity: 0.2 } // Grey out unselected
                ]}
              >
                <View style={[
                  styles.iconCircle, 
                  selected && { backgroundColor: activeMeterColor, borderColor: '#fff' }
                ]}>
                  <Image source={part.image} style={[styles.icon, selected && { tintColor: '#fff' }]} resizeMode="contain" />
                </View>
                <Text style={[styles.label, selected && { color: '#fff' }]}>{part.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* INTENSITY SLIDER */}
        <View style={[styles.meterCard, !isEditing && { opacity: 0.5 }]}>
          <Text style={styles.meterTitle}>Intensity: {painLevel}</Text>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0} maximumValue={10} step={1}
            value={painLevel}
            disabled={!isEditing}
            onValueChange={setPainLevel}
            minimumTrackTintColor={activeMeterColor}
            thumbTintColor={isEditing ? "#fff" : "transparent"} // Hide thumb when locked
          />
        </View>

        {/* DYNAMIC BUTTONS */}
        <View style={styles.buttonGroup}>
          {isEditing ? (
            <Pressable 
              style={[styles.saveButton, selectedParts.length === 0 && styles.disabledButton]} 
              onPress={handleConfirm}
              disabled={selectedParts.length === 0}
            >
              <Text style={styles.saveButtonText}>Confirm Log</Text>
            </Pressable>
          ) : (
            <Pressable 
              style={styles.editButton} 
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setIsEditing(true);
              }}
            >
              <Ionicons name="pencil" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.editButtonText}>Edit Entry</Text>
            </Pressable>
          )}

          <Pressable style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>Change Selection</Text>
          </Pressable>
        </View>
      </View>

      {/* Success Modal remains the same */}
      <Modal transparent visible={showSuccess} animationType="fade">
        <BlurView intensity={100} tint="dark" style={styles.modalOverlay}>
            <Ionicons name="checkmark-done-circle" size={100} color={activeMeterColor} />
            <Text style={styles.successTitle}>Entry Logged</Text>
        </BlurView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0F172A' },
  container: { flex: 1, paddingHorizontal: 20 },
  headerSection: { alignItems: 'center', marginVertical: 30 },
  heading: { fontSize: 26, fontWeight: "900", color: "#fff" },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  card: { width: (width - 60) / 4, marginBottom: 20, alignItems: "center" },
  iconCircle: { width: 62, height: 62, borderRadius: 22, backgroundColor: "#1E293B", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  icon: { width: 28, height: 28, tintColor: '#475569' },
  label: { marginTop: 8, fontSize: 11, color: "#64748B", fontWeight: '600' },
  meterCard: { backgroundColor: '#1E293B', padding: 20, borderRadius: 24, marginTop: 'auto', marginBottom: 20 },
  meterTitle: { color: "#fff", fontSize: 16, fontWeight: '800', marginBottom: 5 },
  buttonGroup: { marginBottom: 10 },
  saveButton: { backgroundColor: '#ec4899', height: 60, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  disabledButton: { backgroundColor: '#334155', opacity: 0.6 },
  saveButtonText: { fontSize: 17, fontWeight: '900', color: '#fff' },
  editButton: { backgroundColor: 'rgba(255,255,255,0.1)', height: 60, borderRadius: 20, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  editButtonText: { color: '#fff', fontSize: 17, fontWeight: '800' },
  backButton: { padding: 15, alignItems: 'center' },
  backButtonText: { color: '#64748B', fontWeight: '700' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  successTitle: { color: '#fff', fontSize: 22, fontWeight: '900', marginTop: 10 }
});