import { Alert } from "react-native";
import { getCycleData, deleteCycleData } from "../track-period/storage"

type GuardResult = "keep" | "update" | "delete";

/**
 * Shows popup if cycle data exists
 * Resolves user intent
 */
export function checkCycleDataGuard(): Promise<GuardResult | null> {
  return new Promise(async (resolve) => {
    const existing = await getCycleData();

    // No data → no popup
    if (!existing) {
      resolve(null);
      return;
    }

    Alert.alert(
      "Cycle Data Found",
      "You already have cycle data saved. What would you like to do?",
      [
        {
          text: "Keep Existing",
          style: "cancel",
          onPress: () => resolve("keep"),
        },
        {
          text: "Update Data",
          onPress: () => resolve("update"),
        },
        {
          text: "Delete Data",
          style: "destructive",
          onPress: async () => {
            await deleteCycleData();
            resolve("delete");
          },
        },
      ]
    );
  });
}
