import AsyncStorage from "@react-native-async-storage/async-storage";

export type PainSelection = "none" | "pain";

const PAIN_DATE_KEY = "pain_date";
const PAIN_SELECTION_KEY = "pain_selection";

/**
 * Returns today's date in YYYY-MM-DD format
 */
export const getTodayDate = (): string => {
  return new Date().toISOString().split("T")[0];
};

/**
 * Save pain selection for today
 */
export const savePainForToday = async (
  selection: PainSelection
): Promise<void> => {
  const today = getTodayDate();

  await AsyncStorage.multiSet([
    [PAIN_DATE_KEY, today],
    [PAIN_SELECTION_KEY, selection],
  ]);
};

/**
 * Load pain selection if it exists for today
 * Returns null if not found or from a different day
 */
export const loadTodayPain = async (): Promise<PainSelection | null> => {
  const today = getTodayDate();

  const [[, storedDate], [, storedSelection]] =
    await AsyncStorage.multiGet([PAIN_DATE_KEY, PAIN_SELECTION_KEY]);

  if (storedDate === today && storedSelection) {
    return storedSelection as PainSelection;
  }

  return null;
};

/**
 * Clear stored pain data (optional utility)
 */
export const clearPainData = async (): Promise<void> => {
  await AsyncStorage.multiRemove([PAIN_DATE_KEY, PAIN_SELECTION_KEY]);
};
