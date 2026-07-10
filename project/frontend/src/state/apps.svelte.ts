import type { apps_config } from '$lib/configs/apps/apps-config';

export type AppID = keyof typeof apps_config;

const app_ids = [
	'finder',
	'launchpad',
	'safari',
	'mail',
	'messages',
	'maps',
	'notes',
	'music',
	'calendar',
	'calculator',
	'terminal',
	'vscode',
	'wallpapers',
	'system-preferences',
	'install',
	'appstore',
	'about-archmac',
] as const satisfies readonly AppID[];

const bool_map = (value: boolean) =>
	Object.fromEntries(app_ids.map((id) => [id, value])) as Record<AppID, boolean>;

const num_map = (value: number) =>
	Object.fromEntries(app_ids.map((id) => [id, value])) as Record<AppID, number>;

export const apps = $state({
	open: { ...bool_map(false), finder: true } as Record<AppID, boolean>,

	active: 'finder' as AppID,

	/**
	 * Maximum zIndex for the active app
	 * Initialize with -2, so that it becomes 0 when initialised
	 */
	active_z_index: -2,

	z_indices: num_map(0),

	is_being_dragged: false as boolean,

	fullscreen: bool_map(false),

	minimized: bool_map(false),
});
