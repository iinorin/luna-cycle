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
import { useRouter } from "expo-router";

import { MOODS, MoodType } from "@/src/mood/moodTypes";

const { width } = Dimensions.get("window");
const COLUMN_COUNT = 3;
const ITEM_SIZE = (width - 32 - (COLUMN_COUNT - 1) * 16) / COLUMN_COUNT;

export default function MoodGrid() {
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  
  // Animation Refs
  const buttonFade = useRef(new Animated.Value(0)).current;
  const buttonSlide = useRef(new Animated.Value(20)).current;
  const fadeAnims = useRef(MOODS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // Staggered entry animation
    const animations = fadeAnims.map((anim, i) =>
      Animated.spring(anim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
        delay: i * 40,
      })
    );
    Animated.stagger(40, animations).start();
  }, []);

  const handleSelect = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedMood(id);

    // Animate save button in
    Animated.parallel([
      Animated.timing(buttonFade, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(buttonSlide, { toValue: 0, tension: 40, useNativeDriver: true }),
    ]).start();
  };

  const handleReset = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setSelectedMood(null);
    // Hide save button
    Animated.timing(buttonFade, { toValue: 0, duration: 200, useNativeDriver: true }).start();
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
              borderColor: active ? item.color : "rgba(255,255,255,0.08)",
              backgroundColor: active ? `${item.color}15` : "rgba(30, 41, 59, 0.4)",
              transform: [{ scale: pressed ? 0.94 : 1 }],
            },
            active && {
              shadowColor: item.color,
              shadowOpacity: 0.5,
              shadowRadius: 12,
              elevation: 8,
              borderWidth: 2,
            }
          ]}
        >
          <View style={[styles.iconContainer, active && { backgroundColor: `${item.color}20` }]}>
            <Ionicons
              name={item.icon as any}
              size={30}
              color={active ? item.color : "#64748B"}
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
        <Text style={styles.subHeading}>MOOD TRACKER</Text>
        <Text style={styles.title}>How's your vibe?</Text>
      </View>

      <FlatList
        data={MOODS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={COLUMN_COUNT}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <View style={styles.actionBar}>
            <Pressable 
                onPress={handleReset} 
                style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.6 }]}
            >
              <Ionicons name="refresh-outline" size={22} color="#94A3B8" />
              <Text style={styles.actionText}>Reset Selection</Text>
            </Pressable>

            <View style={styles.divider} />

            <Pressable 
                onPress={() => router.replace("/cycle")} 
                style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.6 }]}
            >
              <Ionicons name="home-outline" size={22} color="#94A3B8" />
              <Text style={styles.actionText}>Go Home</Text>
            </Pressable>
          </View>
        }
      />

      {/* FLOATING SAVE BUTTON */}
      {selectedMood && (
        <Animated.View style={[
          styles.buttonContainer, 
          { opacity: buttonFade, transform: [{ translateY: buttonSlide }] }
        ]}>
          <Pressable 
            onPress={() => console.log("Saved", selectedMood)}
            style={({ pressed }) => [
              styles.saveButton,
              { backgroundColor: selectedMoodData?.color, transform: [{ scale: pressed ? 0.96 : 1 }] },
              { shadowColor: selectedMoodData?.color }
            ]}
          >
            <Text style={styles.saveButtonText}>Confirm {selectedMoodData?.label}</Text>
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
  header: { marginBottom: 30, alignItems: 'center' },
  subHeading: { color: "#38BDF8", fontSize: 11, fontWeight: "900", letterSpacing: 3, marginBottom: 4 },
  title: { fontSize: 26, fontWeight: "900", color: "#fff" },
  grid: { paddingBottom: 140 },
  row: { justifyContent: "space-between", marginBottom: 14 },
  
  moodItem: {
    borderRadius: 24,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    marginBottom: 8,
  },
  label: { fontSize: 12, color: "#94A3B8", fontWeight: "700" },

  // ACTION BAR STYLES
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  actionBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 },
  actionText: { color: "#94A3B8", fontSize: 13, fontWeight: "600", marginLeft: 8 },
  divider: { width: 1, height: 20, backgroundColor: 'rgba(255,255,255,0.1)', marginHorizontal: 10 },

  buttonContainer: { position: 'absolute', bottom: 34, left: 16, right: 16 },
  saveButton: {
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
  },
  saveButtonText: { color: "#fff", fontSize: 17, fontWeight: "900" },
});