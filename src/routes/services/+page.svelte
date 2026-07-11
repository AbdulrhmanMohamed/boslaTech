<script lang="ts">
	import { theme } from '$lib/stores/theme.svelte';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import {
		ArrowRight, Sparkles, Code, Search, Share,
		ClipboardList, Globe, TrendingUp, ChevronDown
	} from '@lucide/svelte';
	import HeroBackground from '$lib/components/HeroBackground.svelte';
	import CtaSection from '$lib/components/CtaSection.svelte';

	let { data } = $props();
	const currentTheme = $derived(theme.current);
	const typedData = data as any;
	const pageData = typedData?.servicesPage;
	const lang = typedData?.lang || 'ar';

	const categoryIcons: Record<string, any> = {
		code: Code, search: Search, share: Share
	};

	const processIcons: Record<string, any> = {
		search: Search, 'clipboard-list': ClipboardList,
		code: Code, globe: Globe, 'trending-up': TrendingUp
	};

	let openFaqIndex = $state<number | null>(null);

	function toggleFaq(i: number) {
		openFaqIndex = openFaqIndex === i ? null : i;
	}

	function catPath(slug: string) {
		return `${base}/services/${slug}?lang=${lang}`;
	}

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		const animEls = document.querySelectorAll('.anim-up');
		animEls.forEach((el, i) => {
			gsap.from(el, {
				scrollTrigger: { trigger: el, start: 'top 85%' },
				opacity: 0, y: 40, duration: 0.7, delay: i * 0.08, ease: 'power3.out'
			});
		});
	});
</script>

<svelte:head>
	<title>{pageData?.title || 'Services'} — {typedData?.site?.siteName || 'BOSLA'}</title>
	<meta name="description" content={pageData?.subtitle ? pageData.subtitle.slice(0, 155) : ''} />
	<script type="application/ld+json">
		{JSON.stringify({
			"@context": "https://schema.org",
			"@type": "FAQPage",
			"mainEntity": (pageData?.faq?.items || []).map((item: any) => ({
				"@type": "Question",
				"name": item.q,
				"acceptedAnswer": { "@type": "Answer", "text": item.a }
			}))
		})}
	</script>
</svelte:head>

<!-- Hero -->
<section class="relative flex min-h-[60vh] w-full items-center justify-center overflow-hidden transition-colors duration-1000" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
	<HeroBackground />
	<div class="relative z-10 container mx-auto px-6 py-24">
		<div class="mx-auto max-w-4xl space-y-8 text-center">
			<div class="cinematic-glass mb-4 inline-flex items-center gap-3 rounded-full border border-[var(--glass-border)] px-6 py-2">
				<Sparkles class="h-4 w-4 text-brand-orange" />
				<span class="text-xs font-black tracking-widest text-[var(--color-text-muted)] uppercase">
					{lang === 'ar' ? 'خدماتنا' : 'Our Services'}
				</span>
			</div>
			<h1 class="text-6xl leading-tight font-black text-[var(--color-text-base)] md:text-7xl">
				{pageData?.title || (lang === 'ar' ? 'خدماتنا' : 'Our Services')}
			</h1>
			<p class="mx-auto max-w-2xl text-xl leading-relaxed font-medium text-[var(--color-text-muted)] md:text-2xl">
				{pageData?.subtitle || ''}
			</p>
		</div>
	</div>
</section>

<!-- Process Section -->
<section class="relative w-full bg-[var(--color-background)] py-24 transition-colors duration-1000" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
	<div class="container mx-auto px-6">
		<div class="mx-auto mb-16 max-w-3xl text-center">
			<h2 class="anim-up text-4xl font-black text-[var(--color-text-base)] md:text-5xl">
				{pageData?.process?.title || (lang === 'ar' ? 'كيف نعمل' : 'How We Work')}
			</h2>
			<p class="anim-up mt-4 text-lg font-medium text-[var(--color-text-muted)]">
				{pageData?.process?.subtitle || ''}
			</p>
		</div>

		<div class="relative grid gap-6 md:grid-cols-5">
			{#each pageData?.process?.steps || [] as step, i}
				<div class="anim-up cinematic-glass group relative overflow-hidden rounded-2xl border border-[var(--glass-border)] p-6 text-center">
					<div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
						<svelte:component this={processIcons[step.icon] || Code} class="h-6 w-6" />
					</div>
					<div class="absolute top-3 right-3 text-[10px] font-black text-[var(--color-text-dim)] opacity-30">
						0{i + 1}
					</div>
					<h3 class="mb-2 text-lg font-black text-[var(--color-text-base)]">{step.title}</h3>
					<p class="text-sm leading-relaxed font-medium text-[var(--color-text-muted)]">{step.desc}</p>
					{#if i < (pageData?.process?.steps?.length || 0) - 1}
						<div class="absolute top-1/2 -left-3 hidden h-px w-6 bg-gradient-to-r from-transparent via-brand-blue/30 to-transparent md:block"></div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Service Categories -->
<section class="relative w-full bg-[var(--color-background)] py-24 transition-colors duration-1000" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
	<div class="container mx-auto px-6">
		<div class="space-y-24">
			{#each pageData?.categories || [] as category, ci}
				<div class="anim-up grid items-start gap-12 md:grid-cols-2">
					<div>
						<div class="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue">
							<svelte:component this={categoryIcons[category.icon] || Code} class="h-8 w-8" />
						</div>
						<h2 class="mb-4 text-3xl font-black text-[var(--color-text-base)] md:text-4xl">
							{category.name}
						</h2>
						<p class="mb-6 text-base leading-relaxed font-medium text-[var(--color-text-muted)]">
							{category.description}
						</p>
						<a
							href={catPath(category.slug)}
							class="inline-flex items-center gap-2 rounded-full bg-brand-blue px-6 py-3 text-sm font-bold text-white transition-all hover:scale-105"
						>
							{category.cta || (lang === 'ar' ? 'اكتشف المزيد' : 'Learn More')}
							<ArrowRight class="h-4 w-4" />
						</a>
					</div>

					<div class="space-y-4">
						{#each category.items || [] as item}
							<div class="rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-highlight)] p-6 transition-all hover:border-brand-blue/30">
								<h3 class="mb-2 text-xl font-bold text-[var(--color-text-base)]">{item.title}</h3>
								<p class="text-sm leading-relaxed font-medium text-[var(--color-text-muted)]">{item.details}</p>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- FAQ -->
<section class="relative w-full bg-[var(--color-background)] py-24 transition-colors duration-1000" id="faq" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
	<div class="container mx-auto px-6">
		<div class="mx-auto mb-16 max-w-3xl text-center">
			<h2 class="anim-up text-4xl font-black text-[var(--color-text-base)] md:text-5xl">
				{pageData?.faq?.title || (lang === 'ar' ? 'الأسئلة الشائعة' : 'FAQ')}
			</h2>
		</div>
		<div class="mx-auto max-w-3xl space-y-4">
			{#each pageData?.faq?.items || [] as item, i}
			<div
				class="anim-up cinematic-glass cursor-pointer rounded-2xl border transition-all {openFaqIndex === i ? 'border-brand-blue/30' : 'border-[var(--glass-border)]'}"
				onclick={() => toggleFaq(i)}
					onkeydown={(e) => e.key === 'Enter' && toggleFaq(i)}
					role="button"
					tabindex="0"
					aria-expanded={openFaqIndex === i}
				>
					<div class="flex items-center justify-between px-6 py-5">
						<h3 class="text-base font-bold text-[var(--color-text-base)]">{item.q}</h3>
			<ChevronDown
				class="h-5 w-5 shrink-0 text-[var(--color-text-dim)] transition-transform duration-300 {openFaqIndex === i ? 'rotate-180' : ''}"
			/>
					</div>
					{#if openFaqIndex === i}
						<div class="border-t border-[var(--glass-border)] px-6 py-5">
							<p class="text-sm leading-relaxed font-medium text-[var(--color-text-muted)]">{item.a}</p>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- CTA -->
<div class="bg-[var(--color-background)] transition-colors duration-1000">
	<CtaSection {data} />
</div>
