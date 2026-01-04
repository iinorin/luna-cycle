import { View, Text, StyleSheet, Pressable, Linking } from "react-native";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Github } from "lucide-react-native";

export function CustomDrawerContent(props: any) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* SCROLLABLE AREA */}
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 24,
          },
        ]}
      >
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* GITHUB SECTION */}
      <Pressable
        style={styles.githubRow}
        onPress={() => Linking.openURL("https://github.com/iinorin")}
      >
        <Github size={18} color="#fff" />
        <Text style={styles.githubText}>Made with 💖 by iinorin</Text>
      </Pressable>

      {/* FIXED FOOTER */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <Text style={styles.appName}>Luna Cycle</Text>
        <Text style={styles.meta}>Version 1.0.0</Text>
        <Text style={styles.meta}>Built with Expo · React Native - 12/25</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(20, 20, 30, 0.85)",
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  githubRow: {
    flexDirection: "row",
    // alignItems: "center",
    marginLeft: 20,
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  githubText: {
    color: "#fff",
    fontSize: 14,
    opacity: 0.9,
  },

  footer: {
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  appName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },

  meta: {
    color: "#CBD5E1",
    fontSize: 12,
  },
});
