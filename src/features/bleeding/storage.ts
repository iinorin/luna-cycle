import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "BLEEDING_DATA";

export type BleedingEntry = {
  level: number; // 0-3
  stopped: boolean;
};

export type BleedingStore = Record<string, BleedingEntry>;

export async function getBleedingStore(): Promise<BleedingStore> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : {};
}

export async function saveBleedingEntry(params: {
  date: Date;
  level: number;
  stopped: boolean;
}) {
  const store = await getBleedingStore();
  const key = params.date.toISOString().slice(0, 10);

  store[key] = {
    level: params.level,
    stopped: params.stopped,
  };

  await AsyncStorage.setItem(KEY, JSON.stringify(store));
}
