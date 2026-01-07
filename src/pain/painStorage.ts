import AsyncStorage from "@react-native-async-storage/async-storage";

export type PainSelection = "none" | "pain";

const PAIN_DATE_KEY = "pain_date";
const PAIN_SELECTION_KEY = "pain_selection";

export const getTodayDate = (): string => {
  return new Date().toISOString().split("T")[0];
};

export const savePainForToday = async (
  selection: PainSelection
): Promise<void> => {
  const today = getTodayDate();

  await AsyncStorage.multiSet([
    [PAIN_DATE_KEY, today],
    [PAIN_SELECTION_KEY, selection],
  ]);
};

export const loadTodayPain = async (): Promise<PainSelection | null> => {
  const today = getTodayDate();

  const result = await AsyncStorage.multiGet([
    PAIN_DATE_KEY,
    PAIN_SELECTION_KEY,
  ]);

  const storedDate = result[0][1];
  const storedSelection = result[1][1];

  if (storedDate === today && storedSelection) {
    return storedSelection as PainSelection;
  }

  return null;
};

export const clearPainData = async (): Promise<void> => {
  await AsyncStorage.multiRemove([
    PAIN_DATE_KEY,
    PAIN_SELECTION_KEY,
  ]);
};
