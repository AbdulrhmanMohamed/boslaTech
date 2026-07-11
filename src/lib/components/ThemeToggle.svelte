<script lang="ts">
	import { theme } from '$lib/stores/theme.svelte';
	import { Sun, Moon } from '@lucide/svelte';
	import { gsap } from 'gsap';
	import { fly } from 'svelte/transition';

	let btn = $state<HTMLButtonElement>();

	function handleToggle() {
		if (!btn) return;

		// Quick premium feedback
		gsap.to(btn, {
			scale: 0.9,
			duration: 0.1,
			yoyo: true,
			repeat: 1,
			ease: 'power2.inOut',
			onComplete: () => theme.toggleTheme()
		});
	}
</script>

<button
	bind:this={btn}
	onclick={handleToggle}
	class="cinematic-glass group pointer-events-auto relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
	aria-label="Toggle Theme"
>
	<div class="relative h-5 w-5">
		{#if theme.current === 'dark'}
			<div class="absolute inset-0 text-yellow-400" transition:fly={{ y: 10, duration: 400 }}>
				<Sun size={20} strokeWidth={2.5} />
			</div>
		{:else}
			<div class="absolute inset-0 text-brand-blue" transition:fly={{ y: -10, duration: 400 }}>
				<Moon size={20} strokeWidth={2.5} />
			</div>
		{/if}
	</div>

	<!-- Magnetic Glow Effect -->
	<div
		class="absolute inset-0 bg-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
	></div>
</button>
