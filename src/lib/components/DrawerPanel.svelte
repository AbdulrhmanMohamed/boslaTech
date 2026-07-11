<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { X, Globe, MessageSquare, ArrowRight } from '@lucide/svelte';
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import ThemeToggle from './ThemeToggle.svelte';
	import { theme } from '$lib/stores/theme.svelte';
	import { clearLanguageCache } from '$lib/utils/language';
	import { base } from '$app/paths';
	import { closeDrawer, getDrawerState } from '$lib/stores/drawer.svelte';

	const props = $props<{ site?: any; lang: 'en' | 'ar' }>();
	const logoSrc = `${base}/images/blue-logo.png`;

	const logoWidth = 120;
	const logoHeight = (logoWidth * 310) / 900;

	const isOpen = $derived(getDrawerState());

	function link(path: string) {
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

	const isActive = (path: string) => {
		const currentPath = $page?.url?.pathname || '/';
		if (path === `${base}/`) {
			return currentPath === `${base}/`;
		}
		return currentPath.startsWith(path);
	};

	const navItems = $derived([
		{
			path: `${base}/`,
			label: props.site?.nav?.home || (props.lang === 'ar' ? 'الرئيسية' : 'Home')
		},
		{
			path: `${base}/about`,
			label: props.site?.nav?.about || (props.lang === 'ar' ? 'من نحن' : 'About')
		},
		{
			path: `${base}/contact`,
			label: props.site?.nav?.contact || (props.lang === 'ar' ? 'تواصل معنا' : 'Contact')
		},
		{
			path: `${base}/#pricing`,
			label: props.site?.nav?.pricing || (props.lang === 'ar' ? 'الأسعار' : 'Pricing')
		}
	]);

	const currentLangCode = $derived(props.lang);

	async function onLangSelectChange(e: Event) {
		const next = (e.target as HTMLSelectElement).value as 'en' | 'ar';
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

	function handleNavClick() {
		closeDrawer();
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			closeDrawer();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			closeDrawer();
		}
	}

	const drawerPositionClass = $derived(props.lang === 'ar' ? 'right-0' : 'left-0');
</script>

{#if isOpen}
	<!-- Backdrop Overlay -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-[100] transition-all duration-400"
		style="background: {theme.current === 'dark'
			? 'rgba(0, 0, 0, 0.6)'
			: 'rgba(0, 0, 0, 0.3)'}; backdrop-filter: blur(8px);"
		transition:fade={{ duration: 400 }}
		onclick={handleBackdropClick}
		onkeydown={handleKeydown}
	></div>

	<!-- Drawer Panel -->
	<div
		class="fixed top-0 bottom-0 z-[110] flex min-h-screen w-80 max-w-[85vw] flex-col border-x border-[var(--glass-border)] bg-[var(--color-background)] shadow-2xl {drawerPositionClass}"
		role="dialog"
		aria-label="Mobile navigation drawer"
		transition:fly={{ x: props.lang === 'ar' ? 320 : -320, duration: 600, easing: cubicOut }}
	>
		<!-- Drawer Header -->
		<div
			class="flex flex-shrink-0 flex-col gap-2 border-b border-[var(--glass-border)] px-6 py-6"
		>
			<div class="flex items-center justify-between">
				<a
					href={link(`${base}/`)}
					class="flex items-center gap-3"
					aria-label={props.lang === 'ar' ? 'الرئيسية' : 'Home'}
					onclick={handleNavClick}
				>
					<div class="logo-container relative w-[110px]" style="height: {logoHeight}px">
						<img src={logoSrc} alt="Bosla Logo" class="h-full w-full object-contain" />
					</div>
				</a>
				<div class="flex items-center gap-2">
					<ThemeToggle />
					<button
						onclick={closeDrawer}
						class="cinematic-glass rounded-xl p-2 text-[var(--color-text-dim)] hover:text-[var(--color-text-base)]"
						aria-label="Close menu"
					>
						<X class="h-5 w-5" />
					</button>
				</div>
			</div>
			<div class="text-[10px] font-bold leading-tight text-[var(--color-text-dim)]">
				<span class="opacity-70">
					{props.lang === 'ar' ? 'بوصلة التقنية بالشراكة مع' : 'Bosla Tech in partnership with'}
				</span>
				<span class="opacity-50"> {props.site?.registeredAs}</span>
			</div>
		</div>

		<!-- Drawer Content -->
		<div
			class="flex flex-1 flex-col overflow-y-auto {props.lang === 'ar'
				? 'text-right'
				: 'text-left'}"
		>
			<!-- Navigation Links -->
			<nav class="space-y-2 px-4 py-8">
				{#each navItems as item, i}
					<div transition:fly={{ y: 20, duration: 400, delay: 200 + i * 100, easing: cubicOut }}>
						<a
							href={link(item.path)}
							onclick={handleNavClick}
							class="group relative flex items-center justify-between rounded-2xl px-6 py-4 transition-all duration-300 {isActive(
								item.path
							)
								? 'bg-brand-blue text-white shadow-[0_10px_30px_rgba(0,119,255,0.3)]'
								: 'text-[var(--color-text-muted)] hover:bg-[var(--glass-highlight)] hover:text-[var(--color-text-base)]'} {props.lang ===
							'ar'
								? 'flex-row-reverse'
								: ''}"
						>
							<span class="text-lg font-black tracking-tight">{item.label}</span>
							<ArrowRight
								class="h-5 w-5 transition-transform duration-300 {props.lang === 'ar'
									? 'rotate-180 group-hover:-translate-x-1'
									: 'group-hover:translate-x-1'} {isActive(item.path)
									? 'opacity-100'
									: 'opacity-0 group-hover:opacity-100'}"
							/>

							{#if isActive(item.path)}
								<div
									class="animate-shimmer absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-white/0 via-white/10 to-white/0"
								></div>
							{/if}
						</a>
					</div>
				{/each}
			</nav>

			<!-- Language Switcher & CTA -->
			<div class="mt-auto space-y-6 p-6">
				<!-- Language Selector -->
				<div
					class="cinematic-glass space-y-4 rounded-[2rem] border border-[var(--glass-border)] p-6"
				>
					<div class="flex items-center gap-3 {props.lang === 'ar' ? 'flex-row-reverse' : ''}">
						<div
							class="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue"
						>
							<Globe class="h-4 w-4" />
						</div>
						<span class="text-xs font-black tracking-widest text-[var(--color-text-dim)] uppercase">
							{props.lang === 'ar' ? 'اللغة' : 'Language'}
						</span>
					</div>

					<div class="relative">
						<select
							aria-label="Language"
							class="w-full appearance-none rounded-xl border border-[var(--glass-border)] bg-[var(--glass-highlight)] px-4 py-3 text-sm font-bold text-[var(--color-text-base)] transition-all focus:border-brand-blue focus:outline-none"
							value={currentLangCode}
							onchange={onLangSelectChange}
						>
							<option value="en" class="bg-[var(--color-background)]">English</option>
							<option value="ar" class="bg-[var(--color-background)]">العربية</option>
						</select>
						<div
							class="absolute inset-y-0 {props.lang === 'ar'
								? 'left-4'
								: 'right-4'} pointer-events-none flex items-center text-[var(--color-text-dim)]"
						>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 9l-7 7-7-7"
								/></svg
							>
						</div>
					</div>
				</div>

				<!-- CTA Button -->
				<a
					href={link('/contact')}
					onclick={handleNavClick}
					class="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-brand-blue px-6 py-5 text-center text-base font-black text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
				>
					<div
						class="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-1000 group-hover:translate-x-[100%]"
					></div>
					<MessageSquare class="h-5 w-5" />
					{props.lang === 'ar' ? 'احجز استشارة مجانية' : 'Book Free Consultation'}
				</a>

				<!-- Commercial Registration -->
				<div class="text-center text-[10px] leading-relaxed text-[var(--color-text-dim)] opacity-60">
					{props.site?.registeredAs} | س.ت {props.site?.commercialRegistration}
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Base styles for drawer animation could be added here if needed */
</style>
