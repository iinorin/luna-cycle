import { View, Text, StyleSheet, Pressable } from "react-native";
import { useState } from "react";
import {
  Head,
  Brain,
  Eye,
  Heart,
  Armchair,
  Hand,
  Footprints,
  Bone,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

type PainArea = {
  id: string;
  label: string;
  icon: any;
};

const PAIN_AREAS: PainArea[] = [
  { id: "head", label: "Head", icon: Head },
  { id: "eyes", label: "Eyes", icon: Eye },
  { id: "chest", label: "Chest", icon: Heart },
  { id: "brain", label: "Mind", icon: Brain },
  { id: "arms", label: "Arms", icon: Armchair },
  { id: "hands", label: "Hands", icon: Hand },
  { id: "legs", label: "Legs", icon: Footprints },
  { id: "bones", label: "Bones", icon: Bone },
];

export default function PainDetailScreen() {
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

  const toggleArea = (id: string) => {
    setSelectedAreas((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  return (
    <View style={styles.container}>
      {/* Heading */}
      <LinearGradient
        colors={["#1f1f1f", "#0f0f0f"]}
        style={styles.headingCard}
      >
        <Text style={styles.heading}>Where does it hurt?</Text>
        <Text style={styles.subHeading}>
          Select all areas that apply
        </Text>
      </LinearGradient>

      {/* Pain Area Grid */}
      <View style={styles.grid}>
        {PAIN_AREAS.map((area) => {
          const Icon = area.icon;
          const isActive = selectedAreas.includes(area.id);

          return (
            <Pressable
              key={area.id}
              onPress={() => toggleArea(area.id)}
              style={[
                styles.painCard,
                isActive && styles.activeCard,
              ]}
            >
              <Icon
                size={30}
                color={isActive ? "#ff5c8a" : "#b0b0b0"}
              />
              <Text
                style={[
                  styles.cardText,
                  isActive && styles.activeText,
                ]}
              >
                {area.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 16,
  },

  /* Heading */
  headingCard: {
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 24,
  },

  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },

  subHeading: {
    fontSize: 14,
    color: "#b0b0b0",
    textAlign: "center",
    marginTop: 6,
  },

  /* Grid */
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  /* Pain Cards */
  painCard: {
    width: "23%",
    aspectRatio: 1,
    backgroundColor: "#111",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#1f1f1f",
  },

  activeCard: {
    backgroundColor: "#1a0c12",
    borderColor: "#ff5c8a",
  },

  cardText: {
    marginTop: 6,
    fontSize: 12,
    color: "#b0b0b0",
    textAlign: "center",
  },

  activeText: {
    color: "#ff5c8a",
    fontWeight: "600",
  },
});
