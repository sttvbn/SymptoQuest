import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	envPrefix: 'VITE_',
	ssr: {noExternal: ['@googlemaps/js-api-loader']}
});
