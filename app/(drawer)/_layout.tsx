import { Drawer } from "expo-router/drawer";
import { CustomDrawerContent } from "@/src/navigation/CustomDrawerContent";

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: "slide",
        drawerStyle: {
          width: "70%",
          backgroundColor: "rgba(20, 20, 30, 0.85)",
        },
        overlayColor: "rgba(0,0,0,0.35)",
        drawerLabelStyle: {
          color: "#fff",
          fontSize: 16,
          marginTop: 20,
          marginLeft: -10,
        },
        drawerActiveBackgroundColor: "rgba(255,255,255,0.15)",
      }}
    >
      {/* MAIN APP (Tabs) */}
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: "🌙 Cycle",
        }}
      />

      <Drawer.Screen
        name="track-period"
        options={{
          title: "📊 Track Your Period",
        }}
      />

      {/* DRAWER FEATURES */}
      <Drawer.Screen
        name="mood"
        options={{
          title: "😊 Mood Tracker",
        }}
      />

      <Drawer.Screen
        name="food"
        options={{
          title: "🥗 Food Guide",
        }}
      />

      <Drawer.Screen
        name="pain"
        options={{
          title: "🔥 Pain Tracker",
        }}
      />
    </Drawer>
  );
}
