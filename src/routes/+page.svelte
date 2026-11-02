<script lang="ts">
	// @ts-ignore - lucide types declared in src/app.d.ts for Svelte projects
	import { Sparkles, ArrowUpRight } from '@lucide/svelte';
	import { onMount, getContext } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { inView } from '$lib/actions/inView';
	import PricingSection from '$lib/components/PricingSection.svelte';
	import OfferCountdown from '$lib/components/OfferCountdown.svelte';
	import FAQSection from '$lib/components/FAQSection.svelte';
	import CtaSection from '$lib/components/CtaSection.svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import { theme } from '$lib/stores/theme.svelte';
	import { base } from '$app/paths';
	import HomeScene from '$lib/components/scenes/HomeScene.svelte';

	gsap.registerPlugin(ScrollTrigger);

	let { data } = $props();
	const currentTheme = $derived(theme.current);

	// Magnetic Context
	const mouse = getContext<{ x: number; y: number; scrollY: number }>('mouse');

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

	let canvasKey = $state(0); // Used to force re-render on WebGL context recovery

	// Typewriter / Hero Animation (RTL + LTR Safe)
	$effect(() => {
		if (typeof window === 'undefined') return;

		const headlineText = data.home?.hero?.headline;
		const subheadlineText = data.home?.hero?.subheadline;
		const badgeText = data.home?.hero?.launchBadge;
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
			if (badgeElement) badgeElement.textContent = badgeText ?? null;
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
		const isMobile = window.innerWidth < 768;

		// Mobile-specific camera for better composition
		if (isMobile) {
			cameraPosition = [0, 0.5, 9];
			cameraFov = 55;
		} else {
			cameraPosition = [0, 0, 10];
			cameraFov = 45;
		}

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
				sceneScale = 1.8 - self.progress * 0.6;
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

			setTimeout(() => {
				const el = document.getElementById(id);
				if (el) {
					el.scrollIntoView({ behavior: 'auto', block: 'start' });
				}
			}, 10);

			setTimeout(() => {
				const el = document.getElementById(id);
				if (el) {
					el.scrollIntoView({ behavior: 'auto', block: 'start' });
				}
			}, 300);

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

		if (path.startsWith('#')) {
			// Anchor links must stay on the current page
			return path;
		}

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

	// WhatsApp helper — one real number, launch-offer message
	function waLink(customMsg?: string) {
		const isAr = (data as any)?.lang === 'ar';
		const msg = customMsg || (isAr ? 'مرحبًا، أبغى أستفسر عن عرض الإطلاق' : 'Hi, I would like to ask about the launch offer');
		return `https://wa.me/966576944605?text=${encodeURIComponent(msg)}`;
	}

	let pageData = $derived(data as any);
	let isAr = $derived(pageData?.lang === 'ar');
	let metaTitle = $derived(isAr ? 'بوصلة تك — موقعك جاهز خلال 48 ساعة' : 'Bosla Tech — Your Website in 48 Hours');
	let metaDesc = $derived(
		isAr
			? 'نبني مواقع ومتاجر إلكترونية من الصفر ببرمجة حديثة، نسلمها في وقت قياسي، وتبقى ملكك بالكامل بدون اشتراك شهري.'
			: 'We build websites and online stores from scratch with modern code — delivered in record time, fully owned by you with no monthly subscription.'
	);

	// Work gallery items: project images with name + type only
	const workItems = $derived.by(() => {
		const clients = (pageData?.clients?.images || []) as string[];
		const flat = clients.filter(Boolean).slice(0, 12);
		return flat.map((src: string, i: number) => {
			const name = decodeURIComponent(src.split('/').pop() || '')
				.replace(/\.[a-zA-Z0-9-]+$/, '')
				.replace(/[-_%\d\s]+/g, ' ')
				.trim();
			return {
				src,
				name: name || (isAr ? 'مشروعنا' : 'Our project'),
				type: i % 2 === 0 ? (isAr ? 'موقع شركة' : 'Corporate website') : (isAr ? 'متجر إلكتروني' : 'Online store')
			};
		});
	});
</script>

<svelte:head>
	<title>{metaTitle}</title>
	<meta name="description" content={metaDesc} />
</svelte:head>

<div
	bind:this={pageContainer}
	class="min-h-[100svh] w-full overflow-x-hidden bg-[var(--color-background)] text-[var(--color-text-base)] transition-colors duration-1000 selection:bg-brand-blue/30"
>
	<!-- 3D Sticky Scope: Hero + Benefits -->
	<div class="relative">
		<div
			bind:this={hero3DContainer}
			class="hero-3d pointer-events-none fixed top-0 left-0 z-0 h-[120svh] w-full overflow-hidden will-change-transform"
		>
			<HomeScene
				{sceneRotation}
				{canvasKey}
				{cameraPosition}
				{cameraFov}
				onContextRestored={() => { canvasKey++; }}
			/>
		</div>

		<div class="relative z-10">
			<!-- 1. Hero Section -->
			<section
				class="hero-section relative flex min-h-[100svh] items-center pt-36"
				dir={(data as any)?.lang === 'ar' ? 'rtl' : 'ltr'}
			>
				<div class="relative z-10 container mx-auto flex flex-col items-center px-6 md:px-12">
					<div class="hero-content max-w-5xl text-center">
						<div
							bind:this={heroGlassCard}
							class="cinematic-glass group/card relative space-y-10 overflow-hidden rounded-[3rem] border border-[var(--glass-border)] p-8 md:p-16"
						>
							<div class="relative z-10 space-y-10" dir={data.lang === 'ar' ? 'rtl' : 'ltr'}>
								<!-- Launch offer badge -->
								<div
									class="hero-badge cinematic-glass relative z-10 mx-auto mb-4 inline-flex items-center gap-3 rounded-full border border-brand-orange/40 bg-brand-orange/10 px-6 py-2"
								>
									<Sparkles class="h-4 w-4 text-brand-orange" />
									<span
										class="hero-badge-text text-xs font-black tracking-widest text-[var(--color-text-base)] uppercase opacity-90"
									>
										{data.home?.hero?.launchBadge}
									</span>
								</div>

								{#key data.lang}
									<div class="space-y-6">
										<h1
											class="hero-headline text-4xl leading-tight font-black tracking-tighter text-[var(--color-text-base)] md:text-6xl"
										>
											{@html data.home?.hero?.headline}
										</h1>

										<p
											class="hero-subheadline mx-auto max-w-2xl text-lg leading-relaxed font-medium text-[var(--color-text-muted)] md:text-xl"
										>
											{data.home?.hero?.subheadline}
										</p>

										<!-- Fixed countdown to the real offer deadline -->
										<div class="flex justify-center">
											<OfferCountdown lang={data.lang} />
										</div>
									</div>
								{/key}

								<div class="hero-buttons flex flex-wrap items-center justify-center gap-6 pt-4">
									<a
										use:inView
										href={waLink()}
										target="_blank"
										rel="noopener noreferrer"
										class="btn-primary group"
									>
										<span class="relative z-10">
											{data.home?.hero?.ctaPrimary?.label}
										</span>
									</a>

									<a
										use:inView
										href="#our-work"
										onclick={(e) => {
											e.preventDefault();
											document.getElementById('our-work')?.scrollIntoView({ behavior: 'smooth' });
										}}
										class="cinematic-glass group flex items-center gap-3 rounded-2xl border border-[var(--glass-border)] px-8 py-4 font-black text-[var(--color-text-base)] transition-all group-[.in-view]:bg-[var(--color-text-base)]/5 hover:bg-[var(--color-text-base)]/5"
									>
										<span>{data.home?.hero?.ctaSecondary?.label}</span>
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<!-- 2. Why Bosla — 3 cards only -->
			<section id="benefits" class="relative py-24 md:py-32">
				<div class="container mx-auto px-6">
					<div class="mb-16 text-center">
						<h2 class="text-4xl font-black tracking-tight text-[var(--color-text-base)] md:text-5xl">
							{data.home?.benefits?.title}
						</h2>
					</div>
					<div class="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
						{#each data.home?.benefits?.cards || [] as card}
							<div class="interactive-card cinematic-glass rounded-[2rem] border border-[var(--glass-border)] p-8 text-center md:text-start">
								<h3 class="mb-3 text-xl font-black text-brand-orange">{card.head}</h3>
								<p class="mb-2 leading-relaxed font-medium text-[var(--color-text-muted)]">{card.text}</p>
								{#if card.small}
									<p class="text-xs font-bold text-[var(--color-text-muted)] opacity-70">{card.small}</p>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			</section>
		</div>
	</div>

	<!-- Rest of Content Sections Flow -->
	<div class="relative z-10 bg-[var(--color-background)] transition-colors duration-1000">
		<div class="ambient-glow" aria-hidden="true"></div>

		<!-- 3. Our Work -->
		<section id="our-work" class="relative py-24 md:py-32">
			<div class="container mx-auto px-6">
				<div class="mb-16 text-center">
					<h2 class="mb-4 text-4xl font-black tracking-tight text-[var(--color-text-base)] md:text-5xl">
						{data.home?.ourWork?.title}
					</h2>
					<p class="mx-auto max-w-xl font-medium text-[var(--color-text-muted)]">
						{data.home?.ourWork?.subtitle}
					</p>
				</div>
				<div class="mx-auto grid max-w-6xl grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
					{#each workItems as item (item.src)}
						<a use:inView href={waLink()} target="_blank" rel="noopener noreferrer"
							class="group relative overflow-hidden rounded-3xl border border-[var(--glass-border)] bg-[var(--color-surface)]">
							<div class="flex aspect-square items-center justify-center overflow-hidden bg-white/90 p-6">
								<img src={item.src} alt={item.name} loading="lazy" class="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105" />
							</div>
							<div class="flex items-center justify-between gap-2 p-4">
								<div class="min-w-0">
									<p class="truncate text-sm font-black text-[var(--color-text-base)]">{item.name}</p>
									<p class="text-xs font-bold text-[var(--color-text-muted)]">{item.type}</p>
								</div>
							</div>
						</a>
					{/each}
				</div>

				<!-- Live Demo Store -->
				<a
					use:inView
					href="https://demo.boslatech.com"
					target="_blank"
					rel="noopener noreferrer"
					class="group relative mx-auto mt-12 flex max-w-6xl flex-col items-center gap-6 overflow-hidden rounded-3xl border border-brand-blue/20 bg-brand-blue/[0.04] p-8 transition-all duration-500 hover:-translate-y-1 hover:border-brand-blue/40 hover:shadow-xl md:flex-row md:justify-between md:p-10"
				>
					<div class="absolute inset-0 bg-brand-blue/5 opacity-0 transition-opacity duration-700 group-hover:opacity-100"></div>
					<div class="relative z-10 text-center md:text-start">
						<span class="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-blue/20 bg-brand-blue/10 px-4 py-1.5 text-xs font-black text-brand-blue">
							<span class="relative flex h-2 w-2">
								<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-blue opacity-75"></span>
								<span class="relative inline-flex h-2 w-2 rounded-full bg-brand-blue"></span>
							</span>
							{isAr ? 'نسخة تجريبية مباشرة' : 'Live demo'}
						</span>
						<h3 class="text-xl font-black text-[var(--color-text-base)] md:text-2xl">
							{isAr
								? 'جرّب متجر «أصل» للعطور — مبني بالكامل من الصفر'
								: 'Try the ASL perfume store — built entirely from scratch'}
						</h3>
						<p class="mx-auto mt-2 max-w-xl text-sm font-medium text-[var(--color-text-muted)] md:mx-0">
							{isAr
								? 'تصفّح المنتجات، أضف للسلة، وأكمل الشراء كعميل حقيقي — بدون فيديو أو صور ثابتة.'
								: 'Browse products, add to cart, and check out like a real customer — no video or static mockups.'}
						</p>
					</div>
					<span class="relative z-10 inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-blue px-7 py-3.5 text-sm font-black text-white shadow-lg shadow-brand-blue/30 transition-transform duration-300 group-hover:scale-105">
						{isAr ? 'افتح المتجر' : 'Open the store'}
						<ArrowUpRight class="h-4 w-4" />
					</span>
				</a>
			</div>
		</section>

		<!-- 4. How We Work — 3 steps -->
		<section id="how-we-work" class="relative py-24 md:py-32">
			<div class="container mx-auto px-6">
				<div class="mb-16 text-center">
					<h2 class="text-4xl font-black tracking-tight text-[var(--color-text-base)] md:text-5xl">
						{data.home?.howWeWork?.title}
					</h2>
				</div>
				<div class="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
					{#each data.home?.howWeWork?.steps || [] as step, i}
						<div class="interactive-card cinematic-glass rounded-[2rem] border border-[var(--glass-border)] p-8">
							<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-orange/15 text-2xl font-black text-brand-orange">
								{String(i + 1).padStart(2, '0')}
							</div>
							<h3 class="mb-2 text-lg font-black text-[var(--color-text-base)]">{step.head}</h3>
							<p class="leading-relaxed font-medium text-[var(--color-text-muted)]">{step.text}</p>
						</div>
					{/each}
				</div>
			</div>
		</section>

		<!-- 5. Pricing -->
		<PricingSection {data} />

		<!-- 6. FAQ -->
		{#key data.lang}
			<FAQSection {data} />
		{/key}

		<!-- 7. Final CTA -->
		<CtaSection {data} />
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

	:global(.hero-headline .char, .hero-subheadline .char) {
		display: inline-block !important;
	}

	.hero-headline,
	.hero-subheadline,
	.hero-badge,
	.hero-buttons {
		opacity: 1;
	}
</style>
