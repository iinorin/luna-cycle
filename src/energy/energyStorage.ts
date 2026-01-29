import AsyncStorage from "@react-native-async-storage/async-storage";

const ENERGY_STORAGE_KEY = "@energy_history_store";

export const getTodayDate = (): string =>
  new Date().toISOString().split("T")[0];

export type EnergyEntry = {
  level: number;
  date: string;
  time: string;
};

export const saveEnergyForToday = async (
  level: number
): Promise<void> => {
  try {
    const now = new Date();
    const today = getTodayDate();

    const entry: EnergyEntry = {
      level,
      date: today,
      time: now.toTimeString().slice(0, 5), // HH:mm
    };

    const existingData = await AsyncStorage.getItem(
      ENERGY_STORAGE_KEY
    );
    const history = existingData ? JSON.parse(existingData) : {};

    history[today] = entry;

    await AsyncStorage.setItem(
      ENERGY_STORAGE_KEY,
      JSON.stringify(history)
    );
  } catch (e) {
    console.error("Failed to save energy data", e);
  }
};

export const loadTodayEnergy = async (): Promise<EnergyEntry | null> => {
  try {
    const today = getTodayDate();
    const existingData = await AsyncStorage.getItem(
      ENERGY_STORAGE_KEY
    );
    if (!existingData) return null;

    const history = JSON.parse(existingData);
    return history[today] ?? null;
  } catch {
    return null;
  }
};
