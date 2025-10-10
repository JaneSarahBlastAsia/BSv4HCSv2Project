# PowerShell script to create a zip template excluding unnecessary files
# Usage: .\create-template-zip.ps1 [output-name]

param(
    [string]$TemplateName = "CPortalv3"
)

# Create the zip file name
$ZipName = "${TemplateName}.zip"

Write-Host "📦 Creating template zip file: $ZipName" -ForegroundColor Green
Write-Host "🧹 Excluding build artifacts and unnecessary files..." -ForegroundColor Yellow

# Define exclusion patterns
$ExcludePatterns = @(
    "node_modules\*",
    "bin\*",
    "obj\*",
    "*.user",
    "*.suo",
    "*.cache",
    "*.log",
    "*.tmp",
    ".vs\*",
    ".vscode\*",
    "*.zip",
    ".git\*",
    ".gitignore",
    "*.pdb",
    "*.dll",
    "*.exe",
    "Thumbs.db",
    "*.DS_Store",
    "*.swp",
    "*.swo",
    "*~",
    "*.orig",
    "*.rej",
    "*.bak",
    "*.backup",
    "*.old",
    "*.temp",
    "*.pid",
    "*.seed",
    "*.pid.lock",
    "coverage\*",
    ".nyc_output\*",
    "dist\*",
    "build\*",
    "out\*",
    "target\*",
    ".gradle\*",
    ".mvn\*",
    "*.iml",
    "*.ipr",
    "*.iws",
    ".idea\*",
    "nupkgs\*",
    "*.nupkg",
    "*.snupkg",
    "create-template-zip.ps1",
    "create-template-zip.sh",
    "build-nuget.sh",
    "build-nuget.ps1"
)

try {
    # Get all files and folders, excluding the specified patterns
    $FilesToZip = Get-ChildItem -Path . -Recurse | Where-Object {
        $item = $_
        $shouldExclude = $false
        
        foreach ($pattern in $ExcludePatterns) {
            if ($item.FullName -like "*$pattern" -or $item.Name -like $pattern) {
                $shouldExclude = $true
                break
            }
        }
        
        -not $shouldExclude
    }
    
    # Create the zip file
    Compress-Archive -Path $FilesToZip.FullName -DestinationPath $ZipName -Force
    
    if (Test-Path $ZipName) {
        $FileSize = (Get-Item $ZipName).Length
        $FileSizeFormatted = if ($FileSize -lt 1MB) { 
            "{0:N2} KB" -f ($FileSize / 1KB) 
        } else { 
            "{0:N2} MB" -f ($FileSize / 1MB) 
        }
        
        Write-Host "✅ Template zip file created successfully: $ZipName" -ForegroundColor Green
        Write-Host "📁 File size: $FileSizeFormatted" -ForegroundColor Cyan
        Write-Host "📋 Template contents:" -ForegroundColor Cyan
        
        # Show contents of the zip file
        $ZipContents = Get-ChildItem -Path $ZipName | ForEach-Object { 
            Add-Type -AssemblyName System.IO.Compression.FileSystem
            [System.IO.Compression.ZipFile]::OpenRead($_.FullName).Entries | Select-Object Name, Length
        }
        
        $ZipContents | Select-Object -First 20 | Format-Table -AutoSize
        Write-Host "..." -ForegroundColor Gray
        Write-Host "Total files: $($ZipContents.Count)" -ForegroundColor Cyan
        
        Write-Host ""
        Write-Host "🎯 Template Usage:" -ForegroundColor Yellow
        Write-Host "1. Extract the zip file to your desired location" -ForegroundColor White
        Write-Host "2. Rename the folder to your project name" -ForegroundColor White
        Write-Host "3. Update the project name in .csproj and .sln files" -ForegroundColor White
        Write-Host "4. Run 'dotnet restore' and 'dotnet build'" -ForegroundColor White
    } else {
        Write-Host "❌ No zip file created" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
