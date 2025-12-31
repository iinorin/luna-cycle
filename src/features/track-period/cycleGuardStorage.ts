import AsyncStorage from "@react-native-async-storage/async-storage";

const CYCLE_GUARD_KEY = "cycle_guard_seen";

/**
 * Returns true if popup SHOULD be shown
 */
export async function shouldShowCycleGuard(): Promise<boolean> {
  const seen = await AsyncStorage.getItem(CYCLE_GUARD_KEY);
  return seen !== "true";
}

/**
 * Marks the guard as seen so it won't show again
 */
export async function markCycleGuardSeen(): Promise<void> {
  await AsyncStorage.setItem(CYCLE_GUARD_KEY, "true");
}

/**
 * Resets the guard (used after save/delete)
 */
export async function resetCycleGuard(): Promise<void> {
  await AsyncStorage.removeItem(CYCLE_GUARD_KEY);
}
