/* Catálogo de apps de ArchMac — fuente compartida por dock y Spotlight.
 * Iconos reales de macOS (provisionales, solo para el prototipo).
 * Se reemplazarán por iconografía propia antes de distribuir. */

export type App = {
	id: string;
	name: string;
	icon: string;
	/** Inserta un separador en el dock antes de esta app (estilo macOS). */
	dividerBefore?: boolean;
};

const ICON = (folder: string) => `/app-icons/${folder}/256.png`;

export const apps: App[] = [
	{ id: 'finder', name: 'Finder', icon: ICON('finder') },
	{ id: 'launchpad', name: 'Launchpad', icon: ICON('launchpad') },
	{ id: 'safari', name: 'Safari', icon: ICON('safari') },
	{ id: 'messages', name: 'Mensajes', icon: ICON('messages') },
	{ id: 'mail', name: 'Mail', icon: ICON('mail') },
	{ id: 'maps', name: 'Mapas', icon: ICON('maps') },
	{ id: 'photos', name: 'Fotos', icon: ICON('photos') },
	{ id: 'facetime', name: 'FaceTime', icon: ICON('facetime') },
	{ id: 'calendar', name: 'Calendario', icon: ICON('calendar') },
	{ id: 'contacts', name: 'Contactos', icon: ICON('contacts') },
	{ id: 'notes', name: 'Notas', icon: ICON('notes') },
	{ id: 'reminders', name: 'Recordatorios', icon: ICON('reminders') },
	{ id: 'music', name: 'Música', icon: ICON('music') },
	{ id: 'podcasts', name: 'Podcasts', icon: ICON('podcasts') },
	{ id: 'tv', name: 'TV', icon: ICON('tv') },
	{ id: 'news', name: 'Noticias', icon: ICON('news') },
	{ id: 'appstore', name: 'App Store', icon: ICON('appstore') },
	{ id: 'calculator', name: 'Calculadora', icon: ICON('calculator') },
	{ id: 'terminal', name: 'Terminal', icon: ICON('terminal'), dividerBefore: true },
	{ id: 'vscode', name: 'Código', icon: ICON('vscode') },
	{ id: 'settings', name: 'Ajustes', icon: ICON('system-preferences') }
];
