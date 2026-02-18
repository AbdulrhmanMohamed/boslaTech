<script lang="ts">
	import {
		ChevronDown,
		Globe,
		Zap,
		Shield,
		TrendingUp,
		Users,
		Award,
		Smartphone,
		Search,
		BarChart,
		ShoppingCart,
		Settings,
		Edit,
		Layers,
		ArrowRight,
		Sparkles
	} from '@lucide/svelte';
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

	// Make features reactive
	const features = $derived([
		{
			id: 0,
			icon: Zap,
			title:
				props.data?.home?.features?.f1?.title ||
				(props.data?.lang === 'ar' ? 'من الفكرة إلى الإطلاق' : 'From Idea to Launch'),
			subtitle:
				props.data?.home?.features?.f1?.subtitle ||
				(props.data?.lang === 'ar' ? 'سرعة التنفيذ' : 'Fast Implementation'),
			description:
				props.data?.home?.features?.f1?.description ||
				(props.data?.lang === 'ar'
					? 'استلم موقعك الإلكتروني خلال خمسة أيام فقط دون المساس بالجودة أو التفاصيل.'
					: 'Get your website within just five days without compromising on quality or details.'),
			benefits: props.data?.home?.features?.f1?.benefits || []
		},
		{
			id: 1,
			icon: Award,
			title:
				props.data?.home?.features?.f2?.title ||
				(props.data?.lang === 'ar' ? 'تصميم مخصص لهويتك' : 'Custom design for your identity'),
			subtitle:
				props.data?.home?.features?.f2?.subtitle ||
				(props.data?.lang === 'ar'
					? 'موقعك يُصمَّم ليعكس علامتك التجارية'
					: 'Your website is designed to reflect your brand'),
			description:
				props.data?.home?.features?.f2?.description ||
				(props.data?.lang === 'ar'
					? 'موقعك يُصمَّم ليعكس علامتك التجارية ويتماشى مع علامتك التجارية والأسلوب البصري الخاص بك.'
					: 'Your website is designed to reflect your brand and align with your visual style.'),
			benefits: props.data?.home?.features?.f2?.benefits || []
		},
		{
			id: 2,
			icon: Edit,
			title:
				props.data?.home?.features?.f3?.title ||
				(props.data?.lang === 'ar'
					? 'نساعدك في كتابة محتواك الخاص'
					: 'We help you write your own content'),
			subtitle:
				props.data?.home?.features?.f3?.subtitle ||
				(props.data?.lang === 'ar'
					? 'ليس لديك محتوى جاهز؟ لا تقلق.'
					: "Don't have ready content? Don't worry."),
			description:
				props.data?.home?.features?.f3?.description ||
				(props.data?.lang === 'ar'
					? 'زوّدنا فقط بالمعلومات الأساسية، وسيتولى متخصصون في كتابة المحتوى إعداد نصوص موقعك باحترافية.'
					: 'Just provide us with the basic information, and our content writers will professionally prepare your website texts.'),
			benefits: props.data?.home?.features?.f3?.benefits || []
		},
		{
			id: 3,
			icon: Layers,
			title:
				props.data?.home?.features?.f4?.title ||
				(props.data?.lang === 'ar'
					? 'أقسام متنوعة تناسب نشاطك'
					: 'Diverse sections that suit your business'),
			subtitle:
				props.data?.home?.features?.f4?.subtitle ||
				(props.data?.lang === 'ar'
					? 'تصميم مرن يضم كل ما تحتاجه'
					: 'Flexible design that includes everything you need'),
			description:
				props.data?.home?.features?.f4?.description ||
				(props.data?.lang === 'ar'
					? 'تصميم مرن يضم كل ما تحتاجه — من الصفحة الرئيسية إلى المدونة ونموذج التواصل.'
					: 'Flexible design that includes everything you need — from the homepage to the blog and contact form.'),
			benefits: props.data?.home?.features?.f4?.benefits || []
		},
		{
			id: 4,
			icon: ShoppingCart,
			title:
				props.data?.home?.features?.f5?.title ||
				(props.data?.lang === 'ar' ? 'عرض منتجاتك وخدماتك' : 'Showcase your products and services'),
			subtitle:
				props.data?.home?.features?.f5?.subtitle ||
				(props.data?.lang === 'ar'
					? 'أضف منتجاتك أو خدماتك بسهولة'
					: 'Add your products or services easily'),
			description:
				props.data?.home?.features?.f5?.description ||
				(props.data?.lang === 'ar'
					? 'أضف منتجاتك أو خدماتك بسهولة مع صورها ووصفها، ليتمكّن عملاؤك من استعراضها بطريقة أنيقة ومنظَّمة.'
					: 'Add your products or services easily with their images and descriptions, so your clients can browse them in an elegant and organized manner.'),
			benefits: props.data?.home?.features?.f5?.benefits || []
		},
		{
			id: 5,
			icon: Settings,
			title:
				props.data?.home?.features?.f6?.title ||
				(props.data?.lang === 'ar' ? 'لوحة تحكّم سهلة الاستخدام' : 'Easy-to-use control panel'),
			subtitle:
				props.data?.home?.features?.f6?.subtitle ||
				(props.data?.lang === 'ar'
					? 'غيّر محتواك وتابع تحديثات موقعك بنفسك'
					: 'Change your content and follow your website updates yourself'),
			description:
				props.data?.home?.features?.f6?.description ||
				(props.data?.lang === 'ar'
					? 'غيّر محتواك وتابع تحديثات موقعك بنفسك من دون الحاجة إلى مبرمج.'
					: 'Change your content and follow your website updates yourself without needing a programmer.'),
			benefits: props.data?.home?.features?.f6?.benefits || []
		},
		{
			id: 6,
			icon: BarChart,
			title:
				props.data?.home?.features?.f7?.title ||
				(props.data?.lang === 'ar' ? 'نتائج ملموسة' : 'Tangible results'),
			subtitle:
				props.data?.home?.features?.f7?.subtitle ||
				(props.data?.lang === 'ar'
					? 'تصميم مُوجَّه لتحقيق أهداف عملك بسرعة'
					: 'Design focused on achieving your business goals quickly'),
			description:
				props.data?.home?.features?.f7?.description ||
				(props.data?.lang === 'ar'
					? 'تصميم مُوجَّه لتحقيق أهداف عملك بسرعة وزيادة التفاعل مع جمهورك.'
					: 'Design focused on achieving your business goals quickly and increasing engagement with your audience.'),
			benefits: props.data?.home?.features?.f7?.benefits || []
		}
	]);

	const sectionHeader = $derived({
		badge:
			props.data?.home?.features?.badge || (props.data?.lang === 'ar' ? 'المميزات' : 'Features'),
		title:
			props.data?.home?.features?.title ||
			(props.data?.lang === 'ar' ? 'لماذا بوصلة؟' : 'Why Choose Bosla?'),
		subtitle:
			props.data?.home?.features?.subtitle ||
			(props.data?.lang === 'ar'
				? 'نحن نبني أكثر من مجرد مواقع، نحن نبني هويتك الرقمية.'
				: 'We build more than just websites, we build your digital identity.')
	});

	// Animation logic in a separate effect that only runs once or when lang changes
	$effect(() => {
		if (typeof window === 'undefined') return;

		// Track language and data to re-run effect
		const lang = props.data?.lang;
		const headerTitle = sectionHeader.title;
		const headerSubtitle = sectionHeader.subtitle;
		const featuresData = features;

		const ctx = gsap.context(() => {
			const timer = setTimeout(() => {
				const isAr = lang === 'ar';

				// Section Header Elements
				const titleEl = document.querySelector('#features .section-title') as HTMLElement;
				const descriptionEl = document.querySelector(
					'#features .section-description'
				) as HTMLElement;
				const badgeEl = document.querySelector('#features .cinematic-glass-badge') as HTMLElement;

				if (titleEl && descriptionEl) {
					// 🔥 FORCE DIRECTION EXPLICITLY
					titleEl.setAttribute('dir', isAr ? 'rtl' : 'ltr');
					descriptionEl.setAttribute('dir', isAr ? 'rtl' : 'ltr');

					// 🔥 Reset content safely
					titleEl.textContent = headerTitle;
					descriptionEl.textContent = headerSubtitle;

					// 1. Force manual text enforcement with highlights on first and last words
					const words = headerTitle.split(' ');
					if (words.length >= 3) {
						const lastWord = words.pop();
						const firstWord = words.shift();
						const middleText = words.join(' ');
						titleEl.innerHTML = `<span class="text-brand-orange">${firstWord}</span> ${middleText} <span class="text-brand-orange">${lastWord}</span>`;
					} else if (words.length === 2) {
						titleEl.innerHTML = `<span class="text-brand-orange">${words[0]}</span> <span class="text-brand-orange">${words[1]}</span>`;
					} else {
						titleEl.innerHTML = `<span class="text-brand-orange">${headerTitle}</span>`;
					}

					// 2. Clear existing
					gsap.killTweensOf([badgeEl, titleEl, descriptionEl]);
					gsap.set([badgeEl, titleEl, descriptionEl], {
						clearProps: 'all',
						opacity: 0,
						visibility: 'visible'
					});

					const tl = gsap.timeline({
						scrollTrigger: {
							trigger: '#features',
							start: 'top 85%',
							toggleActions: 'play none none none'
						}
					});

					if (isAr) {
						// Arabic Reveal Logic
						gsap.set([titleEl, descriptionEl], { opacity: 1, clipPath: 'inset(0 0 0 100%)' });

						tl.to(badgeEl, {
							y: 0,
							opacity: 1,
							duration: 0.5,
							ease: 'power2.out',
							startAt: { y: 20 }
						})
							.to(
								titleEl,
								{
									clipPath: 'inset(0 0 0 0%)',
									duration: 1.2,
									ease: 'power2.inOut'
								},
								'-=0.2'
							)
							.to(
								descriptionEl,
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
						gsap.set([titleEl, descriptionEl], { opacity: 1 });

						const titleSplit = new SplitType(titleEl, { types: 'chars,words' });
						const descSplit = new SplitType(descriptionEl, { types: 'chars' });

						tl.to(badgeEl, {
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
				}

				// Feature Cards Logic
				const cardElements = document.querySelectorAll('.feature-card');

				cardElements.forEach((card, i) => {
					const cardTitle = card.querySelector('h3');
					const cardDesc = card.querySelector('p');
					const cardSubtitle = card.querySelector('.uppercase');

					if (cardTitle && featuresData[i]) cardTitle.textContent = featuresData[i].title;
					if (cardDesc && featuresData[i]) cardDesc.textContent = featuresData[i].description;
					if (cardSubtitle && featuresData[i]) cardSubtitle.textContent = featuresData[i].subtitle;

					gsap.killTweensOf(card);
					gsap.set(card, { clearProps: 'all', opacity: 0 });

					gsap.to(card, {
						scrollTrigger: {
							trigger: card,
							start: 'top bottom-=100',
							toggleActions: 'play none none none'
						},
						y: 0,
						opacity: 1,
						duration: 0.6,
						delay: i * 0.1,
						ease: 'power2.out',
						startAt: { y: 30 }
					});
				});

				ScrollTrigger.refresh();
			}, 150);

			return () => clearTimeout(timer);
		});

		return () => ctx.revert();
	});

	// Separate effect for mouse interaction
	$effect(() => {
		if (typeof window === 'undefined') return;

		const lang = props.data?.lang;
		const cards = gsap.utils.toArray('.feature-card');
		const cleanupFns: (() => void)[] = [];

		cards.forEach((card: any) => {
			const glow = card.querySelector('.card-glow');
			if (!glow) return;

			// Clear existing
			gsap.killTweensOf(glow);
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
				if (theme.current === 'light') return;
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

			cleanupFns.push(() => {
				card.removeEventListener('mouseenter', onMouseEnter);
				card.removeEventListener('mousemove', onMouseMove);
				card.removeEventListener('mouseleave', onMouseLeave);
			});
		});

		return () => cleanupFns.forEach((fn) => fn());
	});
</script>

<section
	id="features"
	class="relative z-20 overflow-visible py-32"
	dir={props.data?.lang === 'ar' ? 'rtl' : 'ltr'}
>
	<div class="container relative z-10 mx-auto px-6">
		<!-- Header -->
		<div class="mx-auto mb-32 flex max-w-4xl flex-col items-center text-center">
			<div
				class="cinematic-glass-badge cinematic-glass mb-4 inline-flex items-center gap-3 rounded-full border border-[var(--glass-border)] px-6 py-2"
			>
				<Sparkles class="text-brand-orange h-4 w-4" />
				<span class="text-xs font-black uppercase tracking-widest text-[var(--color-text-muted)]"
					>{sectionHeader.badge}</span
				>
			</div>

			{#key props.data?.lang}
				<h2
					class="section-title mb-8 text-5xl font-black leading-[1.1] tracking-tighter text-[var(--color-text-base)] md:text-7xl"
				>
					{sectionHeader.title.split(' ').slice(0, -1).join(' ')}
					<span class="text-brand-orange">{sectionHeader.title.split(' ').slice(-1)}</span>
				</h2>

				<p
					class="section-description mx-auto max-w-2xl text-xl font-medium leading-relaxed text-[var(--color-text-muted)] md:text-2xl"
				>
					{sectionHeader.subtitle}
				</p>
			{/key}
		</div>

		<!-- Grid with 3 columns on large screens -->
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
			{#each features as feature, i}
				{@const Icon = feature.icon}
				{#key props.data?.lang}
					<div class="feature-card group relative h-full">
						<!-- The Main Obsidian Card -->
						<button
							class="cinematic-glass group/card relative flex h-full min-h-[450px] w-full flex-col items-start overflow-hidden rounded-[2.5rem] p-8 text-start transition-all duration-300 focus:outline-none active:scale-[0.98] md:min-h-[500px] md:p-10"
							aria-label={feature.title}
						>
							<!-- Dynamic Spotlight Glow - Radial gradient replaces blur -->
							<div
								class="card-glow pointer-events-none absolute h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-opacity duration-100 group-hover/card:opacity-100 group-focus/card:opacity-100 group-active/card:opacity-100"
								style="left: 0; top: 0; background: radial-gradient(circle, {currentTheme === 'dark'
									? 'var(--color-brand-blue-glow)'
									: 'transparent'} 0%, {currentTheme === 'dark'
									? 'rgba(0, 153, 255, 0.05)'
									: 'transparent'} 50%, transparent 80%); opacity: {currentTheme === 'dark'
									? 0.15
									: 0};"
							></div>

							<!-- Header Row: Icon + Number -->
							<div class="relative z-10 mb-8 flex w-full items-start justify-between">
								<!-- Icon Container -->
								<div class="relative z-10 h-20 w-20 md:h-24 md:w-24">
									<div
										class="group-hover/card:border-brand-orange/40 group-focus/card:border-brand-orange/40 group-active/card:border-brand-orange/40 relative z-10 flex h-full w-full items-center justify-center rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-highlight)] shadow-2xl transition-all duration-100 group-hover/card:rotate-3 group-hover/card:scale-110 group-focus/card:rotate-3 group-focus/card:scale-110 group-active/card:rotate-3 group-active/card:scale-110"
									>
										<Icon
											class="text-brand-blue group-hover/card:text-brand-orange group-focus/card:text-brand-orange group-active/card:text-brand-orange h-10 w-10 transition-all duration-100 group-hover/card:scale-110 group-focus/card:scale-110 group-active/card:scale-110 md:h-12 md:w-12"
										/>
									</div>

									<!-- Dynamic Glow behind icon -->
									<div
										class="bg-brand-blue/10 absolute -inset-4 rounded-full opacity-40 blur-[30px] transition-all duration-100 group-hover/card:scale-150 group-hover/card:opacity-0 group-focus/card:scale-150 group-focus/card:opacity-0 group-active/card:scale-150 group-active/card:opacity-0"
									></div>
									<div
										class="bg-brand-orange/10 absolute -inset-4 rounded-full opacity-0 blur-[30px] transition-all duration-100 group-hover/card:scale-150 group-hover/card:opacity-40 group-focus/card:scale-150 group-focus/card:opacity-40 group-active/card:scale-150 group-active/card:opacity-40"
									></div>
								</div>

								<!-- Number -->
								<div
									class="pointer-events-none select-none text-8xl font-black tracking-tighter opacity-[0.03] transition-all duration-100 group-hover/card:scale-110 group-focus/card:scale-110 group-active/card:scale-110 dark:opacity-[0.05]"
									style="color: var(--color-text-base); line-height: 1;"
								>
									0{i + 1}
								</div>
							</div>

							<!-- Content Area with text micro-interactions - Aligned Start -->
							<div class="relative z-10 flex flex-grow flex-col items-start space-y-8">
								<div class="flex flex-col items-start space-y-4">
									<div
										class="border-brand-blue/10 bg-brand-blue/5 group-hover/card:border-brand-orange/20 group-hover/card:bg-brand-orange/10 group-focus/card:border-brand-orange/20 group-focus/card:bg-brand-orange/10 group-active/card:border-brand-orange/20 group-active/card:bg-brand-orange/10 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 transition-all duration-100"
									>
										<span
											class="text-brand-blue group-hover/card:text-brand-orange group-focus/card:text-brand-orange group-active/card:text-brand-orange text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-100 md:text-xs"
										>
											{feature.subtitle}
										</span>
									</div>
									<h3
										class="group-hover/card:text-brand-orange group-focus/card:text-brand-orange group-active/card:text-brand-orange text-start text-3xl font-black leading-tight tracking-tighter text-[var(--color-text-base)] transition-colors duration-100 md:text-4xl lg:text-5xl"
									>
										{feature.title}
									</h3>
								</div>

								<p
									class="mt-4 max-w-sm text-start text-lg font-medium leading-relaxed text-[var(--color-text-dim)] transition-colors duration-100 group-hover/card:text-[var(--color-text-muted)] group-focus/card:text-[var(--color-text-muted)] group-active/card:text-[var(--color-text-muted)] md:text-xl"
								>
									{feature.description}
								</p>

								<!-- Spacer to push accent line to bottom -->
								<div class="flex-grow"></div>

								<!-- Bottom Accent Line -->
								<div
									class="bg-brand-orange/50 absolute bottom-[-10px] start-0 h-[3px] w-0 shadow-[0_0_15px_rgba(251,98,32,0.3)] transition-all duration-100 group-hover/card:w-full group-focus/card:w-full group-active/card:w-full"
								></div>
							</div>

							<!-- Border Glow Micro-interaction -->
							<div
								class="border-brand-blue/0 group-hover/card:border-brand-orange/20 group-focus/card:border-brand-orange/20 group-active/card:border-brand-orange/20 pointer-events-none absolute inset-0 rounded-[3rem] border transition-all duration-700"
							></div>
						</button>
					</div>
				{/key}
			{/each}
		</div>
	</div>
</section>
