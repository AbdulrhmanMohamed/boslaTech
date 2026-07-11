<script lang="ts">
	import { inView } from '$lib/actions/inView';
	import { theme } from '$lib/stores/theme.svelte';
	import { ArrowRight } from '@lucide/svelte';
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import SplitType from 'split-type';

	if (typeof window !== 'undefined') {
		gsap.registerPlugin(ScrollTrigger);
	}

	// Props to receive data from parent component
	const props = $props<{ data: any }>();
	const data = $derived(props.data);
	const currentTheme = $derived(theme.current);

	function link(path: string) {
		if (typeof window === 'undefined') return path;

		// Handle base URL
		let finalPath = path;
		if (path.startsWith('/') && !path.startsWith(base)) {
			finalPath = `${base}${path}`;
		}

		const q = new URLSearchParams($page.url.search);
		const currentLang = q.get('lang') ?? data?.lang;
		if (currentLang) q.set('lang', currentLang);
		const qs = q.toString();
		return qs ? `${finalPath}?${qs}` : finalPath;
	}

	const cta = $derived({
		badge: data?.home?.cta?.badge || (data?.lang === 'ar' ? 'لنبدأ الآن' : "Let's Start Now"),
		title:
			data?.home?.cta?.title ||
			(data?.lang === 'ar'
				? 'مستعد لبناء موقعك الإلكتروني عالي التحويل؟'
				: 'Ready to Build Your High-Converting Website?'),
		subtitle:
			data?.home?.cta?.subtitle ||
			(data?.lang === 'ar'
				? 'لنقوم بإنشاء حضور إلكتروني قوي يحقق النتائج. احجز استشارة مجانية اليوم.'
				: "Let's create a powerful online presence that drives results. Schedule a free consultation today."),
		button_text:
			data?.home?.cta?.buttonText ||
			data?.home?.cta?.button_text ||
			(data?.lang === 'ar' ? 'احصل على استشارتك المجانية' : 'Get Your Free Consultation'),
		button_link: data?.home?.cta?.button_link || '/contact',
		secondary_button_text:
			data?.home?.cta?.secondary_button_text ||
			(data?.lang === 'ar' ? 'شاهد أعمالنا' : 'View Our Work'),
		secondary_button_link: '/portfolio'
		// Temporarily disabled Company Profile fallback:
		// data?.home?.cta?.secondary_button_link || '/BOSLA-company-profile-Arabic.pdf'
	});

	let sectionRef: HTMLElement;

	// Section Header Animations (Typewriter effect)
	$effect(() => {
		if (typeof window === 'undefined') return;

		// Track dependencies to re-run on language change
		const lang = data?.lang;
		const titleText = cta.title;
		const subtitleText = cta.subtitle;
		const badgeText = cta.badge;
		const primaryBtnText = cta.button_text;
		const secondaryBtnText = cta.secondary_button_text;

		const ctx = gsap.context(() => {
			const timer = setTimeout(() => {
				if (!sectionRef) return;
				const isAr = lang === 'ar';
				// Use scoped selectors instead of ID
				const titleElement = sectionRef.querySelector('.section-title') as HTMLElement;
				const descriptionElement = sectionRef.querySelector('.section-description') as HTMLElement;
				const badgeElement = sectionRef.querySelector('.cinematic-glass-badge') as HTMLElement;
				const primaryBtn = sectionRef.querySelector('.btn-primary-text') as HTMLElement;
				const secondaryBtn = sectionRef.querySelector('.btn-secondary-text') as HTMLElement;

				if (!titleElement || !descriptionElement) return;

				// 🔥 FORCE DIRECTION EXPLICITLY
				titleElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');
				descriptionElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');

				// 🔥 Reset content safely
				titleElement.textContent = titleText;
				descriptionElement.textContent = subtitleText;

				// Apply brand highlight safely after setting textContent
				const words = titleText.split(' ');
				if (words.length >= 3) {
					const lastWord = words.pop();
					const firstWord = words.shift();
					const middleText = words.join(' ');
					titleElement.innerHTML = `<span class="text-brand-orange">${firstWord}</span> ${middleText} <span class="text-brand-orange">${lastWord}</span>`;
				} else if (words.length === 2) {
					titleElement.innerHTML = `<span class="text-brand-orange">${words[0]}</span> <span class="text-brand-orange">${words[1]}</span>`;
				} else {
					titleElement.innerHTML = `<span class="text-brand-orange">${titleText}</span>`;
				}

				if (badgeElement) {
					badgeElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');
					const badgeSpan = badgeElement.querySelector('.badge-text');
					if (badgeSpan) badgeSpan.textContent = badgeText;
				}
				if (primaryBtn) {
					primaryBtn.setAttribute('dir', isAr ? 'rtl' : 'ltr');
					primaryBtn.textContent = primaryBtnText;
				}
				if (secondaryBtn) {
					secondaryBtn.setAttribute('dir', isAr ? 'rtl' : 'ltr');
					secondaryBtn.textContent = secondaryBtnText;
				}

				// Clear existing
				gsap.killTweensOf([badgeElement, titleElement, descriptionElement]);
				gsap.set([badgeElement, titleElement, descriptionElement], {
					clearProps: 'all',
					opacity: 0,
					visibility: 'visible'
				});

				const tl = gsap.timeline({
					scrollTrigger: {
						trigger: '#cta-section',
						start: 'top 85%',
						toggleActions: 'play none none none'
					}
				});

				if (isAr) {
					// Arabic Reveal Logic
					gsap.set([titleElement, descriptionElement], {
						opacity: 1,
						clipPath: 'inset(0 0 0 100%)'
					});

					tl.to(badgeElement, {
						y: 0,
						opacity: 1,
						duration: 0.5,
						ease: 'power2.out',
						startAt: { y: 20 }
					})
						.to(
							titleElement,
							{
								clipPath: 'inset(0 0 0 0%)',
								duration: 1.2,
								ease: 'power2.inOut'
							},
							'-=0.2'
						)
						.to(
							descriptionElement,
							{
								clipPath: 'inset(0 0 0 0%)',
								duration: 1,
								ease: 'power2.inOut',
								delay: 0.2
							},
							'-=0.8'
						);
				} else {
					// English Character Logic
					gsap.set([titleElement, descriptionElement], { opacity: 1 });

					const titleSplit = new SplitType(titleElement, { types: 'chars,words' });
					const descSplit = new SplitType(descriptionElement, { types: 'chars' });

					tl.to(badgeElement, {
						y: 0,
						opacity: 1,
						duration: 0.5,
						ease: 'power2.out',
						startAt: { y: 20 }
					})
						.from(
							titleSplit.chars,
							{
								opacity: 0,
								y: 20,
								stagger: 0.02,
								duration: 0.6,
								ease: 'power3.out'
							},
							'-=0.3'
						)
						.from(
							descSplit.chars,
							{
								opacity: 0,
								y: 10,
								stagger: 0.005,
								duration: 0.4,
								ease: 'power2.out'
							},
							'-=0.4'
						);
				}

				// Micro-interactions (Magnetic & Glow)
				const card = sectionRef.querySelector('.interactive-card') as HTMLElement;
				const glow = sectionRef.querySelector('.card-glow') as HTMLElement;

				if (card) {
					const xTo = gsap.quickTo(card, 'x', { duration: 0.6, ease: 'power2.out' });
					const yTo = gsap.quickTo(card, 'y', { duration: 0.6, ease: 'power2.out' });
					const rotateX = gsap.quickTo(card, 'rotateX', { duration: 0.6, ease: 'power2.out' });
					const rotateY = gsap.quickTo(card, 'rotateY', { duration: 0.6, ease: 'power2.out' });

					let glowXTo: any, glowYTo: any;
					if (glow) {
						gsap.set(glow, { clearProps: 'all' });
						glowXTo = gsap.quickTo(glow, 'x', { duration: 0.4, ease: 'power2.out' });
						glowYTo = gsap.quickTo(glow, 'y', { duration: 0.4, ease: 'power2.out' });
					}

					const onMouseMove = (e: MouseEvent) => {
						const rect = card.getBoundingClientRect();
						const centerX = rect.left + rect.width / 2;
						const centerY = rect.top + rect.height / 2;

						const x = e.clientX - centerX;
						const y = e.clientY - centerY;

						xTo(x * 0.05);
						yTo(y * 0.05);
						rotateX(-y * 0.02);
						rotateY(x * 0.02);

						if (glow) {
							const glowX = e.clientX - rect.left;
							const glowY = e.clientY - rect.top;
							glowXTo(glowX);
							glowYTo(glowY);
						}
					};

					const onMouseEnter = () => {
						if (glow && theme.current !== 'light') {
							gsap.to(glow, { opacity: 1, duration: 0.4 });
						}
					};

					const onMouseLeave = () => {
						xTo(0);
						yTo(0);
						rotateX(0);
						rotateY(0);

						if (glow) {
							gsap.to(glow, { opacity: 0, duration: 0.6 });
						}
					};

					card.addEventListener('mouseenter', onMouseEnter);
					card.addEventListener('mousemove', onMouseMove);
					card.addEventListener('mouseleave', onMouseLeave);

					(card as any)._cleanup = () => {
						card.removeEventListener('mouseenter', onMouseEnter);
						card.removeEventListener('mousemove', onMouseMove);
						card.removeEventListener('mouseleave', onMouseLeave);
					};
				}

				ScrollTrigger.refresh();
			}, 150);

			return () => clearTimeout(timer);
		});

		return () => {
			ctx.revert();
			if (sectionRef) {
				const card = sectionRef.querySelector('.interactive-card') as any;
				if (card?._cleanup) card._cleanup();
			}
		};
	});
</script>

<section
	bind:this={sectionRef}
	id="cta-section"
	class="relative overflow-hidden bg-[var(--color-background)] py-32 perspective-[1000px]"
	dir={data?.lang === 'ar' ? 'rtl' : 'ltr'}
>
	<!-- Unified Spotlight - Radial gradient replaces blur for better performance -->
	<div class="pointer-events-none absolute inset-0 z-0 opacity-30">
		<div
			class="absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-1000"
			style="background: radial-gradient(circle, {currentTheme === 'dark'
				? 'var(--color-brand-blue-glow)'
				: 'var(--color-brand-blue)'} 0%, {currentTheme === 'dark'
				? 'rgba(0, 153, 255, 0.04)'
				: 'rgba(0, 119, 255, 0.01)'} 40%, transparent 70%); opacity: {currentTheme === 'dark'
				? 0.05
				: 0.02};"
		></div>
	</div>

	<div class="relative z-10 container mx-auto px-6">
		<div
			use:inView
			class="interactive-card cinematic-glass group relative overflow-hidden rounded-[3.5rem] border border-[var(--glass-border)] p-16 text-center md:p-24"
		>
			<!-- Dynamic Spotlight Glow - Radial gradient replaces blur -->
			<div
				class="card-glow pointer-events-none absolute h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
				style="left: 0; top: 0; background: radial-gradient(circle, {currentTheme === 'dark'
					? 'rgba(var(--color-brand-blue-rgb), 0.15)'
					: 'transparent'} 0%, {currentTheme === 'dark'
					? 'rgba(0, 119, 255, 0.05)'
					: 'transparent'} 50%, transparent 80%);"
			></div>

			<!-- Inner Shadow/Depth Effect -->
			<div
				class="pointer-events-none absolute inset-0"
				style="box-shadow: {currentTheme === 'dark'
					? 'inset 0 0 40px rgba(255,255,255,0.02)'
					: 'inset 0 0 40px rgba(0,0,0,0.01)'};"
			></div>

			<!-- Hover Glow -->
			<div
				use:inView
				class="absolute inset-0 bg-brand-blue/5 opacity-0 transition-opacity duration-700 group-hover:opacity-100 group-[.in-view]:opacity-100"
			></div>

			<div class="relative z-10 flex flex-col items-center space-y-12">
				<div class="flex flex-col items-center space-y-6">
					<div
						class="cinematic-glass-badge cinematic-glass inline-flex items-center gap-3 rounded-full border border-brand-blue/20 px-6 py-2 text-xs font-black tracking-widest text-brand-blue uppercase"
					>
						<span
							class="h-2 w-2 rounded-full bg-brand-blue"
							style="box-shadow: {currentTheme === 'dark'
								? '0 0 10px rgba(11, 157, 217, 0.5)'
								: '0 0 8px rgba(11, 157, 217, 0.3)'};"
						></span>
						<span class="badge-text">{cta.badge}</span>
					</div>

					{#key data?.lang}
						<h2
							class="section-title max-w-4xl text-4xl leading-[1.1] font-black tracking-tighter text-[var(--color-text-base)] md:text-5xl"
						>
							{cta.title.split(' ').slice(0, -1).join(' ')}
							<span class="text-brand-orange">{cta.title.split(' ').slice(-1)}</span>
						</h2>

						<p
							class="section-description max-w-2xl text-lg leading-relaxed font-medium text-[var(--color-text-muted)] md:text-xl"
						>
							{cta.subtitle}
						</p>
					{/key}
				</div>

				<div
					class="flex w-full flex-col items-center justify-center gap-8 pt-8 sm:w-auto sm:flex-row"
				>
					<a
						href={link(cta.button_link)}
						use:inView
						class="group/btn relative inline-flex w-full items-center justify-center gap-4 overflow-hidden rounded-2xl bg-brand-blue px-12 py-6 font-black text-white shadow-2xl shadow-brand-blue/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-brand-blue/50 sm:w-auto [&.in-view]:-translate-y-2 [&.in-view]:shadow-brand-blue/50"
					>
						<span
							class="absolute inset-0 translate-y-full bg-white/20 transition-transform duration-500 group-hover/btn:translate-y-0 group-[.in-view]/btn:translate-y-0"
						></span>
						<span class="relative z-10 flex items-center gap-4">
							<span class="btn-primary-text">{cta.button_text}</span>
							<ArrowRight
								class="h-6 w-6 transition-transform duration-500 group-hover/btn:translate-x-2 group-[.in-view]/btn:translate-x-2"
							/>
						</span>
						<!-- Pulse Ring -->
						<span
							class="animate-cta-pulse pointer-events-none absolute inset-0 rounded-2xl border-2 border-brand-blue/50"
						></span>
					</a>

					<a
						href={cta.secondary_button_link}
						target="_blank"
						rel="noopener noreferrer"
						class="cinematic-glass inline-flex w-full items-center justify-center gap-4 rounded-2xl border border-[var(--glass-border)] px-12 py-6 font-bold text-[var(--color-text-base)] shadow-none transition-all duration-500 hover:-translate-y-1 hover:border-brand-blue/20 hover:bg-[var(--glass-highlight)] sm:w-auto [&.in-view]:-translate-y-1 [&.in-view]:border-brand-blue/20 [&.in-view]:bg-[var(--glass-highlight)]"
					>
						<span class="btn-secondary-text">{cta.secondary_button_text}</span>
					</a>
				</div>
			</div>

			<!-- Bottom Accent Line -->
			<div
				use:inView
				class="absolute bottom-0 left-0 h-[3px] w-0 bg-brand-blue/30 shadow-[0_0_20px_rgba(0,119,255,0.3)] transition-all duration-1000 group-hover:w-full group-[.in-view]:w-full"
			></div>
		</div>
	</div>
</section>

<style>
	@keyframes cta-pulse {
		0% {
			transform: scale(1);
			opacity: 0.8;
		}
		100% {
			transform: scale(1.1);
			opacity: 0;
		}
	}
	.animate-cta-pulse {
		animation: cta-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}
</style>
