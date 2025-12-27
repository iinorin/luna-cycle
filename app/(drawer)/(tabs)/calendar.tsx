import { View, Text } from "react-native";

export default function CalendarScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 22 }}>📅 Calendar</Text>
      <Text>Period & ovulation calendar</Text>
    </View>
  );
}
