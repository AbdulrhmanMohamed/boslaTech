<script lang="ts">
	import { base } from '$app/paths';
	import { ArrowRight, MapPin, Star, Sparkles } from '@lucide/svelte';
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
	<title>{isAr ? `شركة تصميم مواقع في ${city?.name || ''} — ${typed?.site?.siteName || 'BOSLA'}` : `Digital Services in ${city?.name || ''} — ${typed?.site?.siteName || 'BOSLA'}`}</title>
	<meta name="description" content={isAr
		? `أفضل شركة تصميم وتطوير مواقع وحلول رقمية في ${city?.name || ''}. نقدم تصميماً احترافياً وتحسين محركات البحث والتسويق الرقمي. اتصل بنا اليوم!`
		: `Top web design, development, SEO & digital marketing services in ${city?.name || ''}, Saudi Arabia. Professional digital solutions for your business. Contact us today!`
	} />
</svelte:head>

<section class="relative flex min-h-[55vh] w-full items-center justify-center overflow-hidden transition-colors duration-1000" dir={isAr ? 'rtl' : 'ltr'}>
	<HeroBackground />
	<div class="relative z-10 container mx-auto px-6 py-24">
		<div class="mx-auto max-w-4xl space-y-8 text-center">
			<div class="flex justify-center">
				<Breadcrumbs
					{lang}
					items={[
						{ label: isAr ? city?.name || '' : 'Locations' },
					]}
				/>
			</div>
			<div class="inline-flex items-center gap-3 rounded-full border border-[var(--glass-border)] px-6 py-2">
				<MapPin class="h-5 w-5 text-brand-orange" />
				<span class="text-xs font-black tracking-widest text-[var(--color-text-muted)] uppercase">
					{city?.name || ''} {isAr ? ', المملكة العربية السعودية' : ', Saudi Arabia'}
				</span>
			</div>
			<h1 class="text-5xl leading-tight font-black text-[var(--color-text-base)] md:text-6xl">
				{isAr ? `خدمات رقمية في ${city?.name || ''}` : `Digital Services in ${city?.name || ''}`}
			</h1>
			<p class="mx-auto max-w-2xl text-xl leading-relaxed font-medium text-[var(--color-text-muted)]">
				{isAr
					? `نقدم خدمات تصميم وتطوير المواقع الإلكترونية، تحسين محركات البحث (SEO)، والتسويق الرقمي للشركات في ${city?.name || ''}. فريقنا متخصص في تقديم حلول رقمية متميزة تناسب احتياجات عملك.`
					: `We provide web design & development, SEO, and digital marketing services for businesses in ${city?.name || ''}. Our team delivers tailored digital solutions to help your business grow.`
				}
			</p>
		</div>
	</div>
</section>

<section class="relative w-full bg-[var(--color-background)] py-24 transition-colors duration-1000" dir={isAr ? 'rtl' : 'ltr'}>
	<div class="container mx-auto px-6">
		<div class="mx-auto max-w-5xl">
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
					<a
						href={`${base}/services/${cat.slug}?lang=${lang}`}
						class="group relative overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-highlight)] p-8 transition-all hover:-translate-y-1 hover:shadow-xl"
					>
						<h3 class="mb-4 text-2xl font-black text-[var(--color-text-base)] group-hover:text-brand-blue">{cat.name}</h3>
						<p class="mb-6 line-clamp-4 text-sm leading-relaxed text-[var(--color-text-muted)]">{cat.description}</p>
						<ul class="space-y-3">
							{#each cat.items || [] as item}
								<li class="flex items-start gap-3 text-sm font-medium text-[var(--color-text-muted)]">
									<ArrowRight class="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-blue" />
									<a href={`${base}/services/${cat.slug}/${item.slug}?lang=${lang}`}
										class="transition-colors hover:text-brand-blue">{item.title}</a>
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

			<div class="mt-16 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-highlight)] p-8 text-center md:p-12">
				<div class="mb-4 inline-flex items-center gap-3 rounded-full border border-[var(--glass-border)] px-6 py-2">
					<Star class="h-4 w-4 text-yellow-500" />
					<span class="text-xs font-black tracking-widest text-[var(--color-text-muted)] uppercase">
						{isAr ? `لماذا ${city?.name || ''}؟` : `Why ${city?.name || ''}?`}
					</span>
				</div>
				<h3 class="mb-6 text-3xl font-black text-[var(--color-text-base)]">
					{isAr
						? `نفهم سوق ${city?.name || ''}`
						: `We Understand the ${city?.name || ''} Market`}
				</h3>
				<p class="mx-auto max-w-3xl text-base leading-relaxed font-medium text-[var(--color-text-muted)]">
					{isAr
						? `مؤسسة حافة النجوم تقدم خدماتها للشركات في ${city?.name || ''} وفي جميع أنحاء المملكة. فريقنا على دراية كاملة بسوق ${city?.name || ''} المحلي، مما يمكننا من تقديم حلول رقمية تناسب احتياجات شركتك بدقة.`
						: `Hafat Alnjom serves businesses in ${city?.name || ''} and across the Kingdom. Our team has deep knowledge of the local ${city?.name || ''} market, enabling us to deliver digital solutions tailored to your business needs.`
					}
				</p>
			</div>
		</div>
	</div>
</section>

<div class="bg-[var(--color-background)] transition-colors duration-1000">
	<CtaSection {data} />
</div>
