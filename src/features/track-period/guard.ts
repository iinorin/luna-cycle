import { getCycleData } from "./storage";

export async function hasExistingCycleData(): Promise<boolean> {
  const data = await getCycleData();
  return !!data;
}
