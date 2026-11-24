/** Colours of the exported SVG (not of this page). */
export type Palette = { bg: string; text: string; title: string; levels: string[] };

export type PaletteKey = "dark" | "light" | "custom";

export const PALETTES: Record<"light" | "dark", Palette> = {
  light: { bg: "#ffffff", text: "#57606a", title: "#1f2328", levels: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"] },
  dark: { bg: "#0d1117", text: "#8b949e", title: "#e6edf3", levels: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"] },
};

export type CustomColours = { levels: string[]; bg: string; text: string };

export const DEFAULT_CUSTOM: CustomColours = {
  levels: ["#0a3460", "#1d5a78", "#2b8a96", "#46c1c0", "#96ffff"],
  bg: "#022449",
  text: "#9fb8d6",
};

export function paletteFor(key: PaletteKey, custom: CustomColours): Palette {
  if (key !== "custom") return PALETTES[key];
  return { bg: custom.bg, text: custom.text, title: custom.text, levels: custom.levels };
}
