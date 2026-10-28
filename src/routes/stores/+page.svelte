<script lang="ts">
	import { inView } from '$lib/actions/inView';
	import {
		Check,
		ChevronDown,
		X,
		ExternalLink,
		Star,
		ShieldCheck,
		GraduationCap,
		Headphones,
		Wallet,
		CalendarClock,
		ShoppingCart,
		Settings2,
		Percent,
		Smartphone,
		Truck
	} from '@lucide/svelte';
	import OfferCountdown from '$lib/components/OfferCountdown.svelte';
	import { STORE_PACKAGES, OFFER_DEADLINE } from '$lib/data/pricing';
	import { pricing } from '$lib/stores/pricing.svelte';
	import { base } from '$app/paths';

	let { data }: { data: any } = $props();

	const lang = $derived(data.lang as 'en' | 'ar');
	const t = $derived((data as any).stores);
	const waPhone = '966576944605';

	const waUrl = (msg: string) => `https://wa.me/${waPhone}?text=${encodeURIComponent(msg)}`;

	const waPrimary = $derived(waUrl(t?.hero?.waMsg));

	const storePkgs = $derived([STORE_PACKAGES[0], STORE_PACKAGES[1]]);

	const pkgDisplay = $derived(
		storePkgs.map((p) => ({
			id: p.id,
			name: p.name[lang] as string,
			subtitle: p.description[lang] as string,
			features: p.features[lang] as string[],
			original: pricing.displayOriginal(p.originalPrice),
			sale: pricing.displaySalePrice(p.originalPrice, p.salePercent),
			delivery:
				p.id === 'store-standard'
					? lang === 'ar'
						? 'أسبوع'
						: '1 week'
					: lang === 'ar'
						? '10 أيام'
						: '10 days',
			popular: !!p.popular,
			href: waUrl(`${(t?.packages?.waMsg || '')} ${p.name[lang]}`)
		}))
	);

	const offerEndDate = $derived(
		new Intl.DateTimeFormat(lang === 'ar' ? 'ar-SA' : 'en-GB', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		}).format(new Date(OFFER_DEADLINE))
	);

	const guaranteeIcons = [Wallet, CalendarClock, GraduationCap, Headphones];
	const featureIcons = [Settings2, ShoppingCart, Percent, ShieldCheck, Truck, Smartphone];

	const faqSchema = $derived({
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: ((data as any).stores?.faq?.items || []).map((f: { q: string; a: string }) => ({
			'@type': 'Question',
			name: f.q,
			acceptedAnswer: { '@type': 'Answer', text: f.a }
		}))
	});

	const serviceSchema = $derived({
		'@context': 'https://schema.org',
		'@type': 'Service',
		name: lang === 'ar' ? 'تطوير المتاجر الإلكترونية' : 'Online Store Development',
		description: (data as any).stores?.metaDesc,
		provider: {
			'@type': 'LocalBusiness',
			name: 'مؤسسة حافة النجوم',
			telephone: '+966576944605'
		},
		areaServed: 'SA'
	});
</script>

<svelte:head>
	<title>{(data as any).stores?.title}</title>
	<meta name="description" content={(data as any).stores?.metaDesc} />
	{@html `<script type="application/ld+json">${JSON.stringify(serviceSchema).replaceAll('<', '\\u003c')}</script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(faqSchema).replaceAll('<', '\\u003c')}</script>`}
</svelte:head>

<div class="relative" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
	<!-- 1. Hero -->
	<section class="relative overflow-hidden py-24">
		<div
			class="absolute inset-0 opacity-[0.04]"
			style="background-image: radial-gradient(#000000 1px, transparent 1px); background-size: 32px 32px;"
		></div>
		<div class="container relative z-10 mx-auto px-6 text-center">
			<div
				use:inView
				class="mx-auto mb-8 inline-flex flex-wrap items-center justify-center gap-4 rounded-full border border-brand-blue/30 bg-brand-blue/10 px-6 py-3"
			>
				<span
					class="text-xs font-black tracking-widest text-[var(--color-text-base)] uppercase opacity-90"
				>
					{t?.hero?.badge}
				</span>
				<span class="opacity-60">·</span>
				<OfferCountdown {lang} />
			</div>

			<h1
				class="mx-auto max-w-4xl text-4xl leading-[1.15] font-black tracking-tight text-[var(--color-text-base)] md:text-6xl"
			>
				{t?.hero?.headline}
			</h1>
			<p
				class="mx-auto mt-6 max-w-2xl text-xl leading-relaxed font-medium text-[var(--color-text-muted)] md:text-2xl"
			>
				{t?.hero?.sub}
			</p>

			<div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
				<a
					href={waPrimary}
					target="_blank"
					rel="noopener noreferrer"
					use:inView
					class="group relative w-full overflow-hidden rounded-full bg-brand-blue px-10 py-5 text-center text-base font-black tracking-widest text-white uppercase shadow-[0_20px_50px_rgba(0,119,255,0.35)] transition-transform duration-500 hover:-translate-y-1 sm:w-auto [&.in-view]:-translate-y-1"
				>
					{t?.hero?.ctaPrimary}
				</a>
				<a
					href="#demo"
					use:inView
					class="w-full rounded-full border border-[var(--glass-border)] bg-[var(--glass-highlight)] px-10 py-5 text-center text-base font-black tracking-widest text-[var(--color-text-base)] uppercase transition-all duration-500 hover:-translate-y-1 hover:border-brand-blue/40 sm:w-auto [&.in-view]:-translate-y-1"
				>
					{t?.hero?.ctaSecondary}
				</a>
			</div>
		</div>
	</section>

	<!-- 2. Compare -->
	<section class="relative py-24">
		<div class="container mx-auto px-6">
			<div class="mb-16 text-center">
				<h2 class="text-4xl font-black tracking-tight text-[var(--color-text-base)] md:text-5xl">
					{t?.compare?.title}
				</h2>
				<p class="mx-auto mt-4 max-w-xl font-medium text-[var(--color-text-muted)]">
					{t?.compare?.subtitle}
				</p>
			</div>
			<div
				use:inView
				class="cinematic-glass mx-auto max-w-5xl overflow-hidden rounded-[3rem] border border-[var(--glass-border)]"
			>
				<!-- table head -->
				<div class="grid grid-cols-3 border-b border-[var(--glass-border)]">
					<div class="p-5"></div>
					<div class="p-5 text-center text-sm font-black text-brand-blue md:text-base">
						{t?.compare?.col1}
					</div>
					<div class="p-5 text-center text-xs font-bold text-[var(--color-text-dim)] md:text-sm opacity-60">
						{t?.compare?.col2}
					</div>
				</div>
				{#each t?.compare?.rows || [] as row}
					<div class="grid grid-cols-3 border-b border-[var(--glass-border)] last:border-b-0">
						<div class="p-5 text-xs font-black text-[var(--color-text-base)] md:text-sm">
							{row.label}
						</div>
						<div class="flex items-start gap-2 p-5 text-sm font-medium text-[var(--color-text-base)] md:text-base">
							<Check class="mt-1 h-4 w-4 shrink-0 text-brand-blue" />
							<span>{row.with}</span>
						</div>
						<div class="flex items-start gap-2 p-5 text-xs font-medium text-[var(--color-text-muted)] opacity-70 md:text-sm">
							<X class="mt-0.5 h-4 w-4 shrink-0 opacity-50" />
							<span>{row.without}</span>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- 3. Features -->
	<section class="relative py-24">
		<div class="container mx-auto px-6">
			<div class="mb-16 text-center">
				<h2 class="text-4xl font-black tracking-tight text-[var(--color-text-base)] md:text-5xl">
					{t?.features?.title}
				</h2>
			</div>
			<div class="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each t?.features?.items || [] as feat, i}
					{@const Icon = featureIcons[i]}
					<div
						use:inView
						class="obsidian-card group relative flex flex-col gap-4 overflow-hidden rounded-[2rem] border border-[var(--glass-border)] p-8 transition-[border-color] hover:border-brand-blue/30 [&.in-view]:border-brand-blue/30"
					>
						<div
							class="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue transition-transform group-hover:scale-110 [&.in-view]:scale-110"
						>
							<Icon class="h-6 w-6" />
						</div>
						<h3 class="text-lg font-black text-[var(--color-text-base)]">{feat.title}</h3>
						<p class="leading-relaxed font-medium text-[var(--color-text-muted)]">{feat.text}</p>
					</div>
				{/each}
			</div>
			{#if t?.features?.note}
				<p class="mt-8 text-center text-xs font-bold text-[var(--color-text-dim)] opacity-60">
					{t?.features?.note}
				</p>
			{/if}
		</div>
	</section>

	<!-- 4. Demo -->
	<section id="demo" class="relative py-24">
		<div class="container mx-auto px-6">
			<div
				use:inView
				class="cinematic-glass relative mx-auto max-w-4xl overflow-hidden rounded-[3rem] border border-[var(--glass-border)] p-10 text-center md:p-16"
			>
				<h2 class="text-3xl font-black tracking-tight text-[var(--color-text-base)] md:text-4xl">
					{t?.demo?.title}
				</h2>
				<p class="mx-auto mt-4 max-w-xl leading-relaxed font-medium text-[var(--color-text-muted)]">
					{t?.demo?.text}
				</p>
				<a
					href={t?.demo?.url}
					target="_blank"
					rel="noopener noreferrer"
					class="group mt-8 inline-flex items-center gap-2 rounded-full bg-brand-orange px-10 py-5 text-base font-black tracking-widest text-white uppercase shadow-[0_20px_50px_rgba(255,107,0,0.3)] transition-transform duration-500 hover:-translate-y-1"
				>
					{t?.demo?.button}
					<ExternalLink class="h-4 w-4 transition-transform group-hover:translate-y-1" />
				</a>
				<p class="mt-4 text-xs font-bold text-[var(--color-text-dim)] opacity-60">
					{t?.demo?.small}
				</p>
			</div>
		</div>
	</section>

	<!-- 5. Steps -->
	<section class="relative py-24">
		<div class="container mx-auto px-6">
			<div class="mb-16 text-center">
				<h2 class="text-4xl font-black tracking-tight text-[var(--color-text-base)] md:text-5xl">
					{t?.steps?.title}
				</h2>
			</div>
			<div class="mx-auto grid max-w-5xl gap-6 md:grid-cols-4">
				{#each t?.steps?.items || [] as step, i}
					<div
						use:inView
						class="obsidian-card relative rounded-[2rem] border border-[var(--glass-border)] p-8"
					>
						<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue/15 text-xl font-black text-brand-blue">
							{String(i + 1).padStart(2, '0')}
						</div>
						<p class="leading-relaxed font-bold text-[var(--color-text-base)]">{step}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- 6. Store Packages -->
	<section id="pricing" class="relative py-24">
		<div class="container mx-auto px-6">
			<div class="mb-12 text-center">
				<h2 class="text-4xl font-black tracking-tight text-[var(--color-text-base)] md:text-5xl">
					{t?.packages?.title}
				</h2>
				<div class="mx-auto mt-6 inline-flex flex-wrap items-center justify-center gap-4 rounded-full border border-brand-orange/30 bg-brand-orange/10 px-6 py-3">
					<span class="text-xs font-black tracking-widest text-[var(--color-text-base)] uppercase">
						{t?.packages?.offerText} {offerEndDate}
					</span>
					<span class="opacity-60">·</span>
					<OfferCountdown {lang} />
				</div>
			</div>

			<div class="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
				{#each pkgDisplay as pkg}
					<div
						use:inView
						class="cinematic-glass relative overflow-hidden rounded-[2.5rem] border p-8 {pkg.popular
							? 'border-brand-blue/40 shadow-[0_20px_60px_rgba(0,119,255,0.15)]'
							: 'border-[var(--glass-border)]'}"
					>
						{#if pkg.popular}
							<div class="absolute top-6 right-6 z-20">
								<div class="inline-flex animate-pulse items-center gap-2 rounded-full bg-brand-orange px-4 py-1.5 text-[10px] font-black tracking-widest text-white uppercase shadow-xl shadow-brand-orange/20">
									<Star class="h-3 w-3" />
									{lang === 'ar' ? 'الأكثر طلباً' : 'Most Popular'}
								</div>
							</div>
						{/if}

						<h3 class="text-2xl font-black text-[var(--color-text-base)]">{pkg.name}</h3>
						<p class="mt-2 font-medium text-[var(--color-text-muted)]">{pkg.subtitle}</p>

						<div class="mt-6 flex items-end gap-3">
							<span class="text-4xl font-black tracking-tight text-brand-blue">{pkg.sale}</span>
							<span class="pb-1 text-sm font-bold text-[var(--color-text-dim)] line-through opacity-50">
								{pkg.original}
							</span>
						</div>
						<div class="mt-1 text-xs font-bold text-[var(--color-text-dim)]">
							{t?.packages?.deliveryLabel}: {pkg.delivery}
						</div>

						<ul class="mt-6 space-y-3">
							{#each pkg.features as feat}
								<li class="flex items-start gap-2 font-medium text-[var(--color-text-muted)]">
									<Check class="mt-1 h-4 w-4 shrink-0 text-brand-blue" />
									<span>{feat}</span>
								</li>
							{/each}
						</ul>

						<a
							href={pkg.href}
							target="_blank"
							rel="noopener noreferrer"
							class="mt-8 block rounded-2xl bg-brand-blue px-6 py-4 text-center text-sm font-black tracking-widest text-white uppercase shadow-[0_15px_40px_rgba(0,119,255,0.3)] transition-transform duration-500 hover:-translate-y-1"
						>
							{t?.packages?.cta}
						</a>
					</div>
				{/each}
			</div>
			{#if t?.packages?.customHint}
				<p class="mt-8 text-center font-medium text-[var(--color-text-muted)]">
					{t?.packages?.customHint}
					<a
						href={waPrimary}
						target="_blank"
						rel="noopener noreferrer"
						class="font-black text-brand-blue underline decoration-from-font underline-offset-2 hover:text-brand-orange"
					>
						{lang === 'ar' ? 'كلمنا واتساب' : 'WhatsApp us'}
					</a>
				</p>
			{/if}
		</div>
	</section>

	<!-- 7. Guarantees -->
	<section class="relative py-24">
		<div class="container mx-auto px-6">
			<div class="mb-16 text-center">
				<h2 class="text-4xl font-black tracking-tight text-[var(--color-text-base)] md:text-5xl">
					{t?.guarantees?.title}
				</h2>
			</div>
			<div class="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-4">
				{#each t?.guarantees?.items || [] as g, i}
					{@const Icon = guaranteeIcons[i]}
					<div
						use:inView
						class="obsidian-card flex flex-col gap-4 rounded-[2rem] border border-[var(--glass-border)] p-8"
					>
						<div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-orange/10 text-brand-orange">
							<Icon class="h-6 w-6" />
						</div>
						<div>
							<h3 class="mb-1 font-black text-[var(--color-text-base)]">{g.title}</h3>
							<p class="text-sm leading-relaxed font-medium text-[var(--color-text-muted)]">{g.text}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- 8. FAQ -->
	<section class="relative py-24">
		<div class="container mx-auto px-6">
			<div class="mb-12 text-center">
				<h2 class="text-4xl font-black tracking-tight text-[var(--color-text-base)] md:text-5xl">
					{t?.faq?.title}
				</h2>
			</div>
			<div class="mx-auto max-w-3xl space-y-4">
				{#each t?.faq?.items || [] as f}
					<details class="cinematic-glass group rounded-3xl border border-[var(--glass-border)] p-6">
						<summary class="flex cursor-pointer items-center justify-between gap-4 font-black text-[var(--color-text-base)] marker:content-none">
							{f.q}
							<ChevronDown class="h-5 w-5 shrink-0 text-[var(--color-text-dim)] transition-transform group-open:rotate-180" />
						</summary>
						<p class="mt-4 leading-relaxed font-medium text-[var(--color-text-muted)]">{f.a}</p>
					</details>
				{/each}
			</div>
		</div>
	</section>

	<!-- 9. Final CTA -->
	<section class="relative pb-24">
		<div class="container mx-auto px-6">
			<div
				use:inView
				class="cinematic-glass relative mx-auto max-w-4xl overflow-hidden rounded-[3rem] border border-brand-blue/20 p-10 text-center md:p-16"
			>
				<div
					class="absolute -top-24 -right-24 h-80 w-80 rounded-full opacity-60"
					style="background: radial-gradient(circle, rgba(0, 119, 255, 0.2) 0%, rgba(0, 119, 255, 0.05) 40%, transparent 70%);"
				></div>
				<h2 class="relative z-10 text-3xl font-black tracking-tight text-[var(--color-text-base)] md:text-5xl">
					{t?.finalCta?.title}
				</h2>
				<p class="relative z-10 mx-auto mt-4 max-w-xl text-lg leading-relaxed font-medium text-[var(--color-text-muted)]">
					{t?.finalCta?.pre} <span class="font-black text-brand-orange">{offerEndDate}</span>{t?.finalCta?.text}
				</p>
				<a
					href={waPrimary}
					target="_blank"
					rel="noopener noreferrer"
					class="relative z-10 mt-8 inline-flex rounded-full bg-brand-blue px-10 py-5 text-base font-black tracking-widest text-white uppercase shadow-[0_20px_50px_rgba(0,119,255,0.35)] transition-transform duration-500 hover:-translate-y-1"
				>
					{t?.finalCta?.button}
				</a>
			</div>
		</div>
	</section>
</div>
