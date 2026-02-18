<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { theme } from '$lib/stores/theme.svelte';

	let { data } = $props();
	const currentTheme = $derived(theme.current);

	// Make metrics reactive using $derived to support language switching
	const metrics = $derived(
		data?.lang === 'ar'
			? [
					{
						value: 'مثبت',
						label: 'التميز',
						color: 'brand-blue'
					},
					{
						value: 'موثوق',
						label: 'النتائج',
						color: 'brand-orange'
					},
					{
						value: 'جودة',
						label: 'التسليم',
						color: 'brand-blue'
					},
					{
						value: 'متاح',
						label: 'على مدار الساعة',
						color: 'brand-orange'
					}
				]
			: [
					{
						value: 'Proven',
						label: 'Excellence',
						color: 'brand-blue'
					},
					{
						value: 'Trusted',
						label: 'Results',
						color: 'brand-orange'
					},
					{
						value: 'Quality',
						label: 'Delivery',
						color: 'brand-blue'
					},
					{
						value: 'Always',
						label: 'Available',
						color: 'brand-orange'
					}
				]
	);

	onMount(() => {
		const cards = document.querySelectorAll('.metric-card');
		cards.forEach((card) => {
			const glow = card.querySelector('.card-glow') as HTMLElement;
			const xTo = gsap.quickTo(card, 'x', { duration: 0.6, ease: 'power2.out' });
			const yTo = gsap.quickTo(card, 'y', { duration: 0.6, ease: 'power2.out' });

			card.addEventListener('mousemove', (e: Event) => {
				const mouseEvent = e as MouseEvent;
				const rect = (card as HTMLElement).getBoundingClientRect();
				const x = mouseEvent.clientX - rect.left;
				const y = mouseEvent.clientY - rect.top;

				const centerX = rect.width / 2;
				const centerY = rect.height / 2;

				const moveX = (x - centerX) * 0.15;
				const moveY = (y - centerY) * 0.15;

				xTo(moveX);
				yTo(moveY);

				if (glow) {
					gsap.to(glow, {
						left: x,
						top: y,
						opacity: 1,
						duration: 0.3
					});
				}
			});

			card.addEventListener('mouseleave', () => {
				xTo(0);
				yTo(0);
				if (glow) {
					gsap.to(glow, {
						opacity: 0,
						duration: 0.3
					});
				}
			});
		});
	});
</script>

<!-- Metrics Band -->
<section
	class="relative overflow-hidden bg-[var(--color-background)] py-12 transition-colors duration-1000"
>
	<!-- Subtle background glow -->
	<div
		class="absolute top-1/2 left-1/2 h-px w-full -translate-x-1/2 -translate-y-1/2 bg-[var(--glass-border)] opacity-30"
	></div>

	<div class="relative z-10 mx-auto max-w-7xl px-6">
		<div class="grid grid-cols-2 gap-6 md:grid-cols-4">
			{#each metrics as metric}
				<div
					class="metric-card group cinematic-glass relative flex flex-col items-center overflow-hidden rounded-[2rem] border border-[var(--glass-border)] bg-[var(--color-surface)] p-8 text-center"
				>
					<!-- Dynamic Spotlight Glow -->
					<div
						class="card-glow absolute bg-{metric.color}/10 pointer-events-none h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-[60px]"
					></div>

					<div class="relative z-10 space-y-2">
						<div
							class="text-3xl font-black text-[var(--color-text-base)] md:text-4xl group-hover:text-{metric.color} transition-colors duration-500"
						>
							{metric.value}
						</div>
						<div
							class="text-[10px] font-black tracking-[0.2em] text-[var(--color-text-muted)] uppercase opacity-40"
						>
							{metric.label}
						</div>
					</div>

					<!-- Bottom Accent Line -->
					<div
						class="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full bg-{metric.color} shadow-[0_0_15px_rgba(0,119,255,0.3)] transition-all duration-700"
					></div>
				</div>
			{/each}
		</div>
	</div>
</section>
