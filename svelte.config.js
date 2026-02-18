import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		// adapter-static for static site deployment
		adapter: adapter({
			// Generate static HTML files for each route
			pages: 'dist',
			assets: 'dist',
			fallback: 'index.html', // SPA fallback for client-side routing
			precompress: false,
			strict: true
		}),
		// Handle prerendering errors gracefully
		prerender: {
			handleHttpError: ({ path, referrer, message }) => {
				// Ignore 404 errors during prerendering
				if (message.includes('404')) {
					console.warn(`Ignoring 404 error for ${path}`);
					return;
				}
				// For other errors, throw as normal
				throw new Error(message);
			}
		},
		alias: {
			$components: 'src/lib/components',
			$assets: 'src/lib/assets',
			$utils: 'src/lib/utils',
			$styles: 'src/lib/styles',
			$routes: 'src/routes',
			$static: 'static'
		},
		paths: {
			base: '/bosla-new'
		}
	}
};

export default config;
