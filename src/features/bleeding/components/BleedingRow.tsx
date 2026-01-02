import { View, Text, Pressable, StyleSheet, Animated } from "react-native";
import { useEffect, useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Droplet, CheckCircle2 } from "lucide-react-native";

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
  const pulse = useRef(new Animated.Value(1)).current;

  /* 🔄 Load saved bleeding for today */
  useEffect(() => {
    loadToday();
  }, []);

  async function loadToday() {
    const store = await getBleedingStore();
    const todayKey = new Date().toISOString().slice(0, 10);

    if (store[todayKey]) {
      setLevel(store[todayKey].level);
    }
  }

  /* 💾 Save bleeding level */
  async function save(levelValue: number) {
    setLevel(levelValue);

    const date = new Date();
    await saveBleedingEntry({
      date,
      level: levelValue,
      stopped: false,
    });

    console.log("🩸 Bleeding saved:", date.toDateString(), levelValue);
  }

  /* 🛑 Bleeding stopped */
  async function markStopped() {
    const date = new Date();

    await saveBleedingEntry({
      date,
      level,
      stopped: true,
    });

    console.log("🛑 Bleeding stopped:", date.toDateString());
  }

  /* 🔴 Pulse animation for STOP button */
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

  const CardWrapper = isPeriodDay ? View : BlurView;

  return (
    <View style={styles.wrapper}>
      <CardWrapper
        intensity={25}
        tint="dark"
        style={[
          styles.card,
          !isPeriodDay && styles.disabledCard,
        ]}
      >
        {/* 🩸 Blood Gradient */}
        <LinearGradient
          colors={[
            "rgba(244,63,94,0.35)",
            "rgba(244,63,94,0.08)",
            "transparent",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        <Text style={styles.title}>Bleeding</Text>
        <Text style={styles.subtitle}>
          {isPeriodDay ? `Today • Day ${day}` : "Outside period days"}
        </Text>

        {/* 💧 Bleeding Level */}
        <View style={styles.row}>
          {LEVELS.map((item, index) => {
            const active = level === index;

            return (
              <Pressable
                key={item.label}
                disabled={!isPeriodDay}
                onPress={() => save(index)}
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

        {/* ✅ HAS BLEEDING STOPPED */}
        {isPeriodDay && (
          <Animated.View style={{ transform: [{ scale: pulse }] }}>
            <Pressable
              style={styles.stopButton}
              onPress={markStopped}
            >
              <CheckCircle2 size={18} color="#fff" />
              <Text style={styles.stopText}>
                Has bleeding stopped?
              </Text>
            </Pressable>
          </Animated.View>
        )}
      </CardWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    marginTop: 24,
  },

  card: {
    borderRadius: 22,
    padding: 20,
    overflow: "hidden",
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

  stopButton: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: "#F43F5E",
  },

  stopText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
