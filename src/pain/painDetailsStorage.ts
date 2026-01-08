import AsyncStorage from "@react-native-async-storage/async-storage";

const PAIN_DETAILS_PREFIX = "pain_details";

/**
 * Single day pain record
 */
export type PainDetails = {
  date: string;
  bodyParts: string[];
  intensity: number;
};

/**
 * Get today's date (YYYY-MM-DD)
 */
const getTodayDate = (): string => {
  return new Date().toISOString().split("T")[0];
};

/**
 * Save pain details for today
 */
export const savePainDetailsForToday = async (
  bodyParts: string[],
  intensity: number
): Promise<void> => {
  const date = getTodayDate();

  const payload: PainDetails = {
    date,
    bodyParts,
    intensity,
  };

  await AsyncStorage.setItem(
    `${PAIN_DETAILS_PREFIX}_${date}`,
    JSON.stringify(payload)
  );
};

/**
 * Load today's pain details
 */
export const loadTodayPainDetails = async (): Promise<PainDetails | null> => {
  const date = getTodayDate();

  const raw = await AsyncStorage.getItem(
    `${PAIN_DETAILS_PREFIX}_${date}`
  );

  if (!raw) return null;

  try {
    return JSON.parse(raw) as PainDetails;
  } catch {
    return null;
  }
};

/**
 * Load all pain history (for Insights graphs)
 */
export const loadAllPainDetails = async (): Promise<PainDetails[]> => {
  const keys = await AsyncStorage.getAllKeys();

  const painKeys = keys.filter((k) =>
    k.startsWith(PAIN_DETAILS_PREFIX)
  );

  const items = await AsyncStorage.multiGet(painKeys);

  return items
    .map(([, value]) => {
      if (!value) return null;
      try {
        return JSON.parse(value) as PainDetails;
      } catch {
        return null;
      }
    })
    .filter(Boolean) as PainDetails[];
};

/**
 * Clear today's pain details
 */
export const clearTodayPainDetails = async (): Promise<void> => {
  const date = getTodayDate();
  await AsyncStorage.removeItem(
    `${PAIN_DETAILS_PREFIX}_${date}`
  );
};
