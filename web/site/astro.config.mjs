// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// Sitio oficial + wiki de ArchMac.
// El diseño se controla desde src/styles/custom.css (tokens en design/tokens/).
export default defineConfig({
	site: 'https://archmac.vercel.app',
	// En desarrollo, /demo/ se sirve desde el dev server de la simulación (puerto 5173).
	// En producción no hace falta: build:all copia la demo dentro de dist/demo.
	vite: {
		server: {
			proxy: {
				'/demo': 'http://localhost:5173',
			},
		},
	},
	integrations: [
		starlight({
			title: 'ArchMac',
			description:
				'Distribución Linux basada en Arch con una experiencia de escritorio premium.',
			defaultLocale: 'root',
			locales: {
				root: { label: 'Español', lang: 'es' },
			},
			customCss: ['@fontsource-variable/inter', './src/styles/custom.css'],
			sidebar: [
				{ label: 'Ver demo', link: '/demo/', attrs: { class: 'demo-link' } },
				{ label: 'Empezar', items: [{ autogenerate: { directory: 'empezar' } }] },
				{ label: 'Escritorio', items: [{ autogenerate: { directory: 'escritorio' } }] },
				{ label: 'Aplicaciones', items: [{ autogenerate: { directory: 'aplicaciones' } }] },
				{
					label: 'Personalización',
					items: [{ autogenerate: { directory: 'personalizacion' } }],
				},
				{ label: 'Hardware', items: [{ autogenerate: { directory: 'hardware' } }] },
				{ label: 'Energía y batería', items: [{ autogenerate: { directory: 'energia' } }] },
				{ label: 'Redes', items: [{ autogenerate: { directory: 'redes' } }] },
				{
					label: 'Solución de problemas',
					items: [{ autogenerate: { directory: 'solucion-de-problemas' } }],
				},
				{ label: 'Desarrollo', items: [{ autogenerate: { directory: 'desarrollo' } }] },
				{
					label: 'Proyecto',
					items: [
						{ label: 'Preguntas frecuentes', link: '/faq/' },
						{ label: 'Notas de versión', link: '/notas-de-version/' },
					],
				},
			],
		}),
	],
});
