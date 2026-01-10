import { useState, useRef, useEffect } from "react";
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
import { LinearGradient } from "expo-linear-gradient"; // Ensure you have expo-linear-gradient installed

import { MOODS, MoodType } from "@/src/mood/moodTypes";

const { width } = Dimensions.get("window");
const COLUMN_COUNT = 3; // Switched to 3 for larger, cooler tiles
const ITEM_SIZE = (width - 32 - (COLUMN_COUNT - 1) * 16) / COLUMN_COUNT;

export default function MoodGrid() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  
  // Animation Refs
  const buttonFade = useRef(new Animated.Value(0)).current;
  const buttonSlide = useRef(new Animated.Value(20)).current;
  const fadeAnims = useRef(MOODS.map(() => new Animated.Value(0))).current;

  // Staggered entry animation for the tiles
  useEffect(() => {
    const animations = fadeAnims.map((anim, i) =>
      Animated.spring(anim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
        delay: i * 50,
      })
    );
    Animated.stagger(50, animations).start();
  }, []);

  const handleSelect = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedMood(id);

    // Animate save button appearance
    Animated.parallel([
      Animated.timing(buttonFade, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(buttonSlide, { toValue: 0, tension: 40, useNativeDriver: true }),
    ]).start();
  };

  const selectedMoodData = MOODS.find(m => m.id === selectedMood);

  const renderItem = ({ item, index }: { item: MoodType; index: number }) => {
    const active = selectedMood === item.id;
    
    return (
      <Animated.View style={{ opacity: fadeAnims[index], transform: [{ scale: fadeAnims[index] }] }}>
        <Pressable
          onPress={() => handleSelect(item.id)}
          style={({ pressed }) => [
            styles.moodItem,
            {
              width: ITEM_SIZE,
              height: ITEM_SIZE * 1.1,
              borderColor: active ? item.color : "rgba(255,255,255,0.1)",
              backgroundColor: active ? `${item.color}10` : "rgba(30, 41, 59, 0.5)",
              transform: [{ scale: pressed ? 0.92 : 1 }],
            },
            active && {
              shadowColor: item.color,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.6,
              shadowRadius: 15,
              elevation: 10,
              borderWidth: 2,
            }
          ]}
        >
          <View style={[
            styles.iconContainer, 
            active && { backgroundColor: `${item.color}25`, borderColor: item.color, borderWidth: 1 }
          ]}>
            <Ionicons
              name={item.icon as any}
              size={32}
              color={active ? item.color : "#94A3B8"}
            />
          </View>
          <Text style={[styles.label, active && { color: "#fff", fontWeight: "900" }]}>
            {item.label}
          </Text>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subHeading}>DAILY VIBE</Text>
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

      {/* COOL FLOATING SAVE BUTTON */}
      {selectedMood && (
        <Animated.View style={[
          styles.buttonContainer, 
          { opacity: buttonFade, transform: [{ translateY: buttonSlide }] }
        ]}>
          <Pressable 
            onPress={() => console.log("Saved:", selectedMood)}
            style={({ pressed }) => [
              styles.saveButton,
              { backgroundColor: selectedMoodData?.color, transform: [{ scale: pressed ? 0.95 : 1 }] },
              styles.buttonShadow,
              { shadowColor: selectedMoodData?.color }
            ]}
          >
            <Text style={styles.saveButtonText}>Log {selectedMoodData?.label} Mood</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" style={{marginLeft: 8}} />
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  subHeading: {
    color: "#38BDF8",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 4,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#fff",
  },
  grid: {
    paddingBottom: 120, // Space for the floating button
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  moodItem: {
    borderRadius: 24,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    backdropFilter: 'blur(10px)', // For web support if needed
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.3)',
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    color: "#94A3B8",
    fontWeight: "700",
    textAlign: "center",
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 16,
    right: 16,
  },
  saveButton: {
    height: 64,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
  },
  buttonShadow: {
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  }
});