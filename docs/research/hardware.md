# Investigación — Compatibilidad de hardware

**Objetivo:** que ArchMac "simplemente funcione" al estilo Windows/macOS: Wi-Fi, Bluetooth,
audio, touchpad, GPU, pantallas externas e impresoras operativos desde el primer arranque,
sin terminal.

**Estado:** inventario inicial (2026-07-31). Cada área se convierte en configuración
preinstalada + página de la wiki cuando se valide en hardware real.

## Stack base (candidatos por defecto)

| Área | Elección preliminar | Notas |
|---|---|---|
| Audio | **PipeWire + WirePlumber** | Estándar de facto; perfiles HSP/HFP correctos para auriculares BT |
| Red | **NetworkManager** | Mejor UX y soporte de VPN; iwd como backend Wi-Fi a evaluar |
| Bluetooth | BlueZ + integración en Centro de Control | Emparejamiento sin terminal, códecs (LDAC/aptX vía PipeWire) |
| Touchpad | libinput (Wayland nativo) | Gestos 3/4 dedos → Hyprland (workspace swipe) + shell propio |
| GPU | Mesa (AMD/Intel) · NVIDIA propietario con detección en instalador | NVIDIA Wayland: validar explícitamente (sigue siendo el punto frágil) |
| Pantallas | Hyprland per-monitor scale/VRR + UI propia de pantallas | Escalado fraccional y hotplug sin fricción |
| Impresoras | CUPS + descubrimiento automático (IPP Everywhere / Avahi) | La era de "instalar drivers" de impresora casi terminó con IPP |
| Firmware | fwupd | Actualizaciones de firmware desde Ajustes |
| Codecs/HW accel | VA-API preconfigurado (navegador incluido) | Impacto directo en batería y fluidez |

## Principios

1. **Detectar, no preguntar:** el instalador detecta GPU/CPU y aplica el stack correcto
   (microcode, driver, VA-API) sin que el usuario elija.
2. **Todo configurable desde Ajustes:** ninguna función básica puede requerir terminal.
3. **Matriz de hardware probada:** página en la wiki con equipos verificados y su estado
   (la llenaremos con las pruebas reales; formato inspirado en las tablas de la Arch Wiki).

## Riesgos conocidos a validar

- NVIDIA + Wayland (multimonitor, VRR, suspensión) — el mayor generador de tickets del
  ecosistema; decidir qué generaciones se soportan oficialmente.
- Huellas dactilares (fprintd) y cámaras IR: soporte irregular; marcar como "si el hardware
  lo permite".
- Broadcom Wi-Fi antiguo: requiere dkms propietario → detectarlo en el instalador.
