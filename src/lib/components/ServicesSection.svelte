<script lang="ts">
	import { inView } from '$lib/actions/inView';
	import { theme } from '$lib/stores/theme.svelte';
	import {
		Globe,
		Search,
		Share,
		Code,
		LightbulbIcon,
		BarChart,
		SearchCheck,
		ClipboardList,
		Monitor,
		Paintbrush,
		ShoppingCart,
		AppWindow,
		Smartphone,
		ArrowRight,
		X,
		Sparkles
	} from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import SplitType from 'split-type';
	import { base } from '$app/paths';

	if (typeof window !== 'undefined') {
		gsap.registerPlugin(ScrollTrigger);
	}

	const props = $props<{ data: any }>();
	const data = $derived(props.data);

	const currentTheme = $derived(theme.current);

	// Icon mapping for services
	const iconMap: Record<string, any> = {
		code: Code,
		'bar-chart': BarChart,
		'shopping-cart': ShoppingCart,
		paintbrush: Paintbrush,
		monitor: Monitor,
		globe: Globe,
		search: Search,
		share: Share,
		lightbulb: LightbulbIcon,
		'search-check': SearchCheck,
		'clipboard-list': ClipboardList,
		'app-window': AppWindow,
		smartphone: Smartphone
	};

	function getServiceSlug(icon: string): string {
		if (icon === 'search') return 'seo';
		if (icon === 'share' || icon === 'lightbulb') return 'digital-marketing';
		return 'web-development';
	}

	function servicePath(icon: string): string {
		const slug = getServiceSlug(icon);
		const q = data?.lang ? `?lang=${data.lang}` : '';
		return `${base}/services/${slug}${q}`;
	}

	// Make services reactive with fallbacks matching the language
	const services = $derived(
		(
			data?.services || [
				{
					title:
						data?.lang === 'ar'
							? 'تطوير المواقع الإلكترونية المخصصة'
							: 'Custom Website Development',
					description:
						data?.lang === 'ar'
							? 'بناء مواقع إلكترونية مخصصة من الصفر، مصممة لتناسب هويتكم التجارية الفريدة وأهدافكم.'
							: 'Building bespoke websites from the ground up, tailored to your unique brand identity and business goals.',
					icon: 'code'
				},
				{
					title: data?.lang === 'ar' ? 'التصميم المحسن للتحويل' : 'Conversion-Optimized Design',
					description:
						data?.lang === 'ar'
							? 'تصميم تجارب مستخدم (UX) وواجهات (UI) بديهية وجذابة لا تبدو مذهلة فحسب، بل مبنية استراتيجيًا.'
							: 'Designing intuitive and engaging user experiences (UX) and interfaces (UI) that are strategically built to convert.',
					icon: 'bar-chart'
				},
				{
					title: data?.lang === 'ar' ? 'حلول التجارة الإلكترونية' : 'E-commerce Solutions',
					description:
						data?.lang === 'ar'
							? 'تطوير متاجر إلكترونية قوية وآمنة توفر تجارب تسوق سلسة، تدفع المبيعات وتعظم إمكانات إيراداتكم.'
							: 'Developing powerful and secure online stores that provide seamless shopping experiences and drive sales.',
					icon: 'shopping-cart'
				},
				{
					title:
						data?.lang === 'ar'
							? 'إعادة تصميم وتحديث المواقع'
							: 'Website Redesign & Revitalization',
					description:
						data?.lang === 'ar'
							? 'تحويل المواقع الإلكترونية القديمة إلى أصول رقمية حديثة وعالية الأداء تعكس الاتجاهات الحالية.'
							: 'Transforming outdated websites into modern, high-performing digital assets that reflect current trends.',
					icon: 'paintbrush'
				},
				{
					title: data?.lang === 'ar' ? 'صيانة ودعم المواقع' : 'Website Maintenance & Support',
					description:
						data?.lang === 'ar'
							? 'التأكد من أن موقعكم الإلكتروني يبقى آمنًا ومحدثًا ويعمل بشكل مثالي مع الصيانة المستمرة.'
							: 'Ensuring your website remains secure, up-to-date, and performs optimally with ongoing maintenance.',
					icon: 'monitor'
				},
				{
					title:
						data?.lang === 'ar' ? 'تحسين محركات البحث (SEO)' : 'Search Engine Optimization (SEO)',
					description:
						data?.lang === 'ar'
							? 'تحسين ظهور موقعكم في نتائج محركات البحث لجذب المزيد من الزوار المؤهلين.'
							: "Improving your website's visibility in search engine results to attract more qualified visitors.",
					icon: 'search'
				},
				{
					title:
						data?.lang === 'ar' ? 'استشارات الاستراتيجية الرقمية' : 'Digital Strategy Consulting',
					description:
						data?.lang === 'ar'
							? 'تقديم نصائح استراتيجية لمساعدتكم في التنقل في المشهد الرقمي وتحقيق أهداف عملكم.'
							: 'Providing strategic advice to help you navigate the digital landscape and achieve your business goals.',
					icon: 'lightbulb'
				},
				{
					title: data?.lang === 'ar' ? 'تطوير تطبيقات الويب' : 'Web Application Development',
					description:
						data?.lang === 'ar'
							? 'بناء تطبيقات ويب معقدة وقابلة للتوسع تلبي احتياجات عملكم المحددة.'
							: 'Building complex and scalable web applications that meet your specific business needs.',
					icon: 'app-window'
				}
			]
		).map((s: any) => ({
			...s,
			iconComponent: iconMap[s.icon] || Code
		}))
	);

	const sectionHeader = $derived({
		badge: data?.services_section?.badge || (data?.lang === 'ar' ? 'الخدمات' : 'Services'),
		title:
			data?.services_section?.title ||
			(data?.lang === 'ar' ? 'نساعدك بخبرات بوصلة' : 'We help you with Bosla expertise'),
		subtitle:
			data?.services_section?.subtitle ||
			(data?.lang === 'ar'
				? 'عزز موقعك الإلكترونى بمنظومة متكاملة من الحلول التي تدعم أعمالك من كل زاوية.'
				: 'Enhance your website with an integrated system of solutions that support your business from every angle.'),
		buttonText:
			data?.services_section?.button_text || (data?.lang === 'ar' ? 'عرض المزيد' : 'View More')
	});

	$effect(() => {
		if (typeof window === 'undefined') return;

		// Track dependencies to re-run animations and content checks when they change
		const lang = data?.lang;
		const titleText = sectionHeader.title;
		const subtitleText = sectionHeader.subtitle;
		const servicesData = services;

		const ctx = gsap.context(() => {
			const timer = setTimeout(() => {
				const isAr = lang === 'ar';
				const titleElement = document.querySelector('#services .section-title') as HTMLElement;
				const descriptionElement = document.querySelector(
					'#services .section-description'
				) as HTMLElement;
				const badgeElement = document.querySelector(
					'#services .cinematic-glass-badge'
				) as HTMLElement;

				if (!titleElement || !descriptionElement) return;

				titleElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');
				descriptionElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');

				titleElement.textContent = titleText;
				descriptionElement.textContent = subtitleText;

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
						trigger: '#services',
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

				// Service Cards Entrance Animation
				const cardContainers = document.querySelectorAll('.service-card-container');
				cardContainers.forEach((container: any, i) => {
					const cardTitle = container.querySelector('h3');
					const cardDesc = container.querySelector('p');

					if (cardTitle && servicesData[i]) cardTitle.textContent = servicesData[i].title;
					if (cardDesc && servicesData[i]) cardDesc.textContent = servicesData[i].description;

					gsap.killTweensOf(container);
					gsap.set(container, { clearProps: 'all', opacity: 0 });

					gsap.to(container, {
						scrollTrigger: {
							trigger: container,
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

					// Re-initialize hover interactions
					const card = container.querySelector('.interactive-card');
					const glow = container.querySelector('.card-glow');
					if (!card || !glow) return;

					gsap.set([card, glow], { clearProps: 'all' });

					const xTo = gsap.quickTo(card, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.3)' });
					const yTo = gsap.quickTo(card, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.3)' });
					const scaleTo = gsap.quickTo(card, 'scale', { duration: 0.6, ease: 'back.out(1.7)' });
					const rotateXTo = gsap.quickTo(card, 'rotateX', {
						duration: 0.8,
						ease: 'elastic.out(1, 0.3)'
					});
					const rotateYTo = gsap.quickTo(card, 'rotateY', {
						duration: 0.8,
						ease: 'elastic.out(1, 0.3)'
					});
					const glowXTo = gsap.quickTo(glow, 'x', { duration: 0.4, ease: 'power2.out' });
					const glowYTo = gsap.quickTo(glow, 'y', { duration: 0.4, ease: 'power2.out' });

					let rect = container.getBoundingClientRect();

					const onMouseEnter = () => {
						if (theme.current === 'light') return;
						rect = container.getBoundingClientRect();
						scaleTo(1.05);
						gsap.to(glow, { opacity: 1, duration: 0.4 });
					};

					const onMouseMove = (e: MouseEvent) => {
						const x = e.clientX - rect.left;
						const y = e.clientY - rect.top;
						const moveX = (x - rect.width / 2) * 0.2;
						const moveY = (y - rect.height / 2) * 0.2;
						const rotateX = -((y - rect.height / 2) / rect.height) * 20;
						const rotateY = ((x - rect.width / 2) / rect.width) * 20;
						xTo(moveX);
						yTo(moveY);
						rotateXTo(rotateX);
						rotateYTo(rotateY);
						glowXTo(x);
						glowYTo(y);
					};

					const onMouseLeave = () => {
						xTo(0);
						yTo(0);
						scaleTo(1);
						rotateXTo(0);
						rotateYTo(0);
						gsap.to(glow, { opacity: 0, duration: 0.6 });
					};

					container.addEventListener('mouseenter', onMouseEnter);
					container.addEventListener('mousemove', onMouseMove);
					container.addEventListener('mouseleave', onMouseLeave);

					container._cleanup = () => {
						container.removeEventListener('mouseenter', onMouseEnter);
						container.removeEventListener('mousemove', onMouseMove);
						container.removeEventListener('mouseleave', onMouseLeave);
					};
				});

				ScrollTrigger.refresh();
			}, 150);

			return () => clearTimeout(timer);
		});

		return () => {
			ctx.revert();
			const cardContainers = document.querySelectorAll('.service-card-container');
			cardContainers.forEach((container: any) => {
				if (container._cleanup) container._cleanup();
			});
		};
	});
</script>

<section
	id="services"
	class="relative z-20 overflow-visible bg-[var(--color-background)] py-32"
	dir={data?.lang === 'ar' ? 'rtl' : 'ltr'}
>
	<!-- Unified Spotlight - Radial gradients replace blur for better performance -->
	<div class="pointer-events-none absolute inset-0 z-0 opacity-40">
		<div
			class="absolute top-1/4 -left-1/4 h-[60%] w-[60%] rounded-full transition-colors duration-1000"
			style="background: radial-gradient(circle, {currentTheme === 'dark'
				? 'var(--color-brand-blue-glow)'
				: 'var(--color-brand-blue)'} 0%, {currentTheme === 'dark'
				? 'rgba(0, 153, 255, 0.08)'
				: 'rgba(0, 119, 255, 0.03)'} 40%, transparent 70%); opacity: {currentTheme === 'dark'
				? 0.1
				: 0.05};"
		></div>
		<div
			class="absolute -right-1/4 bottom-1/4 h-[60%] w-[60%] rounded-full transition-colors duration-1000"
			style="background: radial-gradient(circle, {currentTheme === 'dark'
				? 'var(--color-brand-blue-glow)'
				: 'var(--color-brand-blue)'} 0%, {currentTheme === 'dark'
				? 'rgba(0, 153, 255, 0.08)'
				: 'rgba(0, 119, 255, 0.03)'} 40%, transparent 70%); opacity: {currentTheme === 'dark'
				? 0.1
				: 0.05};"
		></div>
	</div>

	<div class="relative z-10 container mx-auto px-6">
		<div class="mx-auto mb-24 flex max-w-4xl flex-col items-center space-y-8 text-center">
			<div
				class="cinematic-glass-badge cinematic-glass mb-4 inline-flex items-center gap-3 rounded-full border border-[var(--glass-border)] px-6 py-2"
			>
				<Sparkles class="h-4 w-4 text-brand-orange" />
				<span class="text-xs font-bold tracking-widest text-brand-blue uppercase">
					{sectionHeader.badge}
				</span>
			</div>
			{#key data?.lang}
				<h2
					class="section-title text-4xl leading-[1.1] font-black tracking-tighter text-[var(--color-text-base)] md:text-5xl"
				>
					{sectionHeader.title.split(' ').slice(0, -1).join(' ')}
					<span class="text-brand-orange">{sectionHeader.title.split(' ').slice(-1)}</span>
				</h2>
				<p
					class="section-description max-w-2xl text-lg leading-relaxed font-medium text-[var(--color-text-dim)] md:text-xl"
				>
					{sectionHeader.subtitle}
				</p>
			{/key}
		</div>

		{#key data?.lang}
			<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
				{#each services as service}
					{@const Icon = service.iconComponent}
					<div class="service-card-container perspective-1000">
						<a
							href={servicePath(service.icon)}
							use:inView
							class="interactive-card cinematic-glass group relative flex h-full w-full flex-col items-center overflow-hidden rounded-[2.5rem] p-8 text-center transition-all duration-500 hover:border-brand-blue/40 md:p-10 [&.in-view]:border-brand-blue/40"
						>
							<!-- Dynamic Spotlight Glow - Radial gradient replaces blur -->
							<div
								class="card-glow pointer-events-none absolute h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
								style="left: 0; top: 0; background: radial-gradient(circle, {currentTheme === 'dark'
									? 'rgba(0, 119, 255, 0.2)'
									: 'transparent'} 0%, {currentTheme === 'dark'
									? 'rgba(0, 119, 255, 0.08)'
									: 'transparent'} 40%, transparent 70%); opacity: {currentTheme === 'dark'
									? 0.15
									: 0};"
							></div>

							<!-- Background Icon Watermark - Centered -->
							<div
								class="pointer-events-none absolute inset-0 flex items-center justify-center opacity-20 transition-colors duration-700"
								style="color: {currentTheme === 'dark'
									? 'rgba(11, 157, 217, 0.03)'
									: 'rgba(11, 157, 217, 0.05)'};"
							>
								<Icon size={180} strokeWidth={1} />
							</div>

							<div class="relative z-10 flex w-full flex-grow flex-col items-center">
								<!-- Icon Box - Premium Style - Centered -->
								<div
									class="mb-10 flex h-20 w-20 items-center justify-center rounded-2xl border border-brand-blue/20 bg-[var(--glass-highlight)] shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:border-brand-blue/40 group-[.in-view]:scale-110 group-[.in-view]:rotate-3 group-[.in-view]:border-brand-orange/40"
								>
									<Icon
										class="h-10 w-10 text-brand-blue transition-all duration-500 group-hover:text-brand-blue-glow group-[.in-view]:text-brand-orange"
									/>
								</div>

								<h3
									class="mb-6 text-center text-2xl font-black tracking-tight text-[var(--color-text-base)] transition-colors duration-500 group-hover:text-brand-blue-glow group-[.in-view]:text-brand-orange md:text-3xl"
								>
									{service.title}
								</h3>
								<p
									class="mb-10 line-clamp-3 max-w-sm text-center text-lg leading-relaxed font-medium text-[var(--color-text-muted)] transition-colors duration-500 group-hover:text-[var(--color-text-base)] group-[.in-view]:text-[var(--color-text-base)]"
								>
									{service.description}
								</p>

								<!-- Bottom Accent Line -->
								<div
									class="absolute bottom-0 left-0 h-[3px] w-0 bg-brand-blue/30 transition-all duration-1000 group-hover:w-full group-[.in-view]:w-full group-[.in-view]:bg-brand-orange/30"
								></div>
							</div>

							<!-- Bottom Action - Centered -->
							<div
								class="relative z-10 flex items-center justify-center gap-3 text-sm font-black tracking-widest text-brand-blue uppercase transition-all duration-500 group-hover:gap-5 group-[.in-view]:gap-5 group-[.in-view]:text-brand-orange"
								class:flex-row-reverse={data?.lang === 'ar'}
							>
								<span
									class="transition-colors group-hover:text-[var(--color-text-base)] group-[.in-view]:text-[var(--color-text-base)]"
									>{sectionHeader.buttonText}</span
								>
								<div
									class="flex h-10 w-10 items-center justify-center rounded-full border border-brand-blue/20 transition-all group-hover:border-brand-blue/40 group-hover:bg-brand-blue/10 group-[.in-view]:border-brand-orange/40 group-[.in-view]:bg-brand-orange/10"
								>
									<div
										class:rotate-180={data?.lang === 'ar'}
										class="transition-transform group-hover:translate-x-1 group-[.in-view]:translate-x-1"
									>
										<ArrowRight class="h-4 w-4" />
									</div>
								</div>
							</div>
						</a>
					</div>
				{/each}
			</div>
		{/key}
	</div>
</section>

<style>
	.perspective-1000 {
		perspective: 1000px;
	}

	.interactive-card {
		transform-style: preserve-3d;
		backface-visibility: hidden;
	}
</style>
