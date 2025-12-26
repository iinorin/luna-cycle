import { View, Text } from "react-native";
import { MESSAGES } from "../src/messages/presets";


export default function HomeScreen() {
console.log(MESSAGES);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 22 }}>🌙 Luna Cycle</Text>
      <Text>Cycle overview will live here</Text>
    </View>
  );
}

