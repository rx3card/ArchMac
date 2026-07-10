import { create_app_config } from '$lib/helpers/create-app-config.ts';
import { public_asset } from '$lib/helpers/asset-path.ts';
import { system } from '$lib/state/system.svelte.ts';

const finder = create_app_config({
	title: 'Finder',
	resizable: true,

	// dockBreaksBefore: true,
	should_open_window: false,
});

// Launchpad: no abre ventana; alterna el overlay de Launchpad.
const launchpad = create_app_config({
	title: 'Launchpad',
	should_open_window: false,
	external_action: () => (system.launchpad_open = !system.launchpad_open),
});

const safari = create_app_config({
	title: 'Safari',
	resizable: true,
});

const mail = create_app_config({
	title: 'Mail',
	resizable: true,
});

const messages = create_app_config({
	title: 'Mensajes',
	resizable: true,
});

const maps = create_app_config({
	title: 'Mapas',
	resizable: true,
});

const notes = create_app_config({
	title: 'Notas',
	resizable: true,
});

const music = create_app_config({
	title: 'Música',
	resizable: true,
});

const terminal = create_app_config({
	title: 'Terminal',
	resizable: true,

	dock_breaks_before: true,
});

const wallpapers = create_app_config({
	title: 'Wallpapers',
	resizable: true,

	height: 600,
	width: 800,
});

const calculator = create_app_config({
	title: 'Calculator',

	expandable: true,
	resizable: false,

	height: 250 * 1.414,
	width: 250,
});

const calendar = create_app_config({
	title: 'Calendar',
	resizable: true,
});

const vscode = create_app_config({
	title: 'VSCode',
	resizable: true,

	height: 600,
	width: 800,
});

const systemPreferences = create_app_config({
	title: 'Ajustes',
	resizable: true,

	width: 760,
	height: 560,
});

// El instalador de la ISO es una app más del escritorio (entorno "live USB").
const install = create_app_config({
	title: 'Instalar ArchMac',
	resizable: true,

	dock_hidden: true,
	icon: public_asset('/app-icons/apple-install.svg'),

	width: 820,
	height: 560,
});

const appstore = create_app_config({
	title: 'App Store',
	resizable: true,
});

const aboutArchMac = create_app_config({
	title: `Acerca de ArchMac`,
	resizable: true,

	dock_hidden: true,

	height: 600,
	width: 800,
});

export const apps_config = {
	finder,
	launchpad,
	safari,
	mail,
	messages,
	maps,
	notes,
	music,
	calendar,
	calculator,

	terminal,
	vscode,
	wallpapers,
	'system-preferences': systemPreferences,
	install,
	appstore,

	'about-archmac': aboutArchMac,
};
