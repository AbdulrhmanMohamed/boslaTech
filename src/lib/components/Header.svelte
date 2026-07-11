<script lang="ts">
	import { theme } from '$lib/stores/theme.svelte';
	import DrawerNavigation from './DrawerNavigation.svelte';
	import ThemeToggle from './ThemeToggle.svelte';
	import { goto, invalidate, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { clearLanguageCache } from '$lib/utils/language';
	import { base } from '$app/paths';
	import { inView } from '$lib/actions/inView';

	const props = $props<{ site?: any; lang: 'en' | 'ar' }>();
	const site = $derived(props.site);
	const lang = $derived(props.lang);

	const logoSrc = `${base}/images/blue-logo.webp`;

	// Aspect ratio for the new logo (900x310)
	const logoWidth = 150;
	const logoHeight = (logoWidth * 310) / 900; // ~51.6px

	async function handleLanguageSwitch(next: 'en' | 'ar') {
		const url = new URL(window.location.href);
		url.searchParams.set('lang', next);

		clearLanguageCache();
		await goto(url.pathname + url.search, {
			replaceState: true,
			noScroll: true,
			keepFocus: true
		});
		await invalidate('app:language');
	}

	function hrefWithLang(next: 'en' | 'ar') {
		// Only access URL in browser environment
		if (typeof window !== 'undefined' && $page?.url) {
			const p = $page.url.pathname;
			const q = new URLSearchParams($page.url.search);
			q.set('lang', next);
			return `${p}?${q.toString()}`;
		}
		// Fallback for prerendering
		return `/?lang=${next}`;
	}

	function link(path: string) {
		// Only access URL in browser environment
		if (typeof window !== 'undefined' && $page?.url) {
			const q = new URLSearchParams($page.url.search);
			const qs = q.toString();
			if (path.includes('#')) {
				const [basePath, hash] = path.split('#');
				return qs ? `${basePath}?${qs}#${hash}` : path;
			}
			return qs ? `${path}?${qs}` : path;
		}
		return path;
	}

	const currentPage = $derived.by(() => $page?.url?.pathname || '/');
	const currentTheme = $derived(theme.current);

	let navRefs = $state<Record<string, HTMLElement>>({});
	let pillStyles = $state({ left: 0, width: 0, height: 0, opacity: 0 });

	function navLinkClass(path: string) {
		const active = isActive(path);
		return `relative inline-flex items-center gap-1 text-sm md:text-base px-6 py-2 rounded-full transition-all duration-500 group overflow-hidden whitespace-nowrap z-10 ${
			active
				? 'text-white font-black scale-105'
				: 'text-[var(--color-text-muted)] hover:text-[var(--color-text-base)] group-[.in-view]:text-[var(--color-text-base)] font-bold hover:bg-[var(--glass-highlight)] group-[.in-view]:bg-[var(--glass-highlight)]'
		}`;
	}

	$effect(() => {
		const path = $page?.url?.pathname || '/';
		const items = navItems;
		const refs = navRefs;

		// First try exact match, then longest prefix match
		let activePath = '';
		for (const item of items) {
			const isExactMatch = path === item.path;
			const isPrefixMatch = path.startsWith(item.path) && item.path !== `${base}/`;

			if (isExactMatch || isPrefixMatch) {
				if (item.path.length > activePath.length) {
					activePath = item.path;
				}
			}
		}

		if (activePath && refs[activePath]) {
			const el = refs[activePath];
			pillStyles = {
				left: el.offsetLeft,
				width: el.offsetWidth,
				height: el.offsetHeight,
				opacity: 1
			};
		} else {
			pillStyles = { left: 0, width: 0, height: 0, opacity: 0 };
		}
	});

	// Make navItems reactive by using $derived
	const navItems = $derived([
		{ path: `${base}/`, label: site?.nav?.home || (lang === 'ar' ? 'الرئيسية' : 'Home') },
		{ path: `${base}/about`, label: site?.nav?.about || (lang === 'ar' ? 'من نحن' : 'About') },
		{
			path: `${base}/contact`,
			label: site?.nav?.contact || (lang === 'ar' ? 'تواصل معنا' : 'Contact')
		},
		{
			path: `${base}/#pricing`,
			label: site?.nav?.pricing || (lang === 'ar' ? 'الأسعار' : 'Pricing')
		}
	]);

	const isActive = (path: string) => {
		const currentPath = $page?.url?.pathname || '/';
		if (path === `${base}/`) {
			return currentPath === `${base}/`;
		}
		return currentPath.startsWith(path);
	};

	let scrollY = $state(0);
</script>

<svelte:window bind:scrollY />

<header
	class="pointer-events-none fixed top-6 right-0 left-0 z-50 flex justify-center px-6 transition-all duration-500 {scrollY >
	20
		? '-translate-y-2'
		: ''}"
>
	<nav
		class="cinematic-glass pointer-events-auto container grid max-w-5xl grid-cols-2 items-center rounded-full px-4 transition-all duration-500 md:grid-cols-3 md:px-8 {scrollY >
		20
			? 'bg-[var(--glass-bg)]/90 py-3 shadow-xl backdrop-blur-xl'
			: 'py-4'}"
		dir={lang === 'ar' ? 'rtl' : 'ltr'}
	>
		<!-- Logo Section -->
		<div class="flex items-center justify-start">
			<a
				use:inView
				href={link(`${base}/`)}
				class="group relative flex flex-col items-start"
				aria-label="Orcado Home"
			>
				<div
					class="logo-container relative w-[120px] transition-transform duration-500 group-hover:scale-105 group-[.in-view]:scale-105 md:w-[130px]"
					style="height: {logoHeight}px"
				>
					<img
						src={logoSrc}
						alt="Bosla Logo"
						width="150"
						height="52"
						class="h-full w-full object-contain"
						loading="eager"
						fetchpriority="high"
					/>
				</div>
				<h1
					class="mt-0.5 text-2xl font-bold leading-tight text-[var(--color-text-dim)]"
					style="font-family: 'Caveat', cursive;"
				>
					{lang === 'ar' ? 'حافة النجوم' : 'Hafat Alnjom'}
				</h1>
			</a>
		</div>

		<!-- Desktop Navigation - Centered -->
		<div class="hidden items-center justify-center md:flex">
			<ul class="relative flex items-center gap-1">
				<!-- Moving Highlight Pill -->
				<div
					class="pointer-events-none absolute rounded-full bg-brand-blue shadow-[0_10px_20px_rgba(0,119,255,0.3)] transition-all duration-500 ease-out"
					style="left: {pillStyles.left}px; width: {pillStyles.width}px; height: {pillStyles.height}px; opacity: {pillStyles.opacity}; top: 50%; transform: translateY(-50%);"
				></div>

				{#each navItems as item}
					<li bind:this={navRefs[item.path]}>
						<a use:inView class={navLinkClass(item.path)} href={link(item.path)}>
							<span class="relative z-10">{item.label}</span>
							{#if !isActive(item.path)}
								<div
									class="absolute inset-0 translate-y-full bg-brand-blue/10 transition-transform duration-500 group-hover:translate-y-0 group-[.in-view]:translate-y-0"
								></div>
							{/if}
						</a>
					</li>
				{/each}
			</ul>
		</div>

		<!-- Right Section: Theme Toggle, Language Toggle & Mobile Menu -->
		<div class="flex items-center justify-end gap-3">
			<!-- Theme Toggle -->
			<div class="hidden md:block">
				<ThemeToggle />
			</div>

			<!-- Desktop Language Toggle -->
			<div
				class="hidden items-center gap-1 rounded-full border border-[var(--glass-border)] bg-[var(--glass-highlight)] p-1 backdrop-blur-md md:flex"
			>
				<button
					onclick={() => handleLanguageSwitch('en')}
					use:inView
					class="rounded-full px-4 py-1.5 text-xs font-black transition-all duration-500 hover:scale-105 active:scale-95 [&.in-view]:scale-105 {lang ===
					'en'
						? 'bg-brand-blue text-white shadow-lg'
						: 'bg-brand-orange/20 text-brand-orange hover:bg-brand-orange/30 [&.in-view]:bg-brand-orange/30'}"
				>
					EN
				</button>
				<button
					onclick={() => handleLanguageSwitch('ar')}
					use:inView
					class="rounded-full px-4 py-1.5 text-xs font-black transition-all duration-500 hover:scale-105 active:scale-95 [&.in-view]:scale-105 {lang ===
					'ar'
						? 'bg-brand-blue text-white shadow-lg'
						: 'bg-brand-orange/20 text-brand-orange hover:bg-brand-orange/30 [&.in-view]:bg-brand-orange/30'}"
				>
					AR
				</button>
			</div>

			<!-- Mobile Menu Trigger -->
			<div class="md:hidden">
				<DrawerNavigation />
			</div>
		</div>
	</nav>
</header>

<style>
</style>
