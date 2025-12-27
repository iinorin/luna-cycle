import { View, StyleSheet } from "react-native";

import { ScreenBackground } from "../src/components/ScreenBackground";
import { HeaderCard } from "../src/components/HeaderCard";
import { CycleRing } from "../src/components/CycleRing";

export default function HomeScreen() {
  return (
    <ScreenBackground>
      <View style={styles.container}>
        <HeaderCard />
        <CycleRing />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
