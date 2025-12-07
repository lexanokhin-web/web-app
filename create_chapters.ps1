$files = @(
    "chapter_4_konzessive_saetze.json",
    "chapter_5_genitiv.json",
    "chapter_6_konjunktiv_ii.json",
    "chapter_7_praepositionen_lokal.json",
    "chapter_8_praepositionen_temporal.json",
    "chapter_9_nebensaetze_temporal.json",
    "chapter_10_relativsaetze.json",
    "chapter_11_adjektivdeklination.json",
    "chapter_12_modalverben.json",
    "chapter_13_passiv.json",
    "chapter_14_praepositionalobjekte.json",
    "chapter_15_werden.json",
    "chapter_16_konjunktionen.json",
    "chapter_17_brauchen_lassen.json"
)

$src = "C:\Users\Cubic\.gemini\placeholder_chapter.json"
$destDir = "public\data\b1_book"

if (-not (Test-Path $src)) {
    Write-Error "Source file not found: $src"
    exit 1
}

if (-not (Test-Path $destDir)) {
    Write-Error "Destination directory not found: $destDir"
    exit 1
}

foreach ($file in $files) {
    $destPath = Join-Path $destDir $file
    Copy-Item -Path $src -Destination $destPath -Force
    Write-Host "Created $destPath"
}
