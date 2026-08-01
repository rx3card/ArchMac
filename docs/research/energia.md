# Investigación — Energía y batería

**Objetivo:** que la batería en ArchMac dure igual o más que en Windows en el mismo equipo,
**sin degradar la experiencia** (nada de apagar animaciones por defecto). Todo debe venir
**preconfigurado y medido**, no como guía que el usuario aplica a mano.

**Estado:** investigación inicial (2026-07-31). Se valida midiendo en hardware real (Fase 2).

## 1. Daemon de gestión de energía

| Opción | Valoración |
|---|---|
| **TLP** *(candidato principal)* | El más completo: CPU, PCIe ASPM, USB autosuspend, SATA/NVMe, radios, umbrales de carga. Sin GUI propia → la nuestra en Ajustes |
| power-profiles-daemon | Simple (3 perfiles), buena integración con UI, pero cubre mucho menos |
| auto-cpufreq | Solo CPU; redundante con TLP |
| tuned | Potente pero orientado a servidores/Red Hat |

Regla: **uno solo** (TLP y PPD entran en conflicto). Decisión final tras medir TLP afinado vs
PPD en el mismo portátil (vatímetro: `powertop`, `turbostat`, batería en idle/vídeo/compilación).

## 2. Inventario de técnicas (checklist de implementación)

- **CPU:** driver `amd_pstate=active` / `intel_pstate`, EPP `balance_power` en batería;
  `thermald` en Intel.
- **GPU:** PSR (Panel Self-Refresh) en iGPU, `power_dpm_state` en AMD, apagado real de la dGPU
  en híbridos (supergfxctl / envycontrol), decodificación de vídeo por hardware en el stack
  preinstalado (VA-API en navegador — enorme impacto real en "ver vídeo").
- **Discos:** NVMe APST agresivo en batería, SATA link power management.
- **Buses:** PCIe ASPM `powersupersave`, USB autosuspend (con lista de exclusión para
  ratones/teclados problemáticos).
- **Radios:** Wi-Fi power save (`iwlwifi`/`mt76` params), Bluetooth suspendible, `rfkill`
  accesible desde Centro de Control.
- **Audio:** `snd_hda_intel power_save=1` / equivalente SOF.
- **Userspace:** auditoría de servicios systemd del arranque (objetivo: lista blanca mínima),
  zram en lugar de swap a disco, sin indexadores pesados en segundo plano, `ananicy-cpp` para
  prioridades de procesos.
- **Pantalla:** brillo adaptativo opcional, timeouts sensatos, VRR donde ayude.
- **Política:** umbrales de carga de batería (75/80%) expuestos en Ajustes, perfil "batería"
  automático al desenchufar.

## 3. Qué NO hacer

- Prometer "duplica tu batería" con scripts agresivos que rompen periféricos (USB autosuspend
  sin exclusiones, ASPM forzado en hardware que no lo soporta). Cada ajuste lleva su condición
  de hardware y su *fallback*.
- Apagar composición/animaciones por defecto: el ahorro es marginal con GPU moderna y destruye
  la propuesta de valor.

## 4. Métrica de éxito

Mismo portátil, misma carga de trabajo (idle 10 min, vídeo 1080p 30 min, navegación guionada):
consumo medio en vatios ArchMac ≤ Windows 10/11 de fábrica. Se publica la metodología y los
números en la wiki cuando existan.
