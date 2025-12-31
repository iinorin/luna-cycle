import AsyncStorage from "@react-native-async-storage/async-storage";

const CYCLE_DATA_KEY = "cycle_data";

export type CycleData = {
  cycleLength: number;
  lastPeriod: string;
  periodDuration: number;
  regularity: string;
  symptoms: string[];

  createdAt?: string;
  updatedAt?: string;
};

export async function saveCycleData(data: CycleData) {
  const now = new Date().toISOString();
  const existing = await getCycleData();

  const finalData: CycleData = {
    ...data,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  await AsyncStorage.setItem(
    CYCLE_DATA_KEY,
    JSON.stringify(finalData)
  );
}

export async function getCycleData(): Promise<CycleData | null> {
  const stored = await AsyncStorage.getItem(CYCLE_DATA_KEY);
  if (!stored) return null;
  return JSON.parse(stored);
}

export async function deleteCycleData() {
  await AsyncStorage.removeItem(CYCLE_DATA_KEY);
}
