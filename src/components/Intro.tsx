import { REPO_URL } from "./links";

export default function Intro() {
  return (
    <header className="row" style={{ justifyContent: "space-between" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <h1>Private Commit Heatmap</h1>
        <p className="lead">
          Your real work lives in private repos, so your GitHub graph looks empty. Export your daily commit counts, paste
          them here, and download a GitHub-style heatmap for your profile or portfolio.
        </p>
      </div>
      <a className="btn" href={REPO_URL}>
        View on GitHub
      </a>
    </header>
  );
}
