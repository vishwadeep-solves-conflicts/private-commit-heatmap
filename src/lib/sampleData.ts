import { addDays, day, iso } from "./dates";

/** Made-up sample: weekdays over two years, quieter in December. Always the same output. */
export function sampleData(): string {
  let seed = 7;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const lines: string[] = [];
  for (let d = day("2025-01-06"); d <= day("2026-11-20"); d = addDays(d, 1)) {
    const wd = d.getUTCDay();
    if (wd === 0 || wd === 6 || rand() < 0.18) continue;
    const quiet = d.getUTCMonth() === 11 ? 0.4 : 1;
    lines.push(`${Math.max(1, Math.round(rand() * rand() * 12 * quiet))} ${iso(d)}`);
  }
  return lines.join("\n");
}
