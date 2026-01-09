import AsyncStorage from "@react-native-async-storage/async-storage";

const PAIN_DETAILS_KEY = "pain_details_store";

/**
 * Shape of a pain entry saved per day
 */
export type PainDetailsEntry = {
  bodyParts: string[];
  level: number; // 0–10
  updatedAt?: string;
};

/**
 * Get today's date (YYYY-MM-DD)
 */
const getTodayDate = (): string => {
  return new Date().toISOString().split("T")[0];
};


/**
 * Load today's pain details
 */
export const loadTodayPainDetails = async (): Promise<PainDetailsEntry | null> => {
  const today = getTodayDate();
  const raw = await AsyncStorage.getItem(PAIN_DETAILS_KEY);
  if (!raw) return null;

  const store = JSON.parse(raw);
  return store[today] || null;
};

/**
 * Save today's pain details
 */
export const savePainDetails = async (
  entry: PainDetailsEntry
): Promise<void> => {
  const today = getTodayDate();
  const raw = await AsyncStorage.getItem(PAIN_DETAILS_KEY);
  const store = raw ? JSON.parse(raw) : {};

  store[today] = {
    ...entry,
    updatedAt: entry.updatedAt || new Date().toLocaleTimeString(),
  };

  await AsyncStorage.setItem(PAIN_DETAILS_KEY, JSON.stringify(store));
};

/* =========================
   🔥 NEW: INSIGHTS SUPPORT
   ========================= */

/**
 * Get ALL pain entries (for Insights & analytics)
 */
export const getAllPainEntries = async (): Promise<
  Record<string, PainDetailsEntry>
> => {
  const raw = await AsyncStorage.getItem(PAIN_DETAILS_KEY);
  return raw ? JSON.parse(raw) : {};
};

/**
 * Clear all pain history (optional utility)
 */
export const clearAllPainDetails = async (): Promise<void> => {
  await AsyncStorage.removeItem(PAIN_DETAILS_KEY);
};
