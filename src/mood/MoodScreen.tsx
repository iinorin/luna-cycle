import { View, StyleSheet } from "react-native";
import MoodGrid from "./MoodGrid";

export default function MoodScreen() {
  return (
    <View style={styles.container}>
      <MoodGrid />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
});
