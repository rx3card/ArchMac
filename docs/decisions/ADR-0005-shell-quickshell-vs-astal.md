# ADR-0005 — Shell del escritorio: Quickshell vs AGS/Astal

**Estado:** 🟡 pendiente — se decide con un *bake-off* al inicio de la Fase 2

## Contexto

El shell (barra, dock, launcher, centro de control, notificaciones, lockscreen) es la pieza que
más define la experiencia ArchMac. Candidatos reales en 2026:

| | **Quickshell** (QML/Qt) | **AGS/Astal** (TS+JSX → GTK) |
|---|---|---|
| Animaciones | Motor declarativo con GPU (states, transitions, easing, shaders) — el punto fuerte exacto que necesita la fidelidad macOS | Animar CSS sobre GTK: posible pero limitado |
| Ecosistema de referencia | Los shells más premium del momento (caelestia, end-4, Noctalia) son Quickshell | Buenos ejemplos, menos ambiciosos visualmente |
| Lenguaje | QML (nuevo para el equipo) | TypeScript (reutiliza el conocimiento de la simulación) |
| Runtime | Qt (C++), muy eficiente | GJS (runtime JS de GNOME), algo más de overhead |
| Datos del sistema | Servicios propios | Librerías Astal (batería, audio, red, Hyprland) muy completas |

## Plan de decisión

Implementar **el mismo componente en ambos** — el dock con magnificación e indicadores, por ser
el más exigente en animación — y comparar: fluidez (fps y jank), RAM, esfuerzo de desarrollo y
fidelidad visual alcanzable. La decisión se registra aquí con los números medidos.

**Hipótesis de trabajo (favorito): Quickshell**, por el motor de animaciones y el techo visual
demostrado por su ecosistema. El costo de aprender QML se compensa con lo que ahorra en pelear
animaciones contra GTK.

## Mientras tanto

Los design tokens (`design/tokens/tokens.json`) se mantienen agnósticos (JSON) para poder
generarse como SCSS (Astal) o QML (Quickshell) sin rehacer nada.
