import { View, Text, StyleSheet, Pressable, Image, Dimensions } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Slider from "@react-native-community/slider";
import { StatusBar } from "expo-status-bar";

import { painBodyParts } from "./painBodyParts";

const { width } = Dimensions.get("window");

export default function PainDetails() {
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [painLevel, setPainLevel] = useState(0);

  const togglePart = (id: string) => {
    setSelectedParts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const isSliderDisabled = selectedParts.length === 0;

  // Meter Color Logic (HSL: 120 is Green, 0 is Red)
  const getMeterColor = (level: number) => {
    if (isSliderDisabled) return "#475569";
    const hue = Math.max(0, 120 - (level * 12));
    return `hsl(${hue}, 80%, 55%)`;
  };

  const activeMeterColor = getMeterColor(painLevel);

  const getStatusMessage = () => {
    if (isSliderDisabled) return "Select area to begin";
    if (painLevel <= 3) return "Mild & Manageable";
    if (painLevel <= 7) return "Moderate Discomfort";
    return "Severe - High Intensity";
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <View style={styles.container}>
        
        {/* Header Section with Dot Indicator */}
        <View style={styles.headerSection}>
          <Text style={styles.subHeading}>SYMPTOM TRACKER</Text>
          <Text style={styles.heading}>Where does it hurt?</Text>
          
          {/* 🔘 THE DOT INDICATOR */}
          <View style={styles.indicatorContainer}>
            {selectedParts.length === 0 ? (
              <View style={styles.emptyDot} />
            ) : (
              selectedParts.map((id) => (
                <View 
                  key={id} 
                  style={[styles.activeDot, { backgroundColor: activeMeterColor }]} 
                />
              ))
            )}
          </View>
        </View>

        {/* Body part grid */}
        <View style={styles.grid}>
          {painBodyParts.map((part) => {
            const selected = selectedParts.includes(part.id);
            return (
              <Pressable
                key={part.id}
                onPress={() => togglePart(part.id)}
                style={({ pressed }) => [
                  styles.card,
                  pressed && { transform: [{ scale: 0.92 }] }
                ]}
              >
                <View style={[
                    styles.iconCircle, 
                    selected && { 
                        backgroundColor: activeMeterColor, 
                        borderColor: activeMeterColor,
                        shadowColor: activeMeterColor 
                    }
                ]}>
                  <Image
                    source={part.image}
                    style={[styles.icon, selected && { tintColor: '#fff' }]}
                    resizeMode="contain"
                  />
                </View>
                <Text style={[styles.label, selected && styles.labelSelected]}>
                  {part.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* 🌡️ THE METER SECTION */}
        <View style={[styles.meterCard, isSliderDisabled && styles.disabledOpacity]}>
          <View style={styles.meterHeader}>
             <View>
                <Text style={styles.meterTitle}>Intensity Meter</Text>
                <Text style={[styles.statusText, { color: activeMeterColor }]}>{getStatusMessage()}</Text>
             </View>
             <View style={[styles.valueBadge, { backgroundColor: activeMeterColor }]}>
                <Text style={styles.valueText}>{painLevel}</Text>
             </View>
          </View>

          {/* Background Meter Bar */}
          <View style={styles.meterTrackBackground}>
             {[...Array(10)].map((_, i) => (
               <View 
                key={i} 
                style={[
                    styles.meterSegment, 
                    { backgroundColor: i < painLevel ? getMeterColor(i + 1) : '#0F172A' }
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
          
          <View style={styles.scaleLabels}>
            <Text style={styles.scaleText}>Mild</Text>
            <Text style={styles.scaleText}>Severe</Text>
          </View>
        </View>

        <Pressable 
            style={[styles.saveButton, isSliderDisabled && styles.saveButtonDisabled]}
            disabled={isSliderDisabled}
        >
            <Text style={styles.saveButtonText}>Confirm Entry</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  subHeading: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 4,
  },
  heading: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
  },
  indicatorContainer: {
    flexDirection: 'row',
    marginTop: 12,
    height: 8,
    alignItems: 'center',
  },
  emptyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1E293B',
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
    borderColor: 'rgba(255,255,255,0.05)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  icon: {
    width: 28,
    height: 28,
    tintColor: '#94A3B8',
  },
  label: {
    marginTop: 8,
    fontSize: 11,
    color: "#64748B",
    fontWeight: '600',
  },
  labelSelected: {
    color: "#fff",
  },
  meterCard: {
    marginTop: 'auto',
    backgroundColor: '#1E293B',
    padding: 24,
    borderRadius: 30,
    marginBottom: 16,
  },
  meterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  meterTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: '700',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  valueBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: "900",
  },
  meterTrackBackground: {
    height: 10,
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: 5,
    paddingHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  meterSegment: {
    height: 6,
    flex: 1,
    marginHorizontal: 1.5,
    borderRadius: 3,
  },
  sliderOverlay: {
    width: '100%',
    height: 40,
    marginTop: -25, 
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  scaleText: {
    fontSize: 10,
    color: '#475569',
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  disabledOpacity: {
    opacity: 0.2,
  },
  saveButton: {
    backgroundColor: '#fff',
    height: 62,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  saveButtonDisabled: {
    backgroundColor: '#334155',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
});