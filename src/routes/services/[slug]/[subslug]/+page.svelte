<script lang="ts">
	import { base } from '$app/paths';
	import { Check, ArrowLeft, ChevronDown, Sparkles, Tag } from '@lucide/svelte';
	import HeroBackground from '$lib/components/HeroBackground.svelte';
	import CtaSection from '$lib/components/CtaSection.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';

	let { data } = $props();
	const typed = $derived(data);
	const service = $derived(typed?.service);
	const category = $derived(typed?.category);
	const lang = $derived(typed?.lang || 'ar');
	const isAr = $derived(lang === 'ar');

	const phoneNumber = '966576704683';

	function getWhatsAppLink(st: string): string {
		const msg = isAr ? `مرحباً، أود الاستفسار عن خدمة: ${st}` : `Hello, I'm interested in: ${st}`;
		return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`;
	}
</script>

<svelte:head>
	<title>{service?.title || ''} — {category?.name || ''} — {typed?.site?.siteName || 'BOSLA'}</title>
	<meta name="description" content={service?.desc || ''} />
	<script type="application/ld+json">
		{JSON.stringify({
			"@context": "https://schema.org",
			"@type": "Service",
			"name": service?.title || '',
			"description": service?.desc || '',
			"provider": {
				"@type": "LocalBusiness",
				"name": "مؤسسة حافة النجوم",
				"telephone": "+966576704683"
			}
		})}
	</script>
	{#if service?.faq?.length}
		<script type="application/ld+json">
			{JSON.stringify({
				"@context": "https://schema.org",
				"@type": "FAQPage",
				"mainEntity": service.faq.map((f: any) => ({
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
	<script type="application/ld+json">
		{JSON.stringify({
			"@context": "https://schema.org",
			"@type": "BreadcrumbList",
			"itemListElement": [
				{ "@type": "ListItem", "position": 1, "name": isAr ? 'الرئيسية' : 'Home', "item": "https://hafatalnjom.com" },
				{ "@type": "ListItem", "position": 2, "name": isAr ? 'خدماتنا' : 'Our Services', "item": "https://hafatalnjom.com/services" },
				{ "@type": "ListItem", "position": 3, "name": category?.name || '', "item": `https://hafatalnjom.com/services/${category?.slug}` },
				{ "@type": "ListItem", "position": 4, "name": service?.title || '' }
			]
		})}
	</script>
</svelte:head>

{#if service}
	<section class="relative flex min-h-[60vh] w-full items-center justify-center overflow-hidden transition-colors duration-1000" dir={isAr ? 'rtl' : 'ltr'}>
		<HeroBackground />
		<div class="relative z-10 container mx-auto px-6 pt-36 pb-24">
			<div class="mx-auto max-w-4xl space-y-8">
				<div class="flex justify-center">
					<Breadcrumbs
						{lang}
						items={[
							{ label: isAr ? 'خدماتنا' : 'Services', href: `${base}/services?lang=${lang}` },
							{ label: category?.name || '', href: `${base}/services/${category?.slug}?lang=${lang}` },
							{ label: service?.title || '' }
						]}
					/>
				</div>
				<div class="space-y-6 text-center">
					<h1 class="text-5xl leading-tight font-black text-[var(--color-text-base)] md:text-6xl">{service.title}</h1>
					<p class="mx-auto max-w-2xl text-xl leading-relaxed font-medium text-[var(--color-text-muted)]">{service.desc}</p>
				</div>
			</div>
		</div>
	</section>

	<section class="relative w-full bg-[var(--color-background)] py-24 transition-colors duration-1000" dir={isAr ? 'rtl' : 'ltr'}>
		<div class="container mx-auto px-6">
			<div class="mx-auto max-w-4xl">
				<div class="prose prose-lg mx-auto max-w-none text-[var(--color-text-base)]" style="line-height: 1.9;">
					{@html service.details}
				</div>

				{#if service.features?.length}
					<div class="mt-16">
						<h2 class="mb-10 text-center text-3xl font-black text-[var(--color-text-base)]">
							{isAr ? 'المميزات' : 'Features'}
						</h2>
						<div class="grid gap-5 md:grid-cols-2">
							{#each service.features as feat}
								<div class="flex items-start gap-4 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-highlight)] p-5">
									<div class="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-blue/10">
										<Check class="h-4 w-4 text-brand-blue" />
									</div>
									<span class="text-base font-medium text-[var(--color-text-base)]">{feat}</span>
								</div>
							{/each}
						</div>
					</div>
				{/if}

				{#if service.topics?.length}
					<div class="mt-16">
						<h2 class="mb-10 text-center text-3xl font-black text-[var(--color-text-base)]">
							{isAr ? 'مواضيع نغطيها أيضاً' : 'Topics We Also Cover'}
						</h2>
						<div class="flex flex-wrap justify-center gap-3">
							{#each service.topics as topic}
								<div class="flex items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass-highlight)] px-5 py-2.5">
									<Tag class="h-3.5 w-3.5 text-brand-blue" />
									<span class="text-sm font-medium text-[var(--color-text-muted)]">{topic.label}</span>
								</div>
							{/each}
						</div>
					</div>
				{/if}

				{#if service.faq?.length}
					<div class="mt-16">
						<h2 class="mb-10 text-center text-3xl font-black text-[var(--color-text-base)]">
							{isAr ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
						</h2>
						<div class="space-y-4">
							{#each service.faq as faq}
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
					</div>
				{/if}

				<div class="mt-16 text-center">
					<div class="mb-4 inline-flex items-center gap-3 rounded-full border border-[var(--glass-border)] px-6 py-2">
						<Sparkles class="h-4 w-4 text-brand-orange" />
						<span class="text-xs font-black tracking-widest text-[var(--color-text-muted)] uppercase">
							{isAr ? 'جاهز للبدء؟' : 'Ready to Get Started?'}
						</span>
					</div>
					<a
						href={getWhatsAppLink(service.title)}
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

					<div class="mt-8">
						<a
							href={`${base}/services/${category?.slug}?lang=${lang}`}
							class="inline-flex items-center gap-2 text-sm font-bold text-brand-blue transition-colors hover:text-brand-orange"
						>
							<ArrowLeft class="h-4 w-4 {isAr ? '' : 'rotate-180'}" />
							{isAr ? 'العودة إلى ' + (category?.name || '') : 'Back to ' + (category?.name || '')}
						</a>
					</div>
				</div>
			</div>
		</div>
	</section>
{/if}

<div class="bg-[var(--color-background)] transition-colors duration-1000">
	<CtaSection {data} />
</div>
