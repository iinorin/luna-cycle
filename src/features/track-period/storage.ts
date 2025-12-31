import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Storage key
 */
const CYCLE_DATA_KEY = "cycle_data";

/**
 * Shape of saved cycle data
 * This MUST match what TrackPeriodScreen saves
 */
export type CycleData = {
  cycleLength: number;       // days
  lastPeriod: string;        // ISO date string
  periodDuration: number;    // days
  regularity: string;        // "regular" | "irregular" | etc
  symptoms: string[];        // ["cramps", "headache"]
};

/**
 * Save cycle data
 */
export async function saveCycleData(data: CycleData): Promise<void> {
  try {
    await AsyncStorage.setItem(
      CYCLE_DATA_KEY,
      JSON.stringify(data)
    );
  } catch (error) {
    console.error("Failed to save cycle data", error);
  }
}

/**
 * Get cycle data
 */
export async function getCycleData(): Promise<CycleData | null> {
  try {
    const stored = await AsyncStorage.getItem(CYCLE_DATA_KEY);
    if (!stored) return null;
    console.log("Stored cycle data:", stored);

    return JSON.parse(stored) as CycleData;
  } catch (error) {
    console.error("Failed to get cycle data", error);
    return null;
  }
}

/**
 * Clear cycle data (optional – useful for reset/debug)
 */
export async function clearCycleData(): Promise<void> {
  try {
    await AsyncStorage.removeItem(CYCLE_DATA_KEY);
  } catch (error) {
    console.error("Failed to clear cycle data", error);
  }
}
