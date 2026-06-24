# ArchMac — Simulación web (frontend)

Prototipo visual / simulación web de la experiencia de escritorio de **ArchMac**, una
distribución Linux basada en Arch con estética inspirada en macOS.

Esto es la **pista de simulación** del proyecto: valida el look & feel (escritorio, dock,
ventanas, animaciones, apps, arranque, instalador) antes de llevarlo al escritorio nativo.

## Stack

- **Svelte 5** + **Vite** + **pnpm**
- **TypeScript** estricto
- Alias de imports: `$lib` → `src/` (definido en `vite.config.ts` y `tsconfig.json`)

## Desarrollo

```bash
pnpm install
pnpm dev      # http://localhost:5173
pnpm check    # type-check (svelte-check)
pnpm build    # build de producción
```

## Notas

- Los **iconos, wallpapers y el logo de Apple** son **PROVISIONALES** (solo para el prototipo);
  se reemplazan por identidad propia antes de cualquier distribución.
- La documentación del proyecto (visión, plan, requisitos, fidelidad de diseño) está en la
  **raíz del repositorio**: `README.md`, `PLAN.md`, `REQUISITOS.md`, `DESIGN-FIDELITY.md`,
  `SOFTWARE.md`.

> Base técnica: este frontend partió de un proyecto open-source de simulación de macOS en
> Svelte (MIT), reescrito y rebrandeado por completo para ArchMac. Todo el branding del autor
> original y sus enlaces se han eliminado.
