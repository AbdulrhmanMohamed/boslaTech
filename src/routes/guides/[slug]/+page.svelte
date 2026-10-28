<script lang="ts">
	import { base } from '$app/paths';
	import { ArrowLeft, ChevronDown, Sparkles } from '@lucide/svelte';
	import HeroBackground from '$lib/components/HeroBackground.svelte';
	import CtaSection from '$lib/components/CtaSection.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';

	let { data } = $props();
	const typed = $derived(data);
	const guide = $derived(typed?.guide);
	const lang = $derived(typed?.lang || 'ar');
	const isAr = $derived(lang === 'ar');

	const phoneNumber = '966576944605';

	function getWhatsAppLink(st: string): string {
		const msg = isAr ? `مرحباً، أود الاستفسار عن خدمة: ${st}` : `Hello, I'm interested in: ${st}`;
		return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`;
	}
</script>

<svelte:head>
	<title>{guide?.title || ''} — {typed?.site?.siteName || 'BOSLA'}</title>
	<meta name="description" content={guide?.desc || ''} />
	<script type="application/ld+json">
		{JSON.stringify({
			"@context": "https://schema.org",
			"@type": "BreadcrumbList",
			"itemListElement": [
				{ "@type": "ListItem", "position": 1, "name": isAr ? 'الرئيسية' : 'Home', "item": "https://hafatalnjom.com" },
				{ "@type": "ListItem", "position": 2, "name": isAr ? 'الأدلة الشاملة' : 'Guides", "item": "https://hafatalnjom.com/guides" },
				{ "@type": "ListItem", "position": 3, "name": guide?.title || '' }
			]
		})}
	</script>
	{#if guide?.faq?.length}
		<script type="application/ld+json">
			{JSON.stringify({
				"@context": "https://schema.org",
				"@type": "FAQPage",
				"mainEntity": guide.faq.map((f: any) => ({
					"@type": "Question",
					"name": f.q,
					"acceptedAnswer": {
						"@type": "Answer",
						"text": f.a
					}
				}))
			})}
		</script>
	{/if}
</svelte:head>

{#if guide}
	<section class="relative flex min-h-[50vh] w-full items-center justify-center overflow-hidden transition-colors duration-1000" dir={isAr ? 'rtl' : 'ltr'}>
		<HeroBackground />
		<div class="relative z-10 container mx-auto px-6 pt-36 pb-24">
			<div class="mx-auto max-w-4xl space-y-8 text-center">
				<div class="flex justify-center">
					<Breadcrumbs
						{lang}
						items={[
							{ label: isAr ? 'الأدلة الشاملة' : 'Guides', href: `${base}/guides?lang=${lang}` },
							{ label: guide?.title || '' }
						]}
					/>
				</div>
				<div class="space-y-6">
					<h1 class="text-4xl leading-tight font-black text-[var(--color-text-base)] md:text-5xl">{guide.title}</h1>
					<p class="mx-auto max-w-2xl text-lg leading-relaxed font-medium text-[var(--color-text-muted)]">{guide.desc}</p>
				</div>
			</div>
		</div>
	</section>

	<section class="relative w-full bg-[var(--color-background)] py-24 transition-colors duration-1000" dir={isAr ? 'rtl' : 'ltr'}>
		<div class="container mx-auto px-6">
			<div class="mx-auto max-w-3xl">
				{#each guide.sections as section}
					<div class="mb-16 last:mb-0">
						<h2 class="mb-6 text-2xl font-bold text-[var(--color-text-base)]">{section.heading}</h2>
						<div class="prose prose-lg mx-auto max-w-none text-[var(--color-text-base)]" style="line-height: 1.9;">
							{@html section.body}
						</div>
					</div>
				{/each}

				{#if guide.faq?.length}
					<hr class="my-16 border-[var(--glass-border)]" />

					<div class="mb-10 text-center">
						<h2 class="text-3xl font-black text-[var(--color-text-base)]">
							{isAr ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
						</h2>
					</div>

					<div class="space-y-4">
						{#each guide.faq as faq, i}
							<details class="group rounded-xl border border-[var(--glass-border)] bg-[var(--glass-highlight)] transition-all">
								<summary class="flex cursor-pointer items-center justify-between px-6 py-5 text-base font-bold text-[var(--color-text-base)]">
									<span>{faq.q}</span>
									<ChevronDown class="h-5 w-5 shrink-0 text-[var(--color-text-muted)] transition-transform duration-300 group-open:rotate-180" />
								</summary>
								<div class="border-t border-[var(--glass-border)] px-6 py-5">
									<p class="text-base leading-relaxed text-[var(--color-text-muted)]">{faq.a}</p>
								</div>
							</details>
						{/each}
					</div>
				{/if}

				<hr class="my-16 border-[var(--glass-border)]" />

				<div class="text-center">
					<div class="mb-6 inline-flex items-center gap-3 rounded-full border border-[var(--glass-border)] px-6 py-2">
						<Sparkles class="h-4 w-4 text-brand-orange" />
						<span class="text-xs font-black tracking-widest text-[var(--color-text-muted)] uppercase">
							{isAr ? 'هل تحتاج مساعدة؟' : 'Need Help?'}
						</span>
					</div>
					<a
						href={getWhatsAppLink(guide.title)}
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center gap-3 rounded-full bg-brand-orange px-12 py-5 text-lg font-black text-white shadow-xl shadow-brand-orange/20 transition-all hover:scale-105 hover:shadow-brand-orange/40"
					>
						{isAr ? 'تواصل معنا عبر واتساب' : 'Contact Us on WhatsApp'}
						<ArrowLeft class="h-5 w-5 {isAr ? '' : 'rotate-180'}" />
					</a>
					<p class="mt-4 text-sm font-medium text-[var(--color-text-muted)]">
						{isAr ? 'نخدم شركات في الرياض وجدة والدمام' : 'Serving businesses in Riyadh, Jeddah & Dammam'}
					</p>
				</div>
			</div>
		</div>
	</section>
{/if}

<div class="bg-[var(--color-background)] transition-colors duration-1000">
	<CtaSection {data} />
</div>
