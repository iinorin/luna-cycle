import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
  Modal,
  Animated,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Slider from "@react-native-community/slider";
import { StatusBar } from "expo-status-bar";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { painBodyParts } from "./painBodyParts";
import {
  loadTodayPainDetails,
  savePainDetails
} from "./painDetailsStorage";

const { width } = Dimensions.get("window");

export default function PainDetails() {
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [painLevel, setPainLevel] = useState(0);

  const [showSuccess, setShowSuccess] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  /* 🔁 Load today's saved pain details (if any) */
  useEffect(() => {
    (async () => {
      const saved = await loadTodayPainDetails();
      if (saved) {
        setSelectedParts(saved.bodyParts);
        setPainLevel(saved.level);

      }
    })();
  }, []);

  const togglePart = (id: string) => {
    setSelectedParts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleConfirm = async () => {
    await savePainDetails({
      bodyParts: selectedParts,
      level: painLevel,
    });

    setShowSuccess(true);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      setShowSuccess(false);
      router.replace("/insights");
    }, 2500);
  };

  const isSliderDisabled = selectedParts.length === 0;

  const getMeterColor = (level: number) => {
    if (isSliderDisabled) return "#475569";
    const hue = Math.max(0, 120 - level * 12);
    return `hsl(${hue}, 80%, 55%)`;
  };

  const activeMeterColor = getMeterColor(painLevel);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />

      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.headerSection}>
          <Text style={styles.subHeading}>SYMPTOM TRACKER</Text>
          <Text style={styles.heading}>Where does it hurt?</Text>

          <View style={styles.indicatorContainer}>
            {selectedParts.length === 0 ? (
              <View style={styles.emptyDot} />
            ) : (
              selectedParts.map((id) => (
                <View
                  key={id}
                  style={[
                    styles.activeDot,
                    { backgroundColor: activeMeterColor },
                  ]}
                />
              ))
            )}
          </View>
        </View>

        {/* BODY GRID */}
        <View style={styles.grid}>
          {painBodyParts.map((part) => {
            const selected = selectedParts.includes(part.id);

            return (
              <Pressable
                key={part.id}
                onPress={() => togglePart(part.id)}
                style={({ pressed }) => [
                  styles.card,
                  pressed && { transform: [{ scale: 0.92 }] },
                ]}
              >
                <View
                  style={[
                    styles.iconCircle,
                    selected && {
                      backgroundColor: activeMeterColor,
                      borderColor: activeMeterColor,
                    },
                  ]}
                >
                  <Image
                    source={part.image}
                    style={[
                      styles.icon,
                      selected && { tintColor: "#fff" },
                    ]}
                    resizeMode="contain"
                  />
                </View>

                <Text
                  style={[
                    styles.label,
                    selected && styles.labelSelected,
                  ]}
                >
                  {part.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* METER */}
        <View
          style={[
            styles.meterCard,
            isSliderDisabled && styles.disabledOpacity,
          ]}
        >
          <View style={styles.meterHeader}>
            <Text style={styles.meterTitle}>Intensity Meter</Text>

            <View
              style={[
                styles.valueBadge,
                { backgroundColor: activeMeterColor },
              ]}
            >
              <Text style={styles.valueText}>{painLevel}</Text>
            </View>
          </View>

          <View style={styles.meterTrackBackground}>
            {[...Array(10)].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.meterSegment,
                  {
                    backgroundColor:
                      i < painLevel
                        ? getMeterColor(i + 1)
                        : "#0F172A",
                  },
                ]}
              />
            ))}
          </View>

          <Slider
            style={styles.sliderOverlay}
            minimumValue={0}
            maximumValue={10}
            step={1}
            value={painLevel}
            disabled={isSliderDisabled}
            onValueChange={setPainLevel}
            minimumTrackTintColor="transparent"
            maximumTrackTintColor="transparent"
            thumbTintColor="#FFFFFF"
          />
        </View>

        {/* BUTTONS */}
        <View style={styles.buttonGroup}>
          <Pressable
            style={[
              styles.saveButton,
              isSliderDisabled && styles.saveButtonDisabled,
            ]}
            onPress={handleConfirm}
            disabled={isSliderDisabled}
          >
            <Text style={styles.saveButtonText}>
              Confirm Entry
            </Text>
          </Pressable>

          <Pressable
            style={styles.backButton}
           
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/insights");
              }
            }}

          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </View>

      {/* SUCCESS MODAL */}
      <Modal transparent visible={showSuccess} animationType="none">
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[styles.modalContent, { opacity: fadeAnim }]}
          >
            <BlurView
              intensity={80}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />

            <View
              style={[
                styles.successCircle,
                { backgroundColor: activeMeterColor },
              ]}
            >
              <Ionicons name="checkmark" size={40} color="#fff" />
            </View>

            <Text style={styles.successTitle}>
              Pain data saved!
            </Text>
            <Text style={styles.successSub}>
              Thank you for checking in.
            </Text>

            <Text style={styles.redirectText}>
              Going back to insights...
            </Text>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0F172A" },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 10 },

  headerSection: { alignItems: "center", marginBottom: 24 },
  subHeading: {
    color: "#64748B",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 4,
  },
  heading: { fontSize: 26, fontWeight: "800", color: "#fff" },

  indicatorContainer: {
    flexDirection: "row",
    marginTop: 12,
    height: 8,
    alignItems: "center",
  },
  emptyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#1E293B",
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: (width - 68) / 4,
    marginBottom: 18,
    alignItems: "center",
  },

  iconCircle: {
    width: 62,
    height: 62,
    borderRadius: 22,
    backgroundColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.05)",
  },
  icon: {
    width: 28,
    height: 28,
    tintColor: "#94A3B8",
  },
  label: {
    marginTop: 8,
    fontSize: 11,
    color: "#64748B",
    fontWeight: "600",
  },
  labelSelected: { color: "#fff" },

  meterCard: {
    marginTop: "auto",
    backgroundColor: "#1E293B",
    padding: 24,
    borderRadius: 30,
    marginBottom: 20,
  },
  meterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  meterTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  valueBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  valueText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
  },

  meterTrackBackground: {
    height: 10,
    flexDirection: "row",
    backgroundColor: "#0F172A",
    borderRadius: 5,
    paddingHorizontal: 2,
    alignItems: "center",
    justifyContent: "space-between",
  },
  meterSegment: {
    height: 6,
    flex: 1,
    marginHorizontal: 1.5,
    borderRadius: 3,
  },
  sliderOverlay: {
    width: "100%",
    height: 40,
    marginTop: -25,
  },

  disabledOpacity: { opacity: 0.2 },

  buttonGroup: { marginBottom: 10 },
  saveButton: {
    backgroundColor: "#fff",
    height: 58,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  saveButtonDisabled: { backgroundColor: "#334155" },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  backButton: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: width * 0.8,
    padding: 30,
    borderRadius: 32,
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  successTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 8,
  },
  successSub: {
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 24,
  },
  redirectText: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "600",
    fontStyle: "italic",
  },
});
