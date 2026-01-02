import AsyncStorage from "@react-native-async-storage/async-storage";

/* 🔑 Storage key */
const BLEEDING_KEY = "bleeding-store";

/* 🩸 Single day bleeding entry */
export type BleedingEntry = {
  level: number;      // 0 = none, 1 = light, 2 = medium, 3 = heavy
  stopped: boolean;   // has bleeding stopped?
};

/* 🗂 Store shape: YYYY-MM-DD -> BleedingEntry */
export type BleedingStore = Record<string, BleedingEntry>;

/* 📥 Load bleeding store */
export async function getBleedingStore(): Promise<BleedingStore> {
  try {
    const raw = await AsyncStorage.getItem(BLEEDING_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to load bleeding store", e);
    return {};
  }
}

/* 📤 Save entire store */
async function saveBleedingStore(store: BleedingStore) {
  try {
    await AsyncStorage.setItem(BLEEDING_KEY, JSON.stringify(store));
  } catch (e) {
    console.warn("Failed to save bleeding store", e);
  }
}

/* 💾 Save / Update bleeding entry (SAFE, UPSERT) */
export async function saveBleedingEntry({
  date,
  level,
  stopped,
}: {
  date: Date;
  level: number;
  stopped: boolean;
}) {
  const key = date.toISOString().slice(0, 10); // YYYY-MM-DD
  const store = await getBleedingStore();

  store[key] = {
    level,
    stopped,
  };

  await saveBleedingStore(store);
}

/* 🗑 Optional helper (future use) */
export async function clearBleedingStore() {
  await AsyncStorage.removeItem(BLEEDING_KEY);
}
