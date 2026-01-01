import AsyncStorage from "@react-native-async-storage/async-storage";

const BLEEDING_KEY = "bleeding_entries";

export type BleedingEntry = {
  level: number;
};

export async function getBleedingData(): Promise<
  Record<string, BleedingEntry>
> {
  const raw = await AsyncStorage.getItem(BLEEDING_KEY);
  return raw ? JSON.parse(raw) : {};
}

export async function saveBleedingEntry(
  day: number,
  level: number
) {
  const existing = await getBleedingData();

  const updated = {
    ...existing,
    [day]: { level },
  };

  await AsyncStorage.setItem(
    BLEEDING_KEY,
    JSON.stringify(updated)
  );
}
