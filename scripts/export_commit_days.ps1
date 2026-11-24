# Write commit_days.txt: one "<count> <YYYY-MM-DD>" line per day you committed.
# Only dates and counts leave your repos: no messages, file names or code.
#
#   .\export_commit_days.ps1 -Author "Your Name" -Since 2024-01-01 -Repos C:\code\repo1, C:\code\repo2
#
# Author is matched case-insensitively against name and email. Copies of the same commit
# on several branches (rebases, cherry-picks) are counted once, by author timestamp + subject.
# Works in an Administrator window too (safe.directory is set for this command only).
param(
  [Parameter(Mandatory = $true)][string]$Author,
  [Parameter(Mandatory = $true)][string]$Since,
  [Parameter(Mandatory = $true)][string[]]$Repos,
  [string]$Out = "commit_days.txt"
)

$rows = @()
foreach ($repo in $Repos) {
  if (-not (Test-Path (Join-Path $repo ".git"))) { Write-Warning "skipping $repo (not a git repo)"; continue }
  $r = @(git -c safe.directory=* -C $repo log --all --no-merges --regexp-ignore-case --author="$Author" --since=$Since --format="%aI|%s")
  $u = @($r | Sort-Object -Unique)
  "{0,-30} {1,6} commits" -f (Split-Path $repo -Leaf), $u.Count
  $rows += $u
}

$days = $rows | ForEach-Object { $_.Substring(0, 10) }
$days | Group-Object | Sort-Object Name | ForEach-Object { "$($_.Count) $($_.Name)" } |
  Set-Content -Encoding ascii $Out
"TOTAL: $($rows.Count) commits on $(($days | Sort-Object -Unique).Count) days -> $Out"
