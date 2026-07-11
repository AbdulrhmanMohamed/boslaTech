<script lang="ts">
	import { base } from '$app/paths';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Home from '@lucide/svelte/icons/home';

	let { items, lang = 'ar' }: { items: { label: string; href?: string }[]; lang?: string } = $props();

	const isAr = lang === 'ar';
</script>

<nav aria-label={isAr ? 'مسار التنقل' : 'Breadcrumb'} class="mb-4 flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-muted)]">
	<a href={base || '/'} class="flex items-center gap-1 transition-colors hover:text-brand-blue" aria-label={isAr ? 'الرئيسية' : 'Home'}>
		<Home class="h-3 w-3" />
	</a>
	{#each items as item, i}
		<ChevronRight class="h-3 w-3 opacity-40 {isAr ? 'rotate-180' : ''}" />
		{#if item.href && i < items.length - 1}
			<a href={item.href} class="transition-colors hover:text-brand-blue">{item.label}</a>
		{:else}
			<span class="text-[var(--color-text-base)]">{item.label}</span>
		{/if}
	{/each}
</nav>
