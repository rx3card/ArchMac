# ============================================================
# ArchMac — Arranca la ISO en QEMU desde Windows para probarla.
#
# Requiere QEMU instalado:  winget install SoftwareFreedomConservancy.QEMU
# Uso:  powershell -File os\scripts\test-iso.ps1 [-Iso ruta\a\archmac.iso]
# ============================================================
param(
    [string]$Iso = ""
)

$ErrorActionPreference = "Stop"

# Localizar la ISO más reciente si no se indicó
if (-not $Iso) {
    $outDir = Join-Path $PSScriptRoot "..\iso\out"
    $candidate = Get-ChildItem -Path $outDir -Filter *.iso -ErrorAction SilentlyContinue |
        Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if ($null -eq $candidate) {
        Write-Error "No se encontró ninguna ISO en os\iso\out. Construye primero con build-iso.sh (WSL)."
    }
    $Iso = $candidate.FullName
}

# Localizar QEMU
$qemu = Get-Command qemu-system-x86_64 -ErrorAction SilentlyContinue
if ($null -eq $qemu) {
    $default = "C:\Program Files\qemu\qemu-system-x86_64.exe"
    if (Test-Path $default) { $qemu = $default }
    else { Write-Error "QEMU no está instalado. Instálalo con: winget install SoftwareFreedomConservancy.QEMU" }
} else {
    $qemu = $qemu.Source
}

Write-Host "Arrancando $Iso en QEMU (4 GB RAM, 4 nucleos)..."

# WHPX acelera si la caracteristica 'Plataforma de hipervisor de Windows' esta activa;
# si no, QEMU cae a TCG (lento pero funcional para probar el arranque).
& $qemu `
    -m 4G -smp 4 `
    -accel whpx -accel tcg `
    -cdrom $Iso `
    -boot d `
    -vga virtio -display sdl `
    -audiodev dsound,id=snd0 -device intel-hda -device hda-duplex,audiodev=snd0 `
    -nic user,model=virtio-net-pci
