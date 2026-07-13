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
	import { setContext } from 'svelte';
	import { fade } from 'svelte/transition';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';

	const siteUrl = 'https://hafatalnjom.com';
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

		// Track lenis for cleanup
		let lenisCleanup: (() => void) | null = null;

		// Dynamically import GSAP to avoid blocking initial render
		Promise.all([
			import('gsap'),
			import('gsap/dist/ScrollTrigger')
		]).then(([{ gsap }, { ScrollTrigger }]) => {
			gsap.registerPlugin(ScrollTrigger);

			const isMobile = window.innerWidth < 768;
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
				(window as any).lenis = lenis;
			}

			(window as any).gsap = gsap;
			(window as any).ScrollTrigger = ScrollTrigger;

			if (lenis) {
				lenis.on('scroll', ScrollTrigger.update);
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

				gsap.ticker.add((time) => {
					lenis!.raf(time * 1000);
				});
				gsap.ticker.lagSmoothing(0);

				lenis.on('scroll', (e: any) => {
					mouse.scrollY = e.scroll;
					document.documentElement.classList.toggle('is-scrolling', e.velocity !== 0);
				});

				requestAnimationFrame(() => ScrollTrigger.refresh());
			} else {
				gsap.ticker.lagSmoothing(0);
				requestAnimationFrame(() => ScrollTrigger.refresh());
			}

			// Store cleanup — lenis and ScrollTrigger are available inside closure
			const curLenis = lenis;
			lenisCleanup = () => {
				curLenis?.destroy();
				ScrollTrigger.getAll().forEach((t) => t.kill());
			};
		});

		return () => {
			lenisCleanup?.();
		};
	});
</script>

<svelte:head>
	{#if data?.site}
		<title>{data.site.siteName} — {data.site.tagline}</title>
		<meta name="description" content={data.lang === 'ar' ? 'شركة تصميم وتطوير مواقع إلكترونية في الرياض — ووردبريس، شوبيفاي، سلة، زد — تحسين محركات البحث وتسويق رقمي للشركات السعودية' : 'Web design and development company in Riyadh — WordPress, Shopify, Salla, Zid — SEO and digital marketing for Saudi businesses'} />
		<meta property="og:title" content={`${data.site.siteName} — ${data.site.tagline}`} />
		<meta property="og:description" content={data.lang === 'ar' ? 'شركة تصميم وتطوير مواقع إلكترونية في الرياض — ووردبريس، شوبيفاي، سلة، زد — تحسين محركات البحث وتسويق رقمي' : 'Web design and development company in Riyadh — WordPress, Shopify, Salla, Zid — SEO and digital marketing'} />
		<meta name="twitter:title" content={`${data.site.siteName} — ${data.site.tagline}`} />
		<meta name="twitter:description" content={data.lang === 'ar' ? 'شركة تصميم وتطوير مواقع إلكترونية في الرياض — ووردبريس، شوبيفاي، سلة، زد — تحسين محركات البحث وتسويق رقمي' : 'Web design and development company in Riyadh — WordPress, Shopify, Salla, Zid — SEO and digital marketing'} />
	{/if}
	<!-- Google Tag Manager → Replace GTM-XXXXXXX with your container ID -->
	<script>{`
		(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
		new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
		j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
		'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
		})(window,document,'script','dataLayer','GTM-XXXXXXX');
	`}</script>
	<link rel="canonical" href="{siteUrl}{$page.url.pathname}" />
	<link rel="alternate" hreflang="ar" href="{siteUrl}{$page.url.pathname}" />
	<link rel="alternate" hreflang="en" href="{siteUrl}{$page.url.pathname}?lang=en" />
	<link rel="alternate" hreflang="x-default" href="{siteUrl}{$page.url.pathname}" />
	<link rel="icon" type="image/png" href={favSrc} />
	<meta property="og:url" content="{siteUrl}{$page.url.pathname}" />
	<meta property="og:locale" content={data?.lang === 'ar' ? 'ar_SA' : 'en_US'} />
	<meta property="og:image" content={logoSrc} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content={logoSrc} />
	<script type="application/ld+json">
		{JSON.stringify({
			"@context": "https://schema.org",
			"@type": "Organization",
			"name": "مؤسسة حافة النجوم",
			"alternateName": "BOSLA",
			"url": "https://hafatalnjom.com",
			"logo": "https://hafatalnjom.com/images/logos/bosla-logo.png",
			"image": "https://hafatalnjom.com/images/logos/bosla-logo.png",
			"description": "شركة تصميم وتطوير مواقع إلكترونية وحلول رقمية في الرياض",
			"taxID": "7050568158",
			"telephone": "+966576704683",
			"email": "info@hafatalnjom.com",
			"address": {
				"@type": "PostalAddress",
				"addressLocality": "Riyadh",
				"addressRegion": "Al-Malaz",
				"addressCountry": "SA"
			},
			"sameAs": [
				"https://wa.me/966576704683",
				"https://www.instagram.com/bosla.sa",
				"https://x.com/bosla_sa"
			],
			"areaServed": ["SA"],
			"priceRange": "SAR 1,500 - SAR 5,000"
		})}
	</script>
	<script type="application/ld+json">
		{JSON.stringify({
			"@context": "https://schema.org",
			"@type": "LocalBusiness",
			"name": "مؤسسة حافة النجوم - Hafat Alnjom",
			"description": "شركة تصميم وتطوير مواقع إلكترونية وحلول رقمية في الرياض",
			"url": "https://hafatalnjom.com",
			"telephone": "+966576704683",
			"taxID": "7050568158",
			"areaServed": ["SA", "GCC"],
			"priceRange": "SAR 1,500 - SAR 5,000",
			"address": {
				"@type": "PostalAddress",
				"addressLocality": "Riyadh",
				"addressRegion": "Al-Malaz",
				"addressCountry": "SA"
			}
		})}
	</script>
</svelte:head>

<!-- Scroll Progress Bar -->
<div
	class="fixed top-0 left-0 z-[9999] h-[3px] bg-gradient-to-r from-brand-blue to-brand-orange transition-all duration-150"
	style="width: {scrollProgress * 100}%"
></div>

<!-- Google Tag Manager (noscript) — Replace GTM-XXXXXXX -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>

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
