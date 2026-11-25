// Builds the heatmap as an SVG string: one GitHub-style block per year, a legend and a caption.
import { levelThresholds, type Counts } from "./commits";
import { DAY_MS, MONTHS, addDays, day, iso, monthYear } from "./dates";
import type { Palette } from "./palettes";

const CELL = 10, GAP = 3, STEP = CELL + GAP, LEFT = 34, TOP = 24, YEAR_GAP = 26;

const esc = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export type Rendered = { svg: string; total: number; days: number; start: Date; end: Date };

/** `caption` may contain {start} and {end}, which become month and year. */
export function renderHeatmap(counts: Counts, t: Palette, caption: string): Rendered {
  const keys = [...counts.keys()].sort();
  const start = day(keys[0]);
  const end = day(keys[keys.length - 1]);
  const th = levelThresholds(counts);
  const level = (n: number) => (n <= 0 ? 0 : th.filter((x) => n >= x).length);

  const years: number[] = [];
  for (let y = start.getUTCFullYear(); y <= end.getUTCFullYear(); y++) years.push(y);
  const width = LEFT + 53 * STEP + 10;
  const height = TOP + years.length * (7 * STEP + YEAR_GAP) + 22;

  const out = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" font-family="-apple-system,Segoe UI,Helvetica,Arial,sans-serif">`,
    `<rect width="100%" height="100%" rx="6" fill="${t.bg}"/>`,
  ];

  let y0 = TOP;
  for (const year of years) {
    const jan1 = new Date(Date.UTC(year, 0, 1));
    const first = addDays(jan1, -jan1.getUTCDay());
    let total = 0;
    for (const [k, v] of counts) if (k.startsWith(year + "-")) total += v;
    out.push(`<text x="${LEFT}" y="${y0 - 5}" font-size="11" font-weight="600" fill="${t.title}">${year} · ${total.toLocaleString("en-US")} commits</text>`);
    ([[1, "Mon"], [3, "Wed"], [5, "Fri"]] as const).forEach(([r, l]) =>
      out.push(`<text x="2" y="${y0 + r * STEP + 9}" font-size="9" fill="${t.text}">${l}</text>`)
    );
    for (let d = first; d.getUTCFullYear() <= year; d = addDays(d, 1)) {
      if (d.getUTCFullYear() !== year) continue;
      const col = Math.floor((d.getTime() - first.getTime()) / (7 * DAY_MS));
      const row = d.getUTCDay();
      if (d.getUTCDate() === 1)
        out.push(`<text x="${LEFT + col * STEP}" y="${y0 + 7 * STEP + 10}" font-size="9" fill="${t.text}">${MONTHS[d.getUTCMonth()]}</text>`);
      const inSpan = d >= start && d <= end;
      const n = counts.get(iso(d)) || 0;
      out.push(
        `<rect x="${LEFT + col * STEP}" y="${y0 + row * STEP}" width="${CELL}" height="${CELL}" rx="2" fill="${inSpan ? t.levels[level(n)] : t.levels[0]}"${inSpan ? "" : ' opacity="0.35"'}><title>${inSpan ? `${n} commits on ${iso(d)}` : ""}</title></rect>`
      );
    }
    y0 += 7 * STEP + YEAR_GAP;
  }

  // legend and caption along the bottom
  const lx = width - 10 - 5 * STEP - 60;
  const ly = height - 14;
  out.push(`<text x="${lx}" y="${ly + 9}" font-size="9" fill="${t.text}">Less</text>`);
  t.levels.forEach((c, i) => out.push(`<rect x="${lx + 26 + i * STEP}" y="${ly}" width="${CELL}" height="${CELL}" rx="2" fill="${c}"/>`));
  out.push(`<text x="${lx + 26 + 5 * STEP + 3}" y="${ly + 9}" font-size="9" fill="${t.text}">More</text>`);
  out.push(
    `<text x="${LEFT}" y="${ly + 9}" font-size="9" fill="${t.text}">${esc(caption.replace("{start}", monthYear(start)).replace("{end}", monthYear(end)))}</text>`
  );
  out.push("</svg>");

  return { svg: out.join("\n"), total: [...counts.values()].reduce((a, b) => a + b, 0), days: counts.size, start, end };
}
