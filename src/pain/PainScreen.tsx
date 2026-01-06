import { View, Text, Pressable, StyleSheet } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { savePainSelection, PainSelection } from "./painStorage";

export default function PainScreen() {
  const [selected, setSelected] = useState<PainSelection | null>(null);

  async function handleSave() {
    if (!selected) return;

    await savePainSelection(selected);

    if (selected === "pain") {
      router.push("/pain-detail");
    } else {
      router.back();
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Pain Check</Text>

      <View style={styles.options}>
        <Pressable
          style={[
            styles.card,
            selected === "no_pain" && styles.selected,
          ]}
          onPress={() => setSelected("no_pain")}
        >
          <Text style={styles.emoji}>😊</Text>
          <Text style={styles.label}>No Pain</Text>
        </Pressable>

        <Pressable
          style={[
            styles.card,
            selected === "pain" && styles.selected,
          ]}
          onPress={() => setSelected("pain")}
        >
          <Text style={styles.emoji}>😣</Text>
          <Text style={styles.label}>Pain</Text>
        </Pressable>
      </View>

      <Pressable
        style={[
          styles.saveBtn,
          !selected && { opacity: 0.5 },
        ]}
        onPress={handleSave}
        disabled={!selected}
      >
        <Text style={styles.saveText}>Save</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  heading: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 30,
  },
  options: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 40,
  },
  card: {
    width: 130,
    height: 130,
    borderRadius: 20,
    backgroundColor: "#f1f1f1",
    justifyContent: "center",
    alignItems: "center",
  },
  selected: {
    backgroundColor: "#ffccd5",
  },
  emoji: {
    fontSize: 36,
  },
  label: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "600",
  },
  saveBtn: {
    backgroundColor: "#ff4d6d",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  saveText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});
