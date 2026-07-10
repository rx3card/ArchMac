# ArchMac — Del prototipo al sistema operativo real

> Cómo convertir la simulación web en una **distribución Linux basada en Arch**.
> Documento técnico y honesto: qué se programa, en qué lenguaje, y el paso a paso.

---

## 1. La idea clave (importante)

**No se programa el sistema operativo "en C desde cero".** El kernel (**Linux**) y toda la base
de Arch (**pacman**, glibc, systemd, coreutils…) **ya están escritos en C** y mantenidos por miles
de personas. Reescribir eso sería absurdo e imposible para un proyecto.

Una **distribución** = Arch Linux + un **conjunto curado de paquetes** + **configuración** +
**branding** + **instalador** + **ISO**. El trabajo de ArchMac está en la **capa del escritorio**
(la experiencia visual), no en el kernel.

> Resumen: ArchMac no es "un SO escrito en C". Es **Arch Linux configurado y vestido** para
> sentirse como macOS, empaquetado en una ISO instalable.

## 2. ¿Dónde encaja "programar"? (y en qué lenguaje)

La experiencia macOS se construye con un **compositor Wayland** + **componentes de shell**
(barra, dock, lanzador, centro de control, notificaciones). Opciones y lenguajes reales:

| Capa | Herramienta recomendada | Lenguaje |
|---|---|---|
| Compositor / ventanas / animaciones | **Hyprland** | C/C++ (ya hecho; se configura, no se reescribe) |
| Shell (barra, dock, control center, notificaciones, launcher) | **AGS / Astal** | **TypeScript + JSX + CSS** (→ widgets GTK) |
| Alternativa de shell | **Quickshell** | QML (Qt) |
| Alternativa ligera | waybar + eww | config declarativa |
| Daemons/utilidades propias (si hacen falta) | — | **Rust** (recomendado) o C/C++ |

**Recomendación:** **AGS/Astal**. Reutiliza directamente lo aprendido en la simulación web
(TS + CSS + componentes), pero renderiza widgets **nativos** y rápidos sobre Hyprland. El
prototipo web es el **plano de diseño** (tokens, layouts, animaciones) de estos componentes.

**Sobre escribir en C:** solo tiene sentido para piezas muy concretas y de bajo nivel (un
daemon, un plugin de Hyprland para el efecto genie nativo, un componente de máximo rendimiento).
Para eso, hoy **Rust** suele ser mejor opción que C (seguridad de memoria, ecosistema), salvo que
sea un plugin de Hyprland (C/C++) o integración directa con una API en C. **No** se necesita C
para el grueso del proyecto.

## 3. Animaciones nativas (genie, etc.)

En el escritorio real, las animaciones de ventana las maneja el **compositor**:
- **Hyprland** tiene su propio sistema de animaciones y **plugins** (C/C++).
- El efecto **genie** sería un plugin/animación de Hyprland (deformación de la ventana al
  minimizar). El prototipo web ya documenta la matemática (embudo + curva); se porta al plugin.

## 4. Paso a paso (de menos a más)

### Fase 0 — Identidad
- Logo ArchMac, set de iconos propio, wallpaper, tokens de color/tipografía.
- (Sustituir los activos de Apple provisionales del prototipo.)

### Fase 1 — Dotfiles + daily-drive (lo más importante)
1. Instalar Arch + **Hyprland** en una máquina/VM real.
2. Construir el shell con **AGS/Astal**: barra superior, dock, control center, notificaciones,
   launcher (Spotlight/Launchpad), lockscreen — siguiendo el diseño del prototipo.
3. Configurar Hyprland: animaciones, blur, esquinas redondeadas, atajos estilo macOS.
4. Greeter de login con **greetd + ReGreet**.
5. **Usarlo a diario** 1–2 semanas y pulir la fricción. *No avanzar hasta que se sienta bien.*

### Fase 2 — Empaquetado en ISO
1. Crear un perfil **`archiso`** (basado en `releng`): lista de paquetes + dotfiles + tema
   preinstalados, autologin a la sesión de prueba.
2. `mkarchiso` para construir la **ISO booteable** que arranca directo al escritorio ArchMac
   (entorno "live").

### Fase 3 — Instalador gráfico (ArchMacInstall)
- Empezar con **archinstall** (un perfil propio) por simplicidad; o **Calamares** si se quiere la
  GUI completa. El **instalador del prototipo web es la referencia de diseño** (pasos: idioma,
  disco, cuenta, resumen, instalación, reinicio).

### Fase 4 — Paquetes, repo y actualizaciones
- Paquetes propios (`PKGBUILD`): tema, configs, shell. Publicar en **AUR** o en un **repo pacman
  propio**. Mecanismo de actualización integrado (overlay sobre Arch).

### Fase 5 — Diferenciación
- Funciones distintivas, documentación de usuario, web oficial, canal de releases.

## 5. Herramientas que se usarán

- **archiso / mkarchiso** — construir la ISO.
- **pacman + PKGBUILD + AUR** — paquetes.
- **Hyprland** — compositor Wayland.
- **AGS/Astal** (o Quickshell) — shell/widgets nativos.
- **greetd / ReGreet** — login.
- **archinstall** o **Calamares** — instalador.
- **QEMU/VM** — pruebas de la ISO sin tocar hardware.

## 6. Repos (resumen)

- **archmac** (este) — web + simulación + documentación (público, showcase).
- **archmac-os** (nuevo) — la distro: `archiso/`, `dotfiles/` (Hyprland + AGS), `packages/`
  (PKGBUILDs), `branding/`, `installer/`. Otro stack, otro ciclo de releases.

> Cuando empiece la Fase 1 se crea `archmac-os`. Hasta entonces, todo el valor está en el
> prototipo (definir la experiencia) y la documentación (definir el plan).

---

## 7. ¿dwm? Gestor de ventanas — por qué NO para ArchMac

**dwm** (suckless) es un WM **de mosaico (tiling), para X11, en C**, que se configura recompilando.
Ultraligero y por teclado, pero **estéticamente opuesto a macOS**: sin animaciones propias, sin
blur/redondeo nativos (dependerías de `picom`, con resultados limitados), sin ventanas flotantes
estilo Mac, sin dock ni genie.

| | dwm (X11) | **Hyprland (Wayland)** ✅ |
|---|---|---|
| Animaciones | No (picom limitado) | **Nativas y fluidas** |
| Blur / esquinas redondeadas | Hack con picom | **Nativo** |
| Flotante estilo macOS | Es tiling | Tiling **y** flotante |
| Genie / plugins | No | **Plugins (C/C++)** |

**Decisión: Hyprland.** Es para lo que está pensado (efectos + flotante + animaciones).

## 8. Optimización de recursos

Sí, se puede optimizar — y **ya parte de mucho más ligero que GNOME/KDE**:
- Hyprland en reposo es muy eficiente (efectos por GPU).
- Pila Hyprland + shell AGS suele rondar **~0.4–0.8 GB en reposo** vs ~1.5 GB+ de GNOME.
- AGS usa **GJS** (runtime JS de GNOME): cómodo para desarrollar, con algo de overhead. Si en el
  futuro un widget pesa, se puede **reescribir esa pieza** en QML (Quickshell) o Rust/C.
- Regla de oro: **no optimizar antes de medir**. Primero que se sienta bien; luego, si hace falta,
  afinas las piezas concretas.

## 9. ¿Crear o "personalizar GNOME"? — Crear (tu instinto es correcto)

ArchMac **NO** es instalar GNOME y tematizarlo. GNOME es un entorno completo y opinado; tematizarlo
tiene límites y nunca se siente como macOS. ArchMac se **construye desde primitivas**:

```
Linux (kernel, ya existe)
  + Hyprland (compositor, ya existe)        ← lo configuras, no lo reescribes
  + tu SHELL propio en AGS/Astal             ← barra, dock, control center, launcher…  (LO CREAS)
  + tus configs + apps + branding propios
  = ArchMac (empaquetado en ISO)
```

Matiz honesto: "crear el escritorio" **no** significa escribir el compositor ni el toolkit desde
cero (eso sería reinventar Hyprland/GTK). Significa **ensamblar piezas existentes y construir
encima tu propio shell e identidad**. Eso es exactamente lo que hace una distro como esta.

## 10. Cómo funciona crear el shell con AGS (ejemplo)

**AGS/Astal** te deja escribir el shell del escritorio en **TypeScript + JSX + CSS** (los mismos
conceptos de la simulación web), pero renderiza **widgets GTK nativos** como paneles Wayland
(layer-shell). Astal aporta *servicios* con datos en vivo: batería, audio, red, Hyprland, etc.

Flujo básico:
```bash
# instalar (AUR)
yay -S aylur-ags-git        # o el paquete 'ags'
ags init                    # crea ~/.config/ags (app.ts, style.css, widget/)
ags run                     # arranca el shell con hot-reload
```

Ejemplo ilustrativo de una **barra superior** (la API exacta varía según versión de AGS/Astal):
```tsx
// widget/TopBar.tsx
import { App, Astal, Gtk } from "astal/gtk3"
import { Variable, GLib, bind } from "astal"
import Battery from "gi://AstalBattery"

const time = Variable("").poll(1000, () =>
  GLib.DateTime.new_now_local().format("%H:%M")!)

export default function TopBar(monitor: number) {
  const bat = Battery.get_default()
  return (
    <window
      className="TopBar"
      monitor={monitor}
      anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      application={App}>
      <centerbox>
        <button halign={Gtk.Align.START} onClicked={() => print("menú ArchMac")}></button>
        <box />
        <box halign={Gtk.Align.END} spacing={8}>
          <label label={bind(bat, "percentage").as((p) => `${Math.round(p * 100)}%`)} />
          <label label={bind(time)} />
        </box>
      </centerbox>
    </window>
  )
}
```
Se estiliza con CSS (`style.css`) usando los **mismos tokens** del prototipo. La idea: portar
componente a componente lo que ya diseñaste en la simulación (barra → dock → control center → …).

## 11. Primeros pasos concretos (entorno de desarrollo de la distro)

```bash
# 1) VM con Arch (o equipo de pruebas)
#    instala Arch con: archinstall   (perfil mínimo)

# 2) Hyprland + utilidades base
sudo pacman -S hyprland kitty wofi network-manager-applet pipewire wireplumber

# 3) Arranca Hyprland y edita su config
Hyprland
#    ~/.config/hypr/hyprland.conf  → animaciones, rounding, blur, gaps (ver dotfiles/)

# 4) Shell con AGS
yay -S aylur-ags-git && ags init && ags run
#    empieza por la barra superior, luego el dock

# 5) Daily-drive 1–2 semanas, pule la fricción
# 6) Cuando convenza → archiso (ISO) → instalador → paquetes
```
El esqueleto del repo **`archmac-os`** (archiso/, dotfiles/hypr, shell-ags/, packages/, branding/)
sirve de punto de partida.
