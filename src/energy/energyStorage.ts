import AsyncStorage from "@react-native-async-storage/async-storage";

const ENERGY_STORAGE_KEY = "@energy_history_store";

export const getTodayDate = (): string =>
  new Date().toISOString().split("T")[0];

const getCurrentTime = (): string =>
  new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

/**
 * Saves energy level (1–5) for today
 * Stores date + time only on first save of the day
 */
export const saveEnergyForToday = async (level: number): Promise<void> => {
  try {
    const today = getTodayDate();
    const existingData = await AsyncStorage.getItem(ENERGY_STORAGE_KEY);
    const history = existingData ? JSON.parse(existingData) : {};

    // If not already saved today, add time
    if (!history[today]) {
      history[today] = {
        level,
        date: today,
        time: getCurrentTime(),
      };
    } else {
      // Editing existing entry → update only level
      history[today].level = level;
    }

    await AsyncStorage.setItem(
      ENERGY_STORAGE_KEY,
      JSON.stringify(history)
    );
  } catch (e) {
    console.error("Failed to save energy data", e);
  }
};

/**
 * Loads today's energy entry
 */
export const loadTodayEnergy = async (): Promise<{
  level: number;
  date: string;
  time: string;
} | null> => {
  try {
    const today = getTodayDate();
    const existingData = await AsyncStorage.getItem(ENERGY_STORAGE_KEY);
    if (!existingData) return null;

    const history = JSON.parse(existingData);
    return history[today] || null;
  } catch {
    return null;
  }
};
