import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		port: 3000,
		host: true,
		hmr: {
			overlay: false
		}
	},
	build: {
		chunkSizeWarningLimit: 600,
		minify: 'esbuild',
		target: 'es2020',
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes('node_modules/gsap')) return 'vendor-gsap';
					if (id.includes('node_modules/lenis')) return 'vendor-lenis';
					if (id.includes('node_modules/')) return 'vendor';
				}
			}
		}
	},
	optimizeDeps: {
		include: ['three', 'gsap', 'lenis']
	},
	esbuild: {
		legalComments: 'none'
	}
});
