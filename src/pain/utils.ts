/* =========================
   🩹 Pain Utilities
   ========================= */

/**
 * Pain entry shape (expected)
 * date: YYYY-MM-DD
 * intensity: 0–10
 * areas: body parts where pain occurred
 */
export type PainEntry = {
  date: string;
  intensity: number;
  areas: string[];
};

/**
 * Pain store shape
 * Keyed by date
 */
export type PainStore = Record<string, PainEntry>;

/* ----------------------------------
   1️⃣ Pain Intensity Over Time
----------------------------------- */
export function getPainIntensityTimeline(store: PainStore) {
  const entries = Object.values(store || {}).sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  return {
    labels: entries.map((e) => e.date.slice(5)), // MM-DD for chart
    values: entries.map((e) => e.intensity ?? 0),
  };
}

/* ----------------------------------
   2️⃣ Pain Occurrence by Body Part
----------------------------------- */
export function getPainBodyPartCounts(store: PainStore) {
  const counts: Record<string, number> = {};

  Object.values(store || {}).forEach((entry) => {
    (entry.areas || []).forEach((area) => {
      counts[area] = (counts[area] || 0) + 1;
    });
  });

  return counts;
}

/* ----------------------------------
   3️⃣ Pain Intensity Distribution
----------------------------------- */
/**
 * Buckets:
 * 0 → None
 * 1 → Mild (1–3)
 * 2 → Moderate (4–6)
 * 3 → Severe (7–10)
 */
export function getPainIntensityBuckets(store: PainStore) {
  const buckets = [0, 0, 0, 0];

  Object.values(store || {}).forEach((entry) => {
    const intensity = entry.intensity ?? 0;

    if (intensity === 0) buckets[0]++;
    else if (intensity <= 3) buckets[1]++;
    else if (intensity <= 6) buckets[2]++;
    else buckets[3]++;
  });

  return buckets;
}

/* ----------------------------------
   4️⃣ Monthly Pain Frequency
----------------------------------- */
export function getMonthlyPainCount(store: PainStore) {
  const months: Record<string, number> = {};

  Object.values(store || {}).forEach((entry) => {
    const month = entry.date.slice(0, 7); // YYYY-MM
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
    (sum, e) => sum + (e.intensity ?? 0),
    0
  );

  return Number((total / entries.length).toFixed(1));
}
