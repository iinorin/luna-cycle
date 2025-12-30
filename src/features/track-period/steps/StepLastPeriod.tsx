import { View, Text, Pressable, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { Calendar } from "react-native-calendars";
import TrackCard from "../components/TrackCard";

type Props = {
  value: Date;
  onNext: (value: Date) => void;
  onBack?: () => void;
};

export default function StepLastPeriod({ value, onNext, onBack }: Props) {
  // local state so calendar actually works
  const [selectedDate, setSelectedDate] = useState<Date>(value);

  // keep in sync if parent updates value
  useEffect(() => {
    setSelectedDate(value);
  }, [value]);

  const dateKey = selectedDate.toISOString().split("T")[0];

  return (
    <TrackCard title="Last period date">
      {/* Calendar */}
      <Calendar
        onDayPress={(day) => {
          setSelectedDate(new Date(day.dateString));
        }}
        markedDates={{
          [dateKey]: {
            selected: true,
            selectedColor: "#EC4899",
          },
        }}
        theme={{
          calendarBackground: "transparent",
          dayTextColor: "#fff",
          monthTextColor: "#fff",
          arrowColor: "#EC4899",
          todayTextColor: "#F9A8D4",
        }}
        style={styles.calendar}
      />

      {/* Selected date */}
      <Text style={styles.date}>
        {selectedDate.toDateString()}
      </Text>

      {/* Actions */}
      <View style={styles.actions}>
        {onBack && (
          <Pressable onPress={onBack}>
            <Text style={styles.back}>Back</Text>
          </Pressable>
        )}

        <Pressable onPress={() => onNext(selectedDate)}>
          <Text style={styles.next}>Next</Text>
        </Pressable>
      </View>
    </TrackCard>
  );
}

const styles = StyleSheet.create({
  calendar: {
    marginTop: 8,
    borderRadius: 12,
  },
  date: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    marginVertical: 16,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  back: {
    color: "#9CA3AF",
  },
  next: {
    color: "#EC4899",
    fontWeight: "700",
  },
});
