# PowerShell Script to Sync docs/wiki/ to GitHub Wiki
# Usage: .\scripts\sync-wiki.ps1

$RepoUrl = "https://github.com/NyboTV/TP_ETS2_Plugin.wiki.git"
$WikiFolder = "docs/wiki"
$TempFolder = "scripts/tmp_wiki"

Write-Host "--- Syncing docs/wiki to GitHub Wiki ---" -ForegroundColor Cyan

# 1. Cleanup old tmp
if (Test-Path $TempFolder) {
    Remove-Item -Path $TempFolder -Recurse -Force
}

# 2. Clone the wiki repo
Write-Host "Cloning Wiki repository..."
git clone $RepoUrl $TempFolder

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Could not clone wiki repository." -ForegroundColor Red
    exit
}

# 3. Copy files from docs/wiki to tmp_wiki
Write-Host "Copying documentation files..."
Get-ChildItem -Path $WikiFolder -Filter *.md | Copy-Item -Destination $TempFolder

# 4. Commit and Push
Push-Location $TempFolder

git add .
$Status = git status --porcelain
if ($Status) {
    Write-Host "Changes detected, pushing to GitHub..."
    git commit -m "Manual sync from docs/wiki (via local script)"
    git push origin master
    Write-Host "--- Wiki Sync Completed Successfully! ---" -ForegroundColor Green
} else {
    Write-Host "No changes detected. Wiki is already up to date." -ForegroundColor Yellow
}

Pop-Location

# 5. Cleanup
Remove-Item -Path $TempFolder -Recurse -Force
