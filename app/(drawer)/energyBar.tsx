import { View, StyleSheet } from "react-native";
import EnergySelector from "@/src/energy/EnergySelector";

export default function EnergyBarScreen() {
  return (
    <View style={styles.container}>
      <EnergySelector />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
});
