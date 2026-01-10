import { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Dimensions,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { MOODS, MoodType } from "@/src/mood/moodTypes";

const { width } = Dimensions.get("window");
// 4 columns feels more premium than 5
const COLUMN_COUNT = 4;
const ITEM_SIZE = (width - 32 - (COLUMN_COUNT - 1) * 12) / COLUMN_COUNT;

export default function MoodGrid() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

const handleSelect = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedMood(id); 
  };

  const renderItem = ({ item }: { item: MoodType }) => {
    const active = selectedMood === item.id;
    
    return (
      <Pressable
        onPress={() => handleSelect(item.id)}
        style={({ pressed }) => [
          styles.moodItem,
          {
            width: ITEM_SIZE,
            height: ITEM_SIZE + 10,
            borderColor: active ? item.color : "rgba(255,255,255,0.05)",
            backgroundColor: active ? `${item.color}15` : "#1E293B",
            transform: [{ scale: pressed ? 0.95 : 1 }],
          },
          active && styles.activeShadow,
          active && { shadowColor: item.color }
        ]}
      >
        <View style={[styles.iconContainer, active && { backgroundColor: `${item.color}20` }]}>
          <Ionicons
            name={item.icon as any}
            size={28}
            color={active ? item.color : "#64748B"}
          />
        </View>
        <Text
          style={[
            styles.label,
            active && { color: "#fff", fontWeight: "800" },
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
      <View style={styles.header}>
        <Text style={styles.subHeading}>DAILY CHECK-IN</Text>
        <Text style={styles.title}>How are you feeling?</Text>
      </View>

      <FlatList
        data={MOODS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={COLUMN_COUNT}
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
    backgroundColor: "#0F172A", // Luna Deep Blue
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  subHeading: {
    color: "#64748B",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
  },
  grid: {
    paddingBottom: 40,
  },
  row: {
    justifyContent: "flex-start",
    gap: 12,
    marginBottom: 12,
  },
  moodItem: {
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  activeShadow: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  label: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "600",
    textAlign: "center",
  },
});