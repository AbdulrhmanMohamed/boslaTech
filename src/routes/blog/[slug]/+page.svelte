<script lang="ts">
	import { base } from '$app/paths';
	import { ArrowLeft, Calendar, Clock, Sparkles, User } from '@lucide/svelte';
	import HeroBackground from '$lib/components/HeroBackground.svelte';
	import CtaSection from '$lib/components/CtaSection.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';

	let { data } = $props();
	const typed = data as any;
	const post = typed?.post;
	const blogPage = typed?.blogPage;
	const lang = typed?.lang || 'ar';
	const isAr = lang === 'ar';
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
		<div class="relative z-10 container mx-auto px-6 py-24">
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
