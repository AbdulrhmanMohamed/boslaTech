<script lang="ts">
	import { inView } from '$lib/actions/inView';
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import SplitType from 'split-type';
	import { Star, Quote } from '@lucide/svelte';
	import { theme } from '$lib/stores/theme.svelte';

	if (typeof window !== 'undefined') {
		gsap.registerPlugin(ScrollTrigger);
	}

	let { data } = $props();
	const currentTheme = $derived(theme.current);

	const sectionHeader = $derived({
		badge: data?.lang === 'ar' ? 'آراء العملاء' : 'Testimonials',
		title: data?.lang === 'ar' ? 'ماذا يقولون عن بوصلة' : 'What they say about Bosla',
		subtitle:
			data?.lang === 'ar'
				? 'نفخر بكوننا شركاء في نجاح عملائنا حول العالم.'
				: 'We are proud to be partners in the success of our clients around the world.'
	});

	const testimonials = $derived([
		{
			name: data?.lang === 'ar' ? 'أحمد منصور' : 'Ahmed Mansour',
			role: data?.lang === 'ar' ? 'المدير التنفيذي لشركة تكنو' : 'CEO of Techno Co',
			content:
				data?.lang === 'ar'
					? 'تجربة استثنائية! الفريق في بوصلة حول فكرتنا إلى واقع رقمي مبهر في وقت قياسي.'
					: 'Exceptional experience! The team at Bosla turned our idea into a stunning digital reality in record time.',
			rating: 5,
			image: 'https://i.pravatar.cc/150?u=ahmed'
		},
		{
			name: data?.lang === 'ar' ? 'سارة الجابر' : 'Sarah Al-Jaber',
			role: data?.lang === 'ar' ? 'مؤسسة متجر ليان' : 'Founder of Layan Store',
			content:
				data?.lang === 'ar'
					? 'أفضل قرار اتخذناه هو العمل مع بوصلة. الدقة في التصميم وسهولة التعامل لا مثيل لها.'
					: 'The best decision we made was working with Bosla. Precision in design and ease of handling are unmatched.',
			rating: 5,
			image: 'https://i.pravatar.cc/150?u=sarah'
		},
		{
			name: data?.lang === 'ar' ? 'خالد العتيبي' : 'Khaled Al-Otaibi',
			role: data?.lang === 'ar' ? 'مدير التسويق في جلوبال' : 'Marketing Director at Global',
			content:
				data?.lang === 'ar'
					? 'احترافية عالية واهتمام بأدق التفاصيل. الموقع زاد من نسبة تحويل العملاء بشكل ملحوظ.'
					: 'High professionalism and attention to the smallest details. The site significantly increased the conversion rate.',
			rating: 5,
			image: 'https://i.pravatar.cc/150?u=khaled'
		},
		{
			name: data?.lang === 'ar' ? 'ليلى صبري' : 'Layla Sabri',
			role: data?.lang === 'ar' ? 'مصممة أزياء' : 'Fashion Designer',
			content:
				data?.lang === 'ar'
					? 'لم أتخيل أن يكون موقعي بهذا الجمال. بوصلة فعلاً يفهمون الهوية البصرية.'
					: 'I never imagined my site would be this beautiful. Bosla truly understands visual identity.',
			rating: 5,
			image: 'https://i.pravatar.cc/150?u=layla'
		},
		{
			name: data?.lang === 'ar' ? 'محمد حسن' : 'Mohamed Hassan',
			role: data?.lang === 'ar' ? 'صاحب مطعم فاخر' : 'Luxury Restaurant Owner',
			content:
				data?.lang === 'ar'
					? 'خدمة سريعة ومتميزة. لوحة التحكم سهلة جداً وتمكنت من تحديث المنيو بنفسي.'
					: 'Fast and excellent service. The control panel is very easy and I was able to update the menu myself.',
			rating: 5,
			image: 'https://i.pravatar.cc/150?u=mohamed'
		}
	]);

	let marqueeRef = $state<HTMLElement | null>(null);

	$effect(() => {
		if (typeof window === 'undefined') return;

		// Section Header Animations
		const title = document.querySelector('#testimonials .section-title');
		const description = document.querySelector('#testimonials .section-description');

		if (title && description) {
			const lang = data.lang;
			const isAr = lang === 'ar';

			// 🔥 FORCE DIRECTION EXPLICITLY
			(title as HTMLElement).setAttribute('dir', isAr ? 'rtl' : 'ltr');
			(description as HTMLElement).setAttribute('dir', isAr ? 'rtl' : 'ltr');

			// 🔥 Reset content safely
			(title as HTMLElement).textContent = sectionHeader.title;
			(description as HTMLElement).textContent = sectionHeader.subtitle;

			// Apply brand highlight safely after setting textContent
			const words = sectionHeader.title.split(' ');
			if (words.length >= 2) {
				const lastTwo = words.slice(-2).join(' ');
				const rest = words.slice(0, -2).join(' ');
				(title as HTMLElement).innerHTML =
					`${rest} <span class="text-brand-orange">${lastTwo}</span>`;
			}

			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: '#testimonials',
					start: 'top 80%',
					toggleActions: 'play none none reverse'
				}
			});

			if (isAr) {
				gsap.set([title, description], {
					opacity: 1,
					clipPath: 'inset(-10% 0 -10% 100%)'
				});
				tl.to(title, {
					clipPath: 'inset(-10% -10% -10% -10%)',
					duration: 1.5,
					ease: 'none'
				}).to(
					description,
					{
						clipPath: 'inset(-10% -10% -10% -10%)',
						duration: 1.2,
						ease: 'none'
					},
					'-=0.2'
				);
			} else {
				const titleSplit = new SplitType(title as HTMLElement, { types: 'chars' });
				const descSplit = new SplitType(description as HTMLElement, { types: 'chars' });
				gsap.set([titleSplit.chars, descSplit.chars], { opacity: 0, y: 10 });
				tl.to(titleSplit.chars, {
					opacity: 1,
					y: 0,
					stagger: 0.03,
					duration: 0.4,
					ease: 'power2.out'
				}).to(
					descSplit.chars,
					{ opacity: 1, y: 0, stagger: 0.01, duration: 0.3, ease: 'power2.out' },
					'-=0.2'
				);
			}
		}

		// Infinite Marquee Animation
		if (marqueeRef) {
			const scrollWidth = marqueeRef.scrollWidth;
			const duration = 40; // Adjust speed

			gsap.to(marqueeRef, {
				x: data.lang === 'ar' ? scrollWidth / 2 : -scrollWidth / 2,
				duration,
				repeat: -1,
				ease: 'none',
				onRepeat: () => {
					gsap.set(marqueeRef, { x: 0 });
				}
			});

			// Card Interactions (Glow & Accent)
			const cards = marqueeRef.querySelectorAll('.testimonial-card');
			cards.forEach((card: any) => {
				const glow = card.querySelector('.card-glow');
				if (!glow) return;

				const glowXTo = gsap.quickTo(glow, 'x', { duration: 0.4, ease: 'power2.out' });
				const glowYTo = gsap.quickTo(glow, 'y', { duration: 0.4, ease: 'power2.out' });

				let rect: DOMRect;

				const onMouseEnter = () => {
					if (currentTheme === 'light') return;
					rect = card.getBoundingClientRect();
					gsap.to(glow, { opacity: 1, duration: 0.4 });
				};

				const onMouseMove = (e: MouseEvent) => {
					// Re-calculate rect because cards are moving in marquee
					rect = card.getBoundingClientRect();
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
			});

			// Pause on hover
			marqueeRef.addEventListener('mouseenter', () =>
				gsap.to(marqueeRef, { timeScale: 0.2, duration: 0.5 })
			);
			marqueeRef.addEventListener('mouseleave', () =>
				gsap.to(marqueeRef, { timeScale: 1, duration: 0.5 })
			);
		}
	});
</script>

<section
	id="testimonials"
	class="relative overflow-hidden bg-[var(--color-background)] py-32 transition-colors duration-1000"
	dir={data?.lang === 'ar' ? 'rtl' : 'ltr'}
>
	<!-- Unified Spotlight Background - Radial gradient replaces blur -->
	<div class="pointer-events-none absolute inset-0 z-0 opacity-30">
		<div
			class="absolute top-1/2 left-1/2 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-1000"
			style="background: radial-gradient(circle, {currentTheme === 'dark'
				? 'var(--color-brand-orange-glow)'
				: 'var(--color-brand-orange)'} 0%, {currentTheme === 'dark'
				? 'rgba(255, 107, 0, 0.04)'
				: 'rgba(255, 107, 0, 0.02)'} 40%, transparent 70%); opacity: {currentTheme === 'dark'
				? 0.05
				: 0.03};"
		></div>
	</div>

	<div class="relative z-10 container mx-auto mb-20 px-6">
		<div
			class="max-w-4xl {data?.lang === 'ar'
				? 'mr-0 items-end text-right'
				: 'ml-0 items-start text-left'} mx-auto flex flex-col items-center text-center"
		>
			<div
				class="cinematic-glass mb-8 inline-flex items-center gap-3 rounded-full border border-[var(--glass-border)] px-6 py-2 text-xs font-black tracking-widest text-brand-orange uppercase"
			>
				<span
					class="h-2 w-2 animate-pulse rounded-full bg-brand-orange shadow-[0_0_10px_rgba(255,107,0,0.5)]"
				></span>
				{sectionHeader.badge}
			</div>

			<h2
				class="section-title mb-8 text-4xl leading-[1.1] font-black tracking-tighter text-[var(--color-text-base)] md:text-6xl"
			>
				{sectionHeader.title.split(' ').slice(0, -2).join(' ')}
				<span class="text-brand-orange">{sectionHeader.title.split(' ').slice(-2).join(' ')}</span>
			</h2>

			<p
				class="section-description max-w-2xl text-lg leading-relaxed font-medium text-[var(--color-text-muted)] md:text-xl"
			>
				{sectionHeader.subtitle}
			</p>
		</div>
	</div>

	<!-- Infinite Marquee -->
	<div class="relative overflow-hidden py-10">
		<div bind:this={marqueeRef} class="flex gap-8 px-4 whitespace-nowrap">
			<!-- Double the items for seamless loop -->
			{#each [...testimonials, ...testimonials] as t}
				<div class="inline-block w-[400px] flex-shrink-0">
					<div
						use:inView
						class="testimonial-card cinematic-glass group relative overflow-hidden rounded-[2.5rem] border border-[var(--glass-border)] bg-[var(--color-surface)] p-8 transition-all duration-500 hover:border-brand-orange/30 [&.in-view]:border-brand-orange/30"
					>
						<!-- Dynamic Spotlight Glow -->
						<div
							class="card-glow pointer-events-none absolute h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-[80px] group-[.in-view]:opacity-100"
							style="left: 0; top: 0; background: {currentTheme === 'dark'
								? 'rgba(var(--color-brand-orange-rgb), 0.1)'
								: 'transparent'};"
						></div>

						<Quote
							class="absolute top-6 right-8 h-10 w-10 text-[var(--color-text-base)] opacity-5 transition-colors duration-500 group-hover:text-brand-orange/10 group-[.in-view]:text-brand-orange/10"
						/>

						<div class="relative z-10 mb-6 flex items-center gap-4">
							<div class="h-14 w-14 overflow-hidden rounded-full border-2 border-brand-orange/20">
								<img src={t.image} alt={t.name} class="h-full w-full object-cover" />
							</div>
							<div>
								<h4 class="text-lg font-black text-[var(--color-text-base)]">{t.name}</h4>
								<p class="text-sm text-[var(--color-text-muted)] opacity-40">{t.role}</p>
							</div>
						</div>

						<div class="relative z-10 mb-4 flex gap-1">
							{#each Array(t.rating) as _}
								<Star class="h-4 w-4 fill-brand-orange text-brand-orange" />
							{/each}
						</div>

						<p
							class="relative z-10 text-lg leading-relaxed whitespace-normal text-[var(--color-text-muted)] italic"
						>
							"{t.content}"
						</p>

						<!-- Bottom Accent Line -->
						<div
							class="absolute bottom-0 left-0 h-[2px] w-0 bg-brand-orange/50 shadow-[0_0_20px_rgba(255,107,0,0.3)] transition-all duration-700 group-hover:w-full group-[.in-view]:w-full"
						></div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
</style>
