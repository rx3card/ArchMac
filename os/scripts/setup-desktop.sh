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

msg "Instalando el shell (dock Quickshell)…"
mkdir -p "$HOME/.config/quickshell"
rm -rf "$HOME/.config/quickshell/archmac"
cp -r "$REPO/os/shell/quickshell" "$HOME/.config/quickshell/archmac"
# Iconos de la simulación (provisionales) para el dock
cp -r "$REPO/web/simulation/public/app-icons" "$HOME/.config/quickshell/archmac/icons"

msg "Configurando autoarranque del escritorio (login en tty1)…"
if ! grep -q ARCHMAC_AUTOSTART "$HOME/.bash_profile" 2>/dev/null; then
	cat >> "$HOME/.bash_profile" <<'EOF'
# ARCHMAC_AUTOSTART: entrar al escritorio al hacer login en tty1
if [[ -z "$WAYLAND_DISPLAY" && "$(tty)" == "/dev/tty1" ]]; then
	if command -v start-hyprland >/dev/null 2>&1; then exec start-hyprland; else exec Hyprland; fi
fi
EOF
fi

# Si Hyprland está corriendo, recargar config y reiniciar wallpaper/barra
if command -v hyprctl >/dev/null 2>&1 && [ -n "${HYPRLAND_INSTANCE_SIGNATURE:-}" ]; then
	msg "Hyprland activo: recargando…"
	pkill swaybg 2>/dev/null || true
	pkill hyprpaper 2>/dev/null || true
	pkill waybar 2>/dev/null || true
	pkill -f 'qs -c archmac' 2>/dev/null || true
	pkill -f 'quickshell -c archmac' 2>/dev/null || true
	hyprctl reload >/dev/null
	hyprctl dispatch exec "swaybg -i $HOME/.config/wallpaper/default.jpg -m fill" >/dev/null
	hyprctl dispatch exec waybar >/dev/null
	hyprctl dispatch exec "sh -c 'command -v qs >/dev/null && exec qs -c archmac || exec quickshell -c archmac'" >/dev/null
fi

msg "Listo. Si no está corriendo, arranca el escritorio con: start-hyprland"
