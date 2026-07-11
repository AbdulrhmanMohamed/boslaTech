<script lang="ts">
	import { theme } from '$lib/stores/theme.svelte';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import {
		ArrowRight, ArrowUpRight, Check, Sparkles, Star, ChevronDown,
		Code, Search, Share,
		Pen, Rocket, Settings, TrendingUp, ClipboardList, Play, BarChart3
	} from '@lucide/svelte';
	import HeroBackground from '$lib/components/HeroBackground.svelte';
	import CtaSection from '$lib/components/CtaSection.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';

	let { data } = $props();
	const currentTheme = $derived(theme.current);
	const typedData = data as any;
	const category = typedData?.category;
	const lang = typedData?.lang || 'ar';

	const isAr = lang === 'ar';
	const phoneNumber = '966576704683';

	let openFaqIndex = $state<number | null>(null);

	function toggleFaq(i: number) {
		openFaqIndex = openFaqIndex === i ? null : i;
	}

	const categoryIcons: Record<string, any> = {
		code: Code, search: Search, share: Share
	};

	const iconMap: Record<string, any> = {
		'pen-tool': Pen,
		code: Code,
		rocket: Rocket,
		search: Search,
		settings: Settings,
		'trending-up': TrendingUp,
		'clipboard-list': ClipboardList,
		play: Play,
		'bar-chart': BarChart3
	};

	function getWhatsAppLink(serviceTitle: string): string {
		const msg = isAr
			? `مرحباً، أود الاستفسار عن خدمة: ${serviceTitle}`
			: `Hello, I'm interested in: ${serviceTitle}`;
		return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`;
	}

	function linkServices() {
		return `${base}/services?lang=${lang}`;
	}

	function contactLink() {
		return `${base}/contact?lang=${lang}`;
	}

	const deliveryTimes: Record<string, { ar: string, en: string }> = {
		'web-development': {
			ar: 'مدة التسليم: 7-10 أيام عمل',
			en: 'Delivery: 7-10 business days'
		},
		'seo': {
			ar: 'النتائج الأولى: 4-8 أسابيع',
			en: 'First results: 4-8 weeks'
		},
		'digital-marketing': {
			ar: 'تحسين مستمر — تقارير شهرية',
			en: 'Ongoing — monthly reports'
		}
	};

	function getDelivery(slug: string): string {
		return deliveryTimes[slug] ? deliveryTimes[slug][isAr ? 'ar' : 'en'] : '';
	}

	function scrollTo(id: string) {
		const el = document.getElementById(id);
		if (el) el.scrollIntoView({ behavior: 'smooth' });
	}

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		const animEls = document.querySelectorAll('.anim-up');
		animEls.forEach((el, i) => {
			gsap.from(el, {
				scrollTrigger: { trigger: el, start: 'top 85%' },
				opacity: 0, y: 30, duration: 0.6, delay: i * 0.08, ease: 'power3.out'
			});
		});
	});
</script>

<svelte:head>
	<title>{category?.name || 'Service'} — {typedData?.site?.siteName || 'BOSLA'}</title>
	<meta name="description" content={category?.description ? category.description.slice(0, 155) + '...' : ''} />
	<script type="application/ld+json">
		{JSON.stringify({
			"@context": "https://schema.org",
			"@type": "Service",
			"name": category?.name || '',
			"description": category?.description || '',
			"provider": {
				"@type": "LocalBusiness",
				"name": "مؤسسة حافة النجوم",
				"telephone": "+966576704683"
			},
			"areaServed": "SA",
			"offers": {
				"@type": "Offer",
				"price": "1500",
				"priceCurrency": "SAR",
				"priceRange": "SAR 1,500 - SAR 5,000"
			}
		})}
	</script>
	<script type="application/ld+json">
		{JSON.stringify({
			"@context": "https://schema.org",
			"@type": "BreadcrumbList",
			"itemListElement": [
				{ "@type": "ListItem", "position": 1, "name": lang === 'ar' ? 'الرئيسية' : 'Home', "item": "https://hafatalnjom.com" },
				{ "@type": "ListItem", "position": 2, "name": lang === 'ar' ? 'خدماتنا' : 'Our Services', "item": "https://hafatalnjom.com/services" },
				{ "@type": "ListItem", "position": 3, "name": category?.name || '' }
			]
		})}
	</script>
</svelte:head>

<!-- Hero -->
<section class="relative flex min-h-[50vh] w-full items-center justify-center overflow-hidden transition-colors duration-1000" dir={isAr ? 'rtl' : 'ltr'}>
	<HeroBackground />
	<div class="relative z-10 container mx-auto px-6 py-24">
		<div class="mx-auto max-w-4xl space-y-8 text-center">
			<div class="flex justify-center">
				<Breadcrumbs
					{lang}
					items={[
						{ label: isAr ? 'خدماتنا' : 'Services', href: linkServices() },
						{ label: category?.name || '' }
					]}
				/>
			</div>

			<div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue">
				<svelte:component this={categoryIcons[category?.icon] || Code} class="h-8 w-8" />
			</div>

			<h1 class="text-5xl leading-tight font-black text-[var(--color-text-base)] md:text-6xl">
				{category?.name || ''}
			</h1>

			<p class="mx-auto max-w-2xl text-lg leading-relaxed font-medium text-[var(--color-text-muted)] md:text-xl">
				{category?.description || ''}
			</p>

			<div class="flex flex-wrap items-center justify-center gap-4 pt-4">
				<a
					href={getWhatsAppLink(category?.name || '')}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-3 rounded-full bg-brand-blue px-8 py-4 text-sm font-black text-white transition-all hover:scale-105"
				>
					{isAr ? 'احصل على عرض سعر' : 'Get a Quote'}
					<ArrowUpRight class="h-4 w-4" />
				</a>
				<button
					onclick={() => scrollTo('services-detail')}
					class="cinematic-glass inline-flex items-center gap-3 rounded-full border border-[var(--glass-border)] px-8 py-4 text-sm font-bold text-[var(--color-text-base)] transition-all hover:border-brand-blue/20"
				>
					{isAr ? 'استعرض الخدمات' : 'Explore Services'}
					<ArrowRight class="h-4 w-4" />
				</button>
			</div>
			<div class="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-medium text-[var(--color-text-muted)]">
				<span class="inline-flex items-center gap-1.5">
					<Star class="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
					<span>{isAr ? '4.9/5 تقييم العملاء' : '4.9/5 Client Rating'}</span>
				</span>
				<span class="text-[var(--glass-border)] hidden sm:inline">|</span>
				<span>{isAr ? 'أكثر من 500 عميل' : '500+ Happy Clients'}</span>
				<span class="text-[var(--glass-border)] hidden sm:inline">|</span>
				<span>{isAr ? 'ضمان استعادة الأموال' : 'Money-Back Guarantee'}</span>
			</div>
		</div>
	</div>
</section>

<!-- Sub-services with Features & CTA -->
<section id="services-detail" class="relative w-full bg-[var(--color-background)] py-24 transition-colors duration-1000" dir={isAr ? 'rtl' : 'ltr'}>
	<div class="container mx-auto px-6">
		<div class="mx-auto max-w-5xl space-y-20">
			{#each category?.items || [] as item, i}
				{@const subHref = `${base}/services/${category?.slug}/${item.slug}?lang=${lang}`}
				<div class="anim-up space-y-8">
					<!-- Service Header -->
					<a href={subHref} class="group block">
						<div class="cinematic-glass rounded-[2.5rem] border border-[var(--glass-border)] p-8 transition-all duration-300 group-hover:border-brand-blue/20 group-hover:shadow-xl md:p-12">
							<div class="mb-3 flex flex-wrap items-center gap-3">
								<div class="inline-flex rounded-full bg-brand-blue/10 px-4 py-1 text-[11px] font-black tracking-wider text-brand-blue uppercase">
									{isAr ? 'الخدمة' : 'Service'} 0{i + 1}
								</div>
								{#if getDelivery(category?.slug)}
									<div class="inline-flex rounded-full bg-brand-orange/10 px-4 py-1 text-[11px] font-black tracking-wider text-brand-orange uppercase">
										{getDelivery(category?.slug)}
									</div>
								{/if}
							</div>
							<h2 class="mb-4 text-3xl font-black text-[var(--color-text-base)] transition-colors group-hover:text-brand-blue">{item.title}</h2>
							<p class="text-base leading-relaxed font-medium text-[var(--color-text-muted)]">{item.details}</p>
							<div class="mt-6 flex items-center gap-2 text-sm font-bold text-brand-blue opacity-0 transition-all group-hover:opacity-100">
								{isAr ? 'اقرأ المزيد' : 'Read More'}
								<ArrowRight class="h-4 w-4" />
							</div>
						</div>
					</a>

					<!-- Features Grid -->
					{#if item.features?.length}
						<div class="grid gap-4 md:grid-cols-2">
							{#each item.features as feature}
								<div class="cinematic-glass group flex items-start gap-4 rounded-2xl border border-[var(--glass-border)] p-5 transition-all duration-300 hover:border-brand-blue/20 hover:bg-[var(--glass-highlight)]">
									<div class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-brand-blue/20 bg-brand-blue/10 transition-colors duration-300 group-hover:border-brand-orange/20 group-hover:bg-brand-orange/10">
										<Check class="h-3.5 w-3.5 text-brand-blue transition-colors duration-300 group-hover:text-brand-orange" />
									</div>
									<span class="text-sm font-medium text-[var(--color-text-muted)] transition-colors duration-300 group-hover:text-[var(--color-text-base)]">{feature}</span>
								</div>
							{/each}
						</div>
					{/if}

					<!-- Sub-service CTA -->
					<div class="flex flex-wrap items-center gap-4">
						<a
							href={getWhatsAppLink(item.title)}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-3 rounded-full bg-brand-blue px-8 py-4 text-sm font-black text-white transition-all hover:scale-105"
						>
							{isAr ? 'اطلب الخدمة الآن' : 'Order This Service'}
							<ArrowUpRight class="h-4 w-4" />
						</a>
						<a
							href={contactLink()}
							class="cinematic-glass inline-flex items-center gap-3 rounded-full border border-[var(--glass-border)] px-8 py-4 text-sm font-bold text-[var(--color-text-base)] transition-all hover:border-brand-blue/20"
						>
							{isAr ? 'تواصل معنا' : 'Contact Us'}
						</a>
					</div>
					<p class="text-xs font-medium text-[var(--color-text-muted)]">
						{isAr ? '✅ أكثر من 500 شركة وثقت في خدماتنا — احصل على استشارتك المجانية اليوم' : '✅ 500+ businesses trust us — Get your free consultation today'}
					</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- FAQ -->
{#if data?.servicesPage?.faq?.items?.length}
	<section class="relative w-full bg-[var(--color-background)] py-24 transition-colors duration-1000" dir={isAr ? 'rtl' : 'ltr'}>
		<div class="container mx-auto px-6">
			<div class="mx-auto max-w-3xl">
				<div class="anim-up mb-12 text-center">
					<h2 class="text-4xl font-black text-[var(--color-text-base)]">
						{data?.servicesPage?.faq?.title || (isAr ? 'الأسئلة الشائعة' : 'FAQ')}
					</h2>
				</div>
				<div class="space-y-4">
					{#each data?.servicesPage?.faq?.items || [] as item, i}
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
		</div>
	</section>
{/if}

<!-- Category-specific Process -->
{#if category?.process?.steps?.length}
	<section class="relative w-full bg-[var(--color-surface)] py-24 transition-colors duration-1000" dir={isAr ? 'rtl' : 'ltr'}>
		<div class="container mx-auto px-6">
			<div class="mx-auto max-w-5xl">
				<div class="anim-up mb-16 text-center">
					<h2 class="text-4xl font-black text-[var(--color-text-base)]">
						{category.process.title || (isAr ? 'كيف نعمل' : 'How We Work')}
					</h2>
				</div>

				<div class="relative grid gap-8 md:grid-cols-3">
					<!-- Connector line -->
					<div class="absolute top-12 left-0 hidden h-px w-full bg-gradient-to-r from-brand-blue/20 via-brand-blue/40 to-brand-blue/20 md:block" style="top: 3rem;"></div>

					{#each category.process.steps as step, si}
						<div class="anim-up relative flex flex-col items-center text-center">
							<div class="relative z-10 mb-6 flex h-24 w-24 items-center justify-center rounded-full border-2 border-brand-blue/20 bg-[var(--color-background)] text-brand-blue shadow-lg">
								<svelte:component this={iconMap[step.icon] || Code} class="h-10 w-10" />
							</div>
							<div class="mb-2 inline-flex rounded-full bg-brand-blue/10 px-4 py-1 text-[11px] font-black tracking-wider text-brand-blue uppercase">
								{isAr ? 'خطوة' : 'Step'} 0{si + 1}
							</div>
							<h3 class="mb-3 text-xl font-black text-[var(--color-text-base)]">{step.title}</h3>
							<p class="max-w-sm text-sm leading-relaxed font-medium text-[var(--color-text-muted)]">{step.desc}</p>
						</div>
					{/each}
				</div>

				<div class="anim-up mt-16 text-center">
					<a
						href={getWhatsAppLink(category?.name || '')}
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center gap-3 rounded-full bg-brand-blue px-10 py-5 text-base font-black text-white shadow-xl shadow-brand-blue/20 transition-all hover:scale-105 hover:shadow-brand-blue/40"
					>
						{isAr ? 'ابدأ مشروعك الآن' : 'Start Your Project Now'}
						<ArrowRight class="h-5 w-5" />
					</a>
					<p class="mt-4 text-sm font-medium text-[var(--color-text-muted)]">
						{isAr ? '⭐ 4.9/5 تقييم · أكثر من 500 عميل · ضمان استعادة الأموال لمدة 30 يومًا' : '⭐ 4.9/5 rating · 500+ clients · 30-day money-back guarantee'}
					</p>
				</div>
			</div>
		</div>
	</section>
{/if}

<!-- Related Services -->
{#if typedData?.servicesPage?.categories}
	{@const others = typedData.servicesPage.categories.filter((c: any) => c.slug !== category?.slug)}
	{#if others.length > 0}
		<section class="relative w-full bg-[var(--color-surface)] py-24 transition-colors duration-1000" dir={isAr ? 'rtl' : 'ltr'}>
			<div class="container mx-auto px-6">
				<div class="mb-16 text-center">
					<div class="mb-4 inline-flex items-center gap-3 rounded-full border border-[var(--glass-border)] px-6 py-2">
						<Sparkles class="h-4 w-4 text-brand-orange" />
						<span class="text-xs font-black tracking-widest text-[var(--color-text-muted)] uppercase">
							{isAr ? 'خدمات أخرى' : 'Other Services'}
						</span>
					</div>
					<h2 class="text-4xl font-black text-[var(--color-text-base)]">
						{isAr ? 'قد تهمك هذه الخدمات أيضًا' : 'You May Also Be Interested In'}
					</h2>
				</div>
				<div class="grid gap-8 md:grid-cols-2">
					{#each others as other}
						<a
							href={`${base}/services/${other.slug}?lang=${lang}`}
							class="group relative overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-[var(--color-background)] p-8 transition-all hover:-translate-y-1 hover:shadow-xl"
						>
							<div class="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
								<svelte:component this={categoryIcons[other.icon] || Code} class="h-7 w-7" />
							</div>
							<h3 class="mb-3 text-2xl font-black text-[var(--color-text-base)] group-hover:text-brand-blue">{other.name}</h3>
							<p class="line-clamp-3 text-sm leading-relaxed text-[var(--color-text-muted)]">{other.description}</p>
							<div class="mt-6 flex items-center gap-2 text-sm font-bold text-brand-blue">
								{isAr ? 'اكتشف المزيد' : 'Discover More'}
								<ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1 {isAr ? 'rotate-180' : ''}" />
							</div>
						</a>
					{/each}
				</div>
			</div>
		</section>
	{/if}
{/if}

<!-- CTA -->
<div class="bg-[var(--color-background)] transition-colors duration-1000">
	<CtaSection {data} />
</div>
