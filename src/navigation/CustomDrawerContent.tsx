import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { View, Text, StyleSheet, Pressable, Linking } from "react-native";
import { Github } from "lucide-react-native";

export function CustomDrawerContent(props: any) {
  return (
    <View style={styles.container}>
      {/* SCROLLABLE DRAWER ITEMS */}
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.scroll}
      >
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* FOOTER */}
      <Pressable
        style={styles.footer}
        onPress={() => Linking.openURL("https://github.com/iinorin")}
      >
        <Text style={styles.footerText}>
          Made with <Text style={styles.heart}>💖</Text> by
        </Text>

        <View style={styles.githubRow}>
          <Github size={18} color="#fff" />
          <Text style={styles.username}>iinorin</Text>
        </View>
      </Pressable>
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
  },

  footer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
  },

  footerText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
  },

  heart: {
    color: "#ff6b9c",
  },

  githubRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  username: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 6,
    fontWeight: "600",
  },
});
