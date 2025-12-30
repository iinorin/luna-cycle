import { View, Text, Pressable, StyleSheet } from "react-native";

type Props = {
  onGoHome: () => void;
};

export default function StepSuccess({ onGoHome }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>
        Yaay! Your data is saved with us.
        {"\n"}
        We’ll now update your cycle 💗
      </Text>

      <Pressable style={styles.button} onPress={onGoHome}>
        <Text style={styles.buttonText}>Go back to Cycle</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  subtitle: { color: "#CBD5F5", fontSize: 16 },
  button: { backgroundColor: "#EC4899", padding: 16 },
  buttonText: { color: "white", fontWeight: "700" },
});
