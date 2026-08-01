# ArchMac OS — La distribución

Esta carpeta contiene **todo el software real** del sistema operativo: el perfil de ISO, los
paquetes, las configuraciones, el shell del escritorio, el instalador y el branding.

> El desarrollo de la distro corresponde a la **Fase 2+** del [plan maestro](../docs/PLAN.md).
> Las decisiones técnicas están documentadas en [docs/decisions/](../docs/decisions/) y las
> investigaciones abiertas en [docs/research/](../docs/research/).

## Estructura

| Carpeta | Contenido | Estado |
|---|---|---|
| [`iso/`](iso/) | Perfil de **archiso**: `profiledef.sh` propio, paquetes extra, overlay live (usuario `archmac`, autologin a Hyprland) | ✅ v0 buildable |
| [`packages/`](packages/) | **PKGBUILDs** propios: tema, shell, configs, branding, meta-paquetes | vacío — Fase 4 |
| [`dotfiles/`](dotfiles/) | `hypr/` (flotante por defecto, blur, animaciones macOS), `kitty/`, `waybar/` (barra provisional) | ✅ v0 |
| [`shell/`](shell/) | El shell propio (barra, dock, launcher, control center, notificaciones) — bake-off [ADR-0005](../docs/decisions/ADR-0005-shell-quickshell-vs-astal.md) | Fase 2–3 |
| [`installer/`](installer/) | Perfil de `archinstall` → instalador propio (la simulación es la especificación) | vacío — Fase 4 |
| [`branding/`](branding/) | Logo, iconos, wallpapers, Plymouth, sonidos — **identidad propia** | vacío — Fase 0 |
| [`scripts/`](scripts/) | [`build-iso.sh`](scripts/build-iso.sh) (ensambla releng + overlay y ejecuta `mkarchiso`) · [`test-iso.ps1`](scripts/test-iso.ps1) (QEMU en Windows) | ✅ v0 |

## Cómo empezar

- **[GETTING-STARTED.md](GETTING-STARTED.md)** — montar el entorno en este PC (VirtualBox para
  desarrollar el escritorio, WSL2 para compilar la ISO) y el flujo editar → build → probar.
- **[PORTING.md](PORTING.md)** — el mapa completo: qué componente de la simulación se convierte
  en qué pieza nativa, y el orden de trabajo de la Fase 2.
