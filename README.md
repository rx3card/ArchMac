# ArchMac

> Distribución **Linux basada en Arch** con una experiencia de escritorio **premium inspirada en
> macOS**, sobre Wayland/Hyprland. Rediseñada desde cero para velocidad, eficiencia, simplicidad
> y control, con identidad visual propia, instalador gráfico y actualizaciones integradas.

ArchMac se desarrolla en **dos pistas**:

1. **Web / Simulación** (este repositorio) — un prototipo web que simula el escritorio completo
   (dock, ventanas, animaciones, apps, arranque, instalador). Sirve para validar el diseño y
   como *showcase* público. Aquí también vivirá la **web del proyecto + documentación** (unificadas).
2. **Software / Distro** (repositorio aparte) — el sistema operativo real: perfil de `archiso`,
   compositor Hyprland, shell nativo, paquetes, branding e instalador. Ver [SOFTWARE.md](SOFTWARE.md).

---

## 📁 Estructura del proyecto

```
ArchMac/                 ← raíz = SITIO WEB del proyecto (Svelte 5 + Vite)
├── index.html           ← entrada de Vite
├── src/
│   ├── main.ts
│   ├── App.svelte       ← la landing (hero, características, capturas, docs…)
│   └── style.css        ← diseño del sitio (vidrio macOS + azul Arch)
├── public/
│   ├── favicon.svg
│   └── screenshots/     ← capturas reales de la simulación
│
├── README.md · PLAN.md · REQUISITOS.md · DESIGN-FIDELITY.md · SOFTWARE.md · CONTEXT.md
│
├── frontend/            ← LA SIMULACIÓN (Svelte 5 + Vite + pnpm, proyecto propio)
│   ├── src/             ← components/, state/, helpers/, configs/, css/
│   └── public/app-icons ← iconos (PROVISIONALES, se reemplazan por propios)
│
└── archive/             ← versiones descartadas (referencia histórica)
```

**Dos proyectos Vite independientes:** la **web** vive en la raíz (`pnpm dev` → puerto 3000) y la
**simulación** en `frontend/` (`cd frontend && pnpm dev` → puerto 5173). En despliegue, la web se
publica en `/` y la simulación compilada se sirve bajo `/frontend` (o un subdominio).

## 🗂️ Estrategia de repositorios

| Repo | Contenido | Estado |
|---|---|---|
| **archmac** (este) | **Web del proyecto + documentación + simulación** del sistema (unificadas). Es lo público/showcase. | activo |
| **archmac-os** (nuevo) | La **distro real**: perfil archiso, dotfiles Hyprland, shell nativo (AGS/Astal), paquetes, instalador, branding. | por crear |

**Respuesta corta:** **2 repos**. Web + simulación + docs van **juntos** aquí (es lo que vas a
publicar). El software de la distro va en un repo **independiente** (`archmac-os`), porque tiene
otro stack, otro ciclo de releases y otras herramientas (ver [SOFTWARE.md](SOFTWARE.md)).

## ▶️ Ejecutar la simulación

```bash
cd frontend
pnpm install
pnpm dev        # http://localhost:5173
```

## ✅ Estado del prototipo (resumen)

Hecho: escritorio (wallpaper, dock con magnificación/rebote/indicadores, barra superior con
iconos de estado propios), **ventanas** (semáforo, arrastrar, redimensionar, maximizar con FLIP,
**minimizar/restaurar con efecto genie**, abrir/cerrar animados), **Spotlight**, **Launchpad**,
cambiador de apps (⌘Tab), **Centro de Control** (brillo/sonido/tema/acento), app de **Ajustes**
(Apariencia funcional), apps (Calculadora, Calendario, Acerca de) y placeholders, **arranque
UEFI** (menú estilo GRUB) → **Recovery** → escritorio, e **instalador gráfico ArchMacInstall**
(como app del escritorio). Tema claro/oscuro + 7 acentos.

Pendiente (ver [REQUISITOS.md](REQUISITOS.md) y [DESIGN-FIDELITY.md](DESIGN-FIDELITY.md)):
Centro de Notificaciones + widgets, pantalla de bloqueo/login, menús de app dinámicos,
Mission Control, Finder navegable, *snapping* de ventanas, e **identidad propia** (logo/iconos).

## ⚖️ Nota legal

Los **iconos, wallpapers y el logo de Apple** que se ven en la simulación son **PROVISIONALES**:
sirven para clavar el look durante el prototipo, pero **deben reemplazarse por iconografía e
identidad propias de ArchMac antes de distribuir** ninguna ISO, por temas de marca/copyright.

## 🔗 Referencias

- [512pixels — Aqua Screenshot Library](https://512pixels.net/projects/aqua-screenshot-library/) — evolución visual de macOS.
- **Efecto genie** (minimizar): la técnica es una *deformación de malla* (la ventana se captura
  como textura y sus vértices se curvan hacia el dock con dos animaciones superpuestas).
  Estudiado a partir de [HarshilShah/Genie](https://github.com/HarshilShah/Genie) (SpriteKit) y
  [Ciechan/BCGenieEffect](https://github.com/Ciechan/BCGenieEffect) (image slicing + CATransform3D).

> La base del frontend partió de un proyecto open-source (MIT) de simulación de macOS en Svelte,
> **reescrito y rebrandeado por completo** para ArchMac (sin branding ni enlaces del autor original).
