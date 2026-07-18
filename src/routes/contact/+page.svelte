<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import { theme } from '$lib/stores/theme.svelte';
	// @ts-ignore - lucide types declared in src/app.d.ts for Svelte projects
	import {
		ArrowRight,
		Phone,
		MapPin,
		Send,
		MessageSquare,
		Clock,
		Globe,
		ChevronDown,
		Award,
		Sparkles
	} from '@lucide/svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import SplitType from 'split-type';
	import HeroBackground from '$lib/components/HeroBackground.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';

	let { data } = $props();
	const currentTheme = $derived(theme.current);
	const typedData = data as any;
	const homeHeroImage = typedData?.home?.hero?.image;

	// Setup mouse context for 3D
	let mouseX = $state(0);
	let mouseY = $state(0);
	setContext('mouse', {
		get x() {
			return mouseX;
		},
		get y() {
			return mouseY;
		}
	});

	let SceneComponent: any = $state(null);

	function handleMouseMove(e: MouseEvent) {
		mouseX = e.clientX;
		mouseY = e.clientY;

		// Global mouse move for particles
		// Create subtle trail particles
		if (Math.random() > 0.95) {
			createParticles(e.clientX, e.clientY, '#3b82f6', 1); // brand-blue equivalent
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
			this.size = Math.random() * 8 + 4; // Increased size: 4 to 12 pixels
			this.speedX = (Math.random() - 0.5) * 1.5;
			this.speedY = (Math.random() - 0.5) * 1.5;
			this.color = color;
			this.opacity = 1;
			this.maxLife = Math.random() * 80 + 40;
			this.life = this.maxLife;
		}

		update() {
			this.x += this.speedX;
			this.y += this.speedY;
			this.life--;
			this.opacity = (this.life / this.maxLife) * 0.6; // Slightly more transparent for larger particles
		}

		draw(ctx: CanvasRenderingContext2D) {
			ctx.save();
			ctx.fillStyle = this.color;
			ctx.globalAlpha = this.opacity;

			// Add a subtle glow for larger particles
			ctx.shadowBlur = 15;
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
		if (particles.length > 150) particles.splice(0, particles.length - 150);
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

	// Cleanup function for onMount
	let cleanupParticles: () => void;

	// Add link helper to persist current lang across navigation
	function link(path: string) {
		const currentLang = typedData?.lang;
		if (currentLang) {
			const q = new URLSearchParams();
			q.set('lang', currentLang);
			const qs = q.toString();
			return `${path}?${qs}`;
		}
		return path;
	}

	// Handle form submission for static deployment
	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		const isAr = typedData?.lang === 'ar';

		// Create a burst of particles on submit
		const rect = (event.target as HTMLElement).getBoundingClientRect();
		createParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, '#3b82f6', 50);

		alert(
			isAr
				? 'تم استلام رسالتك بنجاح! سنتواصل معك قريباً.'
				: 'Your message has been received successfully! We will contact you soon.'
		);
		(event.target as HTMLFormElement).reset();
	}

	let heroTitle: HTMLElement;

	$effect(() => {
		if (heroTitle && data) {
			const isAr = (data as any).lang === 'ar';
			const typedData = data as any;

			// 🔥 FORCE DIRECTION EXPLICITLY
			heroTitle.setAttribute('dir', isAr ? 'rtl' : 'ltr');

			// 🔥 Reset content safely
			const originalText =
				typedData.contact?.title ||
				(isAr ? 'لنتواصل ونبني مستقبلك الرقمي' : "Let's Connect & Build Your Digital Future");
			heroTitle.textContent = originalText;

			// Split into words first to handle the last word orange color
			const words = heroTitle.textContent?.split(' ') || [];
			if (words.length > 0) {
				const lastWord = words.pop();
				heroTitle.innerHTML = `${words.join(' ')} <span class="text-brand-orange">${lastWord}</span>`;
			}
			// Animation
			if (typeof window !== 'undefined') {
				// Kill old ScrollTriggers
				ScrollTrigger.getAll().forEach((t) => {
					if (t.trigger === heroTitle) t.kill();
				});

				if (isAr) {
					// Arabic: Character animation via clip-path reveal to keep ligatures
					gsap.set(heroTitle, { opacity: 1, clipPath: 'inset(0 0 0 100%)' });
					gsap.to(heroTitle, {
						clipPath: 'inset(0 0 0 0%)',
						duration: 1.5,
						ease: 'power2.inOut',
						scrollTrigger: {
							trigger: heroTitle,
							start: 'top 85%'
						}
					});
				} else {
					// English: Character-based typing
					const charSplit = new SplitType(heroTitle, { types: 'chars' });
					gsap.set(charSplit.chars, { y: 10 });
					gsap.to(charSplit.chars, {
						opacity: 1,
						y: 0,
						stagger: 0.03,
						duration: 0.4,
						ease: 'power2.out',
						scrollTrigger: {
							trigger: heroTitle,
							start: 'top 85%'
						}
					});
				}
			}
		}
	});

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);
		initParticles();

		// Start Three.js download immediately, show after 600ms delay
		const scenePromise = import('$lib/components/scenes/ContactScene.svelte').catch((err) => {
			console.warn('ContactScene dynamic import failed:', err);
			return null;
		});
		setTimeout(async () => {
			const m = await scenePromise;
			if (m) SceneComponent = m.default;
		}, 600);
		window.addEventListener('resize', resizeCanvas);
		window.addEventListener('mousemove', handleMouseMove);

		// Add button hover particles
		const submitBtn = document.querySelector('button[type="submit"]');
		if (submitBtn) {
			submitBtn.addEventListener('mousemove', (e: Event) => {
				const mouseEvent = e as MouseEvent;
				if (Math.random() > 0.5) {
					createParticles(mouseEvent.clientX, mouseEvent.clientY, '#ffffff', 2);
				}
			});
		}

		// Magnetic card interactions
		const cards = document.querySelectorAll('.interactive-card');
		cards.forEach((card) => {
			const glow = card.querySelector('.card-glow') as HTMLElement;
			const xTo = gsap.quickTo(card, 'x', { duration: 0.6, ease: 'power2.out' });
			const yTo = gsap.quickTo(card, 'y', { duration: 0.6, ease: 'power2.out' });
			const rotateX = gsap.quickTo(card, 'rotateX', { duration: 0.6, ease: 'power2.out' });
			const rotateY = gsap.quickTo(card, 'rotateY', { duration: 0.6, ease: 'power2.out' });

			card.addEventListener('mousemove', (e: Event) => {
				const mouseEvent = e as MouseEvent;
				const rect = (card as HTMLElement).getBoundingClientRect();
				const x = mouseEvent.clientX - rect.left;
				const y = mouseEvent.clientY - rect.top;

				// Trigger particles on card hover
				if (Math.random() > 0.7) {
					createParticles(mouseEvent.clientX, mouseEvent.clientY, '#f97316', 2); // brand-orange equivalent
				}

				const centerX = rect.width / 2;
				const centerY = rect.height / 2;

				const moveX = (x - centerX) * 0.1;
				const moveY = (y - centerY) * 0.1;
				const rotX = (centerY - y) * 0.05;
				const rotY = (x - centerX) * 0.05;

				xTo(moveX);
				yTo(moveY);
				rotateX(rotX);
				rotateY(rotY);

				if (glow) {
					gsap.to(glow, {
						left: x,
						top: y,
						opacity: 1,
						duration: 0.3
					});
				}
			});

			card.addEventListener('mouseleave', () => {
				xTo(0);
				yTo(0);
				rotateX(0);
				rotateY(0);
				if (glow) {
					gsap.to(glow, {
						opacity: 0,
						duration: 0.3
					});
				}
			});
		});

		// Staggered entry for form elements
		gsap.from('.form-element', {
			opacity: 0,
			y: 30,
			stagger: 0.1,
			duration: 0.8,
			ease: 'power3.out',
			scrollTrigger: {
				trigger: '#contact-form',
				start: 'top 80%'
			}
		});

		return () => {
			cancelAnimationFrame(animationFrameId);
			window.removeEventListener('resize', resizeCanvas);
			window.removeEventListener('mousemove', handleMouseMove);
		};
	});
</script>

<canvas bind:this={canvas} class="pointer-events-none fixed inset-0 z-0"></canvas>

<svelte:head>
	<title>{(data as any).contact?.title || 'Contact'} — {(data as any).site?.siteName || 'BOSLA'}</title>
	<meta name="description" content={(data as any).contact?.subtitle?.slice(0, 155) || (data as any).site?.description || ''} />
</svelte:head>

<!-- Hero Section - Obsidian Design Alignment -->
<section
	class="relative flex min-h-[70vh] w-full items-center justify-center overflow-hidden transition-colors duration-1000"
	dir={(data as any).lang === 'ar' ? 'rtl' : 'ltr'}
>
	<!-- Background Image -->
	<HeroBackground />

	<!-- 3D Connection Object -->
	<div
		class="absolute inset-0 z-0 opacity-60"
		style="filter: {currentTheme === 'light' ? 'brightness(1.2) contrast(0.9)' : 'none'}"
	>
		{#if SceneComponent}
			<SceneComponent />
		{:else}
			<div class="absolute inset-0 bg-gradient-to-br from-[var(--color-brand-blue)]/20 via-transparent to-[var(--color-brand-orange)]/10"></div>
		{/if}
	</div>

	<!-- Background Accents Removed to use HeroBackground -->
	<div class="relative z-10 container mx-auto px-6 py-24">
		<div class="flex justify-center pb-4">
			<Breadcrumbs
				lang={(data as any).lang}
				items={[
					{ label: (data as any).lang === 'ar' ? 'اتصل بنا' : 'Contact Us' }
				]}
			/>
		</div>
		<div class="mx-auto max-w-4xl space-y-8 text-center">
			<div
				class="cinematic-glass mb-4 inline-flex items-center gap-3 rounded-full border border-[var(--glass-border)] px-6 py-2"
			>
				<Sparkles class="h-4 w-4 text-brand-orange" />
				<span class="text-xs font-black tracking-widest text-[var(--color-text-muted)] uppercase">
					{data.lang === 'ar' ? 'تواصل معنا' : 'Get in Touch'}
				</span>
			</div>

			<h1
				bind:this={heroTitle}
				class="hero-title text-6xl leading-tight font-black text-[var(--color-text-base)] md:text-8xl"
			>
				{(data as any).contact?.title || (data.lang === 'ar' ? 'اتصل بنا' : 'Contact Us')}
			</h1>

			<p
				class="mx-auto max-w-2xl text-xl leading-relaxed font-medium text-[var(--color-text-muted)] md:text-2xl"
			>
				{(data as any).contact?.subtitle ||
					(data.lang === 'ar'
						? 'نحن هنا لتحويل أفكارك إلى واقع رقمي ملموس'
						: 'We are here to transform your ideas into tangible digital reality')}
			</p>
		</div>
	</div>
</section>

<!-- Main Contact Section -->
<section
	class="relative w-full overflow-hidden bg-[var(--color-background)] py-24 transition-colors duration-1000"
	dir={(data as any).lang === 'ar' ? 'rtl' : 'ltr'}
>
	<div class="container mx-auto px-6">
		<div class="grid items-start gap-12 lg:grid-cols-3">
			<!-- Contact Info Cards -->
			<div class="space-y-6">
				<!-- Phone Card -->
				<div
					class="interactive-card cinematic-glass group relative overflow-hidden rounded-[2.5rem] border border-[var(--glass-border)] p-8"
				>
					<div
						class="card-glow pointer-events-none absolute h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-[80px]"
						style="background: {currentTheme === 'dark'
							? 'rgba(59, 130, 246, 0.15)'
							: 'rgba(59, 130, 246, 0.25)'}"
					></div>
					<div class="relative z-10 flex flex-col gap-6">
						<div
							class="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue"
						>
							<Phone class="h-8 w-8" />
						</div>
						<div class="space-y-2">
							<h3 class="text-2xl font-black text-[var(--color-text-base)]">
								{(data as any).lang === 'ar' ? 'اتصل بنا' : 'Call Us'}
							</h3>
							<div class="space-y-1">
								{#each (data as any).contact?.phones || [] as p}
									<a
										href="https://wa.me/966576704683?text={encodeURIComponent((data as any).lang === 'ar' ? 'مرحباً، أود الاستفسار عن خدماتكم' : 'Hello, I would like to inquire about your services')}"
										target="_blank"
										rel="noopener noreferrer"
										class="block font-bold text-[var(--color-text-muted)] transition-colors hover:text-brand-blue"
									>
										<span dir="ltr">{p.value}</span>
									</a>
								{/each}
							</div>
						</div>
					</div>
					<div
						class="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-brand-blue to-transparent transition-all duration-700 group-hover:w-full"
					></div>
				</div>

				<!-- Address Card -->
				<div
					class="interactive-card cinematic-glass group relative overflow-hidden rounded-[2.5rem] border border-[var(--glass-border)] p-8"
				>
					<div
						class="card-glow pointer-events-none absolute h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-[80px]"
						style="background: {currentTheme === 'dark'
							? 'rgba(59, 130, 246, 0.15)'
							: 'rgba(59, 130, 246, 0.25)'}"
					></div>
					<div class="relative z-10 flex flex-col gap-6">
						<div
							class="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue"
						>
							<MapPin class="h-8 w-8" />
						</div>
						<div class="space-y-2">
							<h3 class="text-2xl font-black text-[var(--color-text-base)]">
								{(data as any).lang === 'ar' ? 'العنوان' : 'Address'}
							</h3>
							<div class="space-y-1">
								{#each (data as any).contact?.addresses || [] as addr}
									<p class="font-bold text-[var(--color-text-muted)]">{addr.value}</p>
								{/each}
							</div>
						</div>
						<div class="overflow-hidden rounded-2xl">
							<iframe
								src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.780681960655!2d46.718144!3d24.688002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDQxJzE2LjgiTiA0NsKwNDMnMDUuMyJF!5e0!3m2!1sar!2ssa!4v1"
								width="100%"
								height="180"
								style="border:0;"
								allowfullscreen=""
								loading="lazy"
								referrerpolicy="no-referrer-when-downgrade"
								title={(data as any).lang === 'ar' ? 'موقع بوصلة' : 'BOSLA Location'}
								class="rounded-2xl opacity-80 transition-opacity hover:opacity-100"
							></iframe>
						</div>
						<div class="mt-4 text-center">
							<a
								href="https://www.google.com/maps?q=Al+Malaz+Riyadh+Saudi+Arabia"
								target="_blank"
								rel="noopener noreferrer"
								class="text-sm font-bold text-brand-blue underline decoration-from-font underline-offset-2 transition-colors hover:text-brand-orange"
							>
								{(data as any).lang === 'ar' ? 'عرض على Google Maps' : 'View on Google Maps'}
							</a>
						</div>
					</div>
					<div
						class="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-brand-blue to-transparent transition-all duration-700 group-hover:w-full"
					></div>
				</div>

				<!-- Support Card -->
				<div
					class="interactive-card cinematic-glass group relative overflow-hidden rounded-[2.5rem] border border-[var(--glass-border)] p-8"
				>
					<div
						class="card-glow pointer-events-none absolute h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-[80px]"
						style="background: {currentTheme === 'dark'
							? 'rgba(59, 130, 246, 0.15)'
							: 'rgba(59, 130, 246, 0.25)'}"
					></div>
					<div class="relative z-10 flex flex-col gap-6">
						<div
							class="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue"
						>
							<Globe class="h-8 w-8" />
						</div>
						<div class="space-y-2">
							<h3 class="text-2xl font-black text-[var(--color-text-base)]">
								{(data as any).lang === 'ar' ? 'دعم عالمي' : 'Global Support'}
							</h3>
							<p class="font-medium text-[var(--color-text-muted)]">
								{(data as any).lang === 'ar'
									? 'نحن نخدم عملائنا في جميع أنحاء العالم'
									: 'We serve our clients all over the world'}
							</p>
						</div>
					</div>
					<div
						class="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-brand-blue to-transparent transition-all duration-700 group-hover:w-full"
					></div>
				</div>

				<!-- CR Reference -->
				<div
					class="cinematic-glass rounded-[2rem] border border-[var(--glass-border)] p-5 text-center text-[11px] leading-relaxed text-[var(--color-text-dim)]"
				>
					{(data as any).lang === 'ar'
? 'بوصلة | حي الملز، الرياض'
					: 'BOSLA | Al Malaz, Riyadh'}
				</div>
			</div>

			<!-- Main Contact Form -->
			<div class="lg:col-span-2">
				<div
					class="cinematic-glass relative overflow-hidden rounded-[3rem] border border-[var(--glass-border)] p-8 md:p-12"
				>
					<form id="contact-form" onsubmit={handleSubmit} class="relative z-10 space-y-8">
						<div class="form-element space-y-4">
							<div
								class="inline-flex items-center gap-2 rounded-full border border-brand-blue/20 bg-brand-blue/10 px-4 py-1.5 text-[10px] font-black tracking-widest text-brand-blue uppercase"
							>
								<Send class="h-3 w-3" />
								{(data as any).lang === 'ar' ? 'أرسل رسالة' : 'Send a Message'}
							</div>
							<h2 class="text-4xl font-black text-[var(--color-text-base)]">
								{(data as any).lang === 'ar'
									? 'دعنا نبدأ مشروعك القادم'
									: "Let's Start Your Next Project"}
							</h2>
						</div>

						<div class="grid gap-6 md:grid-cols-2">
							<div class="form-element space-y-2">
								<label for="name" class="px-4 text-sm font-bold text-[var(--color-text-muted)]"
									>{(data as any).lang === 'ar' ? 'الاسم الكامل' : 'Full Name'}</label
								>
								<input
									id="name"
									name="name"
									type="text"
									required
									class="w-full rounded-2xl border border-[var(--glass-border)] bg-[var(--color-text-base)]/5 px-6 py-4 font-medium text-[var(--color-text-base)] transition-all outline-none placeholder:text-[var(--color-text-muted)]/30 hover:border-brand-blue/30 focus:border-brand-blue focus:bg-[var(--color-text-base)]/10 focus:ring-4 focus:ring-brand-blue/10"
									placeholder={(data as any).lang === 'ar' ? 'اسمك بالكامل' : 'John Doe'}
								/>
							</div>

							<div class="form-element space-y-2">
								<label for="phone" class="px-4 text-sm font-bold text-[var(--color-text-muted)]"
									>{(data as any).lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</label
								>
								<input
									id="phone"
									name="phone"
									type="tel"
									required
									class="w-full rounded-2xl border border-[var(--glass-border)] bg-[var(--color-text-base)]/5 px-6 py-4 font-medium text-[var(--color-text-base)] transition-all outline-none placeholder:text-[var(--color-text-muted)]/30 hover:border-brand-blue/30 focus:border-brand-blue focus:bg-[var(--color-text-base)]/10 focus:ring-4 focus:ring-brand-blue/10"
									placeholder="+1 234 567 890"
								/>
							</div>

							<div class="form-element space-y-2">
								<label for="company" class="px-4 text-sm font-bold text-[var(--color-text-muted)]"
									>{(data as any).lang === 'ar' ? 'الشركة' : 'Company'}</label
								>
								<input
									id="company"
									name="company"
									type="text"
									class="w-full rounded-2xl border border-[var(--glass-border)] bg-[var(--color-text-base)]/5 px-6 py-4 font-medium text-[var(--color-text-base)] transition-all outline-none placeholder:text-[var(--color-text-muted)]/30 hover:border-brand-blue/30 focus:border-brand-blue focus:bg-[var(--color-text-base)]/10 focus:ring-4 focus:ring-brand-blue/10"
									placeholder={(data as any).lang === 'ar' ? 'اسم الشركة' : 'Company Name'}
								/>
							</div>

							<div class="form-element space-y-2 md:col-span-2">
								<label for="subject" class="px-4 text-sm font-bold text-[var(--color-text-muted)]"
									>{(data as any).lang === 'ar' ? 'الموضوع' : 'Subject'}</label
								>
								<div class="relative">
									<select
										id="subject"
										name="subject"
										required
										style="appearance: none; -webkit-appearance: none; -moz-appearance: none; background-image: none !important;"
										class="w-full appearance-none rounded-2xl border border-[var(--glass-border)] bg-[var(--color-text-base)]/5 bg-none px-6 py-4 font-medium text-[var(--color-text-base)] transition-all outline-none hover:border-brand-blue/30 focus:border-brand-blue focus:bg-[var(--color-text-base)]/10 focus:ring-4 focus:ring-brand-blue/10"
									>
										<option value="" disabled selected class="bg-[var(--color-background)]"
											>{(data as any).lang === 'ar' ? 'اختر موضوعًا' : 'Select a subject'}</option
										>
										<option value="project" class="bg-[var(--color-background)]"
											>{(data as any).lang === 'ar' ? 'مشروع جديد' : 'New Project'}</option
										>
										<option value="support" class="bg-[var(--color-background)]"
											>{(data as any).lang === 'ar' ? 'دعم فني' : 'Technical Support'}</option
										>
										<option value="partnership" class="bg-[var(--color-background)]"
											>{(data as any).lang === 'ar' ? 'شراكة عمل' : 'Business Partnership'}</option
										>
										<option value="other" class="bg-[var(--color-background)]"
											>{(data as any).lang === 'ar' ? 'أخرى' : 'Other'}</option
										>
									</select>
									<div
										class="absolute inset-y-0 {(data as any).lang === 'ar'
											? 'left-6'
											: 'right-6'} pointer-events-none flex items-center text-[var(--color-text-muted)]"
									>
										<ChevronDown class="h-5 w-5" />
									</div>
								</div>
							</div>

							<div class="form-element space-y-2 md:col-span-2">
								<label for="message" class="px-4 text-sm font-bold text-[var(--color-text-muted)]"
									>{(data as any).lang === 'ar' ? 'الرسالة' : 'Message'}</label
								>
								<textarea
									id="message"
									name="message"
									required
									rows={5}
									class="w-full resize-none rounded-2xl border border-[var(--glass-border)] bg-[var(--color-text-base)]/5 px-6 py-4 font-medium text-[var(--color-text-base)] transition-all outline-none placeholder:text-[var(--color-text-muted)]/30 hover:border-brand-blue/30 focus:border-brand-blue focus:bg-[var(--color-text-base)]/10 focus:ring-4 focus:ring-brand-blue/10"
									placeholder={(data as any).lang === 'ar'
										? 'أخبرنا عن مشروعك بالتفصيل...'
										: 'Tell us about your project in detail...'}
								></textarea>
							</div>
						</div>

						<button
							type="submit"
							class="form-element group relative inline-flex w-full items-center justify-center overflow-hidden rounded-full bg-brand-blue px-12 py-5 text-lg font-black text-white transition-all hover:scale-105 active:scale-95 sm:w-auto"
						>
							<div
								class="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-1000 group-hover:translate-x-[100%]"
							></div>
							<span class="relative z-10 flex items-center gap-3">
								{(data as any).lang === 'ar' ? 'إرسال الرسالة' : 'Send Message'}
								<Send
									class="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
								/>
							</span>
						</button>
					</form>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	:global(.interactive-card) {
		transform-style: preserve-3d;
		perspective: 1000px;
	}
</style>
