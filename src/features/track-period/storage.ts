import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Storage key
 */
const CYCLE_DATA_KEY = "cycle_data";

/**
 * Shape of saved cycle data
 * Matches TrackPeriodScreen data
 */
export type CycleData = {
  cycleLength: number;       // days
  lastPeriod: string;        // ISO date string
  periodDuration: number;    // days

  // ✅ relaxed type (no breaking changes)
  regularity: string;

  symptoms: string[];

  // ✅ timestamps
  createdAt: string;         // ISO date
  updatedAt: string;         // ISO date
};

/**
 * Save cycle data
 */
export async function saveCycleData(
  data: Omit<CycleData, "createdAt" | "updatedAt">
): Promise<void> {
  try {
    const existing = await getCycleData();
    const now = new Date().toISOString();

    const payload: CycleData = {
      ...data,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    await AsyncStorage.setItem(
      CYCLE_DATA_KEY,
      JSON.stringify(payload)
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
    return JSON.parse(stored) as CycleData;
  } catch (error) {
    console.error("Failed to get cycle data", error);
    return null;
  }
}

/**
 * Delete cycle data
 */
export async function deleteCycleData(): Promise<void> {
  try {
    await AsyncStorage.removeItem(CYCLE_DATA_KEY);
  } catch (e) {
    console.error("Failed to delete cycle data", e);
  }
}
