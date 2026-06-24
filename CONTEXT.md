# ArchMac — Contexto completo del proyecto (handoff)

> Documento para **retomar el proyecto en una conversación nueva** con todo el contexto.
> Resume qué es ArchMac, qué decisiones se tomaron, qué está hecho, las convenciones, los
> "gotchas" y qué sigue. Léelo junto a: `README.md`, `PLAN.md`, `REQUISITOS.md`,
> `DESIGN-FIDELITY.md`, `SOFTWARE.md`.

---

## 1. Qué es ArchMac

Distribución **Linux basada en Arch** con experiencia de escritorio **premium inspirada en
macOS**, sobre **Wayland/Hyprland**. No es un kernel propio; es Arch **configurado y vestido**
para sentirse como macOS, con identidad propia, instalador gráfico e ISO.

El usuario escribe en **español**, prefiere que recomiende y decida ("lo que tú mejor creas"), y
se frustra cuando se gasta mucho tiempo/tokens en verificación: **pide codificar con decisión y
confiar en `pnpm check`**, sin loops largos de pruebas.

## 2. Arquitectura: dos pistas + dos repos

- **Pista web / simulación** = este repo (`ArchMac/`). Prototipo web que simula el escritorio.
  También albergará la **web del proyecto + documentación** (unificadas). Es lo público/showcase.
- **Pista software / distro** = repo aparte **`archmac-os`** (ya creado el esqueleto en
  `C:\Users\rojas\Dev\archmac-os`). El SO real: Hyprland + shell AGS + archiso + instalador.

**Repos: 2.** `archmac` (web+simulación+docs) y `archmac-os` (distro).

## 3. El frontend (simulación) — stack y convenciones

- Base: **fork de `macos-web`** (proyecto open-source MIT de simulación de macOS en Svelte),
  **reescrito y rebrandeado por completo**. Se eliminó TODO el branding del autor original
  (Puru Vijay) y el `.git` original.
- Stack: **Svelte 5 + Vite + pnpm** (NO SvelteKit). TypeScript estricto.
- **Alias de imports: `$lib` → `src/`** (definido en `vite.config.ts` y `tsconfig.json`).
  ⚠️ Antes era el emoji `🍎`; se reemplazó en todo el código (el usuario lo pidió quitar).
- Iconos: `unplugin-icons` con `~icons/mdi/...` etc. (prefijo `~icons` distinto del alias).
- Comandos: `cd frontend && pnpm install && pnpm dev` (puerto **5173**), `pnpm check`, `pnpm build`.

### Decisiones de tecnología (ya cerradas)
- Prototipo web en **SvelteKit/Svelte** (no Astro): el usuario lo confirmó; Astro es para
  contenido, no para una app interactiva. (Acabó siendo el fork de macos-web, Svelte 5 + Vite.)
- Quickshell (QML) **no** corre en navegador (es nativo) → descartado para la simulación.
- Tipografía: **Inter** (sustituto libre de SF Pro).
- "Inspirado en macOS", **NO clon**. Los **iconos, wallpapers y logo de Apple del prototipo son
  PROVISIONALES** → reemplazar por identidad propia antes de cualquier ISO (tema legal).
- Era de diseño objetivo: **Big Sur → Sequoia** (Ventura/Sonoma).

## 4. Qué está IMPLEMENTADO en la simulación

**Escritorio/barras**
- Wallpaper Ventura · dock flotante (magnificación, rebote, indicadores, separadores, fallback
  de icono png para apps sin `.webp`).
- Barra superior: **menú Apple funcional** (Instalar, Recovery, Reiniciar, Apagar, Acerca de…),
  reloj, **iconos de estado propios en SVG** (Wi-Fi, batería, Spotlight) en `components/icons/`.
- **Centro de Control** (ActionCenter): tema, animaciones, color de acento, fondo, notch, y
  **sliders de Brillo y Sonido** (`ControlSlider.svelte`, estado en `state/display.svelte.ts`).

**Ventanas** (`components/Desktop/Window/Window.svelte`)
- Semáforo (cerrar/minimizar/maximizar), arrastrar, **redimensionar por 8 bordes/esquinas**,
  foco (z-index).
- **Maximizar/restaurar con FLIP** (anima solo `transform`, GPU; desactiva blur durante la
  animación con la clase `.flipping`). Usa clase CSS `.maximized`.
- **Minimizar/restaurar con efecto GENIE** (ver §6).
- **Abrir/cerrar animados** (escala + fade simétricos, `in:`/`out:` transitions).
- Posición controlada por **neodrag v3**, que posiciona con la propiedad CSS **`translate`** (no
  `transform`) — esto es clave para varios fixes.

**Navegación**
- **Spotlight** (⌘/Ctrl+Espacio), **Launchpad** (dock/F4), **cambiador de apps** (⌘/Ctrl+Tab y
  swipe horizontal). Estado en `state/system.svelte.ts` y `state/switcher.svelte.ts`; helper
  `helpers/open-app.ts`. Manejador global de teclado/wheel en `Desktop.svelte`.
- ⚠️ Los gestos de 3/4 dedos **no los expone el navegador** (los intercepta el SO) → se simulan
  con atajos/botones/swipe.

**Apps** (catálogo en `configs/apps/apps-config.ts`, ~16 apps)
- Reales: Calculadora, Calendario, **Acerca de ArchMac** (`AboutArchMac`, id `about-archmac`),
  **Ajustes** (`SystemSettings`, id `system-preferences`, panel **Apariencia funcional**: tema +
  7 acentos), Wallpapers, App Store.
- Placeholder (`PlaceholderApp`): Safari, Mail, Mensajes, Mapas, Notas, Música, Terminal, VSCode.
- **Instalador** (id `install`, icono propio `/app-icons/apple-install.svg` con logo Apple) — es
  **una app del escritorio** (no pantalla aparte).
- `install` y `about-archmac` están **ocultos del dock** (`dock_hidden: true`) pero salen en
  Launchpad/menú Apple. Config soporta `icon?` para iconos personalizados.

**Pantallas de sistema** (conmutador `state/screen.svelte.ts` + `App.svelte`; `main.ts` monta App)
- **UEFI / Startup Manager** (`Boot/UefiBoot.svelte`): menú vertical estilo GRUB (ArchMac,
  Opciones avanzadas→Recovery, Firmware, Reiniciar, Apagar) con cuenta atrás de 5s. **Arranca por
  aquí por defecto** (`screen.current = 'uefi'`) → desktop. Fondo oscuro con formas suaves
  (el usuario prefirió este fondo, NO el limpio).
- **Recovery** (`Recovery/Recovery.svelte`): "Utilidades de ArchMac" (Reinstalar→abre instalador,
  Disco, Terminal, Restaurar).
- **Instalador** (`Installer/Installer.svelte`): asistente por pasos (bienvenida, idioma, disco,
  cuenta, resumen, instalación animada, fin→reiniciar). Renderizado como ventana (app).
- **Power-off** con botón de encendido.

**Tema**: claro/oscuro + 7 acentos (orange, green, cyan, blue, indigo, purple, pink) en
`preferences.theme`; el `$effect` en `state/preferences.svelte.ts` aplica clase + `--system-color-primary`.

## 5. Documentos del repo
- `README.md` — visión, estructura, estrategia de repos, estado, referencias, nota legal.
- `PLAN.md` — plan maestro por fases.
- `REQUISITOS.md` — requisitos funcionales/no funcionales (SRS) + "fuera de alcance".
- `DESIGN-FIDELITY.md` — eras de macOS + huecos de fidelidad + roadmap (ref: 512pixels Aqua Library).
- `SOFTWARE.md` — cómo construir la distro real (dwm vs Hyprland, AGS, optimización, pasos, repos).
- `CONTEXT.md` — este documento.
- `archive/frontend-scratch-v0/` — primer prototipo SvelteKit desde cero (descartado, referencia).

## 6. El efecto GENIE (importante, costó iterar)

- **Qué es**: al minimizar, la ventana se "absorbe" hacia el dock deformándose como un embudo
  (no es un simple `scale`). Técnica: capturar la ventana como **textura**, cortarla en **franjas**
  (malla), y mover los vértices con **dos animaciones superpuestas** (slide/embudo + translate/
  succión) y curva **quadraticEaseInOut**. Estudiado de HarshilShah/Genie y Ciechan/BCGenieEffect.
- **Implementación actual** (`helpers/genie.ts`): **Canvas 2D** con ~90 franjas. Captura con
  `html-to-image` (`captureWindow`). **Pre-carga** la captura al pasar el ratón por el botón
  amarillo y al abrir la ventana (evita el "trabón" de ~380ms). Reutiliza la captura al restaurar.
  El último fix: que **la parte superior también se colapse** al final (no solo la base):
  `narrow = funnel + (1 - funnel) * trans`.
- ⚠️ Se intentó una versión **WebGL** (malla texturizada) pero **renderizaba en blanco** (bug del
  shader/programa sin resolver). Se volvió a la 2D, que sí funciona. Si se retoma WebGL, depurar
  por qué no dibuja la textura (no había error de consola; posible `preserveDrawingBuffer`/uniform).

## 7. "Gotchas" / cosas a recordar
- **El dev server (vite/pnpm) se cae con frecuencia** tras HMRs estructurales rápidos. Solución:
  reiniciar con `pnpm dev` en background y esperar "ready in". No es del código de producción.
- Cambios en `genie.ts`/helpers a veces **no se aplican por HMR** (módulo helper) → recargar la
  página entera para probar.
- Cambios en `vite.config.ts` **requieren reiniciar** el server.
- La herramienta de captura (Playwright) **llega tarde** para animaciones de ~600ms → para
  verificar animaciones, muestrear píxeles del canvas con `getImageData` (2D) o subir
  temporalmente la duración. WebGL `readPixels` no sirve sin `preserveDrawingBuffer`.
- Regla del modo oscuro en `Window.svelte` ponía borde a TODOS los `<div>` hijos → excluir
  `.resize-handle` y `.tl-container` (ya hecho).
- Anillo de foco verde en buscadores: viene de `*:focus-visible { box-shadow: var(--system-focus-outline) }`
  global (usa el acento) → desactivado en los inputs de Spotlight/Launchpad.

## 8. Plan de la distro (resumen de SOFTWARE.md)
- **No se escribe el SO en C**: Arch/Linux ya es C. Se trabaja en la **capa del escritorio**.
- Compositor **Hyprland** (configurar, no reescribir). Shell propio en **AGS/Astal**
  (TypeScript+JSX+CSS → widgets GTK) — reutiliza el diseño de la simulación.
- C/Rust solo para piezas concretas (daemon, plugin de Hyprland para genie nativo); Rust > C.
- **dwm descartado** (X11, tiling, sin efectos; opuesto al look macOS).
- Pasos: identidad propia → **dotfiles + daily-drive** (Hyprland+AGS) → **archiso (ISO)** →
  **instalador** (archinstall/Calamares) → paquetes/repo/actualizaciones → diferenciación.
- Esqueleto `archmac-os` ya creado: `dotfiles/hypr/hyprland.conf` (config estilo macOS),
  `shell-ags/widget/TopBar.tsx` (ejemplo de barra), `archiso/`, `packages/`, `branding/`.

## 9. Próximos pasos sugeridos
**Simulación** (por impacto, ver DESIGN-FIDELITY.md): Centro de Notificaciones + widgets ·
pantalla de bloqueo/login · menús de app dinámicos · Mission Control · Finder navegable ·
snapping de ventanas · afinar vibrancy · **identidad propia** (logo/iconos/wallpaper).

**Software**: arrancar `archmac-os` — Arch en VM → Hyprland → barra y **dock en AGS** → daily-drive.

---

### Cómo usar este documento en una conversación nueva
Pega/menciona este archivo (`CONTEXT.md`) y di en qué quieres trabajar (p. ej. "sigue con el
Centro de Notificaciones de la simulación" o "empieza el dock en AGS de archmac-os"). El resto del
detalle está en los `.md` hermanos del repo.
