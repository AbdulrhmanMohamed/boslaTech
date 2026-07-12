<script lang="ts">
	import { base } from '$app/paths';
	import { ArrowLeft, Sparkles, Calculator, Code, ShoppingCart, Search, Megaphone } from '@lucide/svelte';
	import CtaSection from '$lib/components/CtaSection.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';

	let { data } = $props();
	const typed = $derived(data);
	const lang = $derived(typed?.lang || 'ar');
	const isAr = $derived(lang === 'ar');

	const phoneNumber = '966576704683';

	function getWhatsAppLink(st: string): string {
		const msg = isAr ? `مرحباً، أريد استشارة مجانية لتحديد تكلفة: ${st}` : `Hello, I'd like a free consultation to determine the cost of: ${st}`;
		return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`;
	}

	const priceCategories = [
		{
			icon: Code,
			title: isAr ? 'تطوير المواقع' : 'Web Development',
			items: [
				{ label: isAr ? 'موقع مؤسسي بسيط' : 'Simple Corporate Site', range: isAr ? '1,000 — 3,000 ريال' : 'SAR 1,000 — 3,000' },
				{ label: isAr ? 'موقع ووردبريس متقدم' : 'Advanced WordPress', range: isAr ? '2,000 — 4,000 ريال' : 'SAR 2,000 — 4,000' },
				{ label: isAr ? 'متجر إلكتروني (شوبيفاي/سلة/زد)' : 'E-commerce Store', range: isAr ? '2,000 — 5,000 ريال' : 'SAR 2,000 — 5,000' },
				{ label: isAr ? 'إعادة تصميم موقع' : 'Website Redesign', range: isAr ? '1,500 — 3,500 ريال' : 'SAR 1,500 — 3,500' },
				{ label: isAr ? 'صيانة شهرية' : 'Monthly Maintenance', range: isAr ? '300 — 800 ريال/شهر' : 'SAR 300 — 800/month' },
			]
		},
		{
			icon: Search,
			title: isAr ? 'تحسين محركات البحث' : 'SEO Services',
			items: [
				{ label: isAr ? 'تدقيق SEO (لمرة واحدة)' : 'SEO Audit (one-time)', range: isAr ? '500 — 1,500 ريال' : 'SAR 500 — 1,500' },
				{ label: isAr ? 'حزمة SEO أساسية' : 'Basic SEO Package', range: isAr ? '1,500 — 2,500 ريال/شهر' : 'SAR 1,500 — 2,500/month' },
				{ label: isAr ? 'حزمة SEO متقدمة' : 'Advanced SEO Package', range: isAr ? '2,500 — 4,000 ريال/شهر' : 'SAR 2,500 — 4,000/month' },
				{ label: isAr ? 'SEO محلي لمدينة واحدة' : 'Local SEO (one city)', range: isAr ? '1,000 — 2,000 ريال/شهر' : 'SAR 1,000 — 2,000/month' },
			]
		},
		{
			icon: Megaphone,
			title: isAr ? 'التسويق الرقمي' : 'Digital Marketing',
			items: [
				{ label: isAr ? 'إدارة وسائل التواصل' : 'Social Media Management', range: isAr ? '1,500 — 3,000 ريال/شهر' : 'SAR 1,500 — 3,000/month' },
				{ label: isAr ? 'إعلانات جوجل (إدارة)' : 'Google Ads Management', range: isAr ? '1,000 — 2,000 ريال/شهر' : 'SAR 1,000 — 2,000/month' },
				{ label: isAr ? 'إعلانات سناب شات/تيك توك' : 'Snapchat/TikTok Ads', range: isAr ? '1,500 — 3,000 ريال/شهر' : 'SAR 1,500 — 3,000/month' },
				{ label: isAr ? 'تصميم هوية بصرية' : 'Brand Identity Design', range: isAr ? '1,500 — 4,000 ريال' : 'SAR 1,500 — 4,000' },
			]
		}
	];
</script>

<svelte:head>
	<title>{isAr ? 'حاسبة تكاليف الخدمات الرقمية' : 'Digital Services Cost Calculator'} — {typed?.site?.siteName || 'BOSLA'}</title>
	<meta name="description" content={isAr ? 'دليل أسعار خدمات تطوير المواقع وتحسين محركات البحث والتسويق الرقمي في السعودية. تعرف على تكاليف الخدمات التقريبية.' : 'Pricing guide for web development, SEO, and digital marketing services in Saudi Arabia. Get approximate costs for your project.'} />
</svelte:head>

<section class="relative flex min-h-[50vh] w-full items-center justify-center overflow-hidden transition-colors duration-1000" dir={isAr ? 'rtl' : 'ltr'}>
	<div class="relative z-10 container mx-auto px-6 pt-36 pb-24">
		<div class="mx-auto max-w-4xl space-y-8 text-center">
			<div class="flex justify-center">
				<Breadcrumbs
					{lang}
					items={[
						{ label: isAr ? 'دليل الأسعار' : 'Pricing Guide' }
					]}
				/>
			</div>
			<div class="space-y-6">
				<div class="mx-auto mb-6 inline-flex items-center gap-3 rounded-full border border-brand-blue/30 bg-brand-blue/5 px-6 py-2">
					<Calculator class="h-4 w-4 text-brand-blue" />
					<span class="text-xs font-black tracking-widest text-brand-blue uppercase">
						{isAr ? 'أسعار تقريبية' : 'Approximate Pricing'}
					</span>
				</div>
				<h1 class="text-5xl leading-tight font-black text-[var(--color-text-base)] md:text-6xl">
					{isAr ? 'دليل أسعار الخدمات الرقمية' : 'Digital Services Pricing Guide'}
				</h1>
				<p class="mx-auto max-w-2xl text-xl leading-relaxed font-medium text-[var(--color-text-muted)]">
					{isAr ? 'نطاقات الأسعار التقريبية لخدماتنا في السوق السعودي. الأسعار النهائية تعتمد على متطلبات مشروعك المحددة.' : 'Approximate price ranges for our services in the Saudi market. Final pricing depends on your specific project requirements.'}
				</p>
			</div>
		</div>
	</div>
</section>

<section class="relative w-full bg-[var(--color-background)] py-24 transition-colors duration-1000" dir={isAr ? 'rtl' : 'ltr'}>
	<div class="container mx-auto px-6">
		<div class="mx-auto max-w-4xl">
			<div class="space-y-16">
				{#each priceCategories as cat}
					<div>
						<div class="mb-8 flex items-center gap-4">
							<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-blue/10">
								<cat.icon class="h-6 w-6 text-brand-blue" />
							</div>
							<h2 class="text-2xl font-black text-[var(--color-text-base)]">{cat.title}</h2>
						</div>
						<div class="space-y-3">
							{#each cat.items as item}
								<div class="flex items-center justify-between rounded-xl border border-[var(--glass-border)] bg-[var(--glass-highlight)] px-6 py-4">
									<span class="text-base font-bold text-[var(--color-text-base)]">{item.label}</span>
									<span class="text-sm font-bold text-brand-blue">{item.range}</span>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>

			<hr class="my-16 border-[var(--glass-border)]" />

			<div class="rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-highlight)] p-8 text-center md:p-12">
				<Calculator class="mx-auto mb-4 h-10 w-10 text-brand-orange" />
				<h2 class="mb-4 text-2xl font-black text-[var(--color-text-base)]">
					{isAr ? 'احصل على عرض سعر دقيق' : 'Get an Accurate Quote'}
				</h2>
				<p class="mb-8 text-base leading-relaxed text-[var(--color-text-muted)]">
					{isAr ? 'تواصل معنا عبر واتساب مع وصف مشروعك وسنقدم لك عرض سعر مخصص خلال 24 ساعة' : 'Contact us on WhatsApp with your project description and we will provide a custom quote within 24 hours'}
				</p>
				<a
					href={getWhatsAppLink('')}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-3 rounded-full bg-brand-orange px-12 py-5 text-lg font-black text-white shadow-xl shadow-brand-orange/20 transition-all hover:scale-105 hover:shadow-brand-orange/40"
				>
					{isAr ? 'اطلب عرض سعر عبر واتساب' : 'Request a Quote on WhatsApp'}
					<ArrowLeft class="h-5 w-5 {isAr ? '' : 'rotate-180'}" />
				</a>
			</div>
		</div>
	</div>
</section>

<div class="bg-[var(--color-background)] transition-colors duration-1000">
	<CtaSection {data} />
</div>
