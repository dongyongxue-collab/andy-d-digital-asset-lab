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

function Invoke-QuietGh {
  param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$GhArgs
  )

  $previousErrorActionPreference = $ErrorActionPreference
  $ErrorActionPreference = "SilentlyContinue"
  & gh @GhArgs *> $null
  $exitCode = $LASTEXITCODE
  $ErrorActionPreference = $previousErrorActionPreference

  return $exitCode
}

Write-Step "Checking GitHub login"
if ((Invoke-QuietGh auth status) -ne 0) {
  gh auth login --web --clipboard --git-protocol https
}

Write-Step "Building site"
npm run build

Write-Step "Checking repository"
$repoFullName = "$Owner/$Repo"
if ((Invoke-QuietGh repo view $repoFullName) -ne 0) {
  gh repo create $repoFullName "--$Visibility" --source . --remote origin --push
} else {
  $origin = git remote get-url origin 2>$null
  if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($origin)) {
    git remote add origin "https://github.com/$repoFullName.git"
  } else {
    git remote set-url origin "https://github.com/$repoFullName.git"
  }
  git push -u origin main
}

Write-Step "Enabling GitHub Pages"
if ((Invoke-QuietGh api "repos/$repoFullName/pages") -ne 0) {
  gh api --method POST "repos/$repoFullName/pages" -f build_type=workflow *> $null
}

Write-Step "Triggering deployment"
gh workflow run deploy-pages.yml --repo $repoFullName --ref main

Write-Host ""
Write-Host "Repository: https://github.com/$repoFullName"
Write-Host "Website:    https://$Owner.github.io/$Repo/"
Write-Host "Deployment usually becomes available after 1-3 minutes."
