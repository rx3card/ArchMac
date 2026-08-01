# Design tokens — fuente única de verdad visual

`tokens.json` define los valores visuales canónicos de ArchMac (colores, acentos, tipografía,
radios, efectos). **Ningún consumidor debe inventar valores propios**: si un valor cambia,
cambia aquí primero y se propaga.

## Consumidores actuales

| Consumidor | Archivo(s) | Estado |
|---|---|---|
| Simulación | `web/simulation/src/css/theme.css` + `src/configs/theme/colors.config.ts` | origen de los valores actuales |
| Web/docs | `web/site/src/styles/custom.css` | sincronizado a mano |
| Shell nativo (Fase 2) | `os/shell/` (QML o SCSS según ADR pendiente) | futuro |

## Pendiente

- Script de generación (`tokens.json` → CSS custom properties / SCSS / QML) para eliminar la
  sincronización manual. Se creará cuando exista el segundo consumidor real (el shell).
- Tokens de animación (duraciones y curvas del genie, dock, transiciones) — extraer de la
  simulación cuando se porten al compositor.
