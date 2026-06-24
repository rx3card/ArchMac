const apple_menu = {
	title: 'apple',
	menu: {
		'about-this-mac': {
			title: 'Acerca de ArchMac',
			breakAfter: true,
		},
		'system-preferences': {
			title: 'Ajustes del Sistema…',
		},
		'app-store': {
			title: 'App Store…',
			breakAfter: true,
		},
		'install-archmac': {
			title: 'Instalar ArchMac…',
		},
		recovery: {
			title: 'Reiniciar en Recovery',
			breakAfter: true,
		},
		'force-quit': {
			title: 'Forzar salida…',
			breakAfter: true,
		},
		sleep: {
			title: 'Reposo',
		},
		restart: {
			title: 'Reiniciar…',
		},
		shutdown: {
			title: 'Apagar…',
			breakAfter: true,
		},
		'lock-screen': {
			title: 'Bloquear pantalla',
		},
		logout: {
			title: 'Cerrar sesión…',
		},
	},
};

export const create_menu_config = <T extends {}>(et: T) => ({ apple: apple_menu, ...et });
