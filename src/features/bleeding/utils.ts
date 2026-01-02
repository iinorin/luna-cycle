import { BleedingEntry } from "./storage";

/**
 * Group bleeding entries by YYYY-MM
 * NOTE: date is the OBJECT KEY, not inside BleedingEntry
 */
export function groupByMonth(
  entries: Record<string, BleedingEntry> | undefined
) {
  if (!entries || typeof entries !== "object") return {};

  const grouped: Record<string, Record<string, BleedingEntry>> = {};

  Object.entries(entries).forEach(([date, entry]) => {
    if (!date) return;

    const monthKey = date.slice(0, 7); // YYYY-MM

    if (!grouped[monthKey]) {
      grouped[monthKey] = {};
    }

    grouped[monthKey][date] = entry;
  });

  return grouped;
}

/**
 * Pie chart data: number of days per bleeding level (0–3)
 */
export function getMonthlyPieData(
  monthData: Record<string, BleedingEntry> | undefined
) {
  const counts = [0, 0, 0, 0];

  if (!monthData || typeof monthData !== "object") {
    return counts;
  }

  Object.values(monthData).forEach((entry) => {
    if (typeof entry?.level === "number") {
      counts[entry.level]++;
    }
  });

  return counts;
}

/**
 * Bar chart value: total bleeding score for a month
 */
export function getMonthlyBarValue(
  monthData: Record<string, BleedingEntry> | undefined
): number {
  if (!monthData || typeof monthData !== "object") {
    return 0;
  }

  let total = 0;

  Object.values(monthData).forEach((entry) => {
    if (typeof entry?.level === "number") {
      total += entry.level;
    }
  });

  return total;
}
