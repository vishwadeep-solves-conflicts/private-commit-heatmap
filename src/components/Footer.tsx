import { AUTHOR_URL, REPO_URL } from "./links";

export default function Footer() {
  return (
    <footer>
      Made by <a href={AUTHOR_URL}>Vishwadeep Kushwaha</a> · <a href={REPO_URL}>Source and Python CLI</a> · MIT licence
    </footer>
  );
}
