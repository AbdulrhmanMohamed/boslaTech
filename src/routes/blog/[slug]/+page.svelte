<script lang="ts">
	import { base } from '$app/paths';
	import { ArrowLeft, Calendar, Clock, Sparkles, User, BookOpen, BarChart, ShoppingBag, Search, Megaphone, Palette } from '@lucide/svelte';
	import HeroBackground from '$lib/components/HeroBackground.svelte';
	import CtaSection from '$lib/components/CtaSection.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';

	let { data } = $props();
	const typed = $derived(data);
	const post = $derived(typed?.post);

	const lang = $derived(typed?.lang || 'ar');
	const isAr = $derived(lang === 'ar');

	const badgeColors: Record<string, string> = {
		guide: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
		comparison: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
		'case-study': 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20'
	};

	const badgeLabels = $derived<Record<string, string>>({
		guide: isAr ? 'دليل' : 'Guide',
		comparison: isAr ? 'مقارنة' : 'Comparison',
		'case-study': isAr ? 'دراسة حالة' : 'Case Study'
	});

	const relatedServices: Record<string, Array<{ href: string; icon: any; label: string; arLabel: string }>> = {
		guide: [
			{ href: '/services/web-development/custom-websites', icon: BookOpen, label: 'Custom Website Development', arLabel: 'خدمة تصميم مواقع مخصصة' },
			{ href: '/services/seo/technical-seo', icon: Search, label: 'Technical SEO Services', arLabel: 'خدمات تحسين محركات البحث التقني' },
			{ href: '/services/seo/local-seo', icon: BarChart, label: 'Local SEO', arLabel: 'تحسين محركات البحث المحلي' },
			{ href: '/services/digital-marketing/google-ads', icon: Megaphone, label: 'Google Ads Management', arLabel: 'إدارة إعلانات جوجل' },
			{ href: '/services/web-development/online-stores', icon: ShoppingBag, label: 'Online Stores', arLabel: 'تصميم المتاجر الإلكترونية' }
		],
		comparison: [
			{ href: '/services/web-development/online-stores', icon: ShoppingBag, label: 'E-commerce Store Setup', arLabel: 'خدمة تصميم متجر إلكتروني' },
			{ href: '/services/web-development/custom-websites', icon: BookOpen, label: 'Custom Website Development', arLabel: 'خدمة تصميم مواقع مخصصة' },
			{ href: '/services/web-development/wordpress-development', icon: BookOpen, label: 'WordPress Development', arLabel: 'خدمة تطوير ووردبريس' },
			{ href: '/services/seo/ecommerce-seo', icon: Search, label: 'E-commerce SEO', arLabel: 'تحسين المتاجر الإلكترونية' }
		],
		'case-study': [
			{ href: '/services/seo/local-seo', icon: BarChart, label: 'Local SEO Services', arLabel: 'خدمات تحسين محركات البحث المحلي' },
			{ href: '/services/web-development/online-stores', icon: ShoppingBag, label: 'Online Store Development', arLabel: 'خدمة تصميم المتاجر الإلكترونية' },
			{ href: '/services/digital-marketing/content-marketing', icon: Megaphone, label: 'Content Marketing', arLabel: 'خدمة التسويق بالمحتوى' },
			{ href: '/services/web-development/custom-websites', icon: BookOpen, label: 'Custom Websites', arLabel: 'خدمة تصميم مواقع مخصصة' },
			{ href: '/services/digital-marketing/brand-identity', icon: Palette, label: 'Brand Identity', arLabel: 'خدمة تصميم هوية بصرية' }
		]
	};

	const currentServices = $derived(relatedServices[post?.category] || relatedServices.guide);
</script>

<svelte:head>
	<title>{post?.title || ''} — {typed?.site?.siteName || 'BOSLA'}</title>
	<meta name="description" content={post?.excerpt || ''} />
	<script type="application/ld+json">
		{JSON.stringify({
			"@context": "https://schema.org",
			"@type": "Article",
			"headline": post?.title || '',
			"description": post?.excerpt || '',
			"datePublished": post?.date || '',
			"author": {
				"@type": "Organization",
				"name": post?.author || 'BOSLA'
			},
			"publisher": {
				"@type": "Organization",
				"name": "مؤسسة حافة النجوم"
			}
		})}
	</script>
	<script type="application/ld+json">
		{JSON.stringify({
			"@context": "https://schema.org",
			"@type": "BreadcrumbList",
			"itemListElement": [
				{ "@type": "ListItem", "position": 1, "name": isAr ? 'الرئيسية' : 'Home', "item": "https://hafatalnjom.com" },
				{ "@type": "ListItem", "position": 2, "name": isAr ? 'المدونة' : 'Blog', "item": "https://hafatalnjom.com/blog" },
				{ "@type": "ListItem", "position": 3, "name": post?.title || '' }
			]
		})}
	</script>
</svelte:head>

{#if post}
	<section class="relative flex min-h-[50vh] w-full items-center justify-center overflow-hidden transition-colors duration-1000" dir={isAr ? 'rtl' : 'ltr'}>
		<HeroBackground />
		<div class="relative z-10 container mx-auto px-6 pt-36 pb-24">
			<div class="mx-auto max-w-4xl space-y-8 text-center">
				<div class="flex justify-center">
					<Breadcrumbs
						{lang}
						items={[
							{ label: isAr ? 'المدونة' : 'Blog', href: `${base}/blog?lang=${lang}` },
							{ label: post?.title || '' }
						]}
					/>
				</div>
				<div class="space-y-6">
					{#if post.category}
						<div class="flex justify-center">
							<span class="inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-black uppercase tracking-wider {badgeColors[post.category] || ''}">
								{badgeLabels[post.category] || post.category}
							</span>
						</div>
					{/if}
					<h1 class="text-4xl leading-tight font-black text-[var(--color-text-base)] md:text-5xl">{post.title}</h1>
					<div class="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-[var(--color-text-muted)]">
						<span class="inline-flex items-center gap-1.5">
							<Calendar class="h-4 w-4" />
							{post.date}
						</span>
						<span class="inline-flex items-center gap-1.5">
							<Clock class="h-4 w-4" />
							{post.readingTime}
						</span>
						<span class="inline-flex items-center gap-1.5">
							<User class="h-4 w-4" />
							{post.author}
						</span>
					</div>
					<p class="mx-auto max-w-2xl text-lg leading-relaxed font-medium text-[var(--color-text-muted)]">{post.excerpt}</p>
				</div>
			</div>
		</div>
	</section>

	<section class="relative w-full bg-[var(--color-background)] py-24 transition-colors duration-1000" dir={isAr ? 'rtl' : 'ltr'}>
		<div class="container mx-auto px-6">
			<div class="mx-auto max-w-3xl">
				<div class="prose prose-lg mx-auto max-w-none text-[var(--color-text-base)]" style="line-height: 1.9;">
					{@html post.content}
				</div>

				<!-- Related Services -->
				<div class="my-16 rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-highlight)] p-8">
					<div class="mb-6 inline-flex items-center gap-3 rounded-full border border-[var(--glass-border)] px-6 py-2">
						<Sparkles class="h-4 w-4 text-brand-orange" />
						<span class="text-xs font-black tracking-widest text-[var(--color-text-muted)] uppercase">
							{isAr ? 'خدمات ذات صلة' : 'Related Services'}
						</span>
					</div>
					<div class="grid gap-4 sm:grid-cols-2">
						{#each currentServices as svc}
							<a
								href={`${base}${svc.href}?lang=${lang}`}
								class="group flex items-center gap-3 rounded-2xl border border-[var(--glass-border)] bg-[var(--color-background)] p-4 transition-all hover:border-brand-blue/30 hover:shadow-md"
							>
								<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
									<svc.icon class="h-5 w-5" />
								</div>
								<div>
									<span class="text-sm font-bold text-[var(--color-text-base)] transition-colors group-hover:text-brand-blue">
										{isAr ? svc.arLabel : svc.label}
									</span>
								</div>
								<ArrowLeft class="mr-auto h-4 w-4 shrink-0 text-[var(--color-text-muted)] transition-colors group-hover:text-brand-blue {isAr ? '' : 'rotate-180'}" />
							</a>
						{/each}
					</div>
				</div>

				<hr class="my-16 border-[var(--glass-border)]" />

				<div class="text-center">
					<div class="mb-6 inline-flex items-center gap-3 rounded-full border border-[var(--glass-border)] px-6 py-2">
						<Sparkles class="h-4 w-4 text-brand-orange" />
						<span class="text-xs font-black tracking-widest text-[var(--color-text-muted)] uppercase">
							{isAr ? 'هل أعجبك المقال؟' : 'Enjoyed This Article?'}
						</span>
					</div>
					<a
						href={`${base}/blog?lang=${lang}`}
						class="inline-flex items-center gap-2 text-sm font-bold text-brand-blue transition-colors hover:text-brand-orange"
					>
						<ArrowLeft class="h-4 w-4 {isAr ? '' : 'rotate-180'}" />
						{isAr ? 'العودة إلى المدونة' : 'Back to Blog'}
					</a>
				</div>
			</div>
		</div>
	</section>
{/if}

<div class="bg-[var(--color-background)] transition-colors duration-1000">
	<CtaSection {data} />
</div>

<style>
	:global(.prose p) {
		margin-bottom: 1.5rem;
	}
	:global(.prose h2) {
		margin-top: 2.5rem;
		margin-bottom: 1rem;
		font-size: 1.5rem;
		font-weight: 800;
		color: var(--color-text-base);
	}
	:global(.prose h3) {
		margin-top: 2rem;
		margin-bottom: 0.75rem;
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-text-base);
	}
</style>
