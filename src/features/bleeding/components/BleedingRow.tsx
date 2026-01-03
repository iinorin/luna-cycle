import { View, Text, Pressable, StyleSheet, Animated, Alert } from "react-native";
import { useEffect, useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Droplet, CheckCircle2, Save } from "lucide-react-native";

import {
  getBleedingStore,
  saveBleedingEntry,
} from "@/src/features/bleeding/storage";

type BleedingRowProps = {
  day: number;
  isPeriodDay: boolean;
};

const LEVELS = [
  { label: "None", drops: 0 },
  { label: "Light", drops: 1 },
  { label: "Medium", drops: 2 },
  { label: "Heavy", drops: 3 },
];

export default function BleedingRow({
  day,
  isPeriodDay,
}: BleedingRowProps) {
  const [level, setLevel] = useState(0);
  const [stopped, setStopped] = useState(false);
  const pulse = useRef(new Animated.Value(1)).current;

  /* 📅 Today key */
  const todayKey = new Date().toISOString().slice(0, 10);

  /* 🔄 Load saved data */
  useEffect(() => {
    loadToday();
  }, []);

  async function loadToday() {
    const store = await getBleedingStore();

    if (store[todayKey]) {
      setLevel(store[todayKey].level);
      setStopped(store[todayKey].stopped ?? false);
    }
  }

  /* 💾 SAVE */
  async function saveData() {
    await saveBleedingEntry({
      date: new Date(),
      level,
      stopped,
    });

    Alert.alert(
      "Saved 🩸",
      `Bleeding marked as ${LEVELS[level].label} for today.`
    );
  }

  /* 🛑 STOP */
  async function markStopped() {
    setStopped(true);

    await saveBleedingEntry({
      date: new Date(),
      level,
      stopped: true,
    });

    Alert.alert("Updated", "Bleeding marked as stopped today.");
  }

  /* 🔴 Pulse animation */
  useEffect(() => {
    if (!isPeriodDay) return;

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.06,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [isPeriodDay]);

  return (
    <View style={styles.wrapper}>
      {/* 🧊 OUTER WRAPPER (IMPORTANT FIX) */}
      <View style={styles.cardWrapper}>
        {/* 🌫️ BLUR BACKGROUND (only when disabled) */}
        {!isPeriodDay && (
          <BlurView
            intensity={25}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
        )}

        {/* 🩸 CARD CONTENT */}
        <View
          style={[
            styles.card,
            !isPeriodDay && styles.disabledCard,
          ]}
        >
          {/* 🔴 Gradient */}
          <LinearGradient
            colors={[
              "rgba(244,63,94,0.35)",
              "rgba(244,63,94,0.08)",
              "transparent",
            ]}
            style={StyleSheet.absoluteFill}
          />

          <Text style={styles.title}>Bleeding</Text>
          <Text style={styles.subtitle}>
            {isPeriodDay ? `Today • Day ${day}` : "Outside period days"}
          </Text>

          {/* 💧 LEVEL SELECTOR */}
          <View style={styles.row}>
            {LEVELS.map((item, index) => {
              const active = level === index;

              return (
                <Pressable
                  key={item.label}
                  disabled={!isPeriodDay}
                  onPress={() => setLevel(index)}
                  style={[
                    styles.option,
                    active && styles.activeOption,
                  ]}
                >
                  <View style={styles.iconRow}>
                    {Array.from({ length: item.drops }).map((_, i) => (
                      <Droplet
                        key={i}
                        size={18}
                        color={active ? "#F43F5E" : "#9CA3AF"}
                        fill={active ? "#F43F5E" : "transparent"}
                      />
                    ))}
                  </View>

                  <Text style={styles.label}>{item.label}</Text>
                </Pressable>
              );
            })}
          </View>

          {/* 💾 SAVE */}
          {isPeriodDay && (
            <Pressable style={styles.saveButton} onPress={saveData}>
              <Save size={18} color="#fff" />
              <Text style={styles.saveText}>Save</Text>
            </Pressable>
          )}

          {/* 🛑 STOP */}
          {isPeriodDay && !stopped && (
            <Animated.View style={{ transform: [{ scale: pulse }] }}>
              <Pressable
                style={styles.stopButton}
                onPress={markStopped}
              >
                <CheckCircle2 size={18} color="#fff" />
                <Text style={styles.stopText}>
                  Bleeding stopped
                </Text>
              </Pressable>
            </Animated.View>
          )}

          {/* ✅ STATUS */}
          {stopped && (
            <Text style={styles.stoppedText}>
              ✔ Bleeding has stopped today
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

/* 🎨 STYLES */
const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    marginTop: 24,
  },

  cardWrapper: {
    borderRadius: 22,
    overflow: "hidden",
  },

  card: {
    borderRadius: 22,
    padding: 20,
    backgroundColor: "#111827",
  },

  disabledCard: {
    opacity: 0.45,
  },

  title: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FEE2E2",
  },

  subtitle: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 16,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  option: {
    width: 72,
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "#0F172A",
  },

  activeOption: {
    backgroundColor: "rgba(244,63,94,0.25)",
  },

  iconRow: {
    flexDirection: "row",
    marginBottom: 6,
    minHeight: 22,
  },

  label: {
    fontSize: 12,
    color: "#CBD5F5",
  },

  saveButton: {
    marginTop: 18,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: "#22C55E",
  },

  saveText: {
    color: "#fff",
    fontWeight: "600",
  },

  stopButton: {
    marginTop: 14,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: "#F43F5E",
  },

  stopText: {
    color: "#fff",
    fontWeight: "600",
  },

  stoppedText: {
    marginTop: 14,
    textAlign: "center",
    color: "#86EFAC",
    fontSize: 13,
  },
});
