#!/usr/bin/env python3
"""Build GitHub-style commit heatmaps (SVG) from daily commit counts.

Input: a text file of "<count> <YYYY-MM-DD>" lines, as written by the
export scripts in scripts/ (or `git log ... | sort | uniq -c`).

    python3 heatmap.py commit_days.txt -o out/
    python3 heatmap.py commit_days.txt -o out/ --theme dark --caption "Commits at work"

No dependencies beyond the Python standard library.
"""
import argparse
import collections
import datetime as dt
import html
import pathlib
import sys

CELL, GAP = 10, 3
STEP = CELL + GAP
LEFT, TOP = 34, 24
YEAR_GAP = 26

THEMES = {
    "light": {"bg": "#ffffff", "text": "#57606a", "title": "#1f2328",
              "levels": ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"]},
    "dark": {"bg": "#0d1117", "text": "#8b949e", "title": "#e6edf3",
             "levels": ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"]},
}


def load(path):
    counts = collections.Counter()
    with open(path, encoding="utf-8-sig") as fh:
        for line in fh:
            parts = line.split()
            if len(parts) != 2:
                continue
            try:
                counts[dt.date.fromisoformat(parts[1])] += int(parts[0])
            except ValueError:
                continue
    if not counts:
        sys.exit(f"No '<count> <YYYY-MM-DD>' lines found in {path}")
    return counts


def thresholds(counts):
    vals = sorted(v for v in counts.values() if v > 0)
    q = lambda p: vals[min(len(vals) - 1, int(p * len(vals)))]
    return [1, max(2, q(0.5)), max(3, q(0.75)), max(4, q(0.92))]


def level(n, th):
    return 0 if n <= 0 else sum(n >= t for t in th)


def render(counts, theme, start, end, caption):
    th = thresholds(counts)
    years = list(range(start.year, end.year + 1))
    width = LEFT + 53 * STEP + 10
    height = TOP + len(years) * (7 * STEP + YEAR_GAP) + 22
    c = theme
    out = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" '
           f'viewBox="0 0 {width} {height}" font-family="-apple-system,Segoe UI,Helvetica,Arial,sans-serif">',
           f'<rect width="100%" height="100%" rx="6" fill="{c["bg"]}"/>']
    y0 = TOP
    for year in years:
        jan1 = dt.date(year, 1, 1)
        first = jan1 - dt.timedelta(days=(jan1.weekday() + 1) % 7)  # Sunday on or before Jan 1
        total = sum(v for d, v in counts.items() if d.year == year)
        out.append(f'<text x="{LEFT}" y="{y0 - 5}" font-size="11" font-weight="600" fill="{c["title"]}">'
                   f'{year} · {total:,} commits</text>')
        for row, label in ((1, "Mon"), (3, "Wed"), (5, "Fri")):
            out.append(f'<text x="2" y="{y0 + row * STEP + 9}" font-size="9" fill="{c["text"]}">{label}</text>')
        day = first
        while day.year <= year:
            col = (day - first).days // 7
            row = (day.weekday() + 1) % 7
            if day.year == year:
                if day.day == 1:
                    out.append(f'<text x="{LEFT + col * STEP}" y="{y0 + 7 * STEP + 10}" font-size="9" '
                               f'fill="{c["text"]}">{day.strftime("%b")}</text>')
                in_span = start <= day <= end
                n = counts.get(day, 0)
                fill = c["levels"][level(n, th)] if in_span else c["levels"][0]
                dim = "" if in_span else ' opacity="0.35"'
                tip = html.escape(f"{n} commits on {day.isoformat()}") if in_span else ""
                out.append(f'<rect x="{LEFT + col * STEP}" y="{y0 + row * STEP}" width="{CELL}" height="{CELL}" '
                           f'rx="2" fill="{fill}"{dim}><title>{tip}</title></rect>')
            day += dt.timedelta(days=1)
        y0 += 7 * STEP + YEAR_GAP
    lx, ly = width - 10 - 5 * STEP - 60, height - 14
    out.append(f'<text x="{lx}" y="{ly + 9}" font-size="9" fill="{c["text"]}">Less</text>')
    for i, col in enumerate(c["levels"]):
        out.append(f'<rect x="{lx + 26 + i * STEP}" y="{ly}" width="{CELL}" height="{CELL}" rx="2" fill="{col}"/>')
    out.append(f'<text x="{lx + 26 + 5 * STEP + 3}" y="{ly + 9}" font-size="9" fill="{c["text"]}">More</text>')
    out.append(f'<text x="{LEFT}" y="{ly + 9}" font-size="9" fill="{c["text"]}">'
               f'{html.escape(caption.format(start=start, end=end))}</text>')
    out.append("</svg>")
    return "\n".join(out)


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("input", help="file of '<count> <YYYY-MM-DD>' lines")
    p.add_argument("-o", "--out", default=".", help="output folder (default: current folder)")
    p.add_argument("--theme", choices=["light", "dark", "both", "custom"], default="both")
    p.add_argument("--caption", default="Commits across private repositories, {start:%b %Y} – {end:%b %Y}",
                   help="text under the graph; {start} and {end} are dates")
    p.add_argument("--colors", help="custom theme: 5 comma-separated hex colours, empty to busiest")
    p.add_argument("--bg", default="#ffffff", help="custom theme background")
    p.add_argument("--text", default="#57606a", help="custom theme label colour")
    args = p.parse_args()

    counts = load(args.input)
    start, end = min(counts), max(counts)
    out = pathlib.Path(args.out)
    out.mkdir(parents=True, exist_ok=True)

    if args.theme == "custom":
        if not args.colors or len(args.colors.split(",")) != 5:
            sys.exit("--theme custom needs --colors with 5 hex values")
        themes = {"custom": {"bg": args.bg, "text": args.text, "title": args.text,
                             "levels": [c.strip() for c in args.colors.split(",")]}}
    elif args.theme == "both":
        themes = THEMES
    else:
        themes = {args.theme: THEMES[args.theme]}

    for name, theme in themes.items():
        path = out / f"commit-heatmap-{name}.svg"
        path.write_text(render(counts, theme, start, end, args.caption), encoding="utf-8")
        print(f"wrote {path}")
    print(f"{sum(counts.values()):,} commits on {len(counts):,} days, {start} to {end}")


if __name__ == "__main__":
    main()
