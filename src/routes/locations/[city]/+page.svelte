<script lang="ts">
	import { base } from '$app/paths';
	import { ArrowRight, MapPin, MapPinned, Building, Sparkles, Star } from '@lucide/svelte';
	import HeroBackground from '$lib/components/HeroBackground.svelte';
	import CtaSection from '$lib/components/CtaSection.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';

	let { data } = $props();
	const typed = data as any;
	const city = typed?.city;
	const lang = typed?.lang || 'ar';
	const isAr = lang === 'ar';
	const services = typed?.serviceData;

	const phoneNumber = '966576704683';
</script>

<svelte:head>
	<title>{city?.metaTitle || (isAr ? `شركة تصميم مواقع في ${city?.name || ''} — ${typed?.site?.siteName || 'BOSLA'}` : `Digital Services in ${city?.name || ''} — ${typed?.site?.siteName || 'BOSLA'}`)}</title>
	<meta name="description" content={city?.metaDesc || ''} />
</svelte:head>

<section class="relative flex min-h-[55vh] w-full items-center justify-center overflow-hidden transition-colors duration-1000" dir={isAr ? 'rtl' : 'ltr'}>
	<HeroBackground />
	<div class="relative z-10 container mx-auto px-6 pt-36 pb-24">
		<div class="mx-auto max-w-4xl space-y-8 text-center">
			<div class="flex justify-center">
				<Breadcrumbs
					{lang}
					items={[
						{ label: isAr ? 'المدن' : 'Locations' },
						{ label: city?.name || '' },
					]}
				/>
			</div>
			<div class="inline-flex items-center gap-3 rounded-full border border-[var(--glass-border)] px-6 py-2">
				<MapPin class="h-5 w-5 text-brand-orange" />
				<span class="text-xs font-black tracking-widest text-[var(--color-text-muted)] uppercase">
					{city?.name || ''} {isAr ? '، المملكة العربية السعودية' : ', Saudi Arabia'}
				</span>
			</div>
			<h1 class="text-5xl leading-tight font-black text-[var(--color-text-base)] md:text-6xl">
				{isAr ? `شركة تصميم مواقع في ${city?.name || ''}` : `Web Design Company in ${city?.name || ''}`}
			</h1>
			<p class="mx-auto max-w-3xl text-lg leading-relaxed font-medium text-[var(--color-text-muted)] md:text-xl">
				{city?.localContext || ''}
			</p>
			<div class="flex flex-wrap items-center justify-center gap-4 pt-4">
				<a
					href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(isAr ? `مرحباً، أود الاستفسار عن خدماتكم في ${city?.name || ''}` : `Hello, I'm interested in your services in ${city?.name || ''}`)}`}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-3 rounded-full bg-brand-blue px-8 py-4 text-sm font-black text-white transition-all hover:scale-105"
				>
					{isAr ? 'احصل على استشارة مجانية' : 'Get Free Consultation'}
					<ArrowRight class="h-4 w-4" />
				</a>
			</div>
		</div>
	</div>
</section>

<section class="relative w-full bg-[var(--color-background)] py-24 transition-colors duration-1000" dir={isAr ? 'rtl' : 'ltr'}>
	<div class="container mx-auto px-6">
		<div class="mx-auto max-w-5xl">
			<!-- Local Context -->
			<div class="mb-20 grid gap-8 md:grid-cols-2">
				<div class="space-y-6">
					<div class="inline-flex items-center gap-3 rounded-full border border-[var(--glass-border)] px-6 py-2">
						<MapPinned class="h-4 w-4 text-brand-orange" />
						<span class="text-xs font-black tracking-widest text-[var(--color-text-muted)] uppercase">
							{isAr ? 'المواقع والأحياء' : 'Local Districts'}
						</span>
					</div>
					<h2 class="text-3xl font-black text-[var(--color-text-base)] md:text-4xl">
						{isAr ? `نخدم جميع أحياء ${city?.name || ''}` : `Serving All ${city?.name || ''} Districts`}
					</h2>
					<div class="flex flex-wrap gap-3">
						{#each city?.districts || [] as district}
							<span class="inline-flex items-center gap-2 rounded-full border border-brand-blue/20 bg-brand-blue/5 px-4 py-2 text-sm font-medium text-brand-blue">
								<MapPin class="h-3.5 w-3.5" />
								{district}
							</span>
						{/each}
					</div>
				</div>
				<div class="space-y-6">
					<div class="inline-flex items-center gap-3 rounded-full border border-[var(--glass-border)] px-6 py-2">
						<Building class="h-4 w-4 text-brand-orange" />
						<span class="text-xs font-black tracking-widest text-[var(--color-text-muted)] uppercase">
							{isAr ? 'القطاعات' : 'Business Focus'}
						</span>
					</div>
					<h2 class="text-3xl font-black text-[var(--color-text-base)] md:text-4xl">
						{isAr ? `قطاعات نخدمها في ${city?.name || ''}` : `Sectors We Serve in ${city?.name || ''}`}
					</h2>
					<p class="text-lg font-medium leading-relaxed text-[var(--color-text-muted)]">
						{city?.businessFocus || ''}
					</p>
					<p class="text-sm font-medium text-[var(--color-text-muted)]">
						{isAr
							? `مؤسسة حافة النجوم — سجل تجاري 7050568158`
							: `Hafat Alnjom Est. — CR: 7050568158`}
					</p>
				</div>
			</div>

			<!-- Service Categories -->
			<div class="mb-16 text-center">
				<div class="mb-4 inline-flex items-center gap-3 rounded-full border border-[var(--glass-border)] px-6 py-2">
					<Sparkles class="h-4 w-4 text-brand-orange" />
					<span class="text-xs font-black tracking-widest text-[var(--color-text-muted)] uppercase">
						{isAr ? 'خدماتنا' : 'Our Services'}
					</span>
				</div>
				<h2 class="text-4xl font-black text-[var(--color-text-base)]">
					{isAr ? `كل ما تحتاجه لنمو أعمالك في ${city?.name || ''}` : `Everything Your Business Needs in ${city?.name || ''}`}
				</h2>
			</div>

			<div class="grid gap-8 md:grid-cols-3">
				{#each services?.categories || [] as cat}
					{@const cityServiceDesc = city?.serviceDescriptions?.[cat.slug] || cat.description}
					<a
						href={`${base}/services/${cat.slug}?lang=${lang}`}
						class="group relative overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-highlight)] p-8 transition-all hover:-translate-y-1 hover:shadow-xl"
					>
						<h3 class="mb-4 text-2xl font-black text-[var(--color-text-base)] group-hover:text-brand-blue">{cat.name}</h3>
						<p class="mb-6 text-sm leading-relaxed text-[var(--color-text-muted)]">{cityServiceDesc}</p>
						<ul class="space-y-3">
							{#each cat.items || [] as item}
								<li class="flex items-start gap-3 text-sm font-medium text-[var(--color-text-muted)]">
									<ArrowRight class="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-blue" />
									<a href={`${base}/services/${cat.slug}/${item.slug}?lang=${lang}`} class="transition-colors hover:text-brand-blue">{item.title}</a>
								</li>
							{/each}
						</ul>
						<div class="mt-6 flex items-center gap-2 text-sm font-bold text-brand-blue">
							{isAr ? 'اكتشف المزيد' : 'Learn More'}
							<ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
						</div>
					</a>
				{/each}
			</div>
		</div>
	</div>
</section>

<div class="bg-[var(--color-background)] transition-colors duration-1000">
	<CtaSection {data} />
</div>
