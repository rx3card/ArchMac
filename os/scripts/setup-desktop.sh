#!/usr/bin/env bash
# ============================================================
# ArchMac — Instala/actualiza el escritorio en un Arch ya instalado.
# Idempotente: se puede ejecutar las veces que haga falta.
#
#   bash os/scripts/setup-desktop.sh
# ============================================================
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
msg() { printf '\033[1;34m==>\033[0m %s\n' "$*"; }

msg "Instalando paquetes del escritorio…"
# shellcheck disable=SC2046
sudo pacman -S --needed --noconfirm $(grep -Ev '^\s*(#|$)' "$REPO/os/iso/packages-extra.txt")

msg "Copiando dotfiles a ~/.config…"
mkdir -p "$HOME/.config"
cp -r "$REPO/os/dotfiles/." "$HOME/.config/"

msg "Instalando wallpaper por defecto…"
mkdir -p "$HOME/.config/wallpaper"
cp "$REPO/os/branding/wallpapers/ventura-3.jpg" "$HOME/.config/wallpaper/default.jpg"

# Si Hyprland está corriendo, recargar config y reiniciar wallpaper/barra
if command -v hyprctl >/dev/null 2>&1 && [ -n "${HYPRLAND_INSTANCE_SIGNATURE:-}" ]; then
	msg "Hyprland activo: recargando…"
	pkill hyprpaper 2>/dev/null || true
	pkill waybar 2>/dev/null || true
	hyprctl reload >/dev/null
	hyprctl dispatch exec hyprpaper >/dev/null
	hyprctl dispatch exec waybar >/dev/null
fi

msg "Listo. Si no está corriendo, arranca el escritorio con: start-hyprland"
