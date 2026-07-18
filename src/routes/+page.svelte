<script lang="ts">
	// @ts-ignore - lucide types declared in src/app.d.ts for Svelte projects
	import { ArrowRight, Sparkles } from '@lucide/svelte';
	import { onMount, getContext } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { inView } from '$lib/actions/inView';
	import ServicesSection from '$lib/components/ServicesSection.svelte';
	import CtaSection from '$lib/components/CtaSection.svelte';
	import FeaturesSection from '$lib/components/FeaturesSection.svelte';
	import SocialProofSection from '$lib/components/SocialProofSection.svelte';
	import FAQSection from '$lib/components/FAQSection.svelte';
	import WhyChooseUsSection from '$lib/components/WhyChooseUsSection.svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	// SplitType removed — using simple GSAP animations instead for performance
	import { theme } from '$lib/stores/theme.svelte';
	import { base } from '$app/paths';

	gsap.registerPlugin(ScrollTrigger);

	// Analytics tracking helper
	function trackClick(element: string) {
		console.log(`Tracking click on: ${element}`);
		// Integration with analytics provider could go here
	}

	let { data } = $props();
	const currentTheme = $derived(theme.current);

	// Magnetic Context
	const mouse = getContext<{ x: number; y: number; scrollY: number }>('mouse');

	// Magnetic refs
	let heroGlassCard = $state<HTMLDivElement | null>(null);
	let spotlightRef = $state<HTMLDivElement | null>(null);
	let pageContainer = $state<HTMLDivElement | null>(null);
	let hero3DContainer = $state<HTMLDivElement | null>(null);

	// 3D Scene Control State
	let scrollProgress = $state(0);
	let sceneRotation = $state(0);
	let sceneRotationX = $state(0);
	let sceneRotationZ = $state(0);
	let scenePosition = $state<[number, number, number]>([0, 0, 0]);
	let sceneScale = $state(1.6);
	let ecosystemOpacity = $state(1);

	// Mobile-specific camera settings for better composition
	let cameraPosition = $state<[number, number, number]>([0, 0, 10]);
	let cameraFov = $state(45);

	// Delayed Three.js loading for faster FCP/LCP — dynamically imported
	let SceneComponent: any = $state(null);
	let canvasKey = $state(0); // Used to force re-render on WebGL context recovery

	// Typewriter / Hero Animation (RTL + LTR Safe)
	$effect(() => {
		if (typeof window === 'undefined') return;

		const headlineText = data.home?.hero?.headline;
		const subheadlineText = data.home?.hero?.subheadline;
		const badgeText = `${data.home?.hero?.trustBadge?.badge1} • ${data.home?.hero?.trustBadge?.badge2}`;
		const cta1Text = data.home?.hero?.ctaPrimary?.label;
		const cta2Text = data.home?.hero?.ctaSecondary?.label;
		const lang = data.lang;

		if (!headlineText) return;

		

		const ctx = gsap.context(() => {
			const isAr = lang === 'ar';

			const headlineElement = document.querySelector('.hero-headline') as HTMLElement;
			const subheadlineElement = document.querySelector('.hero-subheadline') as HTMLElement;
			const badgeElement = document.querySelector('.hero-badge-text') as HTMLElement;
			const buttonsElement = document.querySelector('.hero-buttons') as HTMLElement;
			const cta1Element = buttonsElement?.querySelector('.btn-primary span') as HTMLElement;
			const cta2Element = buttonsElement?.querySelector('a:last-child span') as HTMLElement;

			if (!headlineElement || !subheadlineElement) return;

			headlineElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');
			subheadlineElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');

			headlineElement.innerHTML = headlineText;
			subheadlineElement.textContent = subheadlineText;
			if (badgeElement) badgeElement.textContent = badgeText;
			if (cta1Element) cta1Element.textContent = cta1Text;
			if (cta2Element) cta2Element.textContent = cta2Text;

			

			const badgeWrapper = document.querySelector('.hero-badge') as HTMLElement;
			if (badgeWrapper) gsap.set(badgeWrapper, { y: -10 });
			if (buttonsElement) gsap.set(buttonsElement, { y: 20 });

			if (badgeWrapper) {
				gsap.to(badgeWrapper, {
					y: 0,
					duration: 0.6,
					ease: 'power2.out'
				});
			}

			if (isAr) {
				gsap.set(headlineElement, { clipPath: 'inset(0 0 0 100%)' });
				gsap.to(headlineElement, {
					clipPath: 'inset(0 0 0 0%)',
					duration: 1.4,
					ease: 'power2.inOut'
				});

				gsap.set(subheadlineElement, { clipPath: 'inset(0 0 0 100%)' });
				gsap.to(subheadlineElement, {
					clipPath: 'inset(0 0 0 0%)',
					duration: 1.2,
					ease: 'power2.inOut',
					delay: 0.4
				});
			} else {
				gsap.fromTo(
					headlineElement,
					{ y: 20, opacity: 0 },
					{ y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
				);

				gsap.fromTo(
					subheadlineElement,
					{ y: 15, opacity: 0 },
					{ y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.3 }
				);
			}

			if (buttonsElement) {
				gsap.to(buttonsElement, {
					y: 0,
					duration: 0.8,
					ease: 'power2.out',
					delay: 0.8
				});
			}

			ScrollTrigger.refresh();
		});

		return () => {
			ctx.revert();
		};
	});

	// ResizeObserver-based rect caching to avoid layout thrashing
	let heroRect = $state<DOMRect | null>(null);
	let heroResizeObserver: ResizeObserver | null = null;

	$effect(() => {
		if (!heroGlassCard) return;
		const card = heroGlassCard;

		heroResizeObserver?.disconnect();
		heroResizeObserver = new ResizeObserver(() => {
			heroRect = card.getBoundingClientRect();
		});
		heroResizeObserver.observe(card);
		heroRect = card.getBoundingClientRect();

		return () => heroResizeObserver?.disconnect();
	});

	$effect(() => {
		const mx = mouse.x;
		const my = mouse.y;

		// 1. Hero Glass Card 3D Tilt (only in dark mode)
		if (heroGlassCard && currentTheme !== 'light') {
			if (!heroRect) return;
			const centerX = heroRect.left + heroRect.width / 2;
			const centerY = heroRect.top + heroRect.height / 2;

			const rotateY = ((mx - centerX) / (window.innerWidth / 2)) * 10;

			gsap.to(heroGlassCard, {
				rotateX: 0,
				rotateY,
				duration: 0.6,
				ease: 'power2.out',
				transformPerspective: 1000,
				overwrite: 'auto'
			});

			const layers = heroGlassCard.querySelectorAll('.parallax-layer');
			layers.forEach((layer: any) => {
				const depth = parseFloat(layer.dataset.depth || '0');
				gsap.to(layer, {
					x: ((mx - centerX) / (window.innerWidth / 2)) * (depth * 20),
					y: 0,
					duration: 0.8,
					ease: 'power2.out',
					overwrite: 'auto'
				});
			});
		}

		// 2. Interactive Spotlight Backdrop
		if (spotlightRef) {
			gsap.to(spotlightRef, {
				x: mx - window.innerWidth / 2,
				y: my - window.innerHeight / 2,
				duration: 1.2,
				ease: 'power3.out',
				overwrite: 'auto'
			});
		}
	});

	// Entrance Animation with Scroll Storytelling
	onMount(() => {
		// Delayed Canvas loading for faster FCP/LCP
		// Show CSS gradient first, then load Three.js after content is visible
		const isMobile = window.innerWidth < 768;

		// Mobile-specific camera for better composition
		if (isMobile) {
			// Mobile: wider FOV, slightly above, closer
			cameraPosition = [0, 0.5, 9];
			cameraFov = 55;
		} else {
			// Desktop: standard view
			cameraPosition = [0, 0, 10];
			cameraFov = 45;
		}

		// Three.js loads after delay - gradient shows during load time
		// Start downloading Three.js chunk immediately, show after delay
		const scenePromise = import('$lib/components/scenes/HomeScene.svelte').catch((err) => {
			console.warn('HomeScene dynamic import failed:', err);
			return null;
		});
		const canvasDelay = isMobile ? 800 : 1500;

		setTimeout(async () => {
			const m = await scenePromise;
			if (m) SceneComponent = m.default;
		}, canvasDelay);

		// GSAP animations work on both mobile and desktop
		const sections = gsap.utils.toArray('section:not(.hero-section)');

		sections.forEach((section: any) => {
			const content = section.children;

			gsap.fromTo(
				content,
				{ opacity: 0, y: 80 },
				{
					opacity: 1,
					y: 0,
					duration: 1.2,
					ease: 'power3.out',
					stagger: 0.1,
					scrollTrigger: {
						trigger: section,
						start: 'top 85%',
						end: 'top 40%',
						toggleActions: 'play none none reverse'
					}
				}
			);

			const headings = section.querySelectorAll('h2');
			headings.forEach((heading: any) => {
				gsap.from(heading, {
					scrollTrigger: {
						trigger: heading,
						start: 'top 85%',
						toggleActions: 'play none none reverse'
					},
					y: 50,
					opacity: 0,
					duration: 1.2,
					ease: 'expo.out'
				});
			});

			// Magnetic Micro-interactions for cards
			const cards = section.querySelectorAll('.interactive-card');
			const cardRects = new WeakMap<Element, DOMRect>();
			cards.forEach((card: any) => {
				card.addEventListener('mouseenter', () => {
					cardRects.set(card, card.getBoundingClientRect());
				});

				card.addEventListener('mousemove', (e: MouseEvent) => {
					if (currentTheme === 'light') return;

					const rect = cardRects.get(card);
					if (!rect) return;
					const x = e.clientX - rect.left - rect.width / 2;
					const y = e.clientY - rect.top - rect.height / 2;

					gsap.to(card, {
						x: x * 0.1,
						y: y * 0.1,
						rotateX: -y * 0.03,
						rotateY: x * 0.03,
						duration: 0.4,
						ease: 'power2.out',
						boxShadow: `0 30px 60px rgba(11, 157, 217, 0.2)`,
						borderColor: 'rgba(11, 157, 217, 0.4)'
					});

					const glow = card.querySelector('.bg-brand-blue\\/5');
					if (glow) {
						gsap.to(glow, {
							opacity: 1,
							x: x * 0.2,
							y: y * 0.2,
							duration: 0.4
						});
					}
				});

				card.addEventListener('mouseleave', () => {
					cardRects.delete(card);
					gsap.to(card, {
						x: 0,
						y: 0,
						rotateX: 0,
						rotateY: 0,
						duration: 0.8,
						ease: 'elastic.out(1, 0.3)',
						boxShadow: 'none',
						borderColor: 'rgba(255, 255, 255, 0.05)'
					});

					const glow = card.querySelector('.bg-brand-blue\\/5');
					if (glow) {
						gsap.to(glow, {
							opacity: 0,
							x: 0,
							y: 0,
							duration: 0.6
						});
					}
				});
			});
		});

		// 3D Scene Micro-interactions: Transition from Hero to Features
		ScrollTrigger.create({
			trigger: pageContainer,
			start: 'top top',
			end: 'bottom bottom',
			scrub: 1,
			onUpdate: (self) => {
				scrollProgress = self.progress;
				sceneRotation = self.progress * Math.PI * 2;
				// Zoom in/out effect - scale from 1.8 to 1.2 as you scroll down
				sceneScale = 1.8 - self.progress * 0.6;
				// Move scene backward as you scroll to create depth effect
				scenePosition = [0, 0, -self.progress * 2];
				ecosystemOpacity = 1 - self.progress * 0.15;
				sceneRotationX = self.progress * Math.PI * 0.15;
				sceneRotationZ = -self.progress * Math.PI * 0.05;

				if (spotlightRef) {
					gsap.to(spotlightRef, {
						y: self.progress * 500 - 250,
						duration: 0.5,
						ease: 'none'
					});
				}
			}
		});
	});

	afterNavigate(() => {
		if (window.location.hash) {
			const id = window.location.hash.replace('#', '');

			// Instant jump early
			setTimeout(() => {
				const el = document.getElementById(id);
				if (el) {
					el.scrollIntoView({ behavior: 'auto', block: 'start' });
				}
			}, 10);

			// Fallback jump after canvas starts loading to skip scrolling transitions
			setTimeout(() => {
				const el = document.getElementById(id);
				if (el) {
					el.scrollIntoView({ behavior: 'auto', block: 'start' });
				}
			}, 300);

			// Final strict instant jump
			setTimeout(() => {
				const el = document.getElementById(id);
				if (el) {
					el.scrollIntoView({ behavior: 'auto', block: 'start' });
				}
			}, 800);
		}
	});

	function link(path: string) {
		const currentLang = (data as any)?.lang;
		let finalPath = path;

		if (path.startsWith('/') && !path.startsWith(base)) {
			finalPath = `${base}${path}`;
		}

		if (currentLang) {
			const q = new URLSearchParams();
			q.set('lang', currentLang);
			const qs = q.toString();
			return `${finalPath}?${qs}`;
		}
		return finalPath;
	}

	let pageData = $derived(data as any);
	let isAr = $derived(pageData?.lang === 'ar');
	let metaTitle = $derived(isAr ? 'شركة تصميم مواقع في الرياض — BOSLA' : 'Web Design Company Riyadh — BOSLA');
	let metaDesc = $derived(isAr ? 'شركة تصميم وتطوير مواقع إلكترونية في الرياض. نبني مواقع ووردبريس، متاجر شوبيفاي وسلة، ونقدم خدمات تحسين محركات البحث للشركات السعودية.' : 'Web design and development company in Riyadh. We build WordPress websites, Shopify and Salla stores, and provide SEO services for Saudi businesses.');
</script>

<svelte:head>
	<title>{metaTitle || `${pageData?.site?.siteName} — ${pageData?.site?.tagline}`}</title>
	<meta name="description" content={metaDesc || pageData?.site?.description} />
</svelte:head>

<div
	bind:this={pageContainer}
	class="min-h-[100svh] w-full overflow-x-hidden bg-[var(--color-background)] text-[var(--color-text-base)] transition-colors duration-1000 selection:bg-brand-blue/30"
>
	<!-- 3D Sticky Scope: Hero + Features -->
	<div class="relative">
		<!-- 3D Background Layer - Fixed to viewport, covering hero section -->
		<!-- Canvas loads after delay for fast FCP -->
		<div
			bind:this={hero3DContainer}
			class="hero-3d pointer-events-none fixed top-0 left-0 z-0 h-[120svh] w-full overflow-hidden will-change-transform"
		>
			{#if SceneComponent}
				<SceneComponent
					{sceneRotation}
					{canvasKey}
					{cameraPosition}
					{cameraFov}
					onContextRestored={() => { canvasKey++; }}
				/>
			{:else}
				<!-- CSS Gradient Placeholder - Shows immediately for fast FCP -->
				<div
					class="absolute inset-0 bg-gradient-to-br from-[var(--color-brand-blue)]/20 via-transparent to-[var(--color-brand-orange)]/10"
				></div>
				<div
					class="absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_50%_50%,transparent_0%,var(--color-background)_70%)]"
				></div>
			{/if}
		</div>

		<!-- Foreground Content -->
		<div class="relative z-10">
			<!-- Hero Section -->
			<section
				class="hero-section relative flex min-h-[100svh] items-center pt-20"
				dir={(data as any)?.lang === 'ar' ? 'rtl' : 'ltr'}
			>
				<div class="relative z-10 container mx-auto flex flex-col items-center px-6 md:px-12">
					<div class="hero-content max-w-5xl text-center">
						<!-- Glass Background Wrapper with 3D Tilt -->
						<div
							bind:this={heroGlassCard}
							class="cinematic-glass group/card relative space-y-10 overflow-hidden rounded-[3rem] border border-[var(--glass-border)] p-8 md:p-16"
						>
							<div class="relative z-10 space-y-10" dir={data.lang === 'ar' ? 'rtl' : 'ltr'}>
								<!-- Badge and CTAs stay outside {#key} to update instantly via Svelte reactivity -->
								<div
									class="hero-badge cinematic-glass relative z-10 mx-auto mb-4 inline-flex items-center gap-3 rounded-full border border-[var(--glass-border)] px-6 py-2"
								>
									<Sparkles class="h-4 w-4 text-brand-orange" />
									<span
										class="hero-badge-text text-xs font-black tracking-widest text-[var(--color-text-base)] uppercase opacity-80"
									>
										{data.home?.hero?.trustBadge?.badge1} • {data.home?.hero?.trustBadge?.badge2}
									</span>
								</div>

								{#key data.lang}
									<div class="space-y-6">
										<h1
											class="hero-headline text-5xl leading-tight font-black tracking-tighter text-[var(--color-text-base)] md:text-7xl"
										>
											{@html data.home?.hero?.headline}
										</h1>

										<p
											class="hero-subheadline mx-auto max-w-2xl text-xl leading-relaxed font-medium text-[var(--color-text-muted)] md:text-2xl"
										>
											{data.home?.hero?.subheadline}
										</p>
									</div>
								{/key}

								<div class="hero-buttons flex flex-wrap items-center justify-center gap-6 pt-4">
									<a
										use:inView
										href={link(data.home?.hero?.ctaPrimary?.href || '/contact')}
										class="btn-primary group"
									>
										<span class="relative z-10 flex items-center gap-3">
											{data.home?.hero?.ctaPrimary?.label}
											<ArrowRight
												class="h-6 w-6 transition-transform duration-500 group-hover:translate-x-2 group-[.in-view]:translate-x-2"
											/>
										</span>
									</a>

									<a
										use:inView
										href="#services"
										onclick={(e) => {
											e.preventDefault();
											document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
										}}
										class="cinematic-glass group flex items-center gap-3 rounded-2xl border border-[var(--glass-border)] px-8 py-4 font-black text-[var(--color-text-base)] transition-all group-[.in-view]:bg-[var(--color-text-base)]/5 hover:bg-[var(--color-text-base)]/5"
									>
										<span>{data.home?.hero?.ctaSecondary?.label}</span>
										<Sparkles
											class="h-5 w-5 text-brand-orange transition-transform duration-500 group-hover:rotate-12 group-[.in-view]:rotate-12"
										/>
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<FeaturesSection {data} />
		</div>
	</div>

	<!-- Rest of Content Sections Flow -->
	<div class="relative z-10 bg-[var(--color-background)] transition-colors duration-1000">
		<ServicesSection {data} />
		<WhyChooseUsSection {data} />

		<SocialProofSection {data} />
		<CtaSection {data} />

		{#key data.lang}
			<FAQSection {data} />
		{/key}
	</div>
</div>

<style>
	:global(section) {
		perspective: 1000px;
	}

	.hero-headline::after {
		content: '_';
		display: inline-block;
		color: var(--color-brand-orange, #ff6b00);
		animation: blink 1s step-end infinite;
		margin-left: 0.1em;
		font-weight: 100;
	}

	:global([dir='rtl']) .hero-headline::after {
		margin-left: 0;
		margin-right: 0.1em;
	}

	@keyframes blink {
		from,
		to {
			opacity: 1;
		}
		50% {
			opacity: 0;
		}
	}

	/* Prevent SplitType from breaking the block layout */
	:global(.hero-headline .char, .hero-subheadline .char) {
		display: inline-block !important;
	}

	/* Hero content visible on first paint for fast LCP; GSAP still animates entry */
	.hero-headline,
	.hero-subheadline,
	.hero-badge,
	.hero-buttons {
		opacity: 1;
	}
</style>
