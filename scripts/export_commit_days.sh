#!/usr/bin/env bash
# Write commit_days.txt: one "<count> <YYYY-MM-DD>" line per day you committed.
# Only dates and counts leave your repos: no messages, file names or code.
#
#   ./export_commit_days.sh "Your Name" 2024-01-01 path/to/repo1 path/to/repo2 ...
#
# Author is matched case-insensitively against name and email (git --author is a regex),
# so "jane" catches "Jane Doe <jane@work.com>". Copies of the same commit on several
# branches (rebases, cherry-picks) are counted once, by author timestamp + subject.
set -euo pipefail

if [ "$#" -lt 3 ]; then
  echo "usage: $0 <author> <since YYYY-MM-DD> <repo> [repo...]" >&2
  exit 1
fi
author="$1"; since="$2"; shift 2

for repo in "$@"; do
  if [ ! -d "$repo/.git" ]; then echo "skipping $repo (not a git repo)" >&2; continue; fi
  n=$(git -C "$repo" log --all --no-merges --regexp-ignore-case --author="$author" --since="$since" --format='%aI|%s' | sort -u | wc -l)
  printf '%-30s %6s commits\n' "$(basename "$repo")" "$n" >&2
  git -C "$repo" log --all --no-merges --regexp-ignore-case --author="$author" --since="$since" --format='%aI|%s' | sort -u
done | cut -c1-10 | sort | uniq -c | awk '{print $1, $2}' > commit_days.txt

echo "TOTAL: $(awk '{s+=$1} END {print s}' commit_days.txt) commits on $(wc -l < commit_days.txt) days -> commit_days.txt" >&2
