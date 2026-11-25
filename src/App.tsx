import { useMemo, useState } from "react";
import AppBar from "./shared/AppBar";
import Intro from "./components/Intro";
import ExportStep from "./components/ExportStep";
import PasteStep from "./components/PasteStep";
import StyleStep from "./components/StyleStep";
import PreviewStep from "./components/PreviewStep";
import Footer from "./components/Footer";
import { parseCounts } from "./lib/commits";
import { DEFAULT_CUSTOM, paletteFor, type CustomColours, type PaletteKey } from "./lib/palettes";

export default function App() {
  const [text, setText] = useState("");
  const [paletteKey, setPaletteKey] = useState<PaletteKey>("dark");
  const [custom, setCustom] = useState<CustomColours>(DEFAULT_CUSTOM);
  const [caption, setCaption] = useState("Commits across private repositories, {start} – {end}");

  const counts = useMemo(() => parseCounts(text), [text]);
  const palette = paletteFor(paletteKey, custom);

  return (
    <>
      <AppBar title="Private Commit Heatmap" />
      <main>
        <Intro />
        <ExportStep />
        <section className="grid">
          <PasteStep text={text} onChange={setText} />
          <StyleStep
            paletteKey={paletteKey}
            onPaletteKey={setPaletteKey}
            custom={custom}
            onCustom={setCustom}
            caption={caption}
            onCaption={setCaption}
          />
        </section>
        <PreviewStep counts={counts} hasText={text.trim() !== ""} palette={palette} paletteKey={paletteKey} caption={caption} />
        <Footer />
      </main>
    </>
  );
}
