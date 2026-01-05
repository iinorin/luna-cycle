import { View, Pressable, StyleSheet } from "react-native";
import { PainType, PAIN_TYPES } from "./painTypes";

type Props = {
  selected: PainType | null;
  onSelect: (type: PainType) => void;
};

export default function PainTypeGrid({ selected, onSelect }: Props) {
  return (
    <View style={styles.grid}>
      {PAIN_TYPES.map((item) => {
  const Icon = item.icon;

  return (
    <Pressable key={item.id} style={styles.item}>
      <Icon size={24} color="#fff" />
    </Pressable>
  );
})}

    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 20,
  },
  card: {
    width: "22%",
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: "#F2F2F2",
    alignItems: "center",
    justifyContent: "center",
  },
  activeCard: {
    backgroundColor: "#FFD6E8",
  },
});
