import { View, Text, Pressable, StyleSheet } from "react-native";
import TrackCard from "../components/TrackCard";

type Props = {
  value: Date;
  onNext: (value: Date) => void;
  onBack?: () => void;
};

export default function StepLastPeriod({ value, onNext, onBack }: Props) {
  return (
    <TrackCard title="Last period date">
      <Text style={styles.date}>{value.toDateString()}</Text>

      <View style={styles.actions}>
        {onBack && (
          <Pressable onPress={onBack}>
            <Text style={styles.back}>Back</Text>
          </Pressable>
        )}

        <Pressable onPress={() => onNext(value)}>
          <Text style={styles.next}>Next</Text>
        </Pressable>
      </View>
    </TrackCard>
  );
}

const styles = StyleSheet.create({
  date: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    marginVertical: 20,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  back: {
    color: "#9CA3AF",
  },
  next: {
    color: "#EC4899",
    fontWeight: "700",
  },
});
