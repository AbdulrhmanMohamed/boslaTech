<script lang="ts">
	import { inView } from '$lib/actions/inView';
	import { theme } from '$lib/stores/theme.svelte';
	import { ShieldCheck, Zap, Heart, Trophy, Sparkles } from '@lucide/svelte';
	import { gsap } from 'gsap';
	import SplitType from 'split-type';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

	if (typeof window !== 'undefined') {
		gsap.registerPlugin(ScrollTrigger);
	}

	const props = $props<{ data: any }>();
	const data = $derived(props.data);
	const currentTheme = $derived(theme.current);

	const content = $derived(
		data?.home?.whyChooseUs || {
			badge:
				data?.home?.whyChooseUs?.badge || (data?.lang === 'ar' ? 'لماذا بوصلة؟' : 'Why Bosla?'),
			title:
				data?.home?.whyChooseUs?.title ||
				(data?.lang === 'ar'
					? 'نحن لا نبني مواقع فقط، نحن نصنع تجارب'
					: "We don't just build websites, we craft experiences"),
			items: data?.home?.whyChooseUs?.items || [
				{
					title: data?.lang === 'ar' ? 'سرعة فائقة' : 'Ultra Fast',
					desc: data?.lang === 'ar' ? 'أداء يحطم الأرقام القياسية' : 'Record-breaking performance',
					icon: 'zap'
				},
				{
					title: data?.lang === 'ar' ? 'أمان مطلق' : 'Absolute Security',
					desc:
						data?.lang === 'ar'
							? 'حماية بياناتك هي أولويتنا'
							: 'Your data protection is our priority',
					icon: 'shield-check'
				},
				{
					title: data?.lang === 'ar' ? 'دعم مستمر' : 'Constant Support',
					desc:
						data?.lang === 'ar' ? 'نحن معك في كل خطوة' : 'We are with you every step of the way',
					icon: 'heart'
				},
				{
					title: data?.lang === 'ar' ? 'جودة عالمية' : 'Global Quality',
					desc:
						data?.lang === 'ar'
							? 'معايير دولية في كل مشروع'
							: 'International standards in every project',
					icon: 'trophy'
				}
			]
		}
	);

	const iconMap: Record<string, any> = {
		zap: Zap,
		'shield-check': ShieldCheck,
		heart: Heart,
		trophy: Trophy
	};

	const items = $derived(
		content.items.map((item: any) => ({
			...item,
			iconComponent: iconMap[item.icon] || Zap
		}))
	);

	let titleElementRef: HTMLElement | undefined = $state(undefined);
	let badgeElementRef: HTMLElement | undefined = $state(undefined);

	let itemCleanups: (() => void)[] = [];

	$effect(() => {
		if (typeof window === 'undefined') return;
		itemCleanups = [];

		const lang = data?.lang;
		const titleText = content.title;
		const itemsData = items;

		const ctx = gsap.context(() => {
			const isAr = lang === 'ar';
			const titleElement = titleElementRef;
			const badgeElement = badgeElementRef;

			if (!titleElement || !badgeElement) return;

			titleElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');

			titleElement.textContent = titleText;

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

			gsap.killTweensOf([badgeElement, titleElement]);
			gsap.set([badgeElement, titleElement], {
				clearProps: 'all',
				opacity: 0,
				visibility: 'visible'
			});

			ScrollTrigger.refresh();

			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: '#why-choose-us',
					start: 'top 85%',
					toggleActions: 'play none none none'
				}
			});

			if (isAr) {
				gsap.set(titleElement, { opacity: 1, clipPath: 'inset(0 0 0 100%)' });

				tl.to(badgeElement, {
					y: 0,
					opacity: 1,
					duration: 0.5,
					ease: 'power2.out',
					startAt: { y: 20 }
				}).to(
					titleElement,
					{
						clipPath: 'inset(0 0 0 0%)',
						duration: 1.2,
						ease: 'power2.inOut'
					},
					'-=0.2'
				);
			} else {
				gsap.set(titleElement, { opacity: 1 });

				const titleSplit = new SplitType(titleElement, { types: 'chars,words' });

				tl.to(badgeElement, {
					y: 0,
					opacity: 1,
					duration: 0.5,
					ease: 'power2.out',
					startAt: { y: 20 }
				}).from(
					titleSplit.chars,
					{
						opacity: 0,
						y: 20,
						stagger: 0.02,
						duration: 0.6,
						ease: 'power3.out'
					},
					'-=0.3'
				);
			}

			// Why Items Entrance Animation
			const itemElements = document.querySelectorAll('.why-item');

			itemElements.forEach((item: any, i) => {
				const itemTitle = item.querySelector('h3');
				const itemDesc = item.querySelector('p');

				if (itemTitle && itemsData[i]) itemTitle.textContent = itemsData[i].title;
				if (itemDesc && itemsData[i]) itemDesc.textContent = itemsData[i].desc;

				gsap.killTweensOf(item);
				gsap.set(item, { clearProps: 'all', opacity: 0 });

				gsap.to(item, {
					scrollTrigger: {
						trigger: item,
						start: 'top bottom-=50',
						toggleActions: 'play none none none'
					},
					y: 0,
					opacity: 1,
					duration: 0.6,
					delay: i * 0.1,
					ease: 'power2.out',
					startAt: { y: 30 }
				});

				const glow = item.querySelector('.card-glow');
				if (!glow) return;

				gsap.set(glow, { clearProps: 'all' });

				const glowXTo = gsap.quickTo(glow, 'x', { duration: 0.4, ease: 'power2.out' });
				const glowYTo = gsap.quickTo(glow, 'y', { duration: 0.4, ease: 'power2.out' });

				let rect = item.getBoundingClientRect();

				const onMouseEnter = () => {
					if (theme.current === 'light') return;
					rect = item.getBoundingClientRect();
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

				item.addEventListener('mouseenter', onMouseEnter);
				item.addEventListener('mousemove', onMouseMove);
				item.addEventListener('mouseleave', onMouseLeave);

				itemCleanups.push(() => {
					item.removeEventListener('mouseenter', onMouseEnter);
					item.removeEventListener('mousemove', onMouseMove);
					item.removeEventListener('mouseleave', onMouseLeave);
				});
			});

			ScrollTrigger.refresh();
		});

		return () => {
			ctx.revert();
			itemCleanups.forEach((cleanup) => cleanup());
		};
	});
</script>

<section
	class="relative overflow-hidden bg-[var(--color-background)] py-32"
	id="why-choose-us"
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
				bind:this={badgeElementRef}
			>
				<Sparkles class="h-4 w-4 text-brand-orange" />
				<span class="text-xs font-bold tracking-widest text-brand-blue uppercase">
					{content.badge}
				</span>
			</div>
			{#key data?.lang}
				<h2
					class="section-title text-4xl leading-[1.1] font-black tracking-tighter text-[var(--color-text-base)] md:text-5xl"
					bind:this={titleElementRef}
				>
					{content.title.split(' ').slice(0, -1).join(' ')}
					<span class="text-brand-orange">{content.title.split(' ').slice(-1)}</span>
				</h2>
			{/key}
		</div>

		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
			{#each items as item}
				{@const Icon = item.iconComponent}
				<div
					use:inView
					class="why-item cinematic-glass interactive-card group relative flex flex-col items-center overflow-hidden rounded-[2.5rem] border border-[var(--glass-border)] p-10 text-center transition-all duration-700 hover:border-brand-blue/30 [&.in-view]:border-brand-blue/30"
				>
					<!-- Dynamic Spotlight Glow - Radial gradient replaces blur -->
					<div
						use:inView
						class="card-glow pointer-events-none absolute h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-[.in-view]:opacity-100"
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

					<div class="relative z-10 flex h-full flex-col items-center">
						<div
							use:inView
							class="mb-10 inline-flex h-20 w-20 items-center justify-center rounded-[1.5rem] border border-[var(--glass-border)] bg-[var(--glass-highlight)] shadow-lg transition-all duration-700 group-hover:scale-110 group-hover:rotate-3 group-hover:border-brand-blue/30 group-hover:bg-brand-blue/10 group-[.in-view]:scale-110 group-[.in-view]:rotate-3 group-[.in-view]:border-brand-blue/30 group-[.in-view]:bg-brand-blue/10"
						>
							<Icon
								class="h-10 w-10 text-[var(--color-text-base)] transition-colors duration-500 group-hover:text-brand-blue group-[.in-view]:text-brand-blue"
							/>
						</div>

						<h3
							class="mb-4 text-center text-2xl font-black tracking-tight text-[var(--color-text-base)] transition-colors duration-500 group-hover:text-brand-blue group-[.in-view]:text-brand-blue"
						>
							{item.title}
						</h3>

						<p
							class="max-w-sm text-center text-base leading-relaxed font-medium text-[var(--color-text-muted)] transition-colors duration-500 group-hover:text-[var(--color-text-base)] group-[.in-view]:text-[var(--color-text-base)]"
						>
							{item.desc}
						</p>

						<!-- Bottom Accent Line -->
						<div
							use:inView
							class="absolute bottom-0 left-0 h-[2px] w-0 bg-brand-blue/30 transition-all duration-700 group-hover:w-full group-[.in-view]:w-full"
						></div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
