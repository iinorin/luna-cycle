import { View, Pressable, Text, StyleSheet } from "react-native";

type Props = {
  value: boolean | null;
  onChange: (v: boolean) => void;
};

export default function PainToggle({ value, onChange }: Props) {
  return (
    <View style={styles.row}>
      <Pressable
        style={[styles.btn, value === false && styles.active]}
        onPress={() => onChange(false)}
      >
        <Text style={styles.text}>No Pain</Text>
      </Pressable>

      <Pressable
        style={[styles.btn, value === true && styles.active]}
        onPress={() => onChange(true)}
      >
        <Text style={styles.text}>Pain</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 12,
  },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
  },
  active: {
    backgroundColor: "rgba(255,80,120,0.25)",
  },
  text: {
    color: "#fff",
    fontSize: 15,
  },
});
