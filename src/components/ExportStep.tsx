import { SCRIPT_URL } from "./links";

export default function ExportStep() {
  return (
    <section className="card">
      <h2>1. Export your commit dates</h2>
      <p className="small">
        Run one of these where your repos are. It writes <code>commit_days.txt</code> with only dates and counts: no commit
        messages, file names or code.
      </p>
      <div className="grid" style={{ marginTop: 12 }}>
        <div>
          <b>macOS / Linux</b>
          <pre>{`curl -O ${SCRIPT_URL}
bash export_commit_days.sh "Your Name" 2024-01-01 ~/code/repo1 ~/code/repo2`}</pre>
        </div>
        <div>
          <b>Windows (PowerShell)</b>
          <pre>{`.\\export_commit_days.ps1 -Author "Your Name" \`
  -Since 2024-01-01 -Repos C:\\code\\repo1, C:\\code\\repo2`}</pre>
        </div>
      </div>
    </section>
  );
}
