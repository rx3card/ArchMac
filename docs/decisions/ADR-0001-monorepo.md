# ADR-0001 — Monorepo con dos partes: `web/` y `os/`

**Estado:** aceptada · 2026-07-31
**Reemplaza:** la estrategia de 2 repos (`archmac` + `archmac-os`) documentada previamente en
README/CONTEXT, que nunca llegó a ejecutarse (`archmac-os` no se creó).

## Contexto

El proyecto tiene dos productos: la web pública (sitio + documentación + simulación) y la
distro real (ISO, paquetes, dotfiles, shell). La decisión anterior era separarlos en dos
repositorios; el propietario del proyecto pidió explícitamente que todo viva en esta carpeta.

## Opciones consideradas

1. **Dos repos** — separa ciclos de release y stacks; pero duplica gestión, dificulta compartir
   los design tokens y fragmenta el contexto del proyecto.
2. **Monorepo** *(elegida)* — un solo lugar para tokens, docs de ingeniería y ambos productos;
   los ciclos de release se separan por carpeta (la web despliega desde `web/`, la ISO se
   construye desde `os/`), no por repo.

## Decisión

Monorepo con `web/` (site + simulation), `os/` (iso, packages, dotfiles, shell, installer,
branding, scripts), `design/` (tokens compartidos, referencias) y `docs/` (ingeniería: plan,
requisitos, ADRs, investigación).

## Consecuencias

- Los design tokens tienen un único origen (`design/tokens`) consumible por los tres frontales.
- Si en el futuro el volumen del repo o los permisos lo exigen, `os/` puede extraerse con
  `git filter-repo` conservando historial (la estructura por carpetas lo permite limpiamente).
