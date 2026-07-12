<script lang="ts">
	import { base } from '$app/paths';
	import { ArrowLeft, Search, BarChart, Globe, FileText, Sparkles } from '@lucide/svelte';
	import CtaSection from '$lib/components/CtaSection.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';

	let { data } = $props();
	const typed = $derived(data);
	const lang = $derived(typed?.lang || 'ar');
	const isAr = $derived(lang === 'ar');

	const phoneNumber = '966576704683';

	function getWhatsAppLink(st: string): string {
		const msg = isAr ? `مرحباً، أريد تدقيق SEO مجاني لموقعي: ${st}` : `Hello, I'd like a free SEO audit for my website: ${st}`;
		return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`;
	}

	const auditItems = [
		{
			icon: Search,
			title: isAr ? 'تحليل تقني شامل' : 'Full Technical Analysis',
			desc: isAr ? 'ندقق سرعة الموقع، التوافق مع الجوال، بنية الروابط، وملف robots.txt' : 'We check site speed, mobile compatibility, URL structure, and robots.txt'
		},
		{
			icon: BarChart,
			title: isAr ? 'تحليل الكلمات المفتاحية' : 'Keyword Analysis',
			desc: isAr ? 'نحدد الكلمات المفتاحية التي تستهدفها مقارنة بمنافسيك في السوق السعودي' : 'We identify your target keywords vs competitors in the Saudi market'
		},
		{
			icon: Globe,
			title: isAr ? 'تدقيق SEO محلي' : 'Local SEO Check',
			desc: isAr ? 'نتحقق من ظهورك في Google Business Profile ومدى اتساق معلومات نشاطك التجاري' : 'We verify your GBP visibility and NAP consistency'
		},
		{
			icon: FileText,
			title: isAr ? 'تقرير مفصل مع توصيات' : 'Detailed Report with Recommendations',
			desc: isAr ? 'تحصل على تقرير كامل بأولويات التحسين مع خطة تنفيذ واضحة' : 'You get a full report with priorities and clear execution plan'
		}
	];
</script>

<svelte:head>
	<title>{isAr ? 'تدقيق SEO مجاني' : 'Free SEO Audit'} — {typed?.site?.siteName || 'BOSLA'}</title>
	<meta name="description" content={isAr ? 'احصل على تدقيق SEO مجاني وشامل لموقعك. نحلل الأداء التقني والكلمات المفتاحية وظهورك في بحث جوجل السعودية.' : 'Get a free comprehensive SEO audit for your website. We analyze technical performance, keywords, and Google Saudi Arabia visibility.'} />
</svelte:head>

<section class="relative flex min-h-[60vh] w-full items-center justify-center overflow-hidden transition-colors duration-1000" dir={isAr ? 'rtl' : 'ltr'}>
	<div class="atmospheric-dark-hero pointer-events-none absolute inset-0 z-0"></div>
	<div class="relative z-10 container mx-auto px-6 pt-36 pb-24">
		<div class="mx-auto max-w-4xl space-y-8 text-center">
			<div class="flex justify-center">
				<Breadcrumbs
					{lang}
					items={[
						{ label: isAr ? 'تدقيق SEO مجاني' : 'Free SEO Audit' }
					]}
				/>
			</div>
			<div class="space-y-6">
				<div class="mx-auto mb-6 inline-flex items-center gap-3 rounded-full border border-brand-orange/30 bg-brand-orange/5 px-6 py-2">
					<Sparkles class="h-4 w-4 text-brand-orange" />
					<span class="text-xs font-black tracking-widest text-brand-orange uppercase">
						{isAr ? 'مجاناً — بدون التزام' : 'Free — No Obligation'}
					</span>
				</div>
				<h1 class="text-5xl leading-tight font-black text-[var(--color-text-base)] md:text-6xl">
					{isAr ? 'تدقيق SEO مجاني' : 'Free SEO Audit'}
				</h1>
				<p class="mx-auto max-w-2xl text-xl leading-relaxed font-medium text-[var(--color-text-muted)]">
					{isAr ? 'اكتشف أين يقف موقعك بالضبط في تحسين محركات البحث — وأين يمكننا تحسينه' : 'Find out exactly where your site stands with SEO — and where we can improve it'}
				</p>
			</div>
		</div>
	</div>
</section>

<section class="relative w-full bg-[var(--color-background)] py-24 transition-colors duration-1000" dir={isAr ? 'rtl' : 'ltr'}>
	<div class="container mx-auto px-6">
		<div class="mx-auto max-w-4xl">
			<div class="mb-16 text-center">
				<h2 class="mb-6 text-3xl font-black text-[var(--color-text-base)]">
					{isAr ? 'ماذا يشمل التدقيق؟' : 'What the Audit Includes'}
				</h2>
			</div>

			<div class="mb-16 grid gap-6 md:grid-cols-2">
				{#each auditItems as item}
					<div class="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-highlight)] p-6">
						<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-blue/10">
							<item.icon class="h-6 w-6 text-brand-blue" />
						</div>
						<h3 class="mb-2 text-lg font-bold text-[var(--color-text-base)]">{item.title}</h3>
						<p class="text-sm leading-relaxed text-[var(--color-text-muted)]">{item.desc}</p>
					</div>
				{/each}
			</div>

			<div class="rounded-2xl border-2 border-brand-orange/20 bg-gradient-to-br from-brand-orange/5 to-brand-blue/5 p-8 text-center md:p-12">
				<h2 class="mb-4 text-2xl font-black text-[var(--color-text-base)]">
					{isAr ? 'احصل على تدقيقك المجاني الآن' : 'Get Your Free Audit Now'}
				</h2>
				<p class="mb-8 text-base leading-relaxed text-[var(--color-text-muted)]">
					{isAr ? 'أرسل رابط موقعك عبر واتساب وسنقوم بتحليله وإرسال التقرير إليك خلال 48 ساعة' : 'Send us your website URL on WhatsApp and we will analyze it and send the report within 48 hours'}
				</p>
				<a
					href={getWhatsAppLink('')}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-3 rounded-full bg-brand-orange px-12 py-5 text-lg font-black text-white shadow-xl shadow-brand-orange/20 transition-all hover:scale-105 hover:shadow-brand-orange/40"
				>
					{isAr ? 'أرسل موقعك عبر واتساب' : 'Send Your Site on WhatsApp'}
					<ArrowLeft class="h-5 w-5 {isAr ? '' : 'rotate-180'}" />
				</a>
			</div>
		</div>
	</div>
</section>

<div class="bg-[var(--color-background)] transition-colors duration-1000">
	<CtaSection {data} />
</div>
