import { View, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";

type Props = {
  value: number;
  onChange: (value: number) => void;
};

export default function PainLevelBar({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      <Slider
        minimumValue={0}
        maximumValue={10}
        step={1}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor="#ff6b81"
        maximumTrackTintColor="#2f3542"
        thumbTintColor="#ff4757"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 12,
  },
});
