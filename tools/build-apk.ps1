<#
Simple build helper for Windows (PowerShell) to create an Android APK using Capacitor.
Preconditions:
- Node.js installed
- Java JDK 11+
- Android SDK and ANDROID_HOME set in environment
- Android command-line tools available

Usage (PowerShell):
.\tools\build-apk.ps1

This script will:
- run npm install
- copy web assets to www/
- initialize Capacitor if not present
- add Android platform (first run)
- copy web assets to native project
- open Android Studio project or build via Gradle
#>

$root = Split-Path -Parent $MyInvocation.MyCommand.Definition
$workspace = Resolve-Path "$root\.."
Set-Location $workspace

Write-Host "Installing npm dependencies..."
npm install

Write-Host "Preparing web assets..."
if (-not (Test-Path "tools\copy-web.ps1")) { Write-Error "Missing tools\copy-web.ps1"; exit 1 }
powershell -File tools\copy-web.ps1

# Initialize Capacitor if not already initialized
if (-not (Test-Path "capacitor.config.json")) {
    Write-Host "Initializing Capacitor..."
    npx cap init com.infortec.editmcods EditMcods --web-dir=www
}

# Add Android platform if missing
if (-not (Test-Path "android")) {
    Write-Host "Adding Android platform..."
    npx cap add android
}

Write-Host "Copying web assets into Android project..."
npx cap copy

Write-Host "Opening Android project in Android Studio (or build with Gradle)..."
# By default open Android Studio; comment out and run Gradle if you prefer CLI build
npx cap open android

Write-Host "When Android Studio opens, build 'app' -> 'Generate Signed Bundle / APK' or run Gradle assembleRelease."
