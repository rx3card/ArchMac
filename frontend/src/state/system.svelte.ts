export const system_needs_update = $state({
	value: false as boolean,
});

/* Overlays del sistema (Spotlight, Launchpad, cambiador de apps). */
export const system = $state({
	spotlight_open: false,
	launchpad_open: false,
	switcher_open: false,
});
