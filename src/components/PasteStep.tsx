import { sampleData } from "../lib/sampleData";

export default function PasteStep({ text, onChange }: { text: string; onChange: (t: string) => void }) {
  return (
    <div className="card">
      <h2>2. Paste the counts</h2>
      <label htmlFor="data">Contents of commit_days.txt</label>
      <textarea id="data" placeholder={"3 2025-03-14\n7 2025-03-17\n..."} value={text} onChange={(e) => onChange(e.target.value)} />
      <div className="row" style={{ marginTop: 10 }}>
        <input
          type="file"
          accept=".txt,.csv,text/plain"
          aria-label="Open commit_days.txt"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (f) onChange(await f.text());
          }}
        />
        <button type="button" onClick={() => onChange(sampleData())}>
          Try sample data
        </button>
      </div>
      <p className="small" style={{ marginTop: 8 }}>
        Everything runs in this page. Nothing is uploaded.
      </p>
    </div>
  );
}
