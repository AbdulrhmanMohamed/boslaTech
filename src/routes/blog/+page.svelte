<script lang="ts">
	import { base } from '$app/paths';
	import { ArrowLeft, Calendar, Clock, Sparkles } from '@lucide/svelte';
	import HeroBackground from '$lib/components/HeroBackground.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';

	let { data } = $props();
	const typed = data as any;
	const blogPage = typed?.blogPage;
	const lang = typed?.lang || 'ar';
	const isAr = lang === 'ar';
</script>

<svelte:head>
	<title>{blogPage?.title || 'Blog'} — {typed?.site?.siteName || 'BOSLA'}</title>
	<meta name="description" content={blogPage?.subtitle || ''} />
</svelte:head>

<section class="relative flex min-h-[50vh] w-full items-center justify-center overflow-hidden transition-colors duration-1000" dir={isAr ? 'rtl' : 'ltr'}>
	<HeroBackground />
	<div class="relative z-10 container mx-auto px-6 py-24">
		<div class="mx-auto max-w-4xl space-y-8 text-center">
			<div class="flex justify-center">
				<Breadcrumbs {lang} items={[{ label: isAr ? 'المدونة' : 'Blog' }]} />
			</div>
			<div class="space-y-6">
				<h1 class="text-5xl leading-tight font-black text-[var(--color-text-base)] md:text-6xl">{blogPage?.title || ''}</h1>
				<p class="mx-auto max-w-2xl text-xl leading-relaxed font-medium text-[var(--color-text-muted)]">{blogPage?.subtitle || ''}</p>
			</div>
		</div>
	</div>
</section>

<section class="relative w-full bg-[var(--color-background)] py-24 transition-colors duration-1000" dir={isAr ? 'rtl' : 'ltr'}>
	<div class="container mx-auto px-6">
		<div class="mx-auto max-w-4xl space-y-12">
			{#each blogPage?.posts || [] as post}
				<article class="cinematic-glass group relative overflow-hidden rounded-3xl border border-[var(--glass-border)] p-8 transition-all hover:border-brand-blue/20 hover:shadow-xl">
					<a href={`${base}/blog/${post.slug}?lang=${lang}`} class="block">
						<div class="mb-4 flex flex-wrap items-center gap-4 text-xs font-medium text-[var(--color-text-muted)]">
							<span class="inline-flex items-center gap-1.5">
								<Calendar class="h-3.5 w-3.5" />
								{post.date}
							</span>
							<span class="inline-flex items-center gap-1.5">
								<Clock class="h-3.5 w-3.5" />
								{post.readingTime}
							</span>
						</div>
						<h2 class="mb-4 text-2xl font-black text-[var(--color-text-base)] transition-colors group-hover:text-brand-blue">{post.title}</h2>
						<p class="mb-6 text-base leading-relaxed font-medium text-[var(--color-text-muted)]">{post.excerpt}</p>
						<div class="flex items-center gap-2 text-sm font-bold text-brand-blue">
							{isAr ? 'اقرأ المزيد' : 'Read More'}
							<ArrowLeft class="h-4 w-4 {isAr ? '' : 'rotate-180'}" />
						</div>
					</a>
				</article>
			{/each}
		</div>
	</div>
</section>
