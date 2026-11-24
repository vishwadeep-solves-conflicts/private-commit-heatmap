/** Commit count per day, keyed by YYYY-MM-DD. */
export type Counts = Map<string, number>;

/** Reads "count YYYY-MM-DD" lines. Other lines are ignored; repeated dates are added up. */
export function parseCounts(text: string): Counts {
  const counts: Counts = new Map();
  for (const line of text.split(/\r?\n/)) {
    const m = line.trim().match(/^(\d+)\s+(\d{4}-\d{2}-\d{2})$/);
    if (m) counts.set(m[2], (counts.get(m[2]) || 0) + Number(m[1]));
  }
  return counts;
}

/** The commit counts where levels 1–4 start, from the spread of busy days. */
export function levelThresholds(counts: Counts): number[] {
  const vals = [...counts.values()].filter((v) => v > 0).sort((a, b) => a - b);
  const q = (p: number) => vals[Math.min(vals.length - 1, Math.floor(p * vals.length))];
  return [1, Math.max(2, q(0.5)), Math.max(3, q(0.75)), Math.max(4, q(0.92))];
}
