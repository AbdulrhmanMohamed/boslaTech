<script lang="ts">
	import { base } from '$app/paths';
	import { ArrowLeft, BookOpen, Search, Megaphone } from '@lucide/svelte';
	import HeroBackground from '$lib/components/HeroBackground.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';

	let { data } = $props();
	const typed = data as any;
	const lang = typed?.lang || 'ar';
	const isAr = lang === 'ar';
</script>

<svelte:head>
	<title>{isAr ? 'الأدلة الإرشادية' : 'Guides'} — {typed?.site?.siteName || 'BOSLA'}</title>
	<meta name="description" content={isAr ? 'أدلة شاملة حول تطوير المواقع، تحسين محركات البحث، والتسويق الرقمي للشركات السعودية.' : 'Comprehensive guides on web development, SEO, and digital marketing for Saudi businesses.'} />
</svelte:head>

<section class="relative flex min-h-[50vh] w-full items-center justify-center overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
	<HeroBackground />
	<div class="relative z-10 container mx-auto px-6 pt-36 pb-24">
		<div class="mx-auto max-w-4xl space-y-8 text-center">
			<div class="flex justify-center">
				<Breadcrumbs {lang} items={[{ label: isAr ? 'الأدلة' : 'Guides' }]} />
			</div>
			<div class="space-y-6">
				<h1 class="text-5xl font-black text-[var(--color-text-base)] md:text-6xl">{isAr ? 'الأدلة الإرشادية' : 'Guides'}</h1>
				<p class="mx-auto max-w-2xl text-xl font-medium text-[var(--color-text-muted)]">{isAr ? 'أدلة شاملة لمساعدتك في بناء وتطوير أعمالك الرقمية' : 'Comprehensive guides to help you build and grow your digital presence'}</p>
			</div>
		</div>
	</div>
</section>

<section class="relative w-full bg-[var(--color-background)] py-24" dir={isAr ? 'rtl' : 'ltr'}>
	<div class="container mx-auto px-6">
		<div class="mx-auto max-w-4xl space-y-8">
			<a href={`${base}/guides/web-development?lang=${lang}`} class="group block">
				<div class="cinematic-glass rounded-3xl border border-[var(--glass-border)] p-8 transition-all hover:border-brand-blue/20 hover:shadow-xl">
					<div class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue">
						<BookOpen class="h-7 w-7" />
					</div>
					<h2 class="mb-3 text-2xl font-black text-[var(--color-text-base)] transition-colors group-hover:text-brand-blue">{isAr ? 'تطوير المواقع الإلكترونية' : 'Web Development'}</h2>
					<p class="mb-6 text-[var(--color-text-muted)]">{isAr ? 'دليل شامل حول بناء وتطوير المواقع الإلكترونية للشركات السعودية' : 'A complete guide to building and developing websites for Saudi businesses'}</p>
					<div class="flex items-center gap-2 text-sm font-bold text-brand-blue">
						{isAr ? 'اقرأ الدليل' : 'Read Guide'}
						<ArrowLeft class="h-4 w-4 {isAr ? '' : 'rotate-180'}" />
					</div>
				</div>
			</a>

			<a href={`${base}/guides/seo?lang=${lang}`} class="group block">
				<div class="cinematic-glass rounded-3xl border border-[var(--glass-border)] p-8 transition-all hover:border-brand-blue/20 hover:shadow-xl">
					<div class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
						<Search class="h-7 w-7" />
					</div>
					<h2 class="mb-3 text-2xl font-black text-[var(--color-text-base)] transition-colors group-hover:text-brand-blue">{isAr ? 'تحسين محركات البحث' : 'SEO'}</h2>
					<p class="mb-6 text-[var(--color-text-muted)]">{isAr ? 'دليل متكامل لتحسين ظهور موقعك في محركات البحث وجذب العملاء' : 'A comprehensive guide to improving your site\'s visibility on search engines'}</p>
					<div class="flex items-center gap-2 text-sm font-bold text-brand-blue">
						{isAr ? 'اقرأ الدليل' : 'Read Guide'}
						<ArrowLeft class="h-4 w-4 {isAr ? '' : 'rotate-180'}" />
					</div>
				</div>
			</a>

			<a href={`${base}/guides/digital-marketing?lang=${lang}`} class="group block">
				<div class="cinematic-glass rounded-3xl border border-[var(--glass-border)] p-8 transition-all hover:border-brand-blue/20 hover:shadow-xl">
					<div class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
						<Megaphone class="h-7 w-7" />
					</div>
					<h2 class="mb-3 text-2xl font-black text-[var(--color-text-base)] transition-colors group-hover:text-brand-blue">{isAr ? 'التسويق الرقمي' : 'Digital Marketing'}</h2>
					<p class="mb-6 text-[var(--color-text-muted)]">{isAr ? 'دليل استراتيجيات التسويق الرقمي للشركات السعودية' : 'A guide to digital marketing strategies for Saudi businesses'}</p>
					<div class="flex items-center gap-2 text-sm font-bold text-brand-blue">
						{isAr ? 'اقرأ الدليل' : 'Read Guide'}
						<ArrowLeft class="h-4 w-4 {isAr ? '' : 'rotate-180'}" />
					</div>
				</div>
			</a>
		</div>
	</div>
</section>
