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
  const gridScale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Entrance Sequence
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(gridScale, { toValue: 1, friction: 8, useNativeDriver: true })
    ]).start();

    (async () => {
      const saved = await loadTodayPainDetails();
      if (saved) {
        setSelectedParts(saved.bodyParts);
        setPainLevel(saved.level);
        setIsEditing(false);
      }
    })();
  }, []);

  const activeMeterColor = useMemo(() => {
    const hue = Math.max(0, 120 - painLevel * 12);
    return `hsl(${hue}, 80%, 55%)`;
  }, [painLevel]);

  const togglePart = (id: string) => {
    if (!isEditing) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedParts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleConfirm = async () => {
    await savePainDetails({
      bodyParts: selectedParts,
      level: painLevel,
      updatedAt: new Date().toLocaleTimeString(),
    });
    setShowSuccess(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Background dynamic glow */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#0F172A' }]} />
      <LinearGradient 
        colors={[activeMeterColor + '20', 'transparent']} 
        style={{ height: 300, position: 'absolute', top: 0, width: '100%' }} 
      />

      <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ scale: gridScale }] }]}>
        <View style={styles.headerSection}>
          <Text style={styles.heading}>{isEditing ? "Where does it hurt?" : "Your Pain Map"}</Text>
        </View>

        <View style={styles.grid}>
          {painBodyParts.map((part) => {
            const selected = selectedParts.includes(part.id);
            return (
              <Pressable
                key={part.id}
                onPress={() => togglePart(part.id)}
                style={({ pressed }) => [
                  styles.card,
                  isEditing && pressed && { transform: [{ scale: 0.9 }] },
                  !isEditing && !selected && { opacity: 0.2 }
                ]}
              >
                <View style={[
                  styles.iconCircle, 
                  selected && { backgroundColor: activeMeterColor, borderColor: '#fff', shadowColor: activeMeterColor, shadowOpacity: 0.5, shadowRadius: 10 }
                ]}>
                  <Image source={part.image} style={[styles.icon, selected && { tintColor: '#fff' }]} resizeMode="contain" />
                </View>
                <Text style={[styles.label, selected && { color: '#fff', fontWeight: '900' }]}>{part.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.meterCard}>
          <Text style={styles.meterTitle}>Pain Intensity: <Text style={{color: activeMeterColor}}>{painLevel}</Text></Text>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0} maximumValue={10} step={1}
            value={painLevel} disabled={!isEditing}
            onValueChange={setPainLevel}
            minimumTrackTintColor={activeMeterColor}
            thumbTintColor="#fff"
          />
        </View>

        <View style={styles.buttonGroup}>
          {isEditing ? (
            <Pressable style={styles.saveButton} onPress={handleConfirm}>
              <Text style={styles.saveButtonText}>Confirm Log</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.editButton} onPress={() => setIsEditing(true)}>
              <Text style={styles.editButtonText}>Edit Map</Text>
            </Pressable>
          )}
          <Pressable style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>Change Type</Text>
          </Pressable>
        </View>
      </Animated.View>

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
  safe: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 20 },
  headerSection: { alignItems: 'center', marginVertical: 30 },
  heading: { fontSize: 28, fontWeight: "900", color: "#fff" },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  card: { width: (width - 60) / 4, marginBottom: 20, alignItems: "center" },
  iconCircle: { width: 65, height: 65, borderRadius: 22, backgroundColor: "#1E293B", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  icon: { width: 30, height: 30, tintColor: '#475569' },
  label: { marginTop: 8, fontSize: 12, color: "#64748B" },
  meterCard: { backgroundColor: '#1E293B', padding: 25, borderRadius: 30, marginTop: 'auto', marginBottom: 20 },
  meterTitle: { color: "#fff", fontSize: 18, fontWeight: '800', marginBottom: 10 },
  saveButton: { backgroundColor: '#ec4899', height: 65, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  saveButtonText: { fontSize: 18, fontWeight: '900', color: '#fff' },
  editButton: { backgroundColor: 'rgba(255,255,255,0.1)', height: 65, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#fff' },
  editButtonText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  backButton: { padding: 20, alignItems: 'center' },
  backButtonText: { color: '#64748B', fontWeight: '700' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  successTitle: { color: '#fff', fontSize: 24, fontWeight: '900', marginTop: 10 },
  buttonGroup: { marginTop: 20,gap: 12, },
  
});