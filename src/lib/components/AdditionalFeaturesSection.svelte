<script lang="ts">
	import { TrendingUp, Smartphone, Search, Palette, Code, Headphones } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { theme } from '$lib/stores/theme.svelte';

	let { data } = $props();
	let openAccordion = $state(-1); // Start with no accordion open
	const currentTheme = $derived(theme.current);

	onMount(() => {
		const cards = document.querySelectorAll('.interactive-card');
		cards.forEach((card) => {
			const glow = card.querySelector('.card-glow') as HTMLElement;
			if (!glow) return;

			const xTo = gsap.quickTo(card, 'x', { duration: 0.6, ease: 'power2.out' });
			const yTo = gsap.quickTo(card, 'y', { duration: 0.6, ease: 'power2.out' });
			const rotateX = gsap.quickTo(card, 'rotateX', { duration: 0.6, ease: 'power2.out' });
			const rotateY = gsap.quickTo(card, 'rotateY', { duration: 0.6, ease: 'power2.out' });
			const glowXTo = gsap.quickTo(glow, 'x', { duration: 0.4, ease: 'power2.out' });
			const glowYTo = gsap.quickTo(glow, 'y', { duration: 0.4, ease: 'power2.out' });

			let rect = card.getBoundingClientRect();

			card.addEventListener('mouseenter', () => {
				rect = card.getBoundingClientRect();
				gsap.to(glow, { opacity: 1, duration: 0.4 });
			});

			card.addEventListener('mousemove', (e: any) => {
				const centerX = rect.left + rect.width / 2;
				const centerY = rect.top + rect.height / 2;
				const moveX = (e.clientX - centerX) * 0.1;
				const moveY = (e.clientY - centerY) * 0.1;

				xTo(moveX);
				yTo(moveY);
				rotateX(-(e.clientY - centerY) * 0.05);
				rotateY((e.clientX - centerX) * 0.05);

				const x = e.clientX - rect.left;
				const y = e.clientY - rect.top;
				glowXTo(x);
				glowYTo(y);
			});

			card.addEventListener('mouseleave', () => {
				xTo(0);
				yTo(0);
				rotateX(0);
				rotateY(0);
				gsap.to(glow, { opacity: 0, duration: 0.6 });
			});
		});
	});

	function toggleAccordion(index: number, event?: Event) {
		// Prevent the default behavior of the anchor tag if it's wrapped
		event?.preventDefault();
		openAccordion = openAccordion === index ? -1 : index;
	}

	// Make content reactive using $derived to support language switching
	const additionalFeatures = $derived({
		title:
			data?.home?.why_choose_us?.additional?.title ||
			(data?.lang === 'ar'
				? 'ميزات إضافية تجعلنا الخيار الأفضل'
				: 'Additional features that make us the best choice'),
		subtitle:
			data?.home?.why_choose_us?.additional?.subtitle ||
			(data?.lang === 'ar'
				? 'نقدم لك حلول شاملة لضمان نجاح موقعك الإلكتروني'
				: "We provide comprehensive solutions to ensure your website's success"),

		features: [
			{
				icon: TrendingUp,
				title:
					data?.home?.why_choose_us?.features?.f1?.title ||
					(data?.lang === 'ar' ? 'تحسين معدل التحويل' : 'Conversion Rate Optimization'),
				description:
					data?.home?.why_choose_us?.features?.f1?.description ||
					(data?.lang === 'ar'
						? 'نصمم مواقع تحول الزوار إلى عملاء حقيقيين'
						: 'We design websites that convert visitors into actual customers')
			},
			{
				icon: Smartphone,
				title:
					data?.home?.why_choose_us?.features?.f2?.title ||
					(data?.lang === 'ar' ? 'متجاوب مع جميع الأجهزة' : 'Responsive on All Devices'),
				description:
					data?.home?.why_choose_us?.features?.f2?.description ||
					(data?.lang === 'ar'
						? 'موقعك سيعمل بشكل مثالي على الهاتف والتابلت والكمبيوتر'
						: 'Your website will work perfectly on phone, tablet, and computer')
			},
			{
				icon: Search,
				title:
					data?.home?.why_choose_us?.features?.f3?.title ||
					(data?.lang === 'ar' ? 'محسن لمحركات البحث' : 'Search Engine Optimized'),
				description:
					data?.home?.why_choose_us?.features?.f3?.description ||
					(data?.lang === 'ar'
						? 'موقعك سيظهر في النتائج الأولى لجوجل'
						: 'Your website will appear in the first Google results')
			},
			{
				icon: Palette,
				title:
					data?.home?.why_choose_us?.features?.f4?.title ||
					(data?.lang === 'ar' ? 'تصميم احترافي' : 'Professional Design'),
				description:
					data?.home?.why_choose_us?.features?.f4?.description ||
					(data?.lang === 'ar'
						? 'تصاميم عصرية وجذابة تعكس هوية علامتك التجارية'
						: 'Modern and attractive designs that reflect your brand identity')
			},
			{
				icon: Code,
				title:
					data?.home?.why_choose_us?.features?.f5?.title ||
					(data?.lang === 'ar' ? 'كود نظيف ومحسن' : 'Clean and Optimized Code'),
				description:
					data?.home?.why_choose_us?.features?.f5?.description ||
					(data?.lang === 'ar'
						? 'نكتب كود عالي الجودة وسهل الصيانة'
						: "We write high-quality code that's easy to maintain")
			},
			{
				icon: Headphones,
				title:
					data?.home?.why_choose_us?.features?.f6?.title ||
					(data?.lang === 'ar' ? 'خدمة عملاء متميزة' : 'Excellent Customer Service'),
				description:
					data?.home?.why_choose_us?.features?.f6?.description ||
					(data?.lang === 'ar'
						? 'فريق دعم متاح 24/7 للرد على استفساراتك'
						: 'Support team available 24/7 to answer your inquiries')
			}
		]
	});
</script>

<!-- Additional Features Section -->
<section
	class="relative overflow-hidden bg-[var(--color-background)] py-32 transition-colors duration-1000"
	dir={data?.lang === 'ar' ? 'rtl' : 'ltr'}
>
	<!-- Unified Spotlight - Radial gradient replaces blur -->
	<div class="pointer-events-none absolute inset-0 z-0 opacity-30">
		<div
			class="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-1000"
			style="background: radial-gradient(circle, {currentTheme === 'dark'
				? 'var(--color-brand-blue-glow)'
				: 'var(--color-brand-blue)'} 0%, {currentTheme === 'dark'
				? 'rgba(0, 153, 255, 0.04)'
				: 'rgba(0, 119, 255, 0.01)'} 40%, transparent 70%); opacity: {currentTheme === 'dark'
				? 0.05
				: 0.02};"
		></div>
	</div>

	<div class="container relative z-10 mx-auto px-6">
		<!-- Header -->
		<div class="mx-auto mb-20 flex max-w-4xl flex-col items-center space-y-8 text-center">
			<div
				class="cinematic-glass text-brand-blue inline-flex items-center gap-3 rounded-full border border-[var(--glass-border)] px-6 py-2 text-xs font-black uppercase tracking-widest"
			>
				<span
					class="bg-brand-blue h-2 w-2 rounded-full"
					style="box-shadow: {currentTheme === 'dark'
						? '0 0 10px rgba(0,119,255,0.5)'
						: '0 0 8px rgba(0,119,255,0.3)'};"
				></span>
				<span>{data?.lang === 'ar' ? 'المميزات الإضافية' : 'Additional Features'}</span>
			</div>

			<h2
				class="text-4xl font-black leading-[1.1] tracking-tighter text-[var(--color-text-base)] md:text-6xl"
			>
				{additionalFeatures.title.split(' ').slice(0, -1).join(' ')}
				<span class="text-brand-blue">{additionalFeatures.title.split(' ').slice(-1)}</span>
			</h2>

			<p
				class="max-w-2xl text-lg font-medium leading-relaxed text-[var(--color-text-muted)] md:text-xl"
			>
				{additionalFeatures.subtitle}
			</p>
		</div>

		<!-- Features Grid -->
		<div class="grid max-w-full gap-6 md:grid-cols-2 lg:grid-cols-4">
			{#each additionalFeatures.features as feature, index}
				{@const Icon = feature.icon}
				<button
					class="interactive-card cinematic-glass group relative overflow-hidden rounded-[2rem] p-6 transition-all duration-500 {openAccordion ===
					index
						? 'border-brand-blue/40 ring-brand-blue/20 ring-1'
						: 'border-[var(--glass-border)]'}"
					class:text-right={data?.lang === 'ar'}
					class:text-left={data?.lang !== 'ar'}
					onclick={(event) => toggleAccordion(index, event)}
				>
					<!-- Dynamic Spotlight Glow - Radial gradient replaces blur -->
					<div
						class="card-glow pointer-events-none absolute h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
						style="left: 0; top: 0; background: radial-gradient(circle, {currentTheme === 'dark'
							? 'rgba(11, 157, 217, 0.15)'
							: 'rgba(11, 157, 217, 0.08)'} 0%, {currentTheme === 'dark'
							? 'rgba(11, 157, 217, 0.05)'
							: 'rgba(11, 157, 217, 0.03)'} 50%, transparent 80%);"
					></div>

					<div
						class="relative z-10 flex w-full items-center gap-6"
						class:flex-row-reverse={data?.lang === 'ar'}
					>
						<!-- Icon Container -->
						<div
							class="group-hover:border-brand-blue/20 group-hover:bg-brand-blue/10 relative z-10 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-highlight)] transition-all duration-500 group-hover:scale-110"
						>
							<Icon
								class="group-hover:text-brand-blue h-8 w-8 text-[var(--color-text-muted)] transition-colors duration-500"
							/>
						</div>

						<div class="flex-1">
							<h3
								class="group-hover:text-brand-blue text-xl font-black text-[var(--color-text-base)] transition-colors duration-500"
							>
								{feature.title}
							</h3>
						</div>

						<!-- Bottom Accent Line -->
						<div
							class="bg-brand-blue/30 absolute bottom-0 left-0 h-[3px] w-0 transition-all duration-1000 group-hover:w-full"
							style="box-shadow: {currentTheme === 'dark'
								? '0 0 20px rgba(0,119,255,0.5)'
								: '0 0 15px rgba(0,119,255,0.3)'};"
						></div>

						<div
							class="cinematic-glass flex h-10 w-10 items-center justify-center rounded-full border border-[var(--glass-border)] text-[var(--color-text-dim)] transition-all duration-500 {openAccordion ===
							index
								? 'border-brand-blue/30 text-brand-blue rotate-180'
								: 'group-hover:border-brand-blue/20 group-hover:text-[var(--color-text-base)]'}"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="3"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="m6 9 6 6 6-6" />
							</svg>
						</div>
					</div>

					{#if openAccordion === index}
						<div
							class="animate-in fade-in slide-in-from-top-4 relative z-10 mt-8 border-t border-[var(--glass-border)] pt-8 duration-500"
						>
							<p
								class="text-base font-medium leading-relaxed text-[var(--color-text-muted)] md:text-lg"
							>
								{feature.description}
							</p>
						</div>
					{/if}
				</button>
			{/each}
		</div>
	</div>
</section>
