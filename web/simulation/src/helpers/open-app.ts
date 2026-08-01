import { apps_config } from '$lib/configs/apps/apps-config';
import { apps, type AppID } from '$lib/state/apps.svelte';

/** Abre una app (o ejecuta su acción), restaurándola si estaba minimizada. */
export function open_app(app_id: AppID) {
	const cfg = apps_config[app_id];

	if (!cfg.should_open_window) {
		cfg.external_action?.(undefined);
		return;
	}

	apps.minimized[app_id] = false;
	apps.open[app_id] = true;
	apps.active = app_id;
}

/** IDs de apps que abren ventana (para el cambiador de apps y Spotlight). */
export const windowed_app_ids = () =>
	(Object.keys(apps_config) as AppID[]).filter(
		(id) => apps_config[id].should_open_window !== false,
	);
