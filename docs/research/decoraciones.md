# Investigación — Decoración de ventanas uniforme

**Decisión asociada:** [ADR-0004](../decisions/ADR-0004-decoraciones-ventanas.md) (estrategia
por capas). Este documento guarda el detalle técnico y lo que falta por validar.

## El problema de fondo

En Wayland, quién dibuja el marco/botones se negocia por app con el protocolo
**`xdg-decoration`** (CSD = la app se decora; SSD = el compositor decora). El conflicto:

- **GTK/libadwaita nunca pide SSD**: la headerbar es parte del diseño de la app (postura
  ideológica de GNOME, no un bug). → No se puede "quitar" su decoración; solo **retematizarla**.
- **Qt sí respeta SSD** → se le puede quitar la decoración y dejar que el compositor dibuje.
- **Hyprland** (nuestro compositor) no dibuja barras de título por defecto — solo bordes;
  existe el plugin oficial **hyprbars** para dibujarlas.
- **libdecor** existe para que apps sin toolkit (SDL, mpv…) dibujen CSD "prestada"; tiene
  sistema de plugins (cairo/GTK) que en teoría permitiría un plugin de decoración propio.

## Validaciones pendientes (Fase 2, en VM Arch real)

1. Tema GTK con semáforo macOS: partir del estudio de WhiteSur-gtk-theme; verificar botones en
   hover/inactivo, apps con headerbar compleja (Nautilus, editores).
2. Override de libadwaita vía `gtk-4.0/gtk.css`: qué selectores sobreviven a updates de
   libadwaita; alternativa: parche tipo Ubuntu (mantenimiento alto — último recurso).
3. `QT_WAYLAND_DISABLE_WINDOWDECORATION=1` + hyprbars con botones propios: ¿se ve idéntico al
   tema GTK? Medir costo de hyprbars por ventana.
4. Botones a la IZQUIERDA (estilo macOS): `gsettings button-layout` en GTK, `kdeglobals` en Qt,
   hyprbars config — verificar consistencia total.
5. Un **plugin propio de Hyprland** (C++) para decoración SSD unificada + animación genie:
   estudiar la API de plugins (`IHyprWindowDecoration`) — es la solución de máxima calidad para
   las capas 3–4 y candidata a pieza diferencial de ArchMac.
6. Electron: inventariar apps populares (VS Code, Discord, Slack) y qué expone cada una
   (`titleBarStyle`, flags); documentar en la wiki.

## Referencias de estudio

- WhiteSur-gtk-theme (vinceliuice) — retematización completa GTK estilo macOS.
- hyprbars (hyprwm/hyprland-plugins) — barras de título del lado del compositor.
- libdecor (gitlab.freedesktop.org) — CSD para apps sin toolkit, arquitectura de plugins.
- xdg-decoration protocol (wayland-protocols) — la especificación.
- Cómo lo resuelven otros: elementary OS (HIG propio + apps propias), Deepin (DDE dibuja SSD
  propio), CachyOS/Manjaro con temas globales (solo llegan al ~90%).
