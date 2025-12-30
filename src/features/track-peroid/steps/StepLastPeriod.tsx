import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import TrackCard from "../components/TrackCard";

type Props = {
  date: Date;
  onChange: (d: Date) => void;
  onNext: () => void;
};

export default function StepLastPeriod({
  date,
  onChange,
  onNext,
}: Props) {
  const [show, setShow] = useState(false);

  return (
    <TrackCard title="Last Period">

      <Text style={styles.question}>
        When did your last period start?
      </Text>

      <Pressable
        style={styles.button}
        onPress={() => setShow(true)}
      >
        <Ionicons name="calendar-outline" size={20} color="#fff" />
        <Text style={styles.text}>
          {date.toDateString()}
        </Text>
      </Pressable>

      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(_, d) => {
            setShow(false);
            if (d) onChange(d);
          }}
        />
      )}

      <Pressable style={styles.next} onPress={onNext}>
        <Text style={styles.nextText}>Next</Text>
      </Pressable>
    </TrackCard>
  );
}

const styles = StyleSheet.create({
  question: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  button: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#1F2933",
  },
  text: {
    color: "#fff",
  },
  next: {
    marginTop: 20,
    backgroundColor: "#EC4899",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  nextText: {
    color: "#fff",
    fontWeight: "600",
  },
});
