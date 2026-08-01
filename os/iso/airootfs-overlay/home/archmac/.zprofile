# Arranque automático del escritorio ArchMac en la sesión live (solo tty1).
# start-hyprland es el lanzador oficial desde Hyprland 0.56 (con fallback al binario).
if [[ -z "$WAYLAND_DISPLAY" && "$(tty)" == "/dev/tty1" ]]; then
	if command -v start-hyprland >/dev/null 2>&1; then
		exec start-hyprland
	else
		exec Hyprland
	fi
fi
