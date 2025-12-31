import AsyncStorage from "@react-native-async-storage/async-storage";

const CYCLE_GUARD_KEY = "cycle_guard_seen";

/**
 * Should the cycle guard popup be shown?
 * → true if NOT seen before
 */
export async function shouldShowCycleGuard(): Promise<boolean> {
  const seen = await AsyncStorage.getItem(CYCLE_GUARD_KEY);
  return seen !== "true";
}

/**
 * Mark guard as seen (so popup doesn't reappear)
 */
export async function markCycleGuardSeen(): Promise<void> {
  await AsyncStorage.setItem(CYCLE_GUARD_KEY, "true");
}

/**
 * Reset guard (used after delete or fresh save)
 */
export async function resetCycleGuard(): Promise<void> {
  await AsyncStorage.removeItem(CYCLE_GUARD_KEY);
}
