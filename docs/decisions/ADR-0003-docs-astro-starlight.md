# ADR-0003 — Astro + Starlight para la web y la documentación

**Estado:** aceptada · 2026-07-31 (confirmada por el propietario)

## Contexto

Se necesita una web oficial estilo Arch Wiki / Archcraft Wiki: minimalista, elegante, muy
rápida, con identidad propia (que no parezca plantilla), en español, con acceso a la simulación
(`/demo/`). Por ahora solo estructura; el contenido llegará con el desarrollo.

## Opciones consideradas

| Opción | A favor | En contra |
|---|---|---|
| **Astro + Starlight personalizado** *(elegida)* | Cero JS por defecto (el sitio más rápido de la categoría) · búsqueda instantánea sin backend (Pagefind) · sidebar/TOC/i18n/a11y resueltos · theming completo vía CSS custom properties y *component overrides* · soporta componentes Svelte (reutiliza trabajo de la simulación) | Hay que invertir en personalización para escapar del look por defecto |
| Astro puro | Control absoluto | Reimplementar búsqueda, sidebar, TOC y navegación: costo sin valor de identidad |
| VitePress | Rápido, buen DX | Theming profundo en Vue; el stack del proyecto es Svelte |
| Docusaurus | Ecosistema grande | React, pesado, look genérico muy reconocible |
| MediaWiki (la Arch Wiki real) | Edición colaborativa wiki | Servidor PHP + BD + mantenimiento; innecesario para documentación de autor |
| Mantener Svelte+Vite propio | Un solo stack | Sin infraestructura de contenido (markdown, colecciones, búsqueda, rutas) |

## Decisión

**Astro + Starlight**, personalizado con los tokens de `design/tokens/`. La simulación queda
como app Svelte independiente en `web/simulation`, servida bajo `/demo/`.

## Consecuencias

- Escribir documentación = añadir archivos Markdown/MDX en `web/site/src/content/docs/`.
- La identidad visual se profundiza en `src/styles/custom.css` y, cuando haga falta, con
  *component overrides* de Starlight (cabecera, hero, tarjetas).
- El despliegue publica `web/site/dist` como raíz y el build de la simulación bajo `/demo/`.
