import { Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TrackCard from "../components/TrackCard";

export default function StepDone() {
  return (
    <TrackCard>
      <Ionicons name="heart" size={40} color="#EC4899" />
      <Text style={styles.title}>All Set</Text>
      <Text style={styles.text}>
        Your cycle data has been saved
      </Text>
    </TrackCard>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 10,
  },
  text: {
    color: "#9CA3AF",
    marginTop: 6,
  },
});
