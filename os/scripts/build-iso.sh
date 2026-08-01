#!/usr/bin/env bash
# ============================================================
# ArchMac — Ensambla el perfil archiso y construye la ISO.
#
# Se ejecuta DENTRO de Arch Linux (WSL2, VM o equipo real) como root:
#   sudo bash os/scripts/build-iso.sh
#
# Estrategia: copiar el perfil oficial `releng` como base y aplicar
# encima nuestras diferencias (profiledef, paquetes extra, airootfs,
# dotfiles). Así heredamos las configs de arranque (syslinux/systemd-boot)
# sin duplicarlas en el repo, y actualizan solas con archiso.
# ============================================================
set -euo pipefail

OS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORK_DIR="${ARCHMAC_WORK:-/tmp/archmac-iso}"
PROFILE_DIR="$WORK_DIR/profile"
OUT_DIR="${ARCHMAC_OUT:-$OS_DIR/iso/out}"

msg() { printf '\033[1;34m==>\033[0m %s\n' "$*"; }

[[ $EUID -eq 0 ]] || { echo "Ejecuta como root (sudo)."; exit 1; }
command -v pacman >/dev/null || { echo "Esto debe ejecutarse en Arch Linux."; exit 1; }

msg "Instalando herramientas (archiso, rsync)…"
pacman -Sy --needed --noconfirm archiso rsync

msg "Ensamblando perfil en $PROFILE_DIR…"
rm -rf "$PROFILE_DIR"
mkdir -p "$PROFILE_DIR"
cp -r /usr/share/archiso/configs/releng/. "$PROFILE_DIR/"

# 1) Nuestro profiledef (identidad de la ISO, permisos del usuario live)
install -m 644 "$OS_DIR/iso/profiledef.sh" "$PROFILE_DIR/profiledef.sh"

# 2) Paquetes: releng + los nuestros (sin comentarios ni vacíos, sin duplicados)
grep -Ev '^\s*(#|$)' "$OS_DIR/iso/packages-extra.txt" >> "$PROFILE_DIR/packages.x86_64"
sort -u "$PROFILE_DIR/packages.x86_64" -o "$PROFILE_DIR/packages.x86_64"

# 3) Overlay del sistema de archivos live (usuario archmac, autologin, sudo)
rsync -a "$OS_DIR/iso/airootfs-overlay/" "$PROFILE_DIR/airootfs/"

# 4) Dotfiles del escritorio → home del usuario live
mkdir -p "$PROFILE_DIR/airootfs/home/archmac/.config"
rsync -a "$OS_DIR/dotfiles/" "$PROFILE_DIR/airootfs/home/archmac/.config/"

# 5) Servicios: NetworkManager en lugar de iwd/systemd-networkd (elección de UX de ArchMac)
UNITS="$PROFILE_DIR/airootfs/etc/systemd/system"
rm -f "$UNITS/multi-user.target.wants/iwd.service" \
      "$UNITS/multi-user.target.wants/systemd-networkd.service" \
      "$UNITS/network-online.target.wants/systemd-networkd-wait-online.service" \
      "$UNITS/sockets.target.wants/systemd-networkd.socket" 2>/dev/null || true
mkdir -p "$UNITS/multi-user.target.wants"
ln -sf /usr/lib/systemd/system/NetworkManager.service "$UNITS/multi-user.target.wants/NetworkManager.service"

msg "Construyendo la ISO (esto tarda y descarga ~2 GB la primera vez)…"
mkdir -p "$OUT_DIR"
mkarchiso -v -w "$WORK_DIR/work" -o "$OUT_DIR" "$PROFILE_DIR"

msg "Listo. ISO en: $OUT_DIR"
ls -lh "$OUT_DIR"/*.iso 2>/dev/null || true
