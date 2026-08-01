# Decisiones de arquitectura (ADRs)

Cada decisión técnica importante del proyecto se registra aquí como un **Architecture Decision
Record**: qué se decidió, qué alternativas se compararon y por qué. Una decisión puede
**reabrirse** si aparece mejor evidencia — se registra la nueva decisión y se marca la anterior
como reemplazada.

| ADR | Decisión | Estado |
|---|---|---|
| [ADR-0001](ADR-0001-monorepo.md) | Monorepo con dos partes (`web/` + `os/`) | ✅ aceptada |
| [ADR-0002](ADR-0002-base-arch-linux.md) | Arch Linux como base de la distro | ✅ aceptada |
| [ADR-0003](ADR-0003-docs-astro-starlight.md) | Astro + Starlight para la web/documentación | ✅ aceptada |
| [ADR-0004](ADR-0004-decoraciones-ventanas.md) | Estrategia de decoración de ventanas por capas | ✅ aceptada (en refinamiento) |
| [ADR-0005](ADR-0005-shell-quickshell-vs-astal.md) | Shell del escritorio: Quickshell vs Astal | 🟡 pendiente — bake-off en Fase 2 |

Plantilla: contexto → opciones consideradas → decisión → consecuencias.
