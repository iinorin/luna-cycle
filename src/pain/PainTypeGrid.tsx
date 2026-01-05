import { View, Pressable, StyleSheet } from "react-native";
import { PAIN_TYPES } from "./painTypes";

type Props = {
  selected: string[];
  onSelect: (id: string) => void;
};

export default function PainTypeGrid({ selected, onSelect }: Props) {
  return (
    <View style={styles.grid}>
      {PAIN_TYPES.map((item) => {
        const Icon = item.icon;
        const isActive = selected.includes(item.id);

        return (
          <Pressable
            key={item.id}
            onPress={() => onSelect(item.id)}
            style={[
              styles.item,
              isActive && styles.activeItem,
            ]}
          >
            <Icon size={24} color={isActive ? "#fff" : "#888"} />
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
    marginTop: 16,
  },

  item: {
    width: "22%",
    aspectRatio: 1,
    borderRadius: 14,
    backgroundColor: "#1e1e1e",
    alignItems: "center",
    justifyContent: "center",
  },

  activeItem: {
    backgroundColor: "#ff6b81",
  },
});
