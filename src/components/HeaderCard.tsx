import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";

export function HeaderCard() {
  const navigation = useNavigation();

  return (
    <View style={styles.card}>
      {/* Hamburger menu */}
      <Pressable
        style={styles.menuBtn}
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      >
        <Ionicons name="menu" size={26} color="#fff" />
      </Pressable>

      <Text style={styles.title}>Luna Cycle</Text>
      <Text style={styles.subtitle}>
        Track your cycle • Understand your body
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#00C9B7",
    paddingVertical: 28,
    paddingHorizontal: 24,
    borderRadius: 22,
  },
  menuBtn: {
    position: "absolute",
    top: 18,
    left: 18,
    zIndex: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#EFFFFC",
    textAlign: "center",
  },
});
