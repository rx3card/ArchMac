# ArchMac

> Distribución **Linux basada en Arch** con una experiencia de escritorio **premium inspirada
> en macOS**, sobre Wayland/Hyprland. Rediseñada para velocidad, eficiencia, simplicidad y
> control, con identidad visual propia e instalador gráfico.
>
> ⚠️ **Nombre provisional:** «ArchMac» tiene riesgo de marca (política de marcas de Arch Linux
> y marca «Mac» de Apple). El nombre definitivo se decide en la Fase 0 de branding, antes de
> cualquier publicación. Ver [ADR-0002](docs/decisions/ADR-0002-base-arch-linux.md).

## 📁 Estructura del monorepo

Todo el proyecto vive en este repositorio, en **dos partes principales**
([ADR-0001](docs/decisions/ADR-0001-monorepo.md)):

```
ArchMac/
├── web/                 ══ PARTE 1 · La web oficial ══
│   ├── site/            Web + documentación (Astro + Starlight, español)
│   └── simulation/      Simulación del escritorio (Svelte 5 + Vite) → /demo
│
├── os/                  ══ PARTE 2 · La distro ══
│   ├── iso/             Perfil archiso (Fase 3)
│   ├── packages/        PKGBUILDs propios (Fase 4)
│   ├── dotfiles/        Hyprland, terminal, entorno (Fase 2)
│   ├── shell/           Shell del escritorio (Fase 2 — ver ADR-0005)
│   ├── installer/       Instalador gráfico (Fase 4)
│   ├── branding/        Identidad: logo, iconos, wallpapers (Fase 0)
│   └── scripts/         Build de ISO, QEMU, bootstrap
│
├── design/
│   ├── tokens/          Fuente única de verdad visual (tokens.json)
│   └── references/      Referencias de estudio (Aqua Library, etc.)
│
├── docs/                Ingeniería (interno; la wiki pública está en web/site)
│   ├── decisions/       ADRs: decisiones técnicas con justificación
│   ├── research/        Investigación: decoraciones, energía, hardware
│   └── PLAN.md · REQUISITOS.md · SOFTWARE.md · CONTEXT.md · DESIGN-FIDELITY.md
│
└── archive/             Versiones descartadas (referencia histórica)
```

## ▶️ Desarrollo

```bash
# Web + documentación (http://localhost:4321)
cd web/site && pnpm install && pnpm dev

# Simulación del escritorio (http://localhost:5173/demo/)
cd web/simulation && pnpm install && pnpm dev
```

> **Demo en desarrollo:** el sitio hace proxy de `/demo/` al puerto 5173, así que para que el
> botón «Ver demo» funcione en local deben estar corriendo **ambos** servidores. En producción
> no hace falta: `build:all` copia la demo dentro de `dist/demo`.

**Despliegue:** un solo artefacto estático. `cd web/site && pnpm build:all` construye la
simulación (base `/demo/`), el sitio, y copia la demo dentro de `web/site/dist/demo` — el
botón «Ver demo» del sitio apunta ahí. Se publica `web/site/dist` como raíz del dominio.

## ✅ Estado

- **Simulación** — muy avanzada: ventanas (semáforo, arrastre, redimensionado 8 puntos,
  maximizar FLIP, **genie** al minimizar), dock (magnificación, rebote, indicadores),
  Spotlight, Launchpad, ⌘Tab, Centro de Control, Ajustes, arranque UEFI → Recovery →
  instalador gráfico, tema claro/oscuro + 7 acentos.
- **Web/docs** — scaffold completo (Astro + Starlight): estructura entera de la wiki en
  español (38 páginas), búsqueda, tema propio inicial. **Sin contenido aún** (se escribe junto
  al desarrollo real).
- **Distro** — no iniciada. El plan por fases está en [docs/PLAN.md](docs/PLAN.md) y el paso a
  paso técnico en [docs/SOFTWARE.md](docs/SOFTWARE.md).

## 📚 Documentos clave

| Documento | Qué contiene |
|---|---|
| [docs/CONTEXT.md](docs/CONTEXT.md) | Contexto completo para retomar el proyecto |
| [docs/PLAN.md](docs/PLAN.md) | Plan maestro por fases |
| [docs/REQUISITOS.md](docs/REQUISITOS.md) | Requisitos funcionales/no funcionales (SRS) |
| [docs/SOFTWARE.md](docs/SOFTWARE.md) | Cómo se construye la distro real |
| [docs/decisions/](docs/decisions/README.md) | Decisiones de arquitectura (ADRs) |
| [docs/research/](docs/research/) | Investigaciones: decoraciones, energía, hardware |

## ⚖️ Nota legal

Los **iconos, wallpapers y el logo de Apple** de la simulación son **PROVISIONALES** (sirven
para clavar el look durante el prototipo). Deben reemplazarse por identidad propia antes de
distribuir cualquier ISO, junto con el nombre definitivo del proyecto.
