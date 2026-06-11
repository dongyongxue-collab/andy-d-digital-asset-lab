param(
  [string]$Owner = "dongyongxue-collab",
  [string]$Repo = "andy-d-digital-asset-lab",
  [ValidateSet("public", "private")]
  [string]$Visibility = "public"
)

$ErrorActionPreference = "Stop"

function Write-Step($Message) {
  Write-Host ""
  Write-Host "==> $Message" -ForegroundColor Cyan
}

Write-Step "Checking GitHub login"
gh auth status *> $null
if ($LASTEXITCODE -ne 0) {
  gh auth login --web --git-protocol https
}

Write-Step "Building site"
npm run build

Write-Step "Checking repository"
$repoFullName = "$Owner/$Repo"
gh repo view $repoFullName *> $null
if ($LASTEXITCODE -ne 0) {
  gh repo create $repoFullName "--$Visibility" --source . --remote origin
} else {
  $origin = git remote get-url origin 2>$null
  if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($origin)) {
    git remote add origin "https://github.com/$repoFullName.git"
  }
}

Write-Step "Enabling GitHub Pages"
gh api "repos/$repoFullName/pages" *> $null
if ($LASTEXITCODE -ne 0) {
  gh api --method POST "repos/$repoFullName/pages" -f build_type=workflow *> $null
}

Write-Step "Triggering deployment"
git push -u origin main

Write-Host ""
Write-Host "Repository: https://github.com/$repoFullName"
Write-Host "Website:    https://$Owner.github.io/$Repo/"
