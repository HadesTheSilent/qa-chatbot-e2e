$#
# Sync docs/ -> wiki/ helper (PowerShell)
#
# Usage:
#   .\scripts\sync-wiki.ps1 [-Message "commit message"] [-Push] [-WikiUrl "git@github.com:OWNER/repo.wiki.git"]
#
# Examples:
#   # Copy docs -> wiki and commit locally
#   .\scripts\sync-wiki.ps1 -Message "Sync docs -> wiki"
#
#   # Copy docs -> wiki and publish to remote wiki (will clone remote, replace files and push)
#   .\scripts\sync-wiki.ps1 -Push
#
# Notes:
#   - If -Push is specified and no -WikiUrl is provided, the script will try to derive the wiki URL
#     from the `origin` remote by replacing `.git` with `.wiki.git`.
#   - The script will NOT attempt to push your main repository; it clones the wiki repo and pushes
#     from a temporary clone to avoid accidental pushes of the main project.
#>

[CmdletBinding()]
param(
    [string]$Message = "",
    [switch]$Push,
    [string]$WikiUrl = ""
)

$ErrorActionPreference = 'Stop'

# Ensure we are inside a git repo
try {
    $repo = git rev-parse --show-toplevel 2>$null
} catch {
    Write-Error "Este script deve ser executado dentro de um repositório git."
    exit 1
}

$repo = $repo.Trim()
$docs = Join-Path $repo 'docs'
$wiki = Join-Path $repo 'wiki'

if (-not (Test-Path $docs)) {
    Write-Error "Pasta 'docs' não encontrada em $repo"
    exit 1
}

if (-not (Test-Path $wiki)) {
    New-Item -ItemType Directory -Path $wiki | Out-Null
}

Write-Host "Copying files from $docs -> $wiki..."
Get-ChildItem -Path $docs -File | ForEach-Object {
    $dest = Join-Path $wiki $_.Name
    Copy-Item -Path $_.FullName -Destination $dest -Force
    Write-Host "  Copied: $($_.Name)"
}

Write-Host "Staging changes in local repo..."
git add $wiki 2>$null

if ($Message -ne "") {
    $msg = $Message
} else {
    $msg = "Sync docs -> wiki: $(Get-Date -Format o)"
}

# Try to commit, ignore if no changes
try {
    git commit -m "$msg" | Out-Null
    Write-Host "Committed changes to local repo."
} catch {
    Write-Host "No changes to commit locally."
}

if ($Push) {
    Write-Host "Preparing to push to remote wiki..."

    if ($WikiUrl -eq "") {
        try {
            $origin = git remote get-url origin 2>$null
        } catch {
            $origin = $null
        }

        if (-not $origin) {
            Write-Error "Não foi possível obter 'origin'. Forneça -WikiUrl explicitly."
            exit 1
        }

        $WikiUrl = $origin -replace '\.git$','.wiki.git'
        Write-Host "Derived wiki URL from origin: $WikiUrl"
    }

    # Create temp dir and clone the wiki
    $tmp = Join-Path $env:TEMP ("qa-wiki-" + [System.Guid]::NewGuid().ToString())
    Write-Host "Cloning wiki into $tmp"
    git clone $WikiUrl $tmp

    # Clean target (preserve .git)
    Write-Host "Cleaning target clone (preserving .git)..."
    Get-ChildItem -Path $tmp -Force | Where-Object { $_.Name -ne '.git' } | ForEach-Object {
        Remove-Item -LiteralPath $_.FullName -Recurse -Force -ErrorAction SilentlyContinue
    }

    # Copy current wiki content into clone
    Write-Host "Copying local wiki files into clone..."
    Copy-Item -Path (Join-Path $wiki '*') -Destination $tmp -Recurse -Force

    Push-Location $tmp
    try {
        git add --all .
        try {
            git commit -m "$msg" | Out-Null
            Write-Host "Committed changes in wiki clone. Pushing to remote..."
            git push origin main
            Write-Host "Pushed wiki to $WikiUrl"
        } catch {
            Write-Host "No changes to commit in wiki clone. Nothing to push."
        }
    } finally {
        Pop-Location
        # cleanup
        Remove-Item -LiteralPath $tmp -Recurse -Force -ErrorAction SilentlyContinue
    }
} else {
    Write-Host "Skipping remote push. Use -Push to publish to the GitHub Wiki remote."
    Write-Host "Local wiki updated and committed (if there were changes)."
    Write-Host "To publish later: .\scripts\sync-wiki.ps1 -Push"
}

Write-Host "Done."
