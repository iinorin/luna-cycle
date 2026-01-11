import { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Dimensions,
  Animated,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter, useFocusEffect } from "expo-router";
import { BlurView } from "expo-blur";

import { MOODS, MoodType } from "@/src/mood/moodTypes";
import { MoodStorage } from "@/src/mood/moodStorage";

const { width } = Dimensions.get("window");
const COLUMN_COUNT = 3;
const ITEM_SIZE = (width - 32 - (COLUMN_COUNT - 1) * 16) / COLUMN_COUNT;

export default function MoodGrid() {
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAlreadyLogged, setIsAlreadyLogged] = useState(false);
  const [todayMood, setTodayMood] = useState<MoodType | null>(null);
  
  // Animation Refs
  const buttonFade = useRef(new Animated.Value(0)).current;
  const buttonSlide = useRef(new Animated.Value(20)).current;
  const fadeAnims = useRef(MOODS.map(() => new Animated.Value(0))).current;
  const successScale = useRef(new Animated.Value(0.7)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current; // For the floating icon

  // ✅ Check daily status and fetch today's specific mood
  useFocusEffect(
    useCallback(() => {
      const checkDailyLog = async () => {
        const logged = await MoodStorage.hasLoggedToday();
        setIsAlreadyLogged(logged);
        
        if (logged) {
          const history = await MoodStorage.getHistory();
          if (history.length > 0) {
            const lastMood = MOODS.find(m => m.id === history[0].id);
            setTodayMood(lastMood || null);
          }
        }
      };
      checkDailyLog();
    }, [])
  );

  // ✅ Floating animation for the "Already Logged" icon
  useEffect(() => {
    if (isAlreadyLogged) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, { toValue: -10, duration: 1500, useNativeDriver: true }),
          Animated.timing(floatAnim, { toValue: 0, duration: 1500, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [isAlreadyLogged]);

  useEffect(() => {
    if (!isAlreadyLogged) {
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
    }
  }, [isAlreadyLogged]);

  const handleSelect = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedMood(id);
    Animated.parallel([
      Animated.timing(buttonFade, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(buttonSlide, { toValue: 0, tension: 40, useNativeDriver: true }),
    ]).start();
  };

  const handleReset = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setSelectedMood(null);
    Animated.timing(buttonFade, { toValue: 0, duration: 200, useNativeDriver: true }).start();
  };

  const handleSave = async () => {
    if (!selectedMood) return;
    const selectedData = MOODS.find(m => m.id === selectedMood);
    const success = await MoodStorage.saveDailyMood(selectedMood, selectedData?.label || "");

    if (success) {
      setTodayMood(selectedData || null);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowSuccess(true);
      Animated.parallel([
        Animated.timing(successOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(successScale, { toValue: 1, tension: 50, friction: 8, useNativeDriver: true }),
      ]).start();
      setTimeout(() => {
        setShowSuccess(false);
        router.replace("/cycle");
      }, 2000);
    }
  };

  const selectedMoodData = MOODS.find(m => m.id === selectedMood);

  // ✅ RENDERING THE "ALREADY LOGGED" SCREEN
  if (isAlreadyLogged && !showSuccess) {
    return (
      <View style={styles.container}>
        <View style={styles.centeredContent}>
          <View style={styles.checkContainer}>
            <Ionicons name="checkmark-done-circle" size={40} color="#4ADE80" />
          </View>
          
          <Text style={styles.title}>Vibe Logged!</Text>
          
          {/* Animated Today Mood Card */}
          <Animated.View style={[
            styles.todayCard, 
            { transform: [{ translateY: floatAnim }], borderColor: todayMood?.color }
          ]}>
             <Ionicons name={todayMood?.icon as any} size={50} color={todayMood?.color} />
             <Text style={[styles.todayMoodLabel, { color: todayMood?.color }]}>
               {todayMood?.label}
             </Text>
             <Text style={styles.todaySubtext}>This is how you're feeling today</Text>
          </Animated.View>

          <Text style={styles.doneSubText}>Consistency is key to understanding your cycle. See you tomorrow!</Text>
          
          <Pressable onPress={() => router.replace("/cycle")} style={styles.backHomeBtn}>
            <Text style={styles.backHomeBtnText}>Go to Dashboard</Text>
          </Pressable>

          <Pressable onPress={() => setIsAlreadyLogged(false)} style={{ marginTop: 25 }}>
            <Text style={{ color: "#64748B", fontWeight: "600", fontSize: 13 }}>Edit today's mood</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // --- STANDARD GRID RENDER ---
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
            active && { shadowColor: item.color, shadowOpacity: 0.5, shadowRadius: 12, elevation: 8, borderWidth: 2 }
          ]}
        >
          <View style={[styles.iconContainer, active && { backgroundColor: `${item.color}20` }]}>
            <Ionicons name={item.icon as any} size={30} color={active ? item.color : "#64748B"} />
          </View>
          <Text style={[styles.label, active && { color: "#fff", fontWeight: "900" }]}>{item.label}</Text>
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
            <Pressable onPress={handleReset} style={styles.actionBtn}>
              <Ionicons name="refresh-outline" size={20} color="#94A3B8" />
              <Text style={styles.actionText}>Reset</Text>
            </Pressable>
            <View style={styles.divider} />
            <Pressable onPress={() => router.replace("/cycle")} style={styles.actionBtn}>
              <Ionicons name="home-outline" size={20} color="#94A3B8" />
              <Text style={styles.actionText}>Home</Text>
            </Pressable>
          </View>
        }
      />

      {selectedMood && (
        <Animated.View style={[styles.buttonContainer, { opacity: buttonFade, transform: [{ translateY: buttonSlide }] }]}>
          <Pressable 
            onPress={handleSave}
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

      <Modal transparent visible={showSuccess} animationType="none">
        <View style={styles.modalOverlay}>
          <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
          <Animated.View style={[
            styles.successCard,
            { opacity: successOpacity, transform: [{ scale: successScale }], borderColor: selectedMoodData?.color }
          ]}>
             <View style={[styles.checkCircle, { backgroundColor: selectedMoodData?.color }]}>
                <Ionicons name="checkmark-sharp" size={40} color="#fff" />
             </View>
             <Text style={styles.successTitle}>Saved!</Text>
             <Text style={styles.successText}>Your mood is logged.</Text>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A", paddingTop: 60, paddingHorizontal: 16 },
  header: { marginBottom: 30, alignItems: 'center' },
  subHeading: { color: "#38BDF8", fontSize: 11, fontWeight: "900", letterSpacing: 3, marginBottom: 4 },
  title: { fontSize: 26, fontWeight: "900", color: "#fff" },
  grid: { paddingBottom: 140 },
  row: { justifyContent: "space-between", marginBottom: 14 },
  moodItem: { borderRadius: 24, borderWidth: 1.5, alignItems: "center", justifyContent: "center", padding: 10 },
  iconContainer: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(15, 23, 42, 0.5)', marginBottom: 8 },
  label: { fontSize: 12, color: "#94A3B8", fontWeight: "700" },
  actionBar: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20, backgroundColor: 'rgba(30, 41, 59, 0.4)', padding: 14, borderRadius: 20 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15 },
  actionText: { color: "#94A3B8", fontSize: 13, fontWeight: "600", marginLeft: 8 },
  divider: { width: 1, height: 18, backgroundColor: 'rgba(255,255,255,0.1)', marginHorizontal: 5 },
  buttonContainer: { position: 'absolute', bottom: 34, left: 16, right: 16 },
  saveButton: { height: 60, borderRadius: 22, alignItems: 'center', justifyContent: 'center', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 15, elevation: 10 },
  saveButtonText: { color: "#fff", fontSize: 17, fontWeight: "900" },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  successCard: { width: width * 0.75, backgroundColor: '#1E293B', borderRadius: 32, padding: 30, alignItems: 'center', borderWidth: 2 },
  checkCircle: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  successTitle: { fontSize: 24, fontWeight: '900', color: '#fff', marginBottom: 4 },
  successText: { fontSize: 14, color: '#94A3B8', textAlign: 'center' },

  // Logged State Styles
  centeredContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 },
  checkContainer: { marginBottom: 10 },
  todayCard: {
    width: width * 0.8,
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: 30,
    padding: 25,
    marginVertical: 25,
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  todayMoodLabel: { fontSize: 28, fontWeight: '900', marginTop: 10 },
  todaySubtext: { color: '#94A3B8', fontSize: 12, marginTop: 4, fontWeight: '600' },
  doneSubText: { color: "#64748B", textAlign: 'center', fontSize: 14, lineHeight: 20 },
  backHomeBtn: { marginTop: 35, backgroundColor: "#fff", paddingHorizontal: 40, paddingVertical: 18, borderRadius: 24 },
  backHomeBtnText: { color: "#0F172A", fontWeight: "900", fontSize: 16 }
});