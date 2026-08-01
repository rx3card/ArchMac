# ArchMac — Plan maestro

> Distribución Linux basada en Arch, con experiencia visual "premium" inspirada en macOS,
> construida sobre Wayland/Hyprland. Objetivo: apariencia excepcional, rendimiento
> sobresaliente, experiencia fluida y arquitectura simple de mantener.

**Documentos hermanos:** [README.md](README.md) (visión + estructura + repos) ·
[REQUISITOS.md](REQUISITOS.md) (funcionales/no funcionales) ·
[DESIGN-FIDELITY.md](DESIGN-FIDELITY.md) (fidelidad con macOS) ·
[SOFTWARE.md](SOFTWARE.md) (**cómo construir la distro real, paso a paso**).

**Estrategia de repos (2):** `archmac` (este: web + simulación + docs, público) ·
`archmac-os` (la distro real, repo aparte). Detalle en README/SOFTWARE.

**Estado:** la **simulación web** (`/frontend`) ya es una base sólida. El siguiente gran hito es
**arrancar el software real** (Fase 2 en adelante) siguiendo [SOFTWARE.md](SOFTWARE.md).

---

## 1. Principios de diseño (no negociables)

1. **Nativo, no navegador.** El escritorio real se construye con widgets nativos (GTK vía
   AGS/Astal) sobre Hyprland. Nada de empaquetar un navegador como escritorio.
2. **Inspirado, no clon.** Estética macOS como *referencia*, con identidad propia. Evitar
   activos con marca de Apple (logos, SF Pro redistribuida, iconos originales).
3. **Rendimiento primero.** Cada animación y efecto debe justificar su costo. Objetivo de
   RAM en idle competitivo (< ~800 MB en escritorio limpio).
4. **Configuración centralizada.** Una sola fuente de tokens de diseño (colores, espaciados,
   radios, tipografía) compartida entre prototipo web y shell real.
5. **Reproducibilidad.** Todo el sistema definible desde el repo: dotfiles, paquetes, ISO.

---

## 2. Arquitectura: dos pistas

### Pista A — `/frontend` (laboratorio visual, NO se instala)
- **Qué:** prototipo web del look&feel (dock, top bar, control center, ventanas, apps).
- **Tech:** **fork de `macos-web`** (Puru Vijay, MIT) — Svelte 5 + Vite + pnpm. Adoptado el
  2026-06-21 por estar mucho más pulido (animaciones, transiciones, wallpapers) que una
  versión propia desde cero. El `.git` original se eliminó para desligarlo del upstream.
- **Para qué:** base premium inmediata; iteramos rebrand y diseño sobre algo ya sólido.
- La versión SvelteKit desde cero quedó archivada en `archive/frontend-scratch-v0`.

### Pista B — `/shell` (el escritorio real, SÍ se instala)
- **Qué:** dock, barra superior, centro de control, notificaciones, launcher, lockscreen.
- **Tech:** AGS / Astal (TypeScript + JSX + SCSS) sobre Hyprland.
- **Para qué:** lo que realmente entra en la ISO. Reutiliza los tokens del prototipo.

> El puente entre A y B es un paquete de **design tokens** compartido (JSON/SCSS) para que
> el prototipo y el shell nunca diverjan visualmente.

---

## 3. Stack técnico

| Capa | Elección | Notas |
|---|---|---|
| Compositor | **Hyprland** | Animaciones, blur, tiling+floating |
| Shell/widgets | **AGS (Astal)** | TS+JSX+SCSS → widgets GTK nativos |
| Tipografía | **Inter** (+ fallback) | Sustituto libre de SF Pro |
| Login manager | **greetd + ReGreet** | Greeter con identidad ArchMac |
| Iconos/tema base | WhiteSur / McMojave | Punto de partida → identidad propia |
| Terminal | Kitty o Ghostty | Config con tema ArchMac |
| Launcher | AGS propio o Rofi/Wofi | Preferible AGS para coherencia |
| Instalador | archinstall (perfil) → Calamares | GUI completa solo si hace falta |
| Construcción ISO | **archiso** | repo `releng` personalizado |
| Gestión config | dotfiles + script de bootstrap | base para reproducibilidad |

---

## 4. Roadmap por fases

### Fase 0 — Fundaciones y branding (semana 1)
- [ ] Definir identidad: nombre final, logo, paleta, tipografía, tono.
- [ ] Crear **design tokens** (colores, radios, sombras, espaciados, tipografía) en JSON/SCSS.
- [ ] Estructura del repo (ver sección 5).
- [ ] Decidir licencia del proyecto.

### Fase 1 — Prototipo visual web (`/frontend`) (semanas 1–3)
- [ ] Scaffold Svelte/React + tokens.
- [ ] Maquetar: top bar, dock, control center, ventana de ejemplo, wallpaper.
- [ ] Animaciones sutiles (genie, dock magnification, transiciones).
- [ ] Deploy a web. **Hito: la visión se ve y se siente.**

### Fase 2 — Escritorio real sobre Hyprland (`/shell`) (semanas 3–8)
- [ ] Instalar Hyprland + AGS en VM/equipo de pruebas.
- [ ] Top bar AGS (reloj, batería, red, audio, menú).
- [ ] Dock AGS (apps fijadas, indicadores, magnificación).
- [ ] Control center, notificaciones, lockscreen.
- [ ] Config de Hyprland (animaciones, blur, atajos estilo macOS).
- [ ] **Hito: usarlo como daily-driver durante 1–2 semanas y corregir fricción.**

### Fase 3 — Empaquetado en ISO (`/iso`) (semanas 8–11)
- [ ] Perfil archiso con paquetes + dotfiles + tema preinstalado.
- [ ] Autologin a sesión de prueba; primer arranque pulido.
- [ ] Build automatizado de la ISO (script + CI opcional).
- [ ] **Hito: ISO booteable que arranca directo al escritorio ArchMac.**

### Fase 4 — Instalador y actualizaciones (semanas 11+)
- [ ] Perfil de `archinstall` (o Calamares) con branding.
- [ ] Mecanismo de actualización (repo propio / overlay sobre Arch).
- [ ] Herramienta de configuración centralizada (settings app).

### Fase 5 — Diferenciación
- [ ] Funciones distintivas propias (lo que separa ArchMac del resto).
- [ ] Documentación de usuario y de contribución.
- [ ] Web oficial + canal de releases.

---

## 5. Estructura de repo propuesta

```
ArchMac/
├── PLAN.md                  # este documento
├── README.md
├── design/
│   ├── tokens/              # fuente única de verdad visual (JSON/SCSS)
│   ├── branding/            # logo, wallpapers, iconografía
│   └── references/          # capturas, moodboard
├── frontend/                # Pista A — prototipo web (no se instala)
├── shell/                   # Pista B — AGS/Astal (escritorio real)
│   ├── bar/
│   ├── dock/
│   ├── control-center/
│   └── style/               # SCSS generado desde design/tokens
├── dotfiles/                # Hyprland, kitty, etc.
├── iso/                     # perfil archiso (releng)
└── docs/
```

---

## 6. Riesgos y decisiones abiertas

| Riesgo / decisión | Estado |
|---|---|
| Marca "Mac" / activos de Apple → riesgo legal | **Revisar antes de publicar.** Iconos de macOS en uso son PROVISIONALES (solo prototipo); reemplazar por iconografía propia antes de la ISO |
| Web prototype vs shell nativo (no confundir) | Resuelto: dos pistas |
| AGS vs Quickshell (QML) vs waybar+eww | **Congelado** — se decide al llegar a Fase 2 |
| SF Pro (licencia) | Usar Inter como sustituto libre ✅ |
| Alcance del instalador (no adelantarlo) | Diferido a Fase 4 |
| Framework del prototipo | **Resuelto: fork de macos-web** (Svelte 5 + Vite + pnpm) |
| Base del prototipo: ¿scratch o macos-web? | **Resuelto 2026-06-21: adoptar macos-web** |

> Nota: Quickshell (QML) **no** corre en navegador — es nativo. La decisión del shell
> nativo se pospone; ahora el foco es 100% el prototipo web (`/frontend`).

---

## 7. Estado actual y próximos pasos

**Hecho:**
- ✅ Exploración inicial + prototipo SvelteKit desde cero (archivado en `archive/frontend-scratch-v0`).
- ✅ **Pivote:** adoptado el fork de `macos-web` como `/frontend` (base premium: wallpapers,
  logo Apple, dock con bounce, ventanas, genie, boot screen, apps reales). Corre con pnpm.
- ✅ Rebrand inicial: título/metadatos a ArchMac, eliminada la analítica del autor original
  (Microsoft Clarity), `package.json` renombrado a `archmac` v0.1.0.
- ✅ Pantalla de arranque (boot) estilo macOS activada también en dev (el autor la tenía
  desactivada en `import.meta.env.DEV`): fondo negro, logo centrado, barra de progreso.
- ✅ Rebrand profundo: app "About the Developer" → "Acerca de ArchMac" (carpeta y componente
  `AboutArchMac`, id `about-archmac`, icono provisional). Eliminadas del dock las apps promo
  del autor original (View Source → GitHub puruvj, Powered by Vercel). VSCode embed (stackblitz
  del repo original) reemplazado por placeholder propio. `pnpm check`: 0 errores / 0 warnings.

- ✅ Bug de maximizar ventana arreglado: el código original movía `transform` pero neodrag v3
  posiciona con la propiedad CSS `translate`, así que la ventana se desbordaba. Solución:
  maximizar vía clase CSS `.maximized` (`translate: 0 0 !important` + tamaño 100vw), que vence
  al inline de neodrag; al restaurar, la clase desaparece y neodrag recupera la posición previa.

- ✅ Redimensionar ventanas por bordes y esquinas (8 handles, mínimos), con posición
  controlada de neodrag (sin saltos al arrastrar tras redimensionar desde NW/N/W).
- ✅ Minimizar al dock con animación (botón amarillo) + restaurar al hacer clic en el dock.
  Es una aproximación al genie (escala+desplazamiento); el genie fiel necesitaría WebGL.
- ✅ Catálogo de requisitos funcionales/no funcionales en `REQUISITOS.md` con roadmap.
- ✅ Investigación de la UX de macOS (gestos/atajos/animaciones) en `README.md`.
- ✅ Catálogo de apps ampliado (16): Finder, Launchpad, Safari, Mail, Mensajes, Mapas, Notas,
  Música, Calendario, Calculadora, Terminal, VSCode, Wallpapers, Ajustes, App Store, Acerca de.
  Las nuevas abren ventana placeholder ("en construcción") con su icono real.
- ✅ **Spotlight** (⌘/Ctrl+Espacio): buscar y abrir apps.
- ✅ **Launchpad** (botón del dock / F4): cuadrícula con búsqueda y fondo desenfocado.
- ✅ **Cambiador de apps** (⌘/Ctrl+Tab y swipe horizontal): overlay que cicla ventanas abiertas.
- ✅ Fallback de icono png en el dock (apps sin .webp como Launchpad/Notas/Terminal).
- Nota: gestos de 3/4 dedos NO los expone el navegador → se simulan con atajos/botones/swipe.

- ✅ **Efecto genie real** al minimizar/restaurar (deformación de malla por franjas + embudo con
  curva cuadrática hacia el dock, basado en el algoritmo de Harshil Shah). Captura la ventana con
  `html-to-image` y la deforma en un `<canvas>`. Helper: `helpers/genie.ts`.
- ✅ **Pantallas de sistema** (estética macOS) con conmutador `state/screen.svelte.ts` y `App.svelte`:
  - **UEFI / Startup Manager** (`Boot/UefiBoot.svelte`): selector de volumen (ArchMac / Recovery).
  - **Recovery** (`Recovery/Recovery.svelte`): "Utilidades de ArchMac" (Reinstalar, Disco, Terminal…).
  - **Instalador gráfico ArchMacInstall** (`Installer/Installer.svelte`): asistente por pasos
    (bienvenida, idioma, disco, cuenta, resumen, instalación animada, fin → reiniciar).
  - Apagado (power-off) con botón de encendido.
  - Navegación desde el **menú Apple** (Instalar, Recovery, Reiniciar, Apagar).

**Próximo (rebrand + Fase 1):**
1. Logo propio de ArchMac (reemplazar logo Apple del boot y el icono provisional del About).
2. Definir wallpaper por defecto de ArchMac y acento de color propio.
3. Revisar menús de la barra superior (textos/branding).
4. Más adelante: iconografía propia (sustituir los iconos de Apple antes de la ISO).

**Cómo correr el prototipo:**
```
cd frontend
pnpm install
pnpm dev   # http://localhost:5173
```
