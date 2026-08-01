# ArchMac — Plan de fidelidad visual (referencia: Aqua Screenshot Library)

> Fuente: [512pixels — Aqua Screenshot Library](https://512pixels.net/projects/aqua-screenshot-library/)
> (capturas de escritorio de las 26 versiones de macOS, de Cheetah a macOS 26 Tahoe).
>
> Objetivo: decidir la **era de diseño** que imita ArchMac y mapear los huecos para alcanzar
> una fidelidad alta, sin copiar activos de Apple (siguen siendo provisionales).

## 1. Eras de diseño de macOS (resumen)

| Era | Versiones | Rasgos visuales |
|---|---|---|
| Aqua clásico | 10.0–10.6 | Rayas (pinstripes), botones gelatina, brushed metal, lupa, reflejos |
| Lion–Yosemite | 10.7–10.10 | Texturas (linen, cuero), luego **flat + traslucidez/vibrancy** (Yosemite) |
| El Capitan–Catalina | 10.11–10.15 | Flat refinado, modo oscuro (Mojave), dock translúcido |
| **Big Sur–Sequoia** | 11–15 | **Iconos squircle, dock flotante con vidrio, esquinas muy redondeadas, Centro de Control, widgets** |
| Tahoe (macOS 26) | 26 | "Liquid Glass": aún más translucidez y profundidad |

**Decisión para ArchMac:** apuntar a la era **Big Sur → Sequoia** (Ventura/Sonoma), que es la
base actual del prototipo (wallpaper Ventura, iconos squircle, dock flotante). Es estable, muy
reconocible y coherente con lo ya construido. Tahoe (Liquid Glass) queda como posible evolución.

## 2. Estado actual de ArchMac vs. la era objetivo

✅ = hecho · 🟡 = parcial · ⬜ = pendiente

### Escritorio y barras
- ✅ Wallpaper Ventura · dock flotante con magnificación, rebote e indicadores
- ✅ Barra superior: menú Apple (funcional), reloj, iconos de estado (Wi-Fi/batería/Spotlight propios)
- 🟡 Menús de app en la barra: existen pero **estáticos** (no cambian según la app activa)
- ⬜ **Centro de Control** desplegable (Wi-Fi, Bluetooth, brillo, volumen, concentración, música)
- ⬜ **Centro de Notificaciones** + panel de widgets (deslizar desde la derecha)

### Ventanas (muy avanzado)
- ✅ Semáforo, arrastrar, **redimensionar** por bordes, **maximizar (FLIP)**, **genie** minimizar/restaurar
- ✅ Animaciones de **abrir/cerrar** (escala + fade simétricas)
- 🟡 Vibrancy/traslucidez de barras laterales (parcial; afinar el "vidrio esmerilado")
- ⬜ *Snapping*/mosaico al arrastrar a los bordes (macOS Sequoia)

### Navegación
- ✅ Spotlight (⌘Espacio) · Launchpad · cambiador de apps (⌘Tab)
- ⬜ **Mission Control** · App Exposé · Stage Manager · Hot Corners · Spaces

### Apps
- ✅ Calculadora · Calendario · **Ajustes (Apariencia: tema + acento, funcional)** · Acerca de ArchMac
- 🟡 Resto (Safari, Mail, Mensajes, Mapas, Notas, Música, Terminal): ventana placeholder
- ⬜ **Finder** navegable · Terminal simulada · más paneles de Ajustes

### Sistema / sesión
- ✅ Arranque UEFI (menú GRUB estilo macOS) · Recovery · **Instalador ArchMacInstall** (app)
- ✅ Apagado · logo de arranque (Apple)
- ⬜ **Pantalla de bloqueo / login** (avatar, reloj grande, campo de contraseña)

### Identidad
- ✅ Tema claro/oscuro + 7 colores de acento (cambian toda la UI)
- ⬜ Iconografía/wallpaper/logo **propios** (los de Apple son PROVISIONALES → antes de la ISO)

## 3. Roadmap de fidelidad (orden de impacto)

1. **Centro de Control** desplegable — el hueco más visible de la barra superior. *(P0)*
2. **Pantalla de bloqueo / login** estilo macOS (avatar, reloj, blur del fondo). *(P1)*
3. **Centro de Notificaciones + widgets** (panel lateral derecho). *(P1)*
4. **Menús de app dinámicos** (la barra cambia según la app con foco). *(P1)*
5. **Mission Control** (vista de ventanas) + **Stage Manager**. *(P2)*
6. **Finder navegable** + Terminal simulada (contenido real en apps clave). *(P2)*
7. **Snapping/mosaico** de ventanas al arrastrar a bordes. *(P2)*
8. **Afinar vibrancy** de barras laterales y traslucidez (acercar al "vidrio" de Big Sur+). *(P2)*
9. **Identidad propia**: logo ArchMac, set de iconos y wallpaper (antes de empaquetar). *(transversal)*

> Nota: la mayoría de capturas de la biblioteca son del **escritorio por defecto** de cada versión
> (barra + dock + wallpaper). Para detalle fino de cada app/panel conviene complementar con
> capturas concretas de Sonoma/Sequoia cuando ataquemos cada elemento.
