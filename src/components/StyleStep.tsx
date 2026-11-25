import type { CustomColours, PaletteKey } from "../lib/palettes";

type Props = {
  paletteKey: PaletteKey;
  onPaletteKey: (k: PaletteKey) => void;
  custom: CustomColours;
  onCustom: (c: CustomColours) => void;
  caption: string;
  onCaption: (c: string) => void;
};

export default function StyleStep({ paletteKey, onPaletteKey, custom, onCustom, caption, onCaption }: Props) {
  const setLevel = (i: number, v: string) => onCustom({ ...custom, levels: custom.levels.map((c, j) => (j === i ? v : c)) });
  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <h2>3. Style it</h2>
      <div>
        <label htmlFor="theme">Theme</label>
        <select id="theme" value={paletteKey} onChange={(e) => onPaletteKey(e.target.value as PaletteKey)}>
          <option value="dark">GitHub dark</option>
          <option value="light">GitHub light</option>
          <option value="custom">Custom colours</option>
        </select>
      </div>
      {paletteKey === "custom" && (
        <div>
          <label>Colours, empty to busiest</label>
          <div className="colors">
            {custom.levels.map((c, i) => (
              <input key={i} type="color" value={c} aria-label={`Level ${i} colour`} onChange={(e) => setLevel(i, e.target.value)} />
            ))}
          </div>
          <div className="row" style={{ marginTop: 8 }}>
            <label style={{ margin: 0 }} htmlFor="cbg">
              Background
            </label>
            <input type="color" id="cbg" value={custom.bg} onChange={(e) => onCustom({ ...custom, bg: e.target.value })} />
            <label style={{ margin: 0 }} htmlFor="ctext">
              Labels
            </label>
            <input type="color" id="ctext" value={custom.text} onChange={(e) => onCustom({ ...custom, text: e.target.value })} />
          </div>
        </div>
      )}
      <div>
        <label htmlFor="caption">Caption</label>
        <input type="text" id="caption" value={caption} onChange={(e) => onCaption(e.target.value)} />
        <p className="small">{"{start} and {end} become month and year."}</p>
      </div>
    </div>
  );
}
