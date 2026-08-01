/* Pantalla activa del sistema: escritorio, arranque (UEFI), Recovery, instalador, apagado. */

export type Screen = 'desktop' | 'uefi' | 'recovery' | 'poweroff';

// Arranca por el UEFI (Startup Manager) como un PC real; de ahí pasa al escritorio.
export const screen = $state({ current: 'uefi' as Screen });

export function go(to: Screen) {
	screen.current = to;
}
