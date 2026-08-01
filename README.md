# ArchMac

> **🚧 Proyecto en desarrollo activo.** Distribución **Linux basada en Arch** con una
> experiencia de escritorio **premium inspirada en macOS**, sobre Wayland/Hyprland: la
> facilidad de uso de Windows/macOS con la potencia y libertad de Linux.
>
> Todavía **no existe una ISO descargable** ni versión estable. Este repositorio documenta y
> contiene todo el desarrollo en curso.

**Objetivos:** UI/UX al nivel de macOS (animaciones, blur, transparencias, consistencia) ·
rendimiento de un Arch minimalista · funcionar bien en **4 GB de RAM** · estable, seguro y
mantenible.

---

## 📁 Estructura del monorepo

El proyecto tiene **dos partes** ([ADR-0001](docs/decisions/ADR-0001-monorepo.md)):

```
ArchMac/
├── web/                 ══ PARTE 1 · La web ══
│   ├── site/            Web oficial + documentación (Astro + Starlight)
│   └── simulation/      Simulación del escritorio → sirve de PLANO DE DISEÑO
│
├── os/                  ══ PARTE 2 · La distro ══
│   ├── iso/             Perfil archiso (ISO live)
│   ├── dotfiles/        Hyprland, kitty, GTK
│   ├── shell/           El shell propio (barra + dock) en Quickshell
│   ├── scripts/         setup-desktop.sh · build-iso.sh · test-iso.ps1
│   ├── branding/        Wallpapers y (futuro) identidad propia
│   ├── GETTING-STARTED.md   Montar el entorno paso a paso
│   └── PORTING.md           Mapa: simulación → sistema real
│
├── design/tokens/       Fuente única de verdad visual
├── docs/                Ingeniería: plan, requisitos, ADRs, investigación
└── archive/             Versiones descartadas
```

---

## ✅ Qué se ha realizado hasta el momento

### El escritorio real (funcionando en VM con Arch + Hyprland)

- **Compositor configurado** — ventanas **flotantes por defecto** (filosofía macOS, no tiling),
  blur, sombras suaves, esquinas redondeadas, animaciones con curvas tipo macOS, scroll
  natural, gestos de 3 dedos y atajos estilo ⌘ (Q, Espacio, Tab, ⇧3/4, ⌃←/→).
- **Barra superior propia** (Quickshell) — logo, menús en español, iconos de estado **con los
  SVG de la simulación** (Wi-Fi, batería, búsqueda) y reloj en español. Vidrio translúcido.
- **Dock propio** (Quickshell) — panel de vidrio flotante, **magnificación por proximidad**,
  **rebote al lanzar**, etiquetas al pasar el cursor e **iconos de la simulación**.
- **Semáforo macOS** en aplicaciones — botones redondos rojo/amarillo/verde a la izquierda,
  aplicados automáticamente a las apps sin modificarlas ([estrategia por capas](docs/decisions/ADR-0004-decoraciones-ventanas.md)).
- **Tema e identidad visual** — WhiteSur GTK, cursores macOS, iconos Papirus, tipografía Inter,
  wallpaper por defecto.
- **Perfil de ISO** (archiso) con usuario live y autoarranque al escritorio, más scripts de
  construcción y prueba.
- **Instalación en un comando** — `bash os/scripts/setup-desktop.sh` monta o actualiza el
  escritorio completo sobre cualquier Arch.

### La web y la documentación

- **Sitio + wiki** (Astro + Starlight) con la estructura completa en español, búsqueda
  instantánea, tema propio y acceso a la **demo**. *El contenido se escribirá junto al
  desarrollo real: no hay texto de relleno.*
- **Simulación del escritorio** completa (ventanas con efecto genie, dock, Spotlight,
  Launchpad, Centro de Control, arranque UEFI, instalador) — es el plano de diseño del sistema.

### Ingeniería

- **Decisiones documentadas** con alternativas comparadas ([ADRs](docs/decisions/README.md)):
  base Arch, stack de la web, estrategia de decoraciones, shell.
- **Investigación abierta** en [docs/research/](docs/research/): decoraciones de ventana,
  optimización de batería y compatibilidad de hardware.
- **Design tokens** como fuente única de verdad visual compartida.

## 🔜 En qué se trabaja ahora

Indicadores de apps abiertas en el dock · menús que cambian según la app activa · Spotlight y
Launchpad propios · Centro de Control y notificaciones · construcción de la primera ISO.
El orden completo está en [os/PORTING.md](os/PORTING.md) y [docs/CONTEXT.md](docs/CONTEXT.md).

---

## ▶️ Probar el desarrollo

```bash
# Web + documentación (http://localhost:4321)
cd web/site && pnpm install && pnpm dev

# Simulación del escritorio (http://localhost:5173/demo/)
cd web/simulation && pnpm install && pnpm dev
```

Para levantar **el sistema operativo** en una máquina virtual, sigue
[os/GETTING-STARTED.md](os/GETTING-STARTED.md).

---

## ⚖️ Nota legal

El nombre y los **iconos, wallpapers y logotipos de estilo Apple** usados durante el prototipo
son **provisionales**: se reemplazarán por identidad propia antes de distribuir cualquier ISO.
