import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Image,
  Easing,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { CheckCircle2, AlertTriangle, Trash2 } from "lucide-react-native";
import * as Haptics from "expo-haptics";

import {
  savePainForToday,
  clearPainData,
  PainSelection,
} from "./painDailyStorage";

interface PainScreenProps {
  onSelectPain: () => void;
  initialValue?: any;
}

export default function PainScreen({ onSelectPain, initialValue }: PainScreenProps) {
  const [selected, setSelected] = useState<PainSelection | null>(initialValue);
  const [saved, setSaved] = useState(initialValue !== null);

  // --- ANIMATIONS ---
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleNoPain = useRef(new Animated.Value(1)).current;
  const scalePain = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance Animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.04,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const animatePress = (scale: Animated.Value) => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.92, duration: 100, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handleSave = async () => {
    if (!selected) return;
    await savePainForToday(selected);
    setSaved(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Tell the "Brain" we are moving to the next step
    if (selected === 'pain') {
      onSelectPain();
    }
  };


  const handleDeleteTodayLog = async () => {
    await clearPainData();
    setSelected(null);
    setSaved(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <LinearGradient colors={["#1f2937", "#000000"]} style={styles.headerCard}>
        <Text style={styles.headerTitle}>Pain Today</Text>
        <Text style={styles.headerSubtitle}>
          {saved ? "Already logged for today" : "Let us know how you feel"}
        </Text>
      </LinearGradient>

      <View style={styles.iconRow}>
        {/* NO PAIN OPTION */}
        <Pressable
          disabled={saved}
          onPress={() => {
            setSelected("none");
            animatePress(scaleNoPain);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Animated.View
            style={[
              styles.iconWrapper,
              selected === "none" && styles.activeNoPain,
              saved && styles.locked,
              { transform: [{ scale: selected === "none" ? pulseAnim : scaleNoPain }] },
            ]}
          >
            <CheckCircle2 size={52} color={selected === "none" ? "#22c55e" : "#9ca3af"} />
            <Text style={[styles.iconLabel, selected === "none" && styles.activeLabel]}>No Pain</Text>
          </Animated.View>
        </Pressable>

        {/* PAIN OPTION */}
        <Pressable
          disabled={saved}
          onPress={() => {
            setSelected("pain");
            animatePress(scalePain);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }}
        >
          <Animated.View
            style={[
              styles.iconWrapper,
              selected === "pain" && styles.activePain,
              saved && styles.locked,
              { transform: [{ scale: selected === "pain" ? pulseAnim : scalePain }] },
            ]}
          >
            <AlertTriangle size={52} color={selected === "pain" ? "#ef4444" : "#9ca3af"} />
            <Text style={[styles.iconLabel, selected === "pain" && styles.activeLabel]}>Pain</Text>
          </Animated.View>
        </Pressable>
      </View>

      <Pressable
        disabled={selected === null || saved}
        style={[styles.saveButton, selected !== null && !saved ? styles.saveActive : styles.saveDisabled]}
        onPress={handleSave}
      >
        <Text style={styles.saveText}>{saved ? "Saved for today" : "Continue"}</Text>
      </Pressable>

      {saved && (
        <Pressable style={styles.deleteButton} onPress={handleDeleteTodayLog}>
          <Trash2 size={18} color="#f87171" />
          <Text style={styles.deleteText}>Delete today log</Text>
        </Pressable>
      )}

      {saved && selected === "none" && (
        <View style={styles.noPainContainer}>
          <Text style={styles.noPainTitle}>Yay! No pain today 💖</Text>
          <Image
            source={{ uri: "https://media1.tenor.com/m/mufcZq84L18AAAAd/pain-go-away.gif" }}
            style={styles.noPainGif}
          />
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#000000" },
  headerCard: { borderRadius: 25, padding: 25, marginBottom: 40, marginTop: 60 },
  headerTitle: { fontSize: 24, fontWeight: "900", color: "#ffffff" },
  headerSubtitle: { marginTop: 6, fontSize: 14, color: "#9ca3af" },
  iconRow: { flexDirection: "row", justifyContent: "space-evenly", marginBottom: 50 },
  iconWrapper: { width: 150, height: 160, borderRadius: 28, backgroundColor: "#111827", justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: 'transparent' },
  iconLabel: { marginTop: 15, fontSize: 16, fontWeight: "800", color: "#9ca3af" },
  activeNoPain: { backgroundColor: "#052e16", borderWidth: 2, borderColor: "#22c55e" },
  activePain: { backgroundColor: "#450a0a", borderWidth: 2, borderColor: "#ef4444" },
  activeLabel: { color: "#ffffff" },
  locked: { opacity: 0.6 },
  saveButton: { height: 60, borderRadius: 20, justifyContent: "center", alignItems: "center" },
  saveActive: { backgroundColor: "#ec4899" },
  saveDisabled: { backgroundColor: "#1f2937" },
  saveText: { fontSize: 18, fontWeight: "900", color: "#ffffff" },
  deleteButton: { marginTop: 25, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  deleteText: { fontSize: 14, color: "#f87171", fontWeight: "700" },
  noPainContainer: { marginTop: 30, alignItems: "center" },
  noPainTitle: { fontSize: 20, fontWeight: "800", color: "#ffffff", marginBottom: 15 },
  noPainGif: { width: 220, height: 220, borderRadius: 25 },
});