<script lang="ts">
	// @ts-ignore - lucide types declared in src/app.d.ts for Svelte projects
	import {
		ArrowRight,
		FileText,
		Users,
		Award,
		Phone,
		CheckCircle2,
		Target,
		Sparkles
	} from '@lucide/svelte';
	import { onMount, onDestroy, setContext } from 'svelte';
	import { theme } from '$lib/stores/theme.svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import SplitType from 'split-type';
	import CtaSection from '$lib/components/CtaSection.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import HeroBackground from '$lib/components/HeroBackground.svelte';
	import ContactInfoCard from '$lib/components/ContactInfoCard.svelte';
	import AboutScene from '$lib/components/scenes/AboutScene.svelte';

	let { data } = $props();
	const currentTheme = $derived(theme.current);
	const typedData = data as any;
	const homeHeroImage = typedData?.home?.hero?.image;

	// Dynamic Three.js loading
	let canvasKey = $state(0);

	// Scroll-triggered 3D scene
	let scrollProgress = $state(0);
	let sceneRotation = $state(0);
	let sceneRotationX = $state(0);
	let sceneRotationZ = $state(0);
	let scenePosition = $state<[number, number, number]>([0, 0, 0]);
	let sceneScale = $state(1);
	let ecosystemOpacity = $state(1);
	let spotlightRef: HTMLElement | null = null;
	let hero3DContainer: HTMLElement | null = null;
	let pageContainer: HTMLElement | null = null;

	// Camera settings
	let cameraPosition = $state<[number, number, number]>([0, 0, 10]);
	let cameraFov = $state(45);

	// Setup mouse context for 3D
	let mouseX = $state(0);
	let mouseY = $state(0);

	// Create a reactive mouse object for internal use
	const mouse = {
		get x() {
			return mouseX;
		},
		get y() {
			return mouseY;
		}
	};

	setContext('mouse', mouse);

	function handleMouseMove(e: MouseEvent) {
		mouseX = e.clientX;
		mouseY = e.clientY;

		// Create subtle trail particles
		if (Math.random() > 0.96) {
			createParticles(e.clientX, e.clientY, '#fb6220', 1); // brand-orange equivalent
		}
	}

	// Particle System
	class Particle {
		x: number;
		y: number;
		size: number;
		speedX: number;
		speedY: number;
		color: string;
		opacity: number;
		life: number;
		maxLife: number;

		constructor(x: number, y: number, color: string) {
			this.x = x;
			this.y = y;
			this.size = Math.random() * 6 + 3;
			this.speedX = (Math.random() - 0.5) * 1.2;
			this.speedY = (Math.random() - 0.5) * 1.2;
			this.color = color;
			this.opacity = 1;
			this.maxLife = Math.random() * 80 + 40;
			this.life = this.maxLife;
		}

		update() {
			this.x += this.speedX;
			this.y += this.speedY;
			this.life--;
			this.opacity = (this.life / this.maxLife) * 0.5;
		}

		draw(ctx: CanvasRenderingContext2D) {
			ctx.save();
			ctx.fillStyle = this.color;
			ctx.globalAlpha = this.opacity;
			ctx.shadowBlur = 10;
			ctx.shadowColor = this.color;
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
			ctx.fill();
			ctx.restore();
		}
	}

	let canvas: HTMLCanvasElement;
	let particles: Particle[] = [];
	let ctx: CanvasRenderingContext2D;
	let animationFrameId: number;

	function initParticles() {
		if (!canvas) return;
		ctx = canvas.getContext('2d')!;
		resizeCanvas();
		animate();
	}

	function resizeCanvas() {
		if (!canvas) return;
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}

	function createParticles(x: number, y: number, color: string, count = 3) {
		for (let i = 0; i < count; i++) {
			particles.push(new Particle(x, y, color));
		}
		if (particles.length > 100) particles.splice(0, particles.length - 100);
	}

	function animate() {
		if (!canvas || !ctx) return;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for (let i = particles.length - 1; i >= 0; i--) {
			particles[i].update();
			particles[i].draw(ctx);
			if (particles[i].life <= 0) {
				particles.splice(i, 1);
			}
		}
		animationFrameId = requestAnimationFrame(animate);
	}

	// Spotlight Reveal State
	let aboutContainer = $state<HTMLElement>();
	let aboutMouseX = $state(0);
	let aboutMouseY = $state(0);
	let aboutIsHovering = $state(false);

	function handleAboutMouseMove(e: MouseEvent) {
		if (!aboutContainer) return;
		const rect = aboutContainer.getBoundingClientRect();
		aboutMouseX = e.clientX - rect.left;
		aboutMouseY = e.clientY - rect.top;
	}

	// Refs
	let heroGlassCard = $state<HTMLDivElement | null>(null);

	const deliverables = $derived(
		(data as any).lang === 'ar'
			? [
					{ head: 'مواقع تعريفية', text: 'موقع احترافي في صفحة واحدة يعرض نشاطك ويصل عملاءك، جاهز خلال 48 ساعة.' },
					{ head: 'مواقع شركات', text: 'موقع متكامل يعرض خدماتك ومعرض أعمالك، مع لوحة تحكم متقدمة.' },
					{ head: 'متاجر إلكترونية', text: 'متجر كامل مع الدفع والسلة، مبني من الصفر وملكك بالكامل.' }
				]
			: [
					{ head: 'One-Page Websites', text: 'A professional one-page website presenting your business, ready in 48 hours.' },
					{ head: 'Corporate Websites', text: 'A complete website showcasing your services and portfolio, with an advanced control panel.' },
					{ head: 'Online Stores', text: 'A full store with payment and cart, built from scratch and fully yours.' }
				]
	);

	// Split headline animation
	$effect(() => {
		const title = data.about?.title;
		const lang = data.lang;

		if (title) {
			const timer = setTimeout(() => {
				gsap.registerPlugin(ScrollTrigger);
				const isAr = lang === 'ar';
				const titleElement = document.querySelector('.hero-title') as HTMLElement;
				const subtitleElement = document.querySelector('.hero-subtitle') as HTMLElement;

				if (titleElement) {
					// 🔥 FORCE DIRECTION EXPLICITLY
					titleElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');
					// 🔥 Reset content safely
					titleElement.textContent =
						data.about?.title || (isAr ? 'من نحن' : 'About Bosla');

					// Split into words first to handle the last word orange color
					const words = titleElement.textContent?.split(' ') || [];
					if (words.length > 0) {
						const lastWord = words.pop();
						titleElement.innerHTML = `${words.join(' ')} <span class="text-brand-orange">${lastWord}</span>`;
					}

					if (isAr) {
						// Arabic: Character animation via clip-path reveal to keep ligatures
						gsap.set(titleElement, { opacity: 1, clipPath: 'inset(0 0 0 100%)' });
						gsap.to(titleElement, {
							clipPath: 'inset(0 0 0 0%)',
							duration: 1.5,
							ease: 'power2.inOut'
						});
					} else {
						// English: Character-based typing
						const charSplit = new SplitType(titleElement as HTMLElement, { types: 'chars' });
						gsap.set(charSplit.chars, { y: 10 });
						gsap.to(charSplit.chars, {
							opacity: 1,
							y: 0,
							stagger: 0.03,
							duration: 0.4,
							ease: 'power2.out'
						});
					}
				}

				if (subtitleElement) {
					// 🔥 FORCE DIRECTION EXPLICITLY
					subtitleElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');
					// 🔥 Reset content safely
					subtitleElement.textContent =
						data.about?.subtitle ||
						(isAr
							? 'بوصلة هي شريكك الاستراتيجي في صياغة المستقبل الرقمي. نحن نمزج بين الفن والتكنولوجيا لنبتكر تجارب استثنائية تتجاوز التوقعات، وترسخ مكانة علامتك التجارية في الصدارة.'
							: 'BOSLA is your strategic partner in crafting the digital future. We fuse artistry with advanced technology to engineer exceptional experiences that transcend expectations and position your brand at the global forefront.');

					if (isAr) {
						gsap.set(subtitleElement, { opacity: 1, clipPath: 'inset(0 0 0 100%)' });
						gsap.to(subtitleElement, {
							clipPath: 'inset(0 0 0 0%)',
							duration: 1.2,
							ease: 'power2.inOut',
							delay: 0.5
						});
					} else {
						const subSplit = new SplitType(subtitleElement as HTMLElement, { types: 'chars' });
						gsap.set(subSplit.chars, { y: 5 });
						gsap.to(subSplit.chars, {
							opacity: 1,
							y: 0,
							stagger: 0.01,
							duration: 0.3,
							ease: 'power2.out',
							delay: 0.3
						});
					}
				}
			}, 150);
			return () => clearTimeout(timer);
		}
	});

	// Mouse move effects
	$effect(() => {
		const mx = mouse.x;
		const my = mouse.y;

		if (heroGlassCard) {
			const rect = heroGlassCard.getBoundingClientRect();
			const centerX = rect.left + rect.width / 2;
			const rotateY = ((mx - centerX) / (window.innerWidth / 2)) * 10;

			gsap.to(heroGlassCard, {
				rotateY,
				duration: 0.6,
				ease: 'power2.out',
				transformPerspective: 1000
			});
		}
	});

	onMount(() => {
		const isMobile = window.innerWidth < 768;

		if (isMobile) {
			cameraPosition = [0, 0.5, 9];
			cameraFov = 55;
		} else {
			cameraPosition = [0, 0, 10];
			cameraFov = 45;
		}

		// 3D Scene Micro-interactions: Transition from Hero to About content
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
			}
		});

		// Particle Init
		initParticles();
		window.addEventListener('resize', resizeCanvas);
		window.addEventListener('mousemove', handleMouseMove);

		// Section entrance animations
		const sections = gsap.utils.toArray('section:not(.hero-section)');
		sections.forEach((section: any) => {
			gsap.fromTo(
				section,
				{ opacity: 0, y: 100, scale: 0.95, filter: 'blur(10px)' },
				{
					opacity: 1,
					y: 0,
					scale: 1,
					filter: 'blur(0px)',
					duration: 1.2,
					ease: 'power3.out',
					scrollTrigger: {
						trigger: section,
						start: 'top 90%',
						end: 'top 20%',
						scrub: 1
					}
				}
			);

			// Magnetic cards in About page
			const cards = section.querySelectorAll('.interactive-card');
			cards.forEach((card: any) => {
				const xTo = gsap.quickTo(card, 'x', { duration: 0.6, ease: 'power2.out' });
				const yTo = gsap.quickTo(card, 'y', { duration: 0.6, ease: 'power2.out' });
				const rotateX = gsap.quickTo(card, 'rotateX', { duration: 0.6, ease: 'power2.out' });
				const rotateY = gsap.quickTo(card, 'rotateY', { duration: 0.6, ease: 'power2.out' });

				card.addEventListener('mousemove', (e: MouseEvent) => {
					const rect = card.getBoundingClientRect();
					const x = e.clientX - rect.left - rect.width / 2;
					const y = e.clientY - rect.top - rect.height / 2;

					xTo(x * 0.1);
					yTo(y * 0.1);
					rotateX(-y * 0.05);
					rotateY(x * 0.05);

					const glow = card.querySelector('.card-glow');
					if (glow) {
						gsap.to(glow, {
							opacity: 1,
							left: e.clientX - rect.left,
							top: e.clientY - rect.top,
							duration: 0.4
						});
					}
				});

				card.addEventListener('mouseleave', () => {
					xTo(0);
					yTo(0);
					rotateX(0);
					rotateY(0);
					const glow = card.querySelector('.card-glow');
					if (glow) gsap.to(glow, { opacity: 0, duration: 0.6 });
				});
			});
		});
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('resize', resizeCanvas);
			window.removeEventListener('mousemove', handleMouseMove);
			if (animationFrameId) cancelAnimationFrame(animationFrameId);
		}
	});

	function link(path: string) {
		const currentLang = (data as any)?.lang;
		if (currentLang) {
			const q = new URLSearchParams();
			q.set('lang', currentLang);
			return `${path}?${q.toString()}`;
		}
		return path;
	}
</script>

<svelte:head>
	<title>{data.about?.title} — {data.site?.siteName}</title>
	<meta name="description" content={data.about?.subtitle?.slice(0, 155) || data.site?.description} />
</svelte:head>

<div
	bind:this={pageContainer}
	class="min-h-screen w-full overflow-hidden bg-[var(--color-background)] text-[var(--color-text-base)] transition-colors duration-1000 selection:bg-brand-blue/30"
>
	<canvas bind:this={canvas} class="pointer-events-none fixed inset-0 z-100"></canvas>

	<!-- 3D Sticky Scope: Hero Section Only -->
	<div class="relative">
		<!-- 3D Background Layer - Fixed to viewport, centered -->
		<div
			bind:this={hero3DContainer}
			class="hero-3d pointer-events-none fixed top-0 left-0 z-0 h-[120svh] w-full overflow-hidden will-change-transform"
		>
			<AboutScene
				{sceneRotation}
				{sceneRotationX}
				{sceneRotationZ}
				{scenePosition}
				{sceneScale}
				{ecosystemOpacity}
				{canvasKey}
				{cameraPosition}
				{cameraFov}
				onContextRestored={() => { canvasKey++; }}
			/>
		</div>

		<!-- Foreground Content -->
		<div class="relative z-10">
			<div class="container mx-auto px-6 pt-36 md:px-12">
				<div class="flex justify-center">
					<Breadcrumbs
						lang={(data as any).lang}
						items={[
							{ label: (data as any).lang === 'ar' ? 'من نحن' : 'About Us' }
						]}
					/>
				</div>
			</div>
			<!-- Hero Section -->
			<section
				class="hero-section relative flex min-h-[100svh] w-full items-center overflow-hidden pt-20"
				dir={(data as any).lang === 'ar' ? 'rtl' : 'ltr'}
			>
				<div class="relative z-10 container mx-auto flex flex-col items-center px-6 md:px-12">
					<div class="hero-content max-w-5xl text-center">
						<div
							bind:this={heroGlassCard}
							class="cinematic-glass group/card relative space-y-10 overflow-hidden rounded-[3rem] border border-[var(--glass-border)] p-8 md:p-16"
						>
							<div
								class="relative z-10 space-y-10"
								dir={(data as any).lang === 'ar' ? 'rtl' : 'ltr'}
							>
								<div
									class="hero-badge cinematic-glass relative z-10 mx-auto mb-4 inline-flex items-center gap-3 rounded-full border border-[var(--glass-border)] px-6 py-2"
								>
									<Sparkles class="h-4 w-4 text-brand-orange" />
									<span
										class="hero-badge-text text-xs font-black tracking-widest text-[var(--color-text-base)] uppercase opacity-80"
									>
										{data.lang === 'ar' ? 'وكالة حلول رقمية' : 'Digital Solutions Agency'}
									</span>
								</div>

								{#key data.lang}
									<div class="space-y-6">
										<h1
											class="hero-headline text-5xl leading-tight font-black tracking-tighter text-[var(--color-text-base)] md:text-7xl"
										>
											{data.about?.title || ''}
										</h1>

										<p
											class="hero-subheadline mx-auto max-w-2xl text-xl leading-relaxed font-medium text-[var(--color-text-muted)] md:text-2xl"
										>
											{data.about?.intro?.[0]}
										</p>
									</div>
								{/key}

								<div class="hero-buttons flex flex-wrap items-center justify-center gap-6 pt-4">
									<a href={link('/contact')} class="btn-primary group">
										<span class="relative z-10 flex items-center gap-3">
											{data.lang === 'ar' ? 'تواصل معنا' : 'Contact Us'}
											<ArrowRight
												class="h-6 w-6 transition-transform duration-500 group-hover:translate-x-2"
											/>
										</span>
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	</div>

	<!-- About Content Section -->
	<section
		bind:this={aboutContainer}
		onmousemove={handleAboutMouseMove}
		onmouseenter={() => (aboutIsHovering = true)}
		onmouseleave={() => (aboutIsHovering = false)}
		aria-label={data.lang === 'ar' ? 'من نحن' : 'About Us'}
		class="relative mx-auto max-w-7xl px-6 py-24"
		dir={(data as any).lang === 'ar' ? 'rtl' : 'ltr'}
	>
		<!-- Subtle Tech Background Pattern -->
		<div
			class="absolute inset-0 z-0 opacity-[0.03]"
			style="background-image: radial-gradient({currentTheme === 'dark'
				? '#ffffff'
				: '#000000'} 1px, transparent 1px); background-size: 32px 32px;"
		></div>

		<div class="relative z-10 grid items-start gap-16 lg:grid-cols-2">
			<!-- About Text -->
			<article
				class="cinematic-glass space-y-12 rounded-[3rem] border border-[var(--glass-border)] p-8 md:p-12"
			>
				<div class="space-y-6">
					<div
						class="cinematic-glass mb-4 inline-flex items-center gap-3 rounded-full border border-[var(--glass-border)] px-6 py-2"
					>
						<Sparkles class="h-4 w-4 text-brand-orange" />
						<span
							class="text-xs font-black tracking-widest text-[var(--color-text-muted)] uppercase"
						>
							{(data as any).lang === 'ar' ? 'من نحن' : 'About Us'}
						</span>
					</div>
					<h2 class="text-4xl leading-tight font-black text-[var(--color-text-base)] md:text-5xl">
						{(data as any).lang === 'ar'
							? 'نوجّه مشروعك في الاتجاه الصحيح على الإنترنت'
							: 'We point your business in the right direction online'}
					</h2>
					<div class="h-1.5 w-20 rounded-full bg-brand-orange"></div>
				</div>

				<div class="space-y-6">
					{#each (data as any)?.about?.intro || [] as para}
						<p class="text-lg leading-relaxed font-medium text-[var(--color-text-muted)]">{para}</p>
					{/each}
				</div>

				<!-- Contact Information -->
				<ContactInfoCard {data} />
			</article>

			<!-- Services Cards -->
			<div
				class="cinematic-glass space-y-12 rounded-[3rem] border border-[var(--glass-border)] p-8 md:p-12"
			>
				<div class="space-y-6">
					<div
						class="cinematic-glass mb-4 inline-flex items-center gap-3 rounded-full border border-[var(--glass-border)] px-6 py-2"
					>
						<Sparkles class="h-4 w-4 text-brand-orange" />
						<span
							class="text-xs font-black tracking-widest text-[var(--color-text-muted)] uppercase"
						>
							{(data as any).lang === 'ar' ? 'خدماتنا' : 'Our Services'}
						</span>
					</div>
					<h2 class="text-4xl leading-tight font-black text-[var(--color-text-base)] md:text-5xl">
						{(data as any).lang === 'ar'
							? 'ماذا نقدم؟'
							: 'What We Deliver'}
					</h2>
					<div class="h-1.5 w-20 rounded-full bg-brand-blue"></div>
				</div>

				<div class="grid gap-6">
					{#each deliverables as item, i}
						<div
							class="interactive-card cinematic-glass group relative overflow-hidden rounded-[2.5rem] border border-[var(--glass-border)] p-8"
						>
							<div
								class="card-glow pointer-events-none absolute h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/10 opacity-0 blur-[80px]"
							></div>
							<div class="relative z-10 flex items-start gap-6">
								<div
									class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-white shadow-[0_10px_20px_rgba(0,119,255,0.3)] transition-transform group-hover:scale-110"
								>
									<span class="text-xl font-black">{i + 1}</span>
								</div>
								<div class="space-y-2">
									<h3
										class="text-xl font-black text-[var(--color-text-base)] transition-colors group-hover:text-brand-blue"
									>
										{item.head}
									</h3>
									<p class="text-lg leading-relaxed font-medium text-[var(--color-text-muted)]">
										{item.text}
									</p>
								</div>
							</div>
							<div
								class="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-brand-blue via-brand-orange to-transparent transition-all duration-1000 group-hover:w-full"
							></div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- Mission Statement Section -->
	<section class="relative overflow-hidden py-24" dir={(data as any).lang === 'ar' ? 'rtl' : 'ltr'}>
		<div class="mx-auto max-w-7xl px-6">
			<div
				class="cinematic-glass group relative overflow-hidden rounded-[4rem] border border-[var(--glass-border)] p-12 text-center md:p-24"
			>
				<!-- Background Accents - Radial gradients replace blur -->
				<div
					class="absolute -top-24 -right-24 h-96 w-96 rounded-full transition-colors duration-1000 group-hover:opacity-80"
					style="background: radial-gradient(circle, rgba(0, 119, 255, 0.15) 0%, rgba(0, 119, 255, 0.05) 40%, transparent 70%);"
				></div>
				<div
					class="absolute -bottom-24 -left-24 h-96 w-96 rounded-full transition-colors duration-1000 group-hover:opacity-80"
					style="background: radial-gradient(circle, rgba(255, 107, 0, 0.15) 0%, rgba(255, 107, 0, 0.05) 40%, transparent 70%);"
				></div>

				<div class="relative z-10 mx-auto max-w-4xl space-y-10">
					<div
						class="mb-4 inline-flex h-24 w-24 items-center justify-center rounded-[2rem] bg-brand-orange text-white shadow-[0_20px_40px_rgba(255,107,0,0.3)]"
					>
						<Target class="h-12 w-12" />
					</div>

					<div class="space-y-4">
						<h3 class="text-4xl font-black text-[var(--color-text-base)] md:text-6xl">
							{(data as any).lang === 'ar' ? 'رسالتنا' : 'Our Mission'}
						</h3>
						<div class="mx-auto h-2 w-24 rounded-full bg-brand-orange"></div>
					</div>

					<p
						class="text-2xl leading-tight font-bold tracking-tight text-[var(--color-text-muted)] italic md:text-4xl"
					>
						"{(data as any).about?.mission}"
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<CtaSection {data} />
</div>

<style>
	:global(section) {
		perspective: 1000px;
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
	:global(.hero-title .char, .hero-subtitle .char) {
		display: inline-block !important;
	}
</style>
