import { View, Text, Pressable, StyleSheet } from "react-native";
import { PAIN_TYPES, PainType } from "./painTypes";

type Props = {
  selected: PainType | null;
  onSelect: (pain: PainType) => void;
};

export default function PainTypeGrid({ selected, onSelect }: Props) {
  return (
    <View style={styles.grid}>
      {PAIN_TYPES.map((pain) => {
        const Icon = pain.icon;
        const isSelected = selected?.id === pain.id;

        return (
          <Pressable
            key={pain.id}
            onPress={() => onSelect(pain)}
            style={[
              styles.card,
              isSelected && styles.selectedCard,
            ]}
          >
            <Icon
              size={26}
              color={isSelected ? "#fff" : "#333"}
            />

            <Text
              style={[
                styles.label,
                isSelected && styles.selectedLabel,
              ]}
            >
              {pain.label}
            </Text>
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
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#eee",
    borderRadius: 14,
    paddingVertical: 16,
    width: 110,
    alignItems: "center",
  },
  selectedCard: {
    backgroundColor: "#ffb4c8",
  },
  label: {
    marginTop: 6,
    fontSize: 12,
    color: "#333",
  },
  selectedLabel: {
    color: "#fff",
    fontWeight: "600",
  },
});
