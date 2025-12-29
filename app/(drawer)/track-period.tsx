import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function TrackPeriodScreen() {
  const [step, setStep] = useState(1);

  const [lastPeriodDate, setLastPeriodDate] = useState<Date>(
    new Date()
  );
  const [cycleLength, setCycleLength] = useState<number>(28);

  const [showPicker, setShowPicker] = useState(false);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <Text style={styles.title}>Track Your Period</Text>
      <Text style={styles.subtitle}>
        Help us predict your next cycle accurately
      </Text>

      {/* STEP 1 */}
      {step === 1 && (
        <View style={styles.card}>
          <Text style={styles.question}>
            When did your last period start?
          </Text>

          <Pressable
            style={styles.dateButton}
            onPress={() => setShowPicker(true)}
          >
            <Ionicons
              name="calendar-outline"
              size={20}
              color="#fff"
            />
            <Text style={styles.dateText}>
              {lastPeriodDate.toDateString()}
            </Text>
          </Pressable>

          {showPicker && (
            <DateTimePicker
              value={lastPeriodDate}
              mode="date"
              display={
                Platform.OS === "ios"
                  ? "spinner"
                  : "default"
              }
              onChange={(
                event: any,
                selectedDate?: Date
              ) => {
                setShowPicker(false);
                if (selectedDate) {
                  setLastPeriodDate(selectedDate);
                }
              }}
            />
          )}

          <Pressable
            style={styles.nextButton}
            onPress={() => setStep(2)}
          >
            <Text style={styles.nextText}>Next</Text>
            <Ionicons
              name="arrow-forward"
              size={18}
              color="#fff"
            />
          </Pressable>
        </View>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <View style={styles.card}>
          <Text style={styles.question}>
            Average cycle length
          </Text>

          <View style={styles.cycleRow}>
            {[26, 28, 30].map((len) => (
              <Pressable
                key={len}
                onPress={() => setCycleLength(len)}
                style={[
                  styles.cycleChip,
                  cycleLength === len &&
                    styles.cycleChipActive,
                ]}
              >
                <Text style={styles.cycleText}>
                  {len} days
                </Text>
              </Pressable>
            ))}
          </View>

          <Pressable
            style={styles.nextButton}
            onPress={() => setStep(3)}
          >
            <Text style={styles.nextText}>Save</Text>
            <Ionicons
              name="checkmark"
              size={18}
              color="#fff"
            />
          </Pressable>
        </View>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <View style={styles.card}>
          <Ionicons
            name="heart"
            size={42}
            color="#F472B6"
          />
          <Text style={styles.doneTitle}>
            All Set!
          </Text>
          <Text style={styles.doneText}>
            Your cycle data has been saved.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#111827",
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
  },
  question: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 16,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#1F2933",
  },
  dateText: {
    color: "#fff",
    fontSize: 14,
  },
  nextButton: {
    marginTop: 20,
    backgroundColor: "#EC4899",
    paddingVertical: 14,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  nextText: {
    color: "#fff",
    fontWeight: "600",
  },
  cycleRow: {
    flexDirection: "row",
    gap: 10,
  },
  cycleChip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#1F2933",
  },
  cycleChipActive: {
    backgroundColor: "#EC4899",
  },
  cycleText: {
    color: "#fff",
    fontSize: 13,
  },
  doneTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginTop: 10,
  },
  doneText: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 6,
  },
});
