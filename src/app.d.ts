// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
			home: import('./lib/types').Home;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};

declare module '@lucide/svelte';
declare module '@lucide/svelte/icons/*';
