# Copy web assets into www folder for Capacitor packaging
param()

$root = Split-Path -Parent $MyInvocation.MyCommand.Definition
$workspace = Resolve-Path "$root\.."
$src = "$workspace"
$dest = "$workspace\www"

Write-Host "Preparing web assets in: $dest"

# Compute items to copy (exclude node_modules, tools, .git and any existing www)
$exclude = @('node_modules','tools','.git','www')
$itemsToCopy = Get-ChildItem -Path $src -Force | Where-Object {
    $name = $_.Name
    -not ($exclude -contains $name)
}

# remove existing www and recreate clean destination
if (Test-Path $dest) { Remove-Item -Recurse -Force $dest }
New-Item -ItemType Directory -Path $dest | Out-Null

# Copy computed items into www
$itemsToCopy | ForEach-Object {
    $target = Join-Path $dest $_.Name
    if ($_.PSIsContainer) {
        Copy-Item -Path $_.FullName -Destination $target -Recurse -Force
    } else {
        Copy-Item -Path $_.FullName -Destination $target -Force
    }
}

Write-Host "Web assets copied. Ensure manifest.json and service worker are present and correct."
