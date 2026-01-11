import AsyncStorage from "@react-native-async-storage/async-storage";

const MOOD_HISTORY_KEY = "@luna_mood_history";
const LAST_LOGGED_KEY = "@luna_last_mood_date";

export type MoodEntry = {
  id: string;
  date: string; // ISO String
  label: string;
};

export const MoodStorage = {
  /** ✅ Save mood and update the "Last Logged" date */
  saveDailyMood: async (moodId: string, label: string) => {
    try {
      const today = new Date().toLocaleDateString();
      const newEntry: MoodEntry = {
        id: moodId,
        label,
        date: new Date().toISOString(),
      };

      // 1. Update Last Logged Date for the "Daily Check"
      await AsyncStorage.setItem(LAST_LOGGED_KEY, today);

      // 2. Add to history log
      const existingHistory = await MoodStorage.getHistory();
      const updatedHistory = [newEntry, ...existingHistory];
      await AsyncStorage.setItem(MOOD_HISTORY_KEY, JSON.stringify(updatedHistory));
      
      return true;
    } catch (e) {
      console.error("Error saving mood:", e);
      return false;
    }
  },

  /** ✅ Check if the user has already logged today */
  hasLoggedToday: async (): Promise<boolean> => {
    try {
      const lastDate = await AsyncStorage.getItem(LAST_LOGGED_KEY);
      const today = new Date().toLocaleDateString();
      return lastDate === today;
    } catch (e) {
      return false;
    }
  },

  /** ✅ Get all previous mood entries */
  getHistory: async (): Promise<MoodEntry[]> => {
    try {
      const data = await AsyncStorage.getItem(MOOD_HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  /** ✅ Clear (For Reset/Testing) */
  clearMoods: async () => {
    await AsyncStorage.removeItem(LAST_LOGGED_KEY);
    await AsyncStorage.removeItem(MOOD_HISTORY_KEY);
  }
};