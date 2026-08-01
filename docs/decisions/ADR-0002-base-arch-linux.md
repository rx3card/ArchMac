# ADR-0002 — Arch Linux como base de la distribución

**Estado:** aceptada · 2026-07-31 (reevaluada objetivamente a petición del propietario)

## Contexto

Objetivos: escritorio Wayland de última generación (Hyprland + shell propio), experiencia
premium en 4 GB de RAM, ISO propia, instalador gráfico, control total del sistema base.

## Opciones consideradas

| Base | A favor | En contra para este proyecto |
|---|---|---|
| **Arch** *(elegida)* | Rolling (crítico: el stack Wayland/Hyprland evoluciona cada mes) · `archiso` es el sistema de construcción de ISOs más simple y probado · PKGBUILD es el formato de empaquetado más sencillo · AUR cubre el *long tail* · Arch Wiki resuelve gran parte de la investigación de hardware/energía · base mínima real (~sin servicios superfluos) | Sin ciclo de QA propio: la estabilidad depende de nuestro repo/overlay y de retener paquetes problemáticos |
| NixOS | Reproducibilidad total, rollbacks | Modelo hostil para el usuario objetivo (todo vía Nix), theming e integración de shell más difíciles, ecosistema de soporte pequeño |
| Fedora | Buena base moderna, SELinux | Ciclo semestral retrasa el stack Hyprland; empaquetar RPM + infra Koji es mucho más pesado que PKGBUILD; menos control del sistema mínimo |
| Debian/Ubuntu | Estabilidad, hardware enablement (Ubuntu) | Paquetes viejos para un escritorio Wayland de vanguardia; personalización profunda = mantener muchos backports |
| Void / Alpine | Ligereza | musl/runit rompen compatibilidad de software de escritorio; comunidad pequeña |

## Decisión

**Arch Linux.** La combinación rolling + archiso + PKGBUILD + AUR + Arch Wiki es la ruta de
menor fricción hacia una distro propia con stack moderno, y el rendimiento base cumple el
objetivo de 4 GB de RAM.

## Consecuencias

- La estabilidad de cara al usuario final se gestiona con: repo propio (overlay) donde se
  publican los paquetes del sistema ya probados, y documentación de recuperación (Fase 4).
- Riesgo legal: la política de marcas de Arch Linux restringe el uso de «Arch» en nombres de
  distros derivadas → el nombre definitivo del proyecto debe resolverse en Fase 0 (branding).
