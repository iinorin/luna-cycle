import { View, Pressable, Text, StyleSheet } from "react-native";
import { painTypes } from "./painTypes";

type Props = {
  selected: string | null;
  onSelect: (id: string) => void;
};

export default function PainTypeGrid({ selected, onSelect }: Props) {
  return (
    <View style={styles.grid}>
      {painTypes.map((item) => {
        const Icon = item.icon;
        const active = selected === item.id;

        return (
          <Pressable
            key={item.id}
            style={[styles.card, active && styles.active]}
            onPress={() => onSelect(item.id)}
          >
            <Icon size={22} color="#fff" />
            <Text style={styles.label}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    marginTop: 24,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  card: {
    width: "22%",
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
  },
  active: {
    backgroundColor: "rgba(255,80,120,0.3)",
  },
  label: {
    marginTop: 6,
    fontSize: 11,
    color: "#ddd",
  },
});
