<script lang="ts">
	import { theme } from '$lib/stores/theme.svelte';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import { ArrowRight, Sparkles, Code, Search, Share } from '@lucide/svelte';
	import HeroBackground from '$lib/components/HeroBackground.svelte';
	import CtaSection from '$lib/components/CtaSection.svelte';

	let { data } = $props();
	const currentTheme = $derived(theme.current);
	const typedData = data as any;
	const pageData = typedData?.servicesPage;

	const categoryIcons: Record<string, any> = {
		code: Code,
		search: Search,
		share: Share
	};

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		const cards = document.querySelectorAll('.service-category-card');
		cards.forEach((card, i) => {
			gsap.from(card, {
				scrollTrigger: {
					trigger: card,
					start: 'top 85%'
				},
				opacity: 0,
				y: 40,
				duration: 0.8,
				delay: i * 0.15,
				ease: 'power3.out'
			});
		});
	});
</script>

<svelte:head>
	<title>{pageData?.title || 'Services'} | BOSLA</title>
</svelte:head>

<!-- Hero Section -->
<section
	class="relative flex min-h-[60vh] w-full items-center justify-center overflow-hidden transition-colors duration-1000"
	dir={typedData?.lang === 'ar' ? 'rtl' : 'ltr'}
>
	<HeroBackground />

	<div class="relative z-10 container mx-auto px-6 py-24">
		<div class="mx-auto max-w-4xl space-y-8 text-center">
			<div
				class="cinematic-glass mb-4 inline-flex items-center gap-3 rounded-full border border-[var(--glass-border)] px-6 py-2"
			>
				<Sparkles class="h-4 w-4 text-brand-orange" />
				<span class="text-xs font-black tracking-widest text-[var(--color-text-muted)] uppercase">
					{typedData?.lang === 'ar' ? 'خدماتنا' : 'Our Services'}
				</span>
			</div>

			<h1
				class="text-6xl leading-tight font-black text-[var(--color-text-base)] md:text-7xl"
			>
				{pageData?.title || (typedData?.lang === 'ar' ? 'خدماتنا' : 'Our Services')}
			</h1>

			<p
				class="mx-auto max-w-2xl text-xl leading-relaxed font-medium text-[var(--color-text-muted)] md:text-2xl"
			>
				{pageData?.subtitle || ''}
			</p>
		</div>
	</div>
</section>

<!-- Categories Section -->
<section
	class="relative w-full bg-[var(--color-background)] py-24 transition-colors duration-1000"
	dir={typedData?.lang === 'ar' ? 'rtl' : 'ltr'}
>
	<div class="container mx-auto px-6">
		<div class="grid gap-8 md:grid-cols-3">
			{#each pageData?.categories || [] as category, i}
				<div
					class="service-category-card cinematic-glass group relative overflow-hidden rounded-[2.5rem] border border-[var(--glass-border)] p-8"
				>
					<div
						class="card-glow pointer-events-none absolute h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-[80px]"
						style="background: {currentTheme === 'dark'
							? 'rgba(59, 130, 246, 0.15)'
							: 'rgba(59, 130, 246, 0.25)'}"
					></div>

					<div class="relative z-10">
						<div
							class="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue"
						>
							<svelte:component this={categoryIcons[category.icon] || Code} class="h-8 w-8" />
						</div>

						<h2 class="mb-6 text-2xl font-black text-[var(--color-text-base)]">
							{category.name}
						</h2>

						<div class="space-y-4">
							{#each category.items || [] as item}
								<div
									class="rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-highlight)] p-4 transition-all hover:border-brand-blue/30"
								>
									<h3 class="font-bold text-[var(--color-text-base)]">{item.title}</h3>
									<p class="mt-1 text-sm leading-relaxed font-medium text-[var(--color-text-muted)]">
										{item.desc}
									</p>
								</div>
							{/each}
						</div>
					</div>

					<div
						class="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-brand-blue to-transparent transition-all duration-700 group-hover:w-full"
					></div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- CTA -->
<div class="bg-[var(--color-background)] transition-colors duration-1000">
	<CtaSection {data} />
</div>
