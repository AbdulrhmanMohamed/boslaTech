<script lang="ts">
	import { theme } from '$lib/stores/theme.svelte';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import {
		ArrowRight, Sparkles, Code, Search, Share,
		ClipboardList, Globe, TrendingUp, ChevronDown,
		Pen, Settings, Rocket
	} from '@lucide/svelte';
	import HeroBackground from '$lib/components/HeroBackground.svelte';
	import CtaSection from '$lib/components/CtaSection.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';

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
		code: Code, globe: Globe, 'trending-up': TrendingUp,
		'pen-tool': Pen, settings: Settings, rocket: Rocket
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
		<div class="relative z-10 container mx-auto px-6 pt-36 pb-24">
		<div class="flex justify-center pb-4">
			<Breadcrumbs
				{lang}
				items={[
					{ label: lang === 'ar' ? 'خدماتنا' : 'Our Services' }
				]}
			/>
		</div>
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
						{#each [processIcons[step.icon] || Code] as Icon}
							<Icon class="h-6 w-6" />
						{/each}
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
		<div class="grid gap-8 md:grid-cols-3">
			{#each pageData?.categories || [] as category}
				<a href={catPath(category.slug)} class="anim-up group relative overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-highlight)] p-8 transition-all hover:-translate-y-1 hover:shadow-xl">
					<div class="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue transition-colors group-hover:bg-brand-blue group-hover:text-white">
						{#each [categoryIcons[category.icon] || Code] as Icon}
							<Icon class="h-7 w-7" />
						{/each}
					</div>
					<h2 class="mb-3 text-2xl font-black text-[var(--color-text-base)] group-hover:text-brand-blue">{category.name}</h2>
					<p class="mb-6 text-sm leading-relaxed font-medium text-[var(--color-text-muted)] line-clamp-3">{category.description}</p>
					<ul class="mb-6 space-y-2">
						{#each category.items?.slice(0, 4) || [] as item}
							<li class="flex items-start gap-2 text-sm text-[var(--color-text-muted)]">
								<span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-blue"></span>
								{item.title}
							</li>
						{/each}
						{#if (category.items?.length || 0) > 4}
							<li class="text-xs font-bold text-brand-blue">+{(category.items?.length || 0) - 4} {lang === 'ar' ? 'المزيد' : 'more'}</li>
						{/if}
					</ul>
					<div class="flex items-center gap-2 text-sm font-bold text-brand-blue transition-colors group-hover:text-brand-orange">
						{category.cta || (lang === 'ar' ? 'اكتشف المزيد' : 'Learn More')}
						<ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1 {lang === 'ar' ? 'rotate-180' : ''}" />
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- Demo Store Showcase -->
<section class="relative w-full bg-[var(--color-background)] pb-24 transition-colors duration-1000" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
	<div class="container mx-auto px-6">
		<a
			href="https://demo.boslatech.com"
			target="_blank"
			rel="noopener noreferrer"
			class="group relative mx-auto flex max-w-4xl flex-col items-center gap-6 overflow-hidden rounded-3xl border border-brand-blue/20 bg-brand-blue/[0.04] p-8 text-center transition-all duration-500 hover:-translate-y-1 hover:border-brand-blue/40 hover:shadow-xl md:flex-row md:justify-between md:text-start"
		>
			<div class="relative z-10">
				<span class="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-blue/20 bg-brand-blue/10 px-4 py-1.5 text-xs font-black text-brand-blue">
					<span class="relative flex h-2 w-2">
						<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-blue opacity-75"></span>
						<span class="relative inline-flex h-2 w-2 rounded-full bg-brand-blue"></span>
					</span>
					{lang === 'ar' ? 'نسخة تجريبية مباشرة' : 'Live demo'}
				</span>
				<h3 class="text-xl font-black text-[var(--color-text-base)] md:text-2xl">
					{lang === 'ar' ? 'شوف شغلنا على الطبيعة — متجر «أصل» للعطور' : 'See our work live — the ASL perfume store'}
				</h3>
				<p class="mx-auto mt-2 max-w-xl text-sm font-medium text-[var(--color-text-muted)] md:mx-0">
					{lang === 'ar'
						? 'متجر إلكتروني كامل: منتجات، سلة، ودفع — جرّبه بنفسك.'
						: 'A complete online store: products, cart, and checkout — try it yourself.'}
				</p>
			</div>
			<span class="relative z-10 inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-blue px-6 py-3 text-sm font-black text-white shadow-lg shadow-brand-blue/30 transition-transform duration-300 group-hover:scale-105">
				{lang === 'ar' ? 'افتح المتجر' : 'Open the store'}
				<ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1 {lang === 'ar' ? 'rotate-180' : ''}" />
			</span>
		</a>
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
