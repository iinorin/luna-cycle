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

/**
 * Text for today's bleeding based on saved level
 */
export function getBleedingLevelText(level: number) {
  switch (level) {
    case 0:
      return "No bleeding today";
    case 1:
      return "Light bleeding today";
    case 2:
      return "Moderate bleeding today";
    case 3:
      return "Heavy bleeding today";
    default:
      return "No bleeding data for today";
  }
}

/**
 * Overall bleeding insight for a month
 */
export function getMonthlyBleedingSummary(
  monthData: Record<string, BleedingEntry> | undefined
) {
  if (!monthData || typeof monthData !== "object") {
    return "No bleeding data this month";
  }

  const values = Object.values(monthData);
  if (!values.length) return "No bleeding data this month";

  const avg =
    values.reduce((sum, e) => sum + (e.level ?? 0), 0) /
    values.length;

  if (avg < 1) return "Overall bleeding was light this month";
  if (avg < 2) return "Overall bleeding was moderate this month";
  return "Overall bleeding was heavy this month";
}

/**
 * Get today's bleeding entry safely
 */
export function getTodayBleedingEntry(
  entries: Record<string, BleedingEntry> | undefined
) {
  if (!entries || typeof entries !== "object") return null;

  const todayKey = new Date().toISOString().slice(0, 10);
  return entries[todayKey] ?? null;
}
