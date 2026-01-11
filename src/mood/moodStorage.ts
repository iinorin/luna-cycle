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
      const now = new Date();
      const todayString = now.toLocaleDateString();
      
      const newEntry: MoodEntry = {
        id: moodId,
        label,
        date: now.toISOString(),
      };

      // 1. Update Last Logged Date
      await AsyncStorage.setItem(LAST_LOGGED_KEY, todayString);

      // 2. Add to history log
      const history = await MoodStorage.getHistory();
      
      // Prevent duplicate entries for the same day in history if they edit
      const filteredHistory = history.filter(
        entry => new Date(entry.date).toLocaleDateString() !== todayString
      );
      
      const updatedHistory = [newEntry, ...filteredHistory];
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

  /** ✅ GET STREAK STATS (Current & Best) */
  getStreakStats: async (): Promise<{ current: number; best: number }> => {
    try {
      const history = await MoodStorage.getHistory();
      if (history.length === 0) return { current: 0, best: 0 };

      // Ensure history is sorted by date (newest first)
      const sortedHistory = history.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      let currentStreak = 0;
      let bestStreak = 0;
      let tempStreak = 0;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let lastCheckedDate = new Date(today);
      
      // Determine if current streak is even possible (must have logged today or yesterday)
      const mostRecentEntryDate = new Date(sortedHistory[0].date);
      mostRecentEntryDate.setHours(0, 0, 0, 0);
      const daysSinceLastLog = Math.floor((today.getTime() - mostRecentEntryDate.getTime()) / (1000 * 60 * 60 * 24));

      // Calculate streaks
      let iterDate = new Date(mostRecentEntryDate);

      for (let i = 0; i < sortedHistory.length; i++) {
        const entryDate = new Date(sortedHistory[i].date);
        entryDate.setHours(0, 0, 0, 0);

        if (i === 0) {
          tempStreak = 1;
        } else {
          const prevEntryDate = new Date(sortedHistory[i - 1].date);
          prevEntryDate.setHours(0, 0, 0, 0);
          
          const diff = Math.floor((prevEntryDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));

          if (diff === 1) {
            tempStreak++;
          } else {
            // Gap found, streak broken
            if (tempStreak > bestStreak) bestStreak = tempStreak;
            tempStreak = 1;
          }
        }
      }
      
      // Final check for best streak
      if (tempStreak > bestStreak) bestStreak = tempStreak;

      // Current streak only counts if the most recent log was today or yesterday
      currentStreak = daysSinceLastLog <= 1 ? tempStreak : 0;
      
      // If the streak was broken but they logged today, the current streak is 1
      // (The logic above handles the most recent chain)
      
      return { current: currentStreak, best: bestStreak };
    } catch (e) {
      return { current: 0, best: 0 };
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