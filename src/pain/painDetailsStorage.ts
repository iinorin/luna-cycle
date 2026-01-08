import AsyncStorage from "@react-native-async-storage/async-storage";

const DETAILS_KEY = "pain_details";
const DETAILS_DATE_KEY = "pain_details_date";

export type PainDetailsData = {
  bodyParts: string[];
  level: number;
  updatedAt: string;
};

const today = () => new Date().toISOString().split("T")[0];

export async function savePainDetails(data: PainDetailsData) {
  await AsyncStorage.multiSet([
    [DETAILS_DATE_KEY, today()],
    [DETAILS_KEY, JSON.stringify(data)],
  ]);
}

export async function loadTodayPainDetails(): Promise<PainDetailsData | null> {
  const [[, date], [, raw]] = await AsyncStorage.multiGet([
    DETAILS_DATE_KEY,
    DETAILS_KEY,
  ]);

  if (date === today() && raw) {
    return JSON.parse(raw);
  }
  return null;
}

export async function clearPainDetails() {
  await AsyncStorage.multiRemove([DETAILS_KEY, DETAILS_DATE_KEY]);
}
