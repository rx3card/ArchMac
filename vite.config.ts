import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

const useFrontendProxy = process.env.ARCHMAC_FRONTEND_PROXY === '1';

export default defineConfig({
	plugins: [svelte()],
	server: {
		port: 3000,
		proxy: useFrontendProxy
			? {
					'/frontend': {
						target: 'http://localhost:5173',
						changeOrigin: true,
					},
				}
			: undefined,
	},
});
