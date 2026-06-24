import { apps_config } from '$lib/configs/apps/apps-config';
import { open_app } from '$lib/helpers/open-app';
import { apps, type AppID } from './apps.svelte';
import { system } from './system.svelte';

/* Cambiador de apps/ventanas (estilo ⌘+Tab y swipe horizontal entre ventanas). */
export const switcher = $state({ items: [] as AppID[], index: 0 });

function open_windowed_apps(): AppID[] {
	return (Object.keys(apps_config) as AppID[]).filter(
		(id) => apps_config[id].should_open_window !== false && apps.open[id],
	);
}

/** Abre el cambiador (si no lo estaba) y avanza la selección. dir: 1 siguiente, -1 anterior. */
export function switcher_advance(dir: 1 | -1) {
	if (!system.switcher_open) {
		const items = open_windowed_apps();
		if (items.length === 0) return;
		switcher.items = items;
		const cur = items.indexOf(apps.active);
		switcher.index = (cur + dir + items.length) % items.length;
		system.switcher_open = true;
	} else {
		const n = switcher.items.length;
		if (n === 0) return;
		switcher.index = (switcher.index + dir + n) % n;
	}
}

/** Activa la app seleccionada y cierra el cambiador. */
export function switcher_commit() {
	if (!system.switcher_open) return;
	const id = switcher.items[switcher.index];
	system.switcher_open = false;
	if (id) open_app(id);
}

export function switcher_cancel() {
	system.switcher_open = false;
}
