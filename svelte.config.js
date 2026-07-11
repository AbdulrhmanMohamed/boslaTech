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
			entries: [
				'/',
				'/about',
				'/services',
				'/services/web-development',
				'/services/seo',
				'/services/digital-marketing',
				'/contact',
				'/sitemap.xml',
				'/services/web-development/custom-websites',
				'/services/web-development/wordpress-development',
				'/services/web-development/online-stores',
				'/services/web-development/website-redesign',
				'/services/web-development/maintenance-and-support',
				'/services/seo/technical-seo',
				'/services/seo/content-seo',
				'/services/seo/local-seo',
				'/services/seo/link-building',
				'/services/seo/seo-audit',
				'/services/seo/ecommerce-seo',
				'/services/digital-marketing/social-media-marketing',
				'/services/digital-marketing/google-ads',
				'/services/digital-marketing/content-marketing',
				'/services/digital-marketing/snapchat-tiktok-ads',
				'/services/digital-marketing/email-marketing',
				'/services/digital-marketing/brand-identity',
				'/locations/riyadh',
				'/locations/jeddah',
				'/locations/dammam',
				'/locations/khobar',
				'/locations/mecca',
				'/locations/medina',
			],
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
			base: ''
		}
	}
};

export default config;
