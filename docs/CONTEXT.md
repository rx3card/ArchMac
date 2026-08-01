# ArchMac — Contexto completo del proyecto (handoff)

> **Documento para retomar el proyecto en cualquier momento, en cualquier PC, en una
> conversación nueva.** Resume qué es ArchMac, qué está hecho, cómo se levanta el entorno,
> las decisiones tomadas y qué sigue.
>
> **Cómo usarlo:** abre una conversación nueva, di *"lee docs/CONTEXT.md del repo ArchMac"* y
> continúa desde «Qué sigue».
>
> Última actualización: 2026-07-31.

---

## 1. Qué es ArchMac

Distribución **Linux basada en Arch** con experiencia de escritorio **premium inspirada en
macOS** sobre **Wayland/Hyprland**. No es un kernel propio: es Arch **configurado y vestido**
para sentirse como macOS, con identidad propia, ISO e instalador gráfico.

**Objetivos:** facilidad de uso de Windows 10/macOS · UI/UX nivel macOS (animaciones,
transparencias, blur, sombras) · rendimiento comparable a un Arch minimalista · funcionar bien
en **4 GB de RAM** · estabilidad, seguridad y mantenibilidad.

**Cómo trabaja el propietario:** escribe en español, quiere **avance visible y rápido**, prefiere
que se implemente todo de una vez en lugar de por fases, y pide investigación real (comparar
alternativas, justificar técnicamente) antes de decidir.

---

## 2. Estructura del repositorio (monorepo)

```
ArchMac/                        github.com/rx3card/ArchMac  (público)
├── web/
│   ├── site/          Web + wiki (Astro 7 + Starlight, español). 38 páginas estructurales
│   │                  SIN contenido (a propósito). Demo integrada en /demo.
│   └── simulation/    LA SIMULACIÓN (Svelte 5 + Vite). Es el PLANO DE DISEÑO del sistema.
├── os/                LA DISTRO
│   ├── iso/           Perfil archiso (profiledef, packages-extra.txt, airootfs-overlay)
│   ├── dotfiles/      hypr/, kitty/, gtk-3.0/, gtk-4.0/  → se copian a ~/.config
│   ├── shell/quickshell/   EL SHELL PROPIO: shell.qml, TopBar.qml, Dock.qml, assets/
│   ├── scripts/       setup-desktop.sh (instala/actualiza todo), build-iso.sh, test-iso.ps1
│   ├── branding/wallpapers/  ventura-1..5.jpg
│   ├── GETTING-STARTED.md    Montar el entorno paso a paso
│   └── PORTING.md            Mapa: componente de la simulación → pieza nativa
├── design/tokens/     tokens.json (fuente única de verdad visual)
├── docs/              PLAN, REQUISITOS, SOFTWARE, DESIGN-FIDELITY, CONTEXT (este)
│   ├── decisions/     ADR-0001..0005 (decisiones con alternativas comparadas)
│   └── research/      decoraciones.md, energia.md, hardware.md
└── archive/           Versiones descartadas
```

---

## 3. Estado actual — lo que YA FUNCIONA en el sistema real

Verificado en VM (VirtualBox, Arch + Hyprland 0.56):

- **Hyprland** configurado: ventanas **flotantes por defecto** (filosofía macOS, no tiling),
  blur, sombras, esquinas 10px, animaciones con curvas macOS, scroll natural, gestos de 3
  dedos, atajos ⌘ (Q, Espacio, Tab, ⇧3/4, ⌃←/→).
- **Wallpaper** Ventura (swaybg; hyprpaper NO lee webp → por eso los JPG en branding/).
- **Barra superior propia** (Quickshell): logo , "ArchMac", menús en español, iconos de
  estado **SVG copiados de la simulación** (Wi-Fi, batería, lupa) y reloj real en español.
- **Dock propio** (Quickshell): panel de vidrio, **magnificación gaussiana**, **rebote** al
  lanzar, etiquetas al hover, e **iconos de la simulación** (finder, launchpad, safari,
  calendar, calculator, notes, terminal) conectados a apps reales.
- **Apps instaladas:** Firefox, Nautilus, Calendario, Calculadora, Editor, kitty.
- **Tema:** WhiteSur-Dark GTK + cursores WhiteSur + Papirus + Inter.
- **Semáforo macOS** en apps GTK vía `gtk.css` propio (círculos 13px, colores reales).
- **Autoarranque:** login en tty1 → escritorio directo.

### Pendiente / en verificación
- **hyprbars** (semáforo dibujado por el compositor para apps sin cabecera propia, como la
  terminal): último bloque enviado; el script imprime `hyprbars: activo OK` o un AVISO rojo.
- **Firefox** dibuja su propio marco (botones a la derecha) → configurar `browser.tabs.inTitlebar`.
- **Migración de hyprland.conf a Lua**: obligatoria antes de Hyprland 0.57 (aviso amarillo).

---

## 4. Cómo levantar el entorno EN UN PC NUEVO

**El repo es la fuente de verdad. La VM es desechable.** En cualquier máquina:

1. VirtualBox (o VM/hardware real) → instalar **Arch** con `archinstall`
   (perfil **Minimal**, systemd-boot, NetworkManager, pipewire, usuario con sudo, paquete `git`).
   - AVISO: **VirtualBox: DESACTIVAR la aceleración 3D** (con 3D, Hyprland renderiza en negro con
     solo el cursor). Controlador VMSVGA, 128 MB de vídeo.
2. Dentro del Arch instalado:
   ```bash
   git clone https://github.com/rx3card/ArchMac.git && cd ArchMac
   bash os/scripts/setup-desktop.sh
   start-hyprland
   ```
3. Iterar siempre así: `cd ~/ArchMac && git pull && bash os/scripts/setup-desktop.sh`
   (es idempotente y recarga en caliente si Hyprland está corriendo).

**Para llevarse la VM tal cual** (opcional, no necesario): VirtualBox → Archivo → *Exportar
servicio virtualizado* → genera un `.ova` que se importa en el PC nuevo.

**En un PC potente:** además de la VM, ya se puede construir la ISO
(`sudo bash os/scripts/build-iso.sh` en Arch/WSL2) y arrancarla desde USB en hardware real —
ahí es donde se evalúa la fluidez de verdad (la VM no representa el rendimiento real).

---

## 5. Decisiones tomadas (resumen; detalle en docs/decisions/)

| # | Decisión | Razón corta |
|---|---|---|
| 0001 | **Monorepo** (web/ + os/) | Un solo lugar; tokens compartidos. Sustituye la idea de 2 repos |
| 0002 | **Arch Linux** como base | Rolling (stack Wayland moderno), archiso, PKGBUILD, AUR, Arch Wiki |
| 0003 | **Astro + Starlight** para la web/docs | Cero JS, búsqueda sin backend, theming total |
| 0004 | **Decoraciones por capas** | GTK: retematizar sus botones · Qt: quitar CSD · resto: hyprbars |
| 0005 | Shell: **Quickshell** (QML) | Motor de animaciones GPU; en uso desde el dock v0 |

**Riesgo P0 abierto:** el nombre «ArchMac» choca con la política de marcas de Arch Linux y con
«Mac» de Apple; los iconos/wallpapers de Apple son **provisionales**. Resolver en Fase 0 de
branding antes de publicar ISO. El propietario decidió posponerlo conscientemente.

---

## 6. Gotchas aprendidos (no repetir errores)

- **VirtualBox + aceleración 3D = pantalla negra** con Hyprland. Desactivarla.
- **hyprpaper no lee `.webp`** → usar JPG (o swaybg, que es lo que usamos).
- Hyprland **0.51 cambió la sintaxis**: `gesture = 3, horizontal, workspace`,
  `windowrule = match:class ..., float on`, `layerrule = blur on, match:namespace ...`.
  `misc:vfr` y `dwindle:pseudotile` ya no existen como estaban.
- Hyprland **0.56**: se arranca con `start-hyprland`, no `Hyprland`.
- Las reglas `plugin:hyprbars:*` **fallan si se ponen en el .conf** antes de que el plugin
  cargue → aplicarlas en caliente con `hyprctl keyword` tras `hyprpm reload`.
- Los iconos de la barra necesitan **ttf-nerd-fonts-symbols** (si no, salen cuadritos □).
- Las apps GTK **solo leen `gtk.css` al abrir la ventana** → cerrar y reabrir para ver cambios.
- No poner `&` al final de una cadena con `sudo`: el script se va a segundo plano y no puede
  pedir la contraseña.

---

## 7. Qué sigue (orden recomendado)

**A. Terminar la capa visual del escritorio (alto impacto visible)**
1. Verificar/arreglar **hyprbars** → semáforo en terminal y apps sin cabecera.
2. **Indicadores de apps abiertas** en el dock (punto bajo el icono) + separador + papelera.
3. **Menús de la barra según la app activa** (leer ventana enfocada vía IPC de Hyprland).
4. **Spotlight propio** en Quickshell (reemplaza wofi) y **Launchpad**.
5. **Centro de Control** (brillo, volumen, Wi-Fi, tema) y **notificaciones**.
6. Conectar los iconos de estado a datos reales (batería, red, volumen).

**B. Deuda técnica**
7. Migrar `hyprland.conf` a **Lua** (obligatorio antes de 0.57).
8. Generador de tokens: `design/tokens/tokens.json` → CSS/QML (hoy se sincroniza a mano).

**C. Sistema**
9. **Construir la ISO** (`build-iso.sh`) y probarla en QEMU/USB.
10. Lockscreen (hyprlock), greeter, instalador gráfico.
11. **Genie nativo** al minimizar: plugin C++ de Hyprland (la matemática ya está resuelta en
    `web/simulation/src/helpers/genie.ts`).

**D. Cuando el propietario lo decida**
12. Identidad propia: nombre definitivo, logo, iconos y wallpapers propios (quita el riesgo legal).
