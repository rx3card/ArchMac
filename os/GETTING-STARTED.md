# Empezar a desarrollar la distro (desde este PC con Windows)

La distro se **construye y prueba en Linux**. Este PC (Ryzen 3 7320U, 8 GB RAM, Windows 10
Home) puede hacerlo con una máquina virtual. Dos rutas; puedes usar ambas:

## Ruta A — VirtualBox (recomendada para VER y USAR el escritorio)

La VM con entorno gráfico es donde se desarrolla y se siente la experiencia real
(Hyprland, animaciones, dock). Pasos:

1. Instala VirtualBox (si no lo tienes ya): <https://www.virtualbox.org/wiki/Downloads>
2. Descarga la ISO oficial de Arch: <https://archlinux.org/download/>
3. Crea la VM — ajustes importantes:
   - Tipo: Linux / Arch Linux (64-bit)
   - **RAM: 4096 MB** (el objetivo de ArchMac es correr bien en 4 GB — así medimos de verdad)
   - CPU: 4 núcleos · Disco: 40 GB VDI
   - Sistema → **Habilitar EFI** OK (probamos el arranque UEFI real)
   - Pantalla → Controlador **VMSVGA** + **Aceleración 3D DESACTIVADA** [no] + 128 MB de vídeo
     (con 3D activada, VirtualBox rompe el renderizado de Hyprland: pantalla negra con
     solo el cursor. Sin 3D usa renderizado por software — correcto para desarrollar)
4. Arranca la ISO y ejecuta `archinstall` (perfil mínimo, sin entorno de escritorio).
5. Dentro del Arch instalado:

   ```bash
   sudo pacman -Syu git
   git clone https://github.com/rx3card/ArchMac.git && cd ArchMac
   bash os/scripts/setup-desktop.sh   # paquetes + dotfiles + wallpaper, idempotente
   start-hyprland                     # arranca el escritorio (Hyprland ≥ 0.56)
   ```

6. Iterar: `git pull && bash os/scripts/setup-desktop.sh` (recarga solo si Hyprland está activo).

> Nota GPU: dentro de VirtualBox las animaciones no rinden como en hardware real (la
> aceleración 3D de VBox con Wayland es limitada). Para *evaluar fluidez real*, la referencia
> será un arranque desde USB en el portátil (más adelante). La VM es para desarrollar.

## Ruta B — WSL2 con Arch (recomendada para CONSTRUIR la ISO, más rápida)

`mkarchiso` funciona en WSL2 y compila la ISO mucho más rápido que dentro de VirtualBox.

1. PowerShell **como administrador**: `wsl --install` → reinicia el PC.
2. PowerShell normal: `wsl --install archlinux`
3. Dentro de Arch (WSL): `sudo bash /mnt/c/Users/rojas/Dev/ArchMac/os/scripts/build-iso.sh`
4. La ISO queda en `os/iso/out/`.

## Probar la ISO

- **VirtualBox:** crea otra VM (o usa la misma) y monta `os/iso/out/archmac-*.iso` como CD →
  arranca directo al escritorio live (usuario `archmac`, autologin).
- **QEMU (opcional):** `winget install SoftwareFreedomConservancy.QEMU` y luego
  `powershell -File os\scripts\test-iso.ps1`.

## Llevarse la VM a otro PC (sin reinstalar Arch)

La VM ya instalada se puede mover tal cual: no hay que repetir `archinstall`.

**Opción 1 — Exportar la VM completa (recomendada).**
Con la VM **apagada**: VirtualBox → *Archivo* → *Exportar servicio virtualizado* → elegir la
VM → formato **OVF 2.0** → guardar como `archmac-dev.ova` (unos 6–12 GB).
En el PC nuevo: instalar VirtualBox → *Archivo* → *Importar servicio virtualizado* → elegir el
`.ova`. Arranca exactamente como se dejó, con todo instalado.

**Opción 2 — Copiar solo el disco.**
El disco virtual es un archivo `.vdi` en
`C:\Users\<usuario>\VirtualBox VMs\<nombre-VM>\`. Copiarlo al PC nuevo y crear allí una VM
nueva eligiendo *«Usar un archivo de disco duro virtual existente»* apuntando a ese `.vdi`.
Recordar los ajustes: EFI activado, VMSVGA, **3D desactivada**, 4 GB de RAM.

**Opción 3 — Instantáneas (para experimentar sin miedo).**
Antes de un cambio arriesgado: VirtualBox → *Máquina* → *Tomar instantánea*. Si algo se rompe,
se restaura en segundos. Útil antes de tocar el arranque o el sistema de archivos.

> Aun así, la VM **no es imprescindible**: `os/scripts/setup-desktop.sh` reconstruye el
> escritorio completo sobre cualquier Arch limpio. Exportar la VM solo ahorra el rato de
> instalar Arch de nuevo.

## Flujo de trabajo resumido

```
editar os/dotfiles + os/iso  →  build-iso.sh (WSL o VM)  →  probar ISO en VirtualBox
                ↑                                                     │
                └────────────── ajustar y repetir ←───────────────────┘
```

El orden de desarrollo está en [PORTING.md](PORTING.md) (qué componente de la simulación se
convierte en qué pieza nativa, y en qué fase).
