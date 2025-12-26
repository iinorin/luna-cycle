import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export function ScreenBackground({ children }: { children: React.ReactNode }) {
  return (
    <LinearGradient
      colors={["#E8FBF7", "#FAFFFD"]}
      style={styles.container}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
