import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "cycle-data";

export type CycleData = {
  lastPeriodDate: string;
  cycleLength: number;
  periodDuration: number;
  regularity: "regular" | "sometimes" | "irregular";
  symptoms: string[];
};

export async function saveCycleData(data: CycleData) {
  await AsyncStorage.setItem(KEY, JSON.stringify(data));
}

export async function getCycleData(): Promise<CycleData | null> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return null;
  return JSON.parse(raw);
}

export async function clearCycleData() {
  await AsyncStorage.removeItem(KEY);
}
