/* =========================
   🩹 Pain Insights Utilities
   Works with painDetailsStorage.ts
   ========================= */

export type PainDetailsEntry = {
  bodyParts: string[];
  level: number; // 0–10
  updatedAt?: string;
};

/**
 * Pain store shape
 * {
 *   "YYYY-MM-DD": PainDetailsEntry
 * }
 */
export type PainStore = Record<string, PainDetailsEntry>;

/* ----------------------------------
   1️⃣ Pain Intensity Over Time
----------------------------------- */
export function getPainIntensityTimeline(store: PainStore) {
  const entries = Object.entries(store || {})
    .sort(([a], [b]) => a.localeCompare(b));

  return {
    labels: entries.map(([date]) => date.slice(5)), // MM-DD
    values: entries.map(([, entry]) => entry.level ?? 0),
  };
}

/* ----------------------------------
   2️⃣ Pain Occurrence by Body Part
----------------------------------- */
export function getPainBodyPartCounts(store: PainStore) {
  const counts: Record<string, number> = {};

  Object.values(store || {}).forEach((entry) => {
    (entry.bodyParts || []).forEach((part) => {
      counts[part] = (counts[part] || 0) + 1;
    });
  });

  return counts;
}

/* ----------------------------------
   3️⃣ Pain Intensity Distribution
----------------------------------- */
/**
 * Buckets:
 * 0 → None (0)
 * 1 → Mild (1–3)
 * 2 → Moderate (4–6)
 * 3 → Severe (7–10)
 */
export function getPainIntensityBuckets(store: PainStore) {
  const buckets = [0, 0, 0, 0];

  Object.values(store || {}).forEach((entry) => {
    const level = entry.level ?? 0;

    if (level === 0) buckets[0]++;
    else if (level <= 3) buckets[1]++;
    else if (level <= 6) buckets[2]++;
    else buckets[3]++;
  });

  return buckets;
}

/* ----------------------------------
   4️⃣ Monthly Pain Frequency
----------------------------------- */
export function getMonthlyPainCount(store: PainStore) {
  const months: Record<string, number> = {};

  Object.keys(store || {}).forEach((date) => {
    const month = date.slice(0, 7); // YYYY-MM
    months[month] = (months[month] || 0) + 1;
  });

  return months;
}

/* ----------------------------------
   5️⃣ Average Pain Intensity
----------------------------------- */
export function getAveragePainIntensity(store: PainStore) {
  const entries = Object.values(store || {});
  if (!entries.length) return 0;

  const total = entries.reduce(
    (sum, e) => sum + (e.level ?? 0),
    0
  );

  return Number((total / entries.length).toFixed(1));
}

/* ----------------------------------
   6️⃣ Bleeding ↔ Pain Correlation
----------------------------------- */
/**
 * bleedingStore shape:
 * {
 *   "YYYY-MM": {
 *     "DD": number; // 0–3 (None → Heavy)
 *   }
 * }
 */

export function getBleedingPainCorrelation(
  painStore: PainStore,
  bleedingStore: Record<string, Record<string, number>>
) {
  const merged: {
    date: string;
    pain: number;
    bleeding: number;
  }[] = [];

  Object.entries(painStore || {}).forEach(([date, painEntry]) => {
    const month = date.slice(0, 7); // YYYY-MM
    const day = date.slice(8, 10); // DD

    const bleedingLevel =
      bleedingStore?.[month]?.[day] ?? 0;

    merged.push({
      date,
      pain: painEntry.level ?? 0,
      bleeding: bleedingLevel,
    });
  });

  // Sort by date
  merged.sort((a, b) => a.date.localeCompare(b.date));

  return {
    labels: merged.map((d) => d.date.slice(5)), // MM-DD
    painValues: merged.map((d) => d.pain),
    bleedingValues: merged.map((d) => d.bleeding),
  };
}
