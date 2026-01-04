import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { View, Text, StyleSheet, Pressable, Linking } from "react-native";
import { Github } from "lucide-react-native";
import Constants from "expo-constants";

export function CustomDrawerContent(props: any) {
  const version =
    Constants.expoConfig?.version ??
    Constants.manifest?.version ??
    "1.0.0";

  return (
    <View style={styles.container}>
      {/* SCROLLABLE ITEMS */}
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.scroll}
      >
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* GITHUB FOOTER */}
      <Pressable
        style={styles.githubFooter}
        onPress={() => Linking.openURL("https://github.com/iinorin")}
      >
        <Github size={18} color="#fff" />
        <Text style={styles.githubText}>
          Made with <Text style={styles.heart}>💖</Text> by{" "}
          <Text style={styles.username}>iinorin</Text>
        </Text>
      </Pressable>

      {/* APP INFO FOOTER */}
      <View style={styles.appInfoFooter}>
        <Text style={styles.appName}>Luna Cycle</Text>
        <Text style={styles.appInfo}>Version {version}</Text>
        <Text style={styles.appInfo}>Built with Expo · React Native</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b132b",
  },

  scroll: {
    paddingTop: 10,
    paddingBottom: 8,
  },

  /* ───────── GITHUB FOOTER ───────── */
  githubFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  githubText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
  },

  heart: {
    color: "#ff6b9c",
  },

  username: {
    color: "#fff",
    fontWeight: "600",
  },

  /* ───────── APP INFO FOOTER ───────── */
  appInfoFooter: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    backgroundColor: "#0b132b",
  },

  appName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },

  appInfo: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    lineHeight: 16,
  },
});
