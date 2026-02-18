<script lang="ts">
	import { Menu, X } from '@lucide/svelte';
	import { toggleDrawer, getDrawerState } from '$lib/stores/drawer.svelte';

	const isOpen = $derived(getDrawerState());
</script>

<!-- Mobile Menu Button -->
<button
	class="cinematic-glass group relative flex items-center justify-center overflow-hidden rounded-2xl p-3 transition-all active:scale-90 md:hidden"
	onclick={toggleDrawer}
	aria-label="Toggle mobile menu"
>
	<div class="relative flex h-6 w-6 items-center justify-center">
		<div
			class="absolute transition-all duration-500 {isOpen
				? 'scale-50 rotate-90 opacity-0'
				: 'scale-100 rotate-0 opacity-100'}"
		>
			<Menu class="h-6 w-6 text-[var(--color-text-base)]" />
		</div>
		<div
			class="absolute transition-all duration-500 {isOpen
				? 'scale-100 rotate-0 opacity-100'
				: 'scale-50 -rotate-90 opacity-0'}"
		>
			<X class="h-6 w-6 text-[var(--color-text-base)]" />
		</div>
	</div>
</button>
