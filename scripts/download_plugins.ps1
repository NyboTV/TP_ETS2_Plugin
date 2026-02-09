$baseUrl = "https://github.com/truckermudgeon/scs-sdk-plugin/releases/latest/download"
$destDir = "..\bin\scs-sdk-plugin"

# Create Directory
New-Item -ItemType Directory -Force -Path $destDir | Out-Null

# Defined Files
$files = @(
    @{ Name="windows"; Zip="scs-sdk-plugin-windows.zip" },
    @{ Name="linux"; Zip="scs-sdk-plugin-linux.zip" },
    @{ Name="macos"; Zip="scs-sdk-plugin-macos.zip" }
)

# Function to download and extract
function Install-Plugin($os, $zipName) {
    $url = "$baseUrl/$zipName"
    $zipPath = Join-Path $destDir $zipName
    $extractPath = Join-Path $destDir $os

    Write-Host "Downloading $os plugin..."
    try {
        Invoke-WebRequest -Uri $url -OutFile $zipPath
        
        Write-Host "Extracting $os plugin..."
        Expand-Archive -Path $zipPath -DestinationPath $extractPath -Force
        
        # Cleanup Zip
        Remove-Item $zipPath
        
        Write-Host "$os plugin installed."
    } catch {
        Write-Host "Failed to download $os plugin: $($_.Exception.Message)"
        # Try fallback name pattern if "latest" uses different naming scheme?
        # Search result said "build-windows-latest.zip". Let's try that if this fails.
    }
}

# The search result mentioned "build-windows-latest.zip" specifically.
# Let's use THAT pattern instead of my guess.
$files = @(
    @{ Name="windows"; Zip="build-windows-latest.zip" },
    @{ Name="linux"; Zip="build-ubuntu-latest.zip" },
    @{ Name="macos"; Zip="build-macos-latest.zip" }
)

foreach ($file in $files) {
    Install-Plugin -os $file.Name -zipName $file.Zip
}
