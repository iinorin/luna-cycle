import { View, Text } from "react-native";
import { DEFAULT_CYCLE_STATE } from "../src/cycle/state";
import { MESSAGES } from "../src/messages/presets";


export default function HomeScreen() {
console.log(MESSAGES);
console.log("Cycle state:", DEFAULT_CYCLE_STATE);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 22 }}>🌙 Luna Cycle</Text>
      <Text>Cycle overview will live here</Text>
    </View>
  );
}

