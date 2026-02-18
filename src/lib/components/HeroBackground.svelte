<script lang="ts">
	import { theme } from '$lib/stores/theme.svelte';

	const currentTheme = $derived(theme.current);
</script>

<div
	class="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden bg-[var(--color-background)] transition-colors duration-1000"
>
	<!-- Primary Blue Glow (Top-Left) - Radial gradient replaces blur for better performance -->
	<div
		class="animate-pulse-slow absolute -left-[10%] -top-[20%] h-[70vw] w-[70vw] rounded-full opacity-40 transition-all duration-1000"
		style="
      background: radial-gradient(circle, var(--color-brand-blue) 0%, rgba(0, 119, 255, 0.3) 30%, rgba(0, 119, 255, 0.1) 60%, transparent 80%); 
      mix-blend-mode: {currentTheme === 'light' ? 'multiply' : 'screen'};
    "
	></div>

	<!-- Secondary Orange Glow (Bottom-Right) - Radial gradient replaces blur for better performance -->
	<div
		class="animate-float-slow absolute -bottom-[20%] -right-[10%] h-[60vw] w-[60vw] rounded-full opacity-30 transition-all duration-1000"
		style="
      background: radial-gradient(circle, var(--color-brand-orange) 0%, rgba(255, 107, 0, 0.3) 30%, rgba(255, 107, 0, 0.1) 60%, transparent 80%); 
      mix-blend-mode: {currentTheme === 'light' ? 'multiply' : 'screen'}; 
      animation-delay: -2s;
    "
	></div>

	<!-- Accent Blue Glow (Center-Offset) - Radial gradient replaces blur for better performance -->
	<div
		class="animate-float-reverse absolute left-[30%] top-[30%] h-[40vw] w-[40vw] rounded-full opacity-20 transition-all duration-1000"
		style="
      background: radial-gradient(circle, var(--color-brand-blue-glow) 0%, rgba(0, 153, 255, 0.2) 40%, transparent 80%); 
      mix-blend-mode: {currentTheme === 'light' ? 'multiply' : 'screen'}; 
      animation-delay: -4s;
    "
	></div>

	<!-- Subtle Tech Grid Overlay -->
	<div
		class="absolute inset-0 opacity-[0.03]"
		style="
      background-image: linear-gradient(var(--color-text-base) 1px, transparent 1px), linear-gradient(90deg, var(--color-text-base) 1px, transparent 1px); 
      background-size: 40px 40px;
    "
	></div>

	<!-- Vignette / Fade Out -->
	<div
		class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--color-background)]"
	></div>
</div>

<style>
	@keyframes float-slow {
		0%,
		100% {
			transform: translate(0, 0);
		}
		50% {
			transform: translate(20px, -20px);
		}
	}
	@keyframes float-reverse {
		0%,
		100% {
			transform: translate(0, 0);
		}
		50% {
			transform: translate(-20px, 20px);
		}
	}
	@keyframes pulse-slow {
		0%,
		100% {
			opacity: 0.4;
			transform: scale(1);
		}
		50% {
			opacity: 0.3;
			transform: scale(1.05);
		}
	}

	.animate-float-slow {
		animation: float-slow 10s ease-in-out infinite;
	}
	.animate-float-reverse {
		animation: float-reverse 12s ease-in-out infinite;
	}
	.animate-pulse-slow {
		animation: pulse-slow 8s ease-in-out infinite;
	}
</style>
