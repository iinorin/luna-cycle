import AsyncStorage from "@react-native-async-storage/async-storage";

const ENERGY_STORAGE_KEY = "@energy_history_store";

export const getTodayDate = (): string => new Date().toISOString().split("T")[0];

/**
 * Saves energy level (1-5) for today
 * 1: Critical (Red), 5: Full (Green)
 */
export const saveEnergyForToday = async (level: number): Promise<void> => {
  try {
    const today = getTodayDate();
    const existingData = await AsyncStorage.getItem(ENERGY_STORAGE_KEY);
    const history = existingData ? JSON.parse(existingData) : {};
    
    history[today] = level;
    
    await AsyncStorage.setItem(ENERGY_STORAGE_KEY, JSON.stringify(history));
  } catch (e) {
    console.error("Failed to save energy data", e);
  }
};

export const loadTodayEnergy = async (): Promise<number | null> => {
  try {
    const today = getTodayDate();
    const existingData = await AsyncStorage.getItem(ENERGY_STORAGE_KEY);
    if (!existingData) return null;
    const history = JSON.parse(existingData);
    return history[today] || null;
  } catch (e) {
    return null;
  }
};