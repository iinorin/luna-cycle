import { Tabs, useRouter } from "expo-router";
import { Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { getCycleData } from "@/src/features/track-period/storage";
import { deleteCycleData } from "@/src/features/track-period/storage";

export default function TabsLayout() {
  const router = useRouter();

  async function handleCalendarPress() {
    const existingData = await getCycleData();

    // ✅ No data → allow normal flow
    if (!existingData) {
      router.push("/calendar");
      return;
    }

    // ⚠️ Data exists → warn user
    Alert.alert(
      "Cycle data already exists",
      "You already have cycle data saved. What would you like to do?",
      [
        {
          text: "Keep existing",
          style: "cancel",
        },
        {
          text: "Delete data",
          style: "destructive",
          onPress: async () => {
            await deleteCycleData();
            router.push("/calendar");
          },
        },
        {
          text: "Update",
          onPress: () => {
            router.push("/calendar");
          },
        },
      ]
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#6C63FF",
      }}
    >
      {/* CYCLE HOME */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Cycle",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="water" size={size} color={color} />
          ),
        }}
      />

      {/* CALENDAR / TRACK PERIOD */}
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault(); // ⛔ stop default navigation
            handleCalendarPress(); // ✅ custom logic
          },
        }}
      />

      {/* INSIGHTS */}
      <Tabs.Screen
        name="insights"
        options={{
          title: "Insights",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="stats-chart"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
