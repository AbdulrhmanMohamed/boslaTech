<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import CustomCursor from '$lib/components/CustomCursor.svelte';
	import WhatsAppButton from '$lib/components/WhatsAppButton.svelte';
	import DrawerPanel from '$lib/components/DrawerPanel.svelte';
	import { onMount } from 'svelte';
	import type { Site } from '$lib/types';
	import Lenis from 'lenis';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import { setContext } from 'svelte';
	import { fade } from 'svelte/transition';
	import { base } from '$app/paths';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';

	const logoSrc = `${base}/images/boslalogo-web.png`;
	const favSrc = `${base}/images/bosla-fav.png`;

	// Aspect ratio for the new logo (900x310)
	const logoWidth = 150;
	const logoHeight = (logoWidth * 310) / 900; // ~51.6px

	let props = $props<{ children: any; data?: { site: Site; lang: 'en' | 'ar' } }>();
	const data = $derived(props.data);
	const dir = $derived(data?.lang === 'ar' ? 'rtl' : 'ltr');

	// Magnetic Interaction Base: Shared mouse coordinates
	let mouse = $state({ x: 0, y: 0, scrollY: 0 });
	setContext('mouse', mouse);

	let scrollProgress = $state(0);
	function onScroll() {
		const scrollTop = window.scrollY;
		const docHeight = document.documentElement.scrollHeight - window.innerHeight;
		scrollProgress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
	}

	$effect(() => {
		if (!data) return; // Guard against undefined data
		document.documentElement.setAttribute('lang', data.lang);
		document.documentElement.setAttribute('dir', dir);
	});

	onMount(() => {
		// Global Mouse Tracking
		const handleMouseMove = (e: MouseEvent) => {
			mouse.x = e.clientX;
			mouse.y = e.clientY;
		};

		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('scroll', onScroll);

		// Register GSAP plugins
		gsap.registerPlugin(ScrollTrigger);

		// Check if mobile - disable Lenis on mobile for better performance
		const isMobile = window.innerWidth < 768;

		// Initialize Lenis Smooth Scroll (desktop only)
		let lenis: Lenis | null = null;

		if (!isMobile) {
			lenis = new Lenis({
				duration: 1.2,
				easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
				orientation: 'vertical',
				gestureOrientation: 'vertical',
				smoothWheel: true,
				wheelMultiplier: 1,
				touchMultiplier: 2
			});

			// Expose for inspection and other scripts
			(window as any).lenis = lenis;
		}

		(window as any).gsap = gsap;
		(window as any).ScrollTrigger = ScrollTrigger;

		// Proper Lenis + ScrollTrigger sync (desktop only)
		if (lenis) {
			lenis.on('scroll', ScrollTrigger.update);

			// Tell ScrollTrigger to use Lenis's scroll position
			ScrollTrigger.scrollerProxy(window, {
				scrollTop: (value?: number) => {
					if (value !== undefined) {
						lenis!.scrollTo(value, { immediate: true });
					}
					return lenis!.scroll;
				},
				getBoundingClientRect() {
					return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
				},
				pinType: 'transform'
			});

			// Sync Lenis with GSAP ticker
			gsap.ticker.add((time) => {
				lenis!.raf(time * 1000);
			});

			gsap.ticker.lagSmoothing(0);

			// Update ScrollTrigger when Lenis scrolls
			lenis.on('scroll', (e: any) => {
				mouse.scrollY = e.scroll;
				document.documentElement.classList.toggle('is-scrolling', e.velocity !== 0);
			});

			// Initial ScrollTrigger refresh after everything is loaded
			requestAnimationFrame(() => {
				ScrollTrigger.refresh();
			});

			return () => {
				lenis?.destroy();
				ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
			};
		} else {
			// Mobile: basic ScrollTrigger without Lenis
			gsap.ticker.lagSmoothing(0);

			requestAnimationFrame(() => {
				ScrollTrigger.refresh();
			});

			return () => {
				ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
			};
		}
	});
</script>

<svelte:head>
	{#if data?.site}
		<title>{data.site.siteName} — {data.site.tagline}</title>
		<meta name="description" content={data.site.description} />
		<meta property="og:title" content={`${data.site.siteName} — ${data.site.tagline}`} />
		<meta property="og:description" content={data.site.description} />
		<meta name="twitter:title" content={`${data.site.siteName} — ${data.site.tagline}`} />
		<meta name="twitter:description" content={data.site.description} />
	{/if}
	<link rel="icon" type="image/png" href={favSrc} />
	<meta property="og:image" content={logoSrc} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content={logoSrc} />
</svelte:head>

<!-- Scroll Progress Bar -->
<div
	class="fixed top-0 left-0 z-[9999] h-[3px] bg-gradient-to-r from-brand-blue to-brand-orange transition-all duration-150"
	style="width: {scrollProgress * 100}%"
></div>

<!-- Sticky Get a Quote -->
<a
	href={`${base}/contact?lang=${data?.lang || 'ar'}`}
	class="group fixed z-50 flex items-center justify-center transition-all duration-300"
	class:left-6={data?.lang === 'en'}
	class:right-6={data?.lang === 'ar'}
	style="bottom: 5.5rem;"
	aria-label={data?.lang === 'ar' ? 'احصل على عرض سعر' : 'Get a Quote'}
>
	<div
		class="relative flex h-12 w-12 items-center justify-center rounded-full shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-110"
		style="background: var(--color-brand-orange);"
	>
		<div
			class="absolute inset-0 -z-10 animate-ping rounded-full opacity-50"
			style="background: var(--color-brand-orange);"
		></div>
		<ArrowUpRight class="h-6 w-6 text-white" />
	</div>
</a>

{#if data?.site}
	<Header site={data.site} lang={data.lang} />
{/if}

<CustomCursor />
{#if data}
	<WhatsAppButton lang={data.lang} />
	<DrawerPanel site={data.site} lang={data.lang} />
{/if}

<div class="atmospheric-noise"></div>

<main class="mx-auto min-h-screen">
	<div class="transition-all duration-700 ease-in-out">
		{@render props.children?.()}
	</div>
</main>

{#if data}
	<Footer {data} />
{/if}
