import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer screenOptions={{ headerShown: false }}>
        <Drawer.Screen name="(tabs)" options={{ title: "Home" }} />
        <Drawer.Screen name="mood" options={{ title: "Mood Tracker" }} />
        <Drawer.Screen name="food" options={{ title: "Food Guide" }} />
        <Drawer.Screen name="pain" options={{ title: "Pain Tracker" }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}
