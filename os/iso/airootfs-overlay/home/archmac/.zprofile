# Arranque automático del escritorio ArchMac en la sesión live (solo tty1).
if [[ -z "$WAYLAND_DISPLAY" && "$(tty)" == "/dev/tty1" ]]; then
	exec Hyprland
fi
