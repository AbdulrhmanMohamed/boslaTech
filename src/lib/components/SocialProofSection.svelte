<script lang="ts">
	import { inView } from '$lib/actions/inView';
	import { TrendingUp, Users, Award, Star, Sparkles } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import SplitType from 'split-type';
	import { theme } from '$lib/stores/theme.svelte';

	if (typeof window !== 'undefined') {
		gsap.registerPlugin(ScrollTrigger);
	}

	const props = $props<{ data: any }>();
	const data = $derived(props.data);
	const currentTheme = $derived(theme.current);

	const iconMap: Record<string, any> = {
		users: Users,
		'trending-up': TrendingUp,
		award: Award,
		star: Star
	};

	const content = $derived(
		data?.home?.socialProof || {
			badge: data?.lang === 'ar' ? 'خدماتنا' : 'Our Coverage',
			title:
				data?.lang === 'ar'
					? 'ماذا نقدم للشركات السعودية'
					: 'What We Offer Saudi Businesses',
			description:
				data?.lang === 'ar'
					? 'نبني حلولاً رقمية متكاملة للشركات في جميع أنحاء المملكة'
					: 'We build complete digital solutions for businesses across the Kingdom',
			stats: [
				{
					icon: 'users',
					value: 17,
					suffix: '',
					label: data?.lang === 'ar' ? 'خدمة رقمية' : 'Digital Services',
					description:
						data?.lang === 'ar'
							? 'تشمل تطوير المواقع والسيو والتسويق'
							: 'Across web development, SEO, and marketing'
				},
				{
					icon: 'trending-up',
					value: 6,
					suffix: '',
					label: data?.lang === 'ar' ? 'مدن سعودية' : 'Saudi Cities',
					description: data?.lang === 'ar' ? 'نخدمها بخدمات محلية مخصصة' : 'We serve with dedicated local services'
				},
				{
					icon: 'award',
					value: 3,
					suffix: '',
					label: data?.lang === 'ar' ? 'منصات متاجر' : 'E-commerce Platforms',
					description:
						data?.lang === 'ar' ? 'شوبيفاي، سلة، زد — خبرة معتمدة' : 'Shopify, Salla, Zid — certified expertise'
				},
				{
					icon: 'star',
					value: 2016,
					suffix: '',
					label: data?.lang === 'ar' ? 'سجل تجاري' : 'Est. 2016',
					description:
						data?.lang === 'ar' ? 'مؤسسة حافة النجوم — سجل رقم 7050568158' : 'Hafat Alnjom — CR 7050568158'
				}
			]
		}
	);

	const stats = $derived(
		content.stats.map((stat: any) => ({
			...stat,
			iconComponent: iconMap[stat.icon] || Users
		}))
	);

	$effect(() => {
		if (typeof window === 'undefined') return;

		// Track language and data to re-run animations when they change
		const lang = data?.lang;
		const titleText = content.title;
		const descriptionText = content.description;
		const statsData = stats;

		const ctx = gsap.context(() => {
			const timer = setTimeout(() => {
				const isAr = lang === 'ar';
				const titleElement = document.querySelector('#social-proof .section-title') as HTMLElement;
				const descriptionElement = document.querySelector(
					'#social-proof .section-description'
				) as HTMLElement;
				const badgeElement = document.querySelector(
					'#social-proof .cinematic-glass-badge'
				) as HTMLElement;

				if (!titleElement || !descriptionElement) return;

				titleElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');
				descriptionElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');

				titleElement.textContent = titleText;
				descriptionElement.textContent = descriptionText;

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

				gsap.killTweensOf([badgeElement, titleElement, descriptionElement]);
				gsap.set([badgeElement, titleElement, descriptionElement], {
					clearProps: 'all',
					opacity: 0,
					visibility: 'visible'
				});

				const tl = gsap.timeline({
					scrollTrigger: {
						trigger: '#social-proof',
						start: 'top 85%',
						toggleActions: 'play none none none'
					}
				});

				if (isAr) {
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

				// Stat Cards Entrance and Counter Animation
				const statCards = document.querySelectorAll('.stat-card');
				statCards.forEach((card: any, i) => {
					const cardData = statsData[i];
					if (!cardData) return;

					const labelElement = card.querySelector('.stat-label');
					const descElement = card.querySelector('.stat-description');

					if (labelElement) {
						labelElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');
						labelElement.textContent = cardData.label;
					}
					if (descElement) {
						descElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');
						descElement.textContent = cardData.description;
					}

					const targetValue = parseFloat(card.getAttribute('data-value') || '0');
					const valueDisplay = card.querySelector('.stat-value') as HTMLElement;
					const graphPath = card.querySelector('.stat-graph-path') as SVGPathElement;

					if (valueDisplay) valueDisplay.textContent = '0';

					gsap.killTweensOf(card);
					gsap.set(card, { clearProps: 'all', opacity: 0 });

					const cardTl = gsap.timeline({
						scrollTrigger: {
							trigger: card,
							start: 'top bottom-=50',
							toggleActions: 'play none none none'
						}
					});

					cardTl.to(card, {
						y: 0,
						opacity: 1,
						duration: 0.6,
						delay: i * 0.1,
						ease: 'power2.out',
						startAt: { y: 30 }
					});

					if (valueDisplay) {
						const obj = { val: 0 };
						cardTl.to(
							obj,
							{
								val: targetValue,
								duration: 2.5,
								ease: 'power4.out',
								onUpdate: () => {
									valueDisplay.textContent =
										targetValue % 1 === 0 ? Math.round(obj.val).toString() : obj.val.toFixed(1);
								}
							},
							'-=0.4'
						);
					}

					if (graphPath) {
						const length = graphPath.getTotalLength();
						gsap.set(graphPath, { strokeDasharray: length, strokeDashoffset: length });
						cardTl.to(
							graphPath,
							{
								strokeDashoffset: 0,
								duration: 2,
								ease: 'power2.inOut'
							},
							'-=2'
						);
					}

					const glow = card.querySelector('.card-glow');
					if (!glow) return;

					gsap.set(glow, { clearProps: 'all' });

					const glowXTo = gsap.quickTo(glow, 'x', { duration: 0.4, ease: 'power2.out' });
					const glowYTo = gsap.quickTo(glow, 'y', { duration: 0.4, ease: 'power2.out' });

					let rect = card.getBoundingClientRect();

					const onMouseEnter = () => {
						if (theme.current === 'light') return;
						rect = card.getBoundingClientRect();
						gsap.to(glow, { opacity: 1, duration: 0.4 });
					};

					const onMouseMove = (e: MouseEvent) => {
						const x = e.clientX - rect.left;
						const y = e.clientY - rect.top;
						glowXTo(x);
						glowYTo(y);
					};

					const onMouseLeave = () => {
						gsap.to(glow, { opacity: 0, duration: 0.6 });
					};

					card.addEventListener('mouseenter', onMouseEnter);
					card.addEventListener('mousemove', onMouseMove);
					card.addEventListener('mouseleave', onMouseLeave);

					card._cleanup = () => {
						card.removeEventListener('mouseenter', onMouseEnter);
						card.removeEventListener('mousemove', onMouseMove);
						card.removeEventListener('mouseleave', onMouseLeave);
					};
				});

				ScrollTrigger.refresh();
			}, 150);

			return () => clearTimeout(timer);
		});

		return () => {
			ctx.revert();
			const statCards = document.querySelectorAll('.stat-card');
			statCards.forEach((card: any) => {
				if (card._cleanup) card._cleanup();
			});
		};
	});
</script>

<section
	id="social-proof"
	class="relative overflow-hidden bg-[var(--color-background)] py-32 transition-colors duration-1000"
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
		<div class="mx-auto mb-24 flex max-w-4xl flex-col items-center space-y-8 text-center">
			<div
				class="cinematic-glass-badge cinematic-glass mb-4 inline-flex items-center gap-3 rounded-full border border-[var(--glass-border)] px-6 py-2"
			>
				<Sparkles class="h-4 w-4 text-brand-orange" />
				<span class="text-xs font-bold tracking-widest text-brand-blue uppercase">
					{content.badge}
				</span>
			</div>
			{#key data?.lang}
				<h2
					class="section-title text-4xl leading-[1.1] font-black tracking-tighter text-[var(--color-text-base)] md:text-5xl"
				>
					{content.title.split(' ').slice(0, -1).join(' ')}
					<span class="text-brand-orange">{content.title.split(' ').slice(-1)}</span>
				</h2>
				<p class="section-description mx-auto max-w-2xl text-lg text-[var(--color-text-muted)]">
					{content.description}
				</p>
			{/key}
		</div>

		<div class="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
			{#each stats as stat, i}
				{@const Icon = stat.iconComponent}
				<div
					use:inView
					class="stat-card cinematic-glass interactive-card group relative overflow-hidden rounded-[3rem] border border-[var(--glass-border)] p-12 text-center transition-colors duration-700 hover:border-brand-blue/30 [&.in-view]:border-brand-blue/30"
					data-value={stat.value}
				>
					<!-- Dynamic Spotlight Glow - Radial gradient replaces blur -->
					<div
						class="card-glow pointer-events-none absolute h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
						style="left: 0; top: 0; background: radial-gradient(circle, {currentTheme === 'dark'
							? 'rgba(var(--color-brand-blue-rgb), 0.15)'
							: 'transparent'} 0%, {currentTheme === 'dark'
							? 'rgba(0, 119, 255, 0.05)'
							: 'transparent'} 50%, transparent 80%); opacity: {currentTheme === 'dark' ? 1 : 0};"
					></div>

					<!-- Inner Shadow/Depth Effect -->
					<div
						class="pointer-events-none absolute inset-0"
						style="box-shadow: {currentTheme === 'dark'
							? 'inset 0 0 40px rgba(255,255,255,0.02)'
							: 'inset 0 0 40px rgba(0,0,0,0.01)'};"
					></div>

					<!-- Dynamic Background Graph -->
					<div
						use:inView
						class="pointer-events-none absolute inset-0 z-0 opacity-10 transition-opacity duration-700 group-hover:opacity-20 group-[.in-view]:opacity-20"
					>
						<svg class="h-full w-full" viewBox="0 0 200 100" preserveAspectRatio="none">
							<path
								class="stat-graph-path"
								d="M0,80 Q25,70 50,85 T100,60 T150,75 T200,40"
								fill="none"
								stroke="rgba(var(--color-brand-blue-rgb), 0.5)"
								stroke-width="2"
							/>
						</svg>
					</div>

					<!-- Background Icon Watermark -->
					<div
						use:inView
						class="pointer-events-none absolute -top-10 -right-10 rotate-12 text-brand-blue/[0.02] transition-all duration-1000 group-hover:text-brand-blue/[0.05] group-[.in-view]:text-brand-blue/[0.05]"
					>
						<Icon size={240} strokeWidth={1} />
					</div>

					<!-- Scanning Light Effect -->
					<div
						use:inView
						class="group-hover:animate-shimmer group-[.in-view]:animate-shimmer pointer-events-none absolute inset-0 -translate-x-full bg-brand-blue/5"
					></div>

					<!-- Icon Box - Premium Style -->
					<div
						use:inView
						class="relative z-10 mx-auto mb-10 flex h-24 w-24 items-center justify-center rounded-3xl border border-brand-blue/10 bg-[var(--glass-highlight)] shadow-2xl transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 group-hover:border-brand-blue/40 group-[.in-view]:scale-110 group-[.in-view]:rotate-6 group-[.in-view]:border-brand-blue/40"
					>
						<Icon
							class="h-12 w-12 text-brand-blue transition-all duration-700 group-hover:text-brand-blue-glow group-[.in-view]:text-brand-blue-glow"
						/>
						<!-- Internal Glow -->
						<div
							use:inView
							class="absolute inset-0 bg-brand-blue/20 opacity-0 blur-xl transition-opacity duration-700 group-hover:opacity-100 group-[.in-view]:opacity-100"
						></div>
					</div>

					<div
						use:inView
						class="relative z-10 mb-4 text-5xl font-black tracking-tighter text-[var(--color-text-base)] transition-colors duration-700 group-hover:text-brand-blue group-[.in-view]:text-brand-blue md:text-6xl"
					>
						<span class="stat-value">0</span><span class="text-brand-orange">{stat.suffix}</span>
					</div>

					<div
						use:inView
						class="stat-label relative z-10 mb-3 text-[10px] font-black tracking-[0.2em] text-[var(--color-text-muted)] uppercase transition-colors duration-700 group-hover:text-[var(--color-text-base)] group-[.in-view]:text-[var(--color-text-base)]"
					>
						{stat.label}
					</div>
					<div
						use:inView
						class="stat-description relative z-10 text-sm leading-relaxed font-medium text-[var(--color-text-muted)] opacity-60 transition-colors duration-700 group-hover:text-[var(--color-text-base)] group-[.in-view]:text-[var(--color-text-base)]"
					>
						{stat.description}
					</div>

					<!-- Bottom Accent Line -->
					<div
						use:inView
						class="absolute bottom-0 left-0 h-[2px] w-0 bg-brand-blue/30 transition-all duration-700 group-hover:w-full group-[.in-view]:w-full"
					></div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
</style>
