<script lang="ts">
	import { base } from '$app/paths';
	import { ArrowLeft, MapPin, Briefcase, Target, CheckCircle, MessageCircle, Sparkles } from '@lucide/svelte';
	import HeroBackground from '$lib/components/HeroBackground.svelte';
	import CtaSection from '$lib/components/CtaSection.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';

	let { data } = $props();
	const typed = $derived(data);
	const study = $derived(typed?.study);
	const lang = $derived(typed?.lang || 'ar');
	const isAr = $derived(lang === 'ar');

	const phoneNumber = '966576704683';

	function getWhatsAppLink(st: string): string {
		const msg = isAr ? `مرحباً، أود الاستفسار عن: ${st}` : `Hello, I'm interested in: ${st}`;
		return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`;
	}
</script>

<svelte:head>
	<title>{study?.title || ''} — {typed?.site?.siteName || 'BOSLA'}</title>
	<meta name="description" content={study?.desc || ''} />
</svelte:head>

{#if study}
	<section class="relative flex min-h-[50vh] w-full items-center justify-center overflow-hidden transition-colors duration-1000" dir={isAr ? 'rtl' : 'ltr'}>
		<HeroBackground />
		<div class="relative z-10 container mx-auto px-6 pt-36 pb-24">
			<div class="mx-auto max-w-4xl space-y-8 text-center">
				<div class="flex justify-center">
					<Breadcrumbs
						{lang}
						items={[
							{ label: isAr ? 'دراسات الحالة' : 'Case Studies', href: `${base}/case-studies?lang=${lang}` },
							{ label: study?.title || '' }
						]}
					/>
				</div>
				<div class="space-y-6">
					<h1 class="text-4xl leading-tight font-black text-[var(--color-text-base)] md:text-5xl">{study.title}</h1>
					<p class="mx-auto max-w-2xl text-lg leading-relaxed font-medium text-[var(--color-text-muted)]">{study.desc}</p>
				</div>
			</div>
		</div>
	</section>

	<section class="relative w-full bg-[var(--color-background)] py-24 transition-colors duration-1000" dir={isAr ? 'rtl' : 'ltr'}>
		<div class="container mx-auto px-6">
			<div class="mx-auto max-w-4xl">
				<div class="mb-12 grid gap-6 md:grid-cols-4">
					<div class="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-highlight)] p-5 text-center">
						<Briefcase class="mx-auto mb-2 h-5 w-5 text-brand-blue" />
						<p class="text-xs font-bold text-[var(--color-text-muted)] uppercase">{isAr ? 'العميل' : 'Client'}</p>
						<p class="mt-1 text-sm font-bold text-[var(--color-text-base)]">{study.client}</p>
					</div>
					<div class="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-highlight)] p-5 text-center">
						<Target class="mx-auto mb-2 h-5 w-5 text-brand-blue" />
						<p class="text-xs font-bold text-[var(--color-text-muted)] uppercase">{isAr ? 'المجال' : 'Industry'}</p>
						<p class="mt-1 text-sm font-bold text-[var(--color-text-base)]">{study.industry}</p>
					</div>
					<div class="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-highlight)] p-5 text-center">
						<MapPin class="mx-auto mb-2 h-5 w-5 text-brand-blue" />
						<p class="text-xs font-bold text-[var(--color-text-muted)] uppercase">{isAr ? 'الموقع' : 'Location'}</p>
						<p class="mt-1 text-sm font-bold text-[var(--color-text-base)]">{study.location}</p>
					</div>
					<div class="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-highlight)] p-5 text-center">
						<Sparkles class="mx-auto mb-2 h-5 w-5 text-brand-blue" />
						<p class="text-xs font-bold text-[var(--color-text-muted)] uppercase">{isAr ? 'الخدمات' : 'Services'}</p>
						<p class="mt-1 text-sm font-bold text-[var(--color-text-base)]">{study.services.join(', ')}</p>
					</div>
				</div>

				<div class="mb-12">
					<h2 class="mb-4 text-2xl font-bold text-[var(--color-text-base)]">
						{isAr ? 'التحدي' : 'The Challenge'}
					</h2>
					<p class="text-base leading-relaxed text-[var(--color-text-muted)]">{study.challenge}</p>
				</div>

				<div class="mb-12">
					<h2 class="mb-4 text-2xl font-bold text-[var(--color-text-base)]">
						{isAr ? 'الحل' : 'The Solution'}
					</h2>
					<p class="text-base leading-relaxed text-[var(--color-text-muted)]">{study.solution}</p>
				</div>

				<div class="mb-12">
					<h2 class="mb-6 text-2xl font-bold text-[var(--color-text-base)]">
						{isAr ? 'النتائج' : 'Results'}
					</h2>
					<div class="space-y-4">
						{#each study.results as result}
							<div class="flex items-start gap-4 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-highlight)] p-5">
								<div class="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-500/10">
									<CheckCircle class="h-4 w-4 text-green-500" />
								</div>
								<span class="text-base font-medium text-[var(--color-text-base)]">{result}</span>
							</div>
						{/each}
					</div>
				</div>

				{#if study.testimonial}
					<div class="rounded-2xl border border-[var(--glass-border)] bg-gradient-to-br from-brand-blue/5 to-brand-orange/5 p-8 text-center">
						<MessageCircle class="mx-auto mb-4 h-8 w-8 text-brand-orange" />
						<p class="mb-6 text-lg leading-relaxed font-medium italic text-[var(--color-text-base)]">"{study.testimonial.text}"</p>
						<p class="font-bold text-[var(--color-text-base)]">{study.testimonial.name}</p>
						<p class="text-sm text-[var(--color-text-muted)]">{study.testimonial.role}</p>
					</div>
				{/if}

				<hr class="my-16 border-[var(--glass-border)]" />
				<div class="text-center">
					<div class="mb-6 inline-flex items-center gap-3 rounded-full border border-[var(--glass-border)] px-6 py-2">
						<Sparkles class="h-4 w-4 text-brand-orange" />
						<span class="text-xs font-black tracking-widest text-[var(--color-text-muted)] uppercase">
							{isAr ? 'نريد تحقيق نفس النتائج لك' : "Let's Achieve Similar Results"}
						</span>
					</div>
					<a
						href={getWhatsAppLink(study.title)}
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center gap-3 rounded-full bg-brand-orange px-12 py-5 text-lg font-black text-white shadow-xl shadow-brand-orange/20 transition-all hover:scale-105 hover:shadow-brand-orange/40"
					>
						{isAr ? 'تواصل معنا عبر واتساب' : 'Contact Us on WhatsApp'}
						<ArrowLeft class="h-5 w-5 {isAr ? '' : 'rotate-180'}" />
					</a>
				</div>
			</div>
		</div>
	</section>
{/if}

<div class="bg-[var(--color-background)] transition-colors duration-1000">
	<CtaSection {data} />
</div>
