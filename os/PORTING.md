# Mapa de porteo: simulación web → sistema real

La simulación (`web/simulation`) es el **plano de diseño** del sistema. Esta tabla define en
qué se convierte cada pieza y en qué orden se construye. «Shell» = el shell propio
(Quickshell o Astal, [ADR-0005](../docs/decisions/ADR-0005-shell-quickshell-vs-astal.md)).

| Componente en la simulación | Implementación nativa | Fase |
|---|---|---|
| Wallpaper | `hyprpaper` (→ gestor propio con selector en Ajustes) | 2 ✅ base |
| Ventanas: mover/redimensionar/foco | Hyprland (ya configurado en `dotfiles/hypr`) | 2 ✅ base |
| Maximizar (botón verde, FLIP) | Animación de Hyprland (`fullscreen`) — curva ya afinada | 2 ✅ base |
| **Minimizar con genie** | Aproximación: workspace especial · Fiel: **plugin de Hyprland (C++)** con deformación de malla — la matemática ya está en `web/simulation/src/helpers/genie.ts` | 2 aprox · 5 fiel |
| Semáforo (cerrar/min/max) en TODAS las apps | Estrategia por capas del [ADR-0004](../docs/decisions/ADR-0004-decoraciones-ventanas.md): tema GTK + override libadwaita + Qt SSD + hyprbars | 2–3 |
| Barra superior | Waybar provisional (hecho) → **Shell: barra propia** (menús de app, iconos de estado) | 2 → 3 |
| Dock (magnificación, rebote, indicadores) | **Shell: dock propio** — pieza estrella del bake-off ADR-0005 | 3 |
| Spotlight (⌘Espacio) | Wofi provisional (hecho) → **Shell: launcher propio** (apps, archivos, cálculo) | 2 → 3 |
| Launchpad | **Shell: rejilla de apps** | 3 |
| ⌘Tab switcher | Bind de Hyprland (hecho) → **Shell: overlay visual** | 2 → 3 |
| Centro de Control (brillo/sonido/tema) | **Shell: panel propio** sobre servicios del sistema (brightnessctl, PipeWire, NetworkManager) | 3 |
| Notificaciones + widgets | **Shell: daemon de notificaciones propio** (protocolo org.freedesktop.Notifications) | 3 |
| Tema claro/oscuro + 7 acentos | Paquete `archmac-theme`: GTK + Qt + shell leyendo `design/tokens` | 3 |
| Pantalla de bloqueo / login | `hyprlock` con estética propia → greetd + greeter propio | 3–4 |
| Arranque UEFI → escritorio | systemd-boot + **Plymouth** con animación de arranque propia | 3 |
| Recovery | Modo rescate de la ISO (ya existe en el perfil live) + utilidades propias | 4 |
| Instalador gráfico (ArchMacInstall) | Perfil `archinstall` → instalador propio (el flujo de la simulación es la especificación) | 4 |
| App de Ajustes | Aplicación propia (mismo stack que el shell) | 4 |
| Gestos 3/4 dedos | Hyprland (workspace swipe hecho) + gestos del shell | 2–3 |

## Nota técnica pendiente: migración a config Lua de Hyprland

Desde **Hyprland 0.55** el formato de configuración clásico (hyprlang) está **deprecado en
favor de Lua** (`hl.gesture({...})`, etc.). Nuestro `dotfiles/hypr/hyprland.conf` usa la
sintaxis clásica validada contra 0.51–0.54, que sigue funcionando por compatibilidad. Antes de
la ISO estable hay que migrar a Lua — además nos conviene: la config Lua permite lógica
(leer `design/tokens/tokens.json` directamente, generar reglas dinámicas).

## Orden de trabajo (Fase 2, concreto)

1. **Daily-drive base** ← estamos aquí: VM con Hyprland + dotfiles de este repo. Sentir y pulir.
2. **Bake-off del shell** (ADR-0005): el dock con magnificación en Quickshell y en Astal; medir.
3. Con el ganador: barra → dock → launcher → centro de control → notificaciones (en ese orden,
   cada pieza reemplaza a su provisional).
4. ISO live que demuestre todo (build-iso.sh ya la genera en cada iteración).
