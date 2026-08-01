/* Zona de acomodo (snapping/mosaico) que se previsualiza al arrastrar una ventana a un borde. */

export type SnapZone = { x: number; y: number; w: number; h: number; key: string };

export const snap = $state<{ zone: SnapZone | null }>({ zone: null });
