<#
Moral Clarity AI • Canon Integrity Verification Script

- Verifies governed documents against governance/checksums.yml
- Fails on:
  - Missing files
  - TODO checksums
  - Hash mismatches
  - YAML parse errors
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Write-Host "🔍 Moral Clarity AI — Canon Integrity Check" -ForegroundColor Cyan

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$checksumFile = Join-Path $repoRoot "governance/checksums.yml"

if (-not (Test-Path $checksumFile)) {
    throw "❌ Missing governance/checksums.yml"
}

# --- Load YAML ---
try {
    $yamlText = Get-Content $checksumFile -Raw
    $yaml = ConvertFrom-Yaml $yamlText
}
catch {
    throw "❌ Failed to parse checksums.yml: $_"
}

if (-not $yaml.documents) {
    throw "❌ No documents listed in checksums.yml"
}

$failures = @()

foreach ($doc in $yaml.documents) {

    $relativePath = $doc.file
    $expectedHash = $doc.checksum

    Write-Host "→ Verifying $relativePath"

    if ($expectedHash -eq "TODO") {
        $failures += "Checksum TODO for $relativePath"
        continue
    }

    $fullPath = Join-Path $repoRoot $relativePath

    if (-not (Test-Path $fullPath)) {
        $failures += "Missing file: $relativePath"
        continue
    }

    $actualHash = (Get-FileHash $fullPath -Algorithm SHA256).Hash.ToUpper()
    $expectedHash = $expectedHash.ToUpper()

    if ($actualHash -ne $expectedHash) {
        $failures += @"
Hash mismatch for $relativePath
  Expected: $expectedHash
  Actual:   $actualHash
"@
    }
}

if ($failures.Count -gt 0) {
    Write-Host "`n❌ CANON INTEGRITY FAILURE" -ForegroundColor Red
    foreach ($f in $failures) {
        Write-Host " - $f" -ForegroundColor Red
    }
    exit 1
}

Write-Host "`n✅ Canon integrity verified. No drift detected." -ForegroundColor Green
exit 0
