import { View, ActivityIndicator } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { loadTodayEnergy } from "@/src/energy/energyStorage";

export default function Entry() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const todayEnergy = await loadTodayEnergy();

      if (todayEnergy !== null) {
        router.replace({
          pathname: "/energy/energy-success",
          params: { level: todayEnergy },
        });
      } else {
        router.replace("./app/(drawer)/(tabs)/energyBar");
      }
    })();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator color="#fff" />
    </View>
  );
}
