# ADR-0004 — Estrategia de decoración de ventanas por capas

**Estado:** aceptada (en refinamiento continuo) · 2026-07-31
**Investigación asociada:** [docs/research/decoraciones.md](../research/decoraciones.md)

## Contexto

Objetivo: que **todas** las aplicaciones muestren los botones y el marco de ventana con el
estilo ArchMac (semáforo estilo macOS) sin modificarlas una a una. En Wayland la decoración se
negocia con el protocolo `xdg-decoration`, pero **GTK/libadwaita lo ignora deliberadamente**:
sus apps siempre dibujan su propia cabecera (CSD). No existe un interruptor global; quien
prometa uno está vendiendo humo.

## Decisión: cobertura por capas

| Capa | Mecanismo | Cobertura |
|---|---|---|
| 1. Apps GTK 3/4 | **Tema GTK propio** que redibuja headerbar y botones (estudio de referencia: WhiteSur-gtk-theme) + `gsettings` para posición/orden de botones | La mayoría del software de escritorio |
| 2. libadwaita | Hoja de estilos inyectada (`~/.config/gtk-4.0/gtk.css`) instalada por nuestro paquete de tema (mecanismo que usan Ubuntu/Pop!_OS) | Apps GNOME modernas |
| 3. Apps Qt 5/6 | Respetan `xdg-decoration`: forzar decoración del servidor (`QT_WAYLAND_DISABLE_WINDOWDECORATION=1`) o estilo Qt propio (qt6ct/Kvantum) | Apps Qt/KDE |
| 4. Decoración del servidor | Hyprland solo dibuja bordes → plugin **hyprbars** (fork con nuestros botones) para apps que piden SSD; a largo plazo, plugin propio (mismo vehículo que el genie nativo) | SDL, mpv, terminales, etc. |
| 5. Electron/Chromium | Dibujan su propio marco; se configura app por app **solo** para las preinstaladas y se documenta el resto | Caso a caso |

## Consecuencias

- Cobertura realista ≈ 95% del software habitual + 100% de lo preinstalado. Nadie en el
  ecosistema (ni elementary OS) logra el 100% de apps de terceros; se asume explícitamente.
- El paquete `archmac-theme` (Fase 2) agrupa las capas 1–3; el plugin de Hyprland cubre la 4.
- Cada capa es independiente: si una app rompe el tema, no afecta al resto del sistema.
