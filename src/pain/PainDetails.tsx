import { View, Text, StyleSheet, Pressable, Image, Dimensions } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Slider from "@react-native-community/slider";
import { StatusBar } from "expo-status-bar";

// Ensure this path matches your project structure
import { painBodyParts } from "./painBodyParts";

const { width } = Dimensions.get("window");

export default function PainDetails() {
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [painLevel, setPainLevel] = useState(0);

  const togglePart = (id: string) => {
    setSelectedParts((prev) =>
      prev.includes(id)
        ? prev.filter((p) => p !== id)
        : [...prev, id]
    );
  };

  const isSliderDisabled = selectedParts.length === 0;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <View style={styles.container}>
        
        {/* 1. Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.subHeading}>LOG SYMPTOMS</Text>
          <Text style={styles.heading}>Where does it hurt?</Text>
          <View style={styles.indicatorContainer}>
             {selectedParts.map((_, index) => (
               <View key={index} style={styles.dot} />
             ))}
          </View>
        </View>

        {/* 2. Body part grid */}
        <View style={styles.grid}>
          {painBodyParts.map((part) => {
            const selected = selectedParts.includes(part.id);

            return (
              <Pressable
                key={part.id}
                onPress={() => togglePart(part.id)}
                style={({ pressed }) => [
                  styles.card,
                  pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] }
                ]}
              >
                {/* Visual Circle around Icon */}
                <View style={[styles.iconCircle, selected && styles.iconCircleActive]}>
                  <Image
                    source={part.image}
                    style={[
                      styles.icon,
                      selected && styles.iconSelected
                    ]}
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

        {/* 3. Pain level slider */}
        <View style={[styles.sliderCard, isSliderDisabled && styles.disabledOpacity]}>
          <View style={styles.sliderHeader}>
            <Text style={styles.sliderTitle}>Intensity</Text>
            <View style={styles.badge}>
                <Text style={styles.sliderValue}>{painLevel}</Text>
            </View>
          </View>

          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={10}
            step={1}
            value={painLevel}
            disabled={isSliderDisabled}
            onValueChange={setPainLevel}
            minimumTrackTintColor="#F472B6"
            maximumTrackTintColor="#334155"
            thumbTintColor={isSliderDisabled ? "#475569" : "#F472B6"}
          />
          
          <View style={styles.scaleLabels}>
            <Text style={styles.scaleText}>Mild</Text>
            <Text style={styles.scaleText}>Moderate</Text>
            <Text style={styles.scaleText}>Severe</Text>
          </View>
        </View>

        {/* 4. Action Button */}
        <Pressable 
            style={[styles.saveButton, isSliderDisabled && styles.saveButtonDisabled]}
            disabled={isSliderDisabled}
        >
            <Text style={styles.saveButtonText}>Save Details</Text>
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
    paddingTop: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  subHeading: {
    color: '#F472B6',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 8,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },
  indicatorContainer: {
    flexDirection: 'row',
    marginTop: 12,
    height: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F472B6',
    marginHorizontal: 3,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: (width - 68) / 4, 
    marginBottom: 20,
    alignItems: "center",
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 24,
    backgroundColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  iconCircleActive: {
    backgroundColor: "#F472B6",
    borderColor: '#F472B6',
    shadowColor: "#F472B6",
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  icon: {
    width: 32,
    height: 32,
    tintColor: '#94A3B8', // Default color
  },
  iconSelected: {
    tintColor: '#FFFFFF', // Selected color
  },
  label: {
    marginTop: 10,
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: '500',
    textAlign: "center",
  },
  labelSelected: {
    color: "#fff",
    fontWeight: "700",
  },
  sliderCard: {
    marginTop: 'auto',
    backgroundColor: '#1E293B',
    padding: 24,
    borderRadius: 32,
    marginBottom: 20,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  badge: {
    backgroundColor: 'rgba(244, 114, 182, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(244, 114, 182, 0.3)',
  },
  sliderTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: '600',
  },
  sliderValue: {
    color: "#F472B6",
    fontSize: 16,
    fontWeight: "800",
  },
  slider: {
    width: '100%',
    height: 40,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  scaleText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  disabledOpacity: {
    opacity: 0.3,
  },
  saveButton: {
    backgroundColor: '#fff',
    height: 64,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  saveButtonDisabled: {
    backgroundColor: '#334155',
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
});