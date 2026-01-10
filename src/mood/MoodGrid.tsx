import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { MOODS, MoodType } from "@/src/mood/moodTypes";

const SCREEN_WIDTH = Dimensions.get("window").width;
const ITEM_SIZE = (SCREEN_WIDTH - 32 - 16) / 5;

export default function MoodGrid() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const renderItem = ({ item }: { item: MoodType }) => {
    const active = selectedMood === item.id;

    return (
      <Pressable
        onPress={() => setSelectedMood(item.id)}
        style={[
          styles.moodItem,
          {
            width: ITEM_SIZE,
            height: ITEM_SIZE,
            borderColor: active ? item.color : "transparent",
            backgroundColor: active
              ? item.color + "22"
              : "#f9fafb",
          },
        ]}
      >
        <Ionicons
          name={item.icon}
          size={24}
          color={active ? item.color : "#9ca3af"}
        />
        <Text
          style={[
            styles.label,
            active && { color: item.color, fontWeight: "700" },
          ]}
          numberOfLines={1}
        >
          {item.label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How are you feeling?</Text>

      <FlatList
        data={MOODS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={5}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 16,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    color: "#111827",
  },

  grid: {
    paddingBottom: 40,
  },

  row: {
    justifyContent: "space-between",
    marginBottom: 12,
  },

  moodItem: {
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
  },

  label: {
    fontSize: 10,
    marginTop: 4,
    color: "#6b7280",
    textAlign: "center",
  },
});
