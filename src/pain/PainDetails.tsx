import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { useState } from "react";
import { painBodyParts } from "./painBodyParts";

export default function PainDetails() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Where does it hurt?</Text>

      <View style={styles.grid}>
        {painBodyParts.map((part) => {
          const isSelected = selectedId === part.id;

          return (
            <Pressable
              key={part.id}
              style={[
                styles.card,
                isSelected && styles.cardSelected,
              ]}
              onPress={() => setSelectedId(part.id)}
            >
              <Image
                source={part.image}
                style={[
                  styles.icon,
                  isSelected && styles.iconSelected,
                ]}
                resizeMode="contain"
              />

              <Text
                style={[
                  styles.label,
                  isSelected && styles.labelSelected,
                ]}
              >
                {part.label}
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
    padding: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 24,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "22%",
    aspectRatio: 1,
    borderRadius: 18,
    backgroundColor: "#0f172a",
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  cardSelected: {
    backgroundColor: "#1e293b",
    borderWidth: 2,
    borderColor: "#f472b6",
  },
  icon: {
    width: 36,
    height: 36,
    opacity: 0.7,
  },
  iconSelected: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
  label: {
    marginTop: 6,
    fontSize: 12,
    color: "#94a3b8",
    textAlign: "center",
  },
  labelSelected: {
    color: "#f9a8d4",
    fontWeight: "600",
  },
});
