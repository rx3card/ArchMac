# ArchMac — Especificación de Requisitos (Frontend)

> Documento explicativo de **requisitos funcionales (RF)** y **no funcionales (RNF)** del
> prototipo web de ArchMac, cuyo objetivo es replicar la experiencia de macOS.
>
> **Leyenda de estado:** ✅ hecho · 🟡 parcial · ⬜ pendiente
> **Prioridad:** P0 (núcleo, imprescindible) · P1 (importante) · P2 (deseable) · P3 (extra)
>
> Cada requisito incluye: *qué es*, *por qué importa*, *comportamiento esperado* y
> *criterios de aceptación* (cómo sabemos que está bien hecho).

---

# PARTE I — REQUISITOS FUNCIONALES (qué debe hacer el sistema)

## Módulo A — Gestión de ventanas

### RF-A1 · Abrir aplicación — `P0` ✅
- **Qué:** lanzar una app crea su ventana en pantalla.
- **Por qué:** es la acción básica del escritorio.
- **Comportamiento esperado:** al hacer clic en el dock, el icono **rebota**, la ventana
  aparece con una transición de escala/opacidad y recibe el foco.
- **Criterios de aceptación:** la ventana se monta, queda enfocada (al frente) y el icono
  muestra el indicador de "abierta".

### RF-A2 · Cerrar ventana — `P0` ✅
- **Qué:** botón rojo del semáforo cierra la ventana.
- **Comportamiento esperado:** la ventana se desvanece/encoge y desaparece; el estado de la
  app pasa a "cerrada".
- **Criterios de aceptación:** la ventana se desmonta y el indicador del dock se apaga.

### RF-A3 · Minimizar al dock (efecto *genie*) — `P0` 🟡
- **Qué:** botón amarillo envía la ventana al dock con animación.
- **Por qué:** es una de las animaciones más icónicas de macOS.
- **Comportamiento esperado (objetivo):** la ventana se **deforma como papel/líquido** (efecto
  *genie*: franjas que se curvan y estrechan) y se **absorbe hacia su icono del dock**.
- **Estado actual:** aproximación CSS (escala + desplazamiento hacia el dock + fade). El *genie*
  fiel requiere **WebGL** (vertex shader de malla) o **SVG `feDisplacementMap`**.
- **Criterios de aceptación:** al minimizar, la ventana desaparece hacia el dock; al hacer clic
  en su icono, regresa con la animación inversa.

### RF-A4 · Maximizar / Pantalla completa y restaurar — `P0` ✅
- **Qué:** botón verde lleva la ventana a pantalla completa (bajo la barra) y la restaura.
- **Comportamiento esperado:** ocupa todo el ancho/alto disponible; al restaurar vuelve a su
  posición y tamaño anteriores.
- **Criterios de aceptación:** maximizada llena la pantalla (sin desbordes); restaurada coincide
  exactamente con la geometría previa.

### RF-A5 · Mover ventana (arrastrar) — `P0` ✅
- **Qué:** arrastrar desde la barra de título reposiciona la ventana.
- **Criterios de aceptación:** la ventana sigue al cursor sin saltos; no se mueve si está
  maximizada.

### RF-A6 · Redimensionar por bordes y esquinas — `P0` ✅
- **Qué:** estirar la ventana desde sus 8 puntos (4 bordes + 4 esquinas).
- **Comportamiento esperado:** redimensionar desde un borde **derecho/inferior** solo crece;
  desde **izquierdo/superior** crece y desplaza el borde correspondiente, respetando un tamaño
  mínimo.
- **Criterios de aceptación:** funciona en los 8 sentidos, con cursores correctos, y **sin
  saltos** al arrastrar después de redimensionar.

### RF-A7 · Foco y orden de apilado (z-index) — `P0` ✅
- **Qué:** la ventana sobre la que se hace clic pasa al frente y recibe foco.
- **Criterios de aceptación:** el semáforo de la ventana activa se ve a color; las inactivas, en
  gris.

### RF-A8 · Símbolos del semáforo al pasar el cursor — `P1` ✅
- **Qué:** los iconos ✕ − ↗ aparecen solo al pasar el ratón por el semáforo.

### RF-A9 · Doble clic en la barra de título — `P2` ⬜
- **Qué:** doble clic = minimizar o hacer zoom (configurable).

### RF-A10 · *Snapping* / mosaico de ventanas — `P2` ⬜
- **Qué:** arrastrar una ventana a un borde la ajusta a media pantalla (o mosaico).
- **Por qué:** productividad; macOS Sequoia lo incorpora.

### RF-A11 · Reubicar ventanas fuera de pantalla — `P2` ⬜
- **Qué:** si la resolución cambia y una ventana queda fuera, traerla a la vista.

---

## Módulo B — Dock

### RF-B1 · Magnificación por proximidad — `P0` ✅
- **Qué:** los iconos crecen según la cercanía del cursor (curva tipo campana).

### RF-B2 · Rebote al abrir / solicitar atención — `P1` ✅
- **Qué:** el icono rebota al lanzar la app o cuando requiere atención.

### RF-B3 · Indicador de app abierta — `P0` ✅
- **Qué:** punto debajo del icono de las apps en ejecución.

### RF-B4 · Separadores — `P1` ✅
- **Qué:** divisores entre grupos (apps fijadas / sistema / minimizadas / papelera).

### RF-B5 · Ventanas minimizadas en el dock — `P1` 🟡
- **Qué:** la **miniatura** de la ventana minimizada se coloca a la derecha del separador.
- **Estado:** se restaura al clic, pero falta mostrar miniatura propia.

### RF-B6 · Menú contextual del icono — `P2` ⬜
- **Qué:** clic derecho → Salir, Opciones, Mantener en el Dock, Mostrar en Finder…

### RF-B7 · Auto-ocultar y posición — `P2` ⬜
- **Qué:** ocultar el dock automáticamente; colocarlo abajo/izquierda/derecha.

### RF-B8 · Papelera — `P3` ⬜
- **Qué:** icono de papelera al final del dock (vaciar / arrastrar para eliminar).

---

## Módulo C — Barra de menús superior

### RF-C1 · Menú Apple () — `P1` 🟡
- **Qué:** menú con Acerca de, Ajustes, App Store, Reposo, Reiniciar, Apagar, Cerrar sesión,
  Bloquear pantalla.
- **Estado:** existe el logo; faltan las acciones reales.

### RF-C2 · Menús de la app activa — `P1` 🟡
- **Qué:** Archivo, Edición, Ver, Ventana, Ayuda — **cambian según la app con foco**.
- **Estado:** existen estáticos; falta que dependan de la app activa.

### RF-C3 · Iconos de estado — `P1` 🟡
- **Qué:** Wi-Fi, Bluetooth, batería, volumen, hora, Spotlight, Centro de Control.
- **Estado:** hay un toggle; faltan iconos reales con su estado.

### RF-C4 · Reloj y fecha — `P0` ✅
- **Qué:** hora y fecha en vivo a la derecha.

---

## Módulo D — Centro de Control y Notificaciones

### RF-D1 · Centro de Control — `P1` ⬜
- **Qué:** panel desplegable con brillo, volumen, Wi-Fi, Bluetooth, AirDrop, modo concentración
  y controles de música.
- **Criterios de aceptación:** se abre desde su icono, los controles modifican el estado y la
  UI reacciona (p. ej. volumen ↔ icono de la barra).

### RF-D2 · Centro de Notificaciones — `P1` ⬜
- **Qué:** panel lateral con notificaciones y **widgets** (reloj, calendario, clima).

### RF-D3 · Notificaciones emergentes (toasts) — `P2` ⬜
- **Qué:** avisos que entran desde la esquina superior derecha y se apilan.

---

## Módulo E — Navegación del sistema

### RF-E1 · Spotlight — `P1` 🟡 ✅(apps)
- **Qué:** búsqueda universal con **⌘/Ctrl+Espacio** (apps, archivos, cálculos, conversiones, web).
- **Comportamiento esperado:** panel central, navegación con flechas, Enter abre el resultado.
- **Estado:** ✅ búsqueda y apertura de **apps** (flechas + Enter + clic). Falta: archivos,
  cálculos, conversiones y web (esos requieren datos/backend — ver Parte III).

### RF-E2 · Mission Control — `P1` ⬜
- **Qué:** **⌃↑** o 3 dedos ↑ → vista de todas las ventanas + barra de Spaces arriba.

### RF-E3 · App Exposé — `P2` ⬜
- **Qué:** **⌃↓** o 3 dedos ↓ → solo las ventanas de la app activa.

### RF-E4 · Launchpad — `P1` ✅
- **Qué:** cuadrícula de todas las apps con búsqueda; fondo desenfocado.
- **Estado:** ✅ rejilla de apps + búsqueda + fondo blur. Se abre desde el dock, con **F4** o
  (simulando 4 dedos) su botón. Falta: paginación y carpetas (P3).

### RF-E5 · Cambiador de apps (⌘Tab) — `P1` ✅
- **Qué:** overlay para recorrer las apps abiertas manteniendo ⌘/Ctrl.
- **Estado:** ✅ ⌘/Ctrl+Tab (Shift = inverso) muestra el overlay y cicla; confirma al soltar la
  tecla o tras una pausa. También se activa con **swipe horizontal** sobre el escritorio (simula
  el gesto de 3 dedos ↔ entre ventanas).

### RF-E6 · Escritorios (Spaces) — `P2` ⬜
- **Qué:** múltiples escritorios virtuales; navegación con 3/4 dedos ↔ o ⌃←/→.

### RF-E7 · Stage Manager — `P3` ⬜
- **Qué:** agrupar ventanas a un lado para enfocarse en una.

### RF-E8 · Hot Corners — `P3` ⬜
- **Qué:** acción al llevar el cursor a una esquina (p. ej. Mission Control).

---

## Módulo F — Escritorio

### RF-F1 · Wallpaper — `P0` ✅
- **Qué:** fondo de pantalla (Ventura por defecto).

### RF-F2 · Selector de wallpaper — `P1` 🟡
- **Qué:** elegir entre varios fondos (el repo trae muchos); aplicar al instante.

### RF-F3 · Menú contextual del escritorio — `P1` ⬜
- **Qué:** clic derecho → Cambiar fondo, Ordenar, Mostrar opciones de vista…

### RF-F4 · Iconos/archivos en el escritorio — `P3` ⬜
- **Qué:** archivos y carpetas colocables en el escritorio.

### RF-F5 · Widgets — `P3` ⬜
- **Qué:** widgets en el escritorio (estilo Sonoma).

---

## Módulo G — Aplicaciones

### RF-G1 · Calculadora — `P1` ✅
### RF-G2 · Calendario — `P1` ✅
### RF-G3 · Acerca de ArchMac — `P1` ✅
### RF-G4 · Finder navegable — `P2` ⬜
- **Qué:** explorador con barra lateral, vistas (iconos/lista/columnas), navegación de carpetas.
### RF-G5 · Terminal simulada — `P2` ⬜
- **Qué:** terminal con comandos básicos de demostración.
### RF-G6 · Ajustes del sistema — `P1` ⬜
- **Qué:** apariencia (claro/oscuro/auto), acento, fondo, dock, idioma.
### RF-G7 · Otras apps (Safari, Mail, Mensajes, Mapas, Notas, Música, Terminal, Ajustes…) — `P2–P3` 🟡
- **Estado:** todas existen en el dock/Launchpad/Spotlight con **ventana placeholder** ("en
  construcción") y su icono real. Falta darles contenido real (ver Parte III para los límites).

---

## Módulo H — Sesión y arranque

### RF-H1 · Pantalla de arranque (boot) — `P1` ✅
- **Qué:** fondo negro, logo centrado, barra de progreso.

### RF-H2 · Pantalla de bloqueo / login — `P1` ⬜
- **Qué:** fondo, avatar de usuario, campo de contraseña, hora grande.

### RF-H3 · Apagar / Reiniciar / Reposo / Cerrar sesión — `P1` ⬜
- **Qué:** acciones del menú  con sus transiciones (pantalla a negro, etc.).

### RF-H4 · Sonidos del sistema — `P3` ⬜
- **Qué:** sonido de arranque y alertas.

---

## Módulo I — Interacción (teclado, gestos, etc.)

### RF-I1 · Atajos de teclado globales — `P2` 🟡
- **Qué:** ⌘Q (salir), ⌘W (cerrar), ⌘M (minimizar), ⌘Espacio (Spotlight), ⌘Tab (apps),
  ⌃↑ (Mission Control), F4 (Launchpad), etc.
- **Estado:** ✅ ⌘/Ctrl+Espacio, ⌘/Ctrl+Tab, F4, Escape. Faltan ⌘Q/W/M y Mission Control.

### RF-I2 · Emulación de gestos del trackpad — `P2` 🟡
- **Qué:** mapear gestos a eventos web. **Limitación real:** los navegadores **no reciben** los
  gestos de 3/4 dedos (los intercepta el SO), así que se **simulan** con equivalentes.
- **Estado:** ✅ swipe horizontal sobre el escritorio = cambiar de ventana (simula 3 dedos ↔);
  Launchpad por botón/F4 (simula 4 dedos). Mission Control pendiente.

### RF-I3 · Menús contextuales (clic derecho) — `P2` ⬜
- **Qué:** menús contextuales coherentes en escritorio, dock y apps.

### RF-I4 · Arrastrar y soltar — `P3` ⬜
- **Qué:** mover archivos entre ventanas/escritorio.

### RF-I5 · Persistencia de sesión — `P2` ⬜
- **Qué:** recordar apps abiertas, geometría de ventanas, wallpaper, tema y acento
  (localStorage) entre recargas.

---

# PARTE II — REQUISITOS NO FUNCIONALES (cómo debe ser el sistema)

### RNF-1 · Rendimiento — `P0` 🟡
- **Qué:** animaciones a **60 fps**, arranque rápido, consumo de memoria contenido.
- **Cómo:** usar `transform`/`opacity` (compositor GPU), evitar *layout thrashing*, carga
  perezosa de apps.
- **Aceptación:** sin *jank* perceptible al arrastrar/redimensionar/minimizar.

### RNF-2 · Accesibilidad (a11y) — `P1` 🟡
- **Qué:** roles ARIA, navegación por teclado, foco visible, contraste suficiente, compatibilidad
  con lectores de pantalla.
- **Incluye:** respetar **`prefers-reduced-motion`** (desactivar/atenuar animaciones).

### RNF-3 · Diseño responsivo — `P1` ⬜
- **Qué:** adaptarse a distintas resoluciones; recolocar ventanas y dock; usable en pantallas
  pequeñas.

### RNF-4 · Theming coherente — `P0` 🟡
- **Qué:** claro/oscuro + color de acento, todo desde **tokens/variables CSS** (una sola fuente
  de verdad). Cambiar el tema actualiza toda la UI sin inconsistencias.

### RNF-5 · Internacionalización (i18n) — `P2` 🟡
- **Qué:** español por defecto, preparado para inglés; textos centralizados, formatos de
  fecha/hora localizados.

### RNF-6 · PWA / offline — `P2` 🟡
- **Qué:** instalable y con cacheo de assets (el repo base ya incluye `vite-plugin-pwa`).

### RNF-7 · Mantenibilidad y arquitectura — `P0` ✅
- **Qué:** componentes pequeños y reutilizables, **estado centralizado** (`src/state`),
  configuración de apps declarativa, sin lógica duplicada.
- **Aceptación:** añadir una app nueva = crear su config + componente, sin tocar el núcleo.

### RNF-8 · Compatibilidad de navegadores — `P1` 🟡
- **Qué:** Chrome, Edge, Firefox y Safari modernos.

### RNF-9 · Calidad de tipos y build — `P0` ✅
- **Qué:** TypeScript estricto; `pnpm check` sin errores ni warnings antes de cada avance.

### RNF-10 · Fidelidad visual y de animación — `P1` 🟡
- **Qué:** las animaciones deben **sentirse como macOS** (duraciones y curvas correctas; ver
  tabla en el [README](README.md)). El *genie* fiel es objetivo explícito.

### RNF-11 · Seguridad — `P2` ⬜
- **Qué:** sanear contenido en apps que muestren HTML/iframes; sin *secrets* en el cliente.

### RNF-12 · Testeo — `P2` ⬜
- **Qué:** pruebas de los comportamientos críticos (gestión de ventanas, estado).

### RNF-13 · Documentación — `P1` ✅
- **Qué:** README con la investigación de macOS, este documento de requisitos y `PLAN.md`.

### RNF-14 · Legal / propiedad intelectual — `P0` 🟡
- **Qué:** los **iconos, wallpapers y el logo de Apple son PROVISIONALES** (solo para el
  prototipo). **Deben sustituirse por identidad propia** de ArchMac antes de distribuir cualquier
  ISO, para evitar problemas de marca/copyright.

---

# PARTE III — Fuera de alcance (del prototipo web)

> Estas funciones **no** se implementan en el prototipo web porque dependen del **sistema
> operativo real**. Pertenecen a la **Fase 2** (escritorio nativo con AGS/Astal sobre Hyprland)
> o a fases posteriores. Se listan aquí para dejar el límite explícito y evitar confusión.

### FA-1 · Gestión real de archivos
- Leer/escribir/borrar archivos y carpetas del disco. En el prototipo, Finder es una **maqueta
  navegable** sin acceso real al sistema de ficheros.

### FA-2 · Ejecución real de aplicaciones
- Abrir binarios/apps del sistema. En el prototipo las "apps" son **componentes simulados**.

### FA-3 · Terminal real
- Ejecutar comandos del sistema. En el prototipo será una **terminal simulada** con respuestas
  predefinidas (demostración), no un shell real.

### FA-4 · Conectividad y hardware reales
- Wi-Fi, Bluetooth, AirDrop, batería, brillo, volumen del hardware. En el prototipo los controles
  del Centro de Control son **simulados** (modifican estado de la UI, no el hardware).

### FA-5 · Servicios de nube e IA
- iCloud, sincronización, Siri / asistentes de IA, App Store con descargas reales.

### FA-6 · Multiusuario y seguridad del SO
- Cuentas de usuario reales, permisos, FileVault, llavero. El login del prototipo es **visual**.

### FA-7 · Instalación, actualizaciones y empaquetado
- Instalador gráfico, actualizaciones del sistema y generación de la **ISO** (Archiso). Esto es
  parte de las **Fases 3–4** del [PLAN.md](PLAN.md), no del frontend.

### FA-8 · Integración nativa del escritorio
- Compositor (Hyprland), barras/dock nativos (AGS/Astal), multimonitor real, atajos a nivel de
  SO. Es la **Fase 2**: el frontend web solo valida el look & feel; el comportamiento nativo se
  reconstruye después con tecnología de escritorio.

> **Resumen del límite:** el prototipo web busca que ArchMac **se vea y se sienta** como macOS
> (UI, animaciones, gestos emulados). Todo lo que requiera tocar hardware, ficheros o procesos
> reales se aborda en el escritorio nativo.

---

## Trazabilidad y prioridades (resumen)

| Prioridad | Foco |
|---|---|
| **P0** | Ventanas (✅ casi completo), dock básico (✅), reloj (✅), rendimiento, theming, build, legal |
| **P1** | Centro de Control, Spotlight, Mission Control, Launchpad, ⌘Tab, barra de menús real, Ajustes, login/apagar, *genie* fiel |
| **P2** | Atajos de teclado, gestos, persistencia, Finder/Terminal, snapping, notificaciones |
| **P3** | Stage Manager, Hot Corners, widgets, papelera, sonidos, apps extra |

> El roadmap ordenado por impacto está al final del [README](README.md).
