<script lang="ts">
	import { Check, Star, Zap, Crown, ArrowRight, Clock, Shield, X } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { theme } from '$lib/stores/theme.svelte';
	import { base } from '$app/paths';

	let { data } = $props();
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

	const packages = [
		{
			id: 'starter',
			name: 'الباقة الأساسية',
			subtitle: 'مثالية للشركات الناشئة',
			price: '2,500',
			originalPrice: '3,500',
			duration: 'ريال سعودي',
			popular: false,
			badge: '',
			description: 'موقع إلكتروني احترافي يعكس هويتك التجارية ويجذب عملاءك الأوائل',
			features: [
				'تصميم مخصص وفريد',
				'حتى 5 صفحات رئيسية',
				'تصميم متجاوب لجميع الأجهزة',
				'تحسين محركات البحث الأساسي',
				'نموذج تواصل متقدم',
				'ربط وسائل التواصل الاجتماعي',
				'شهادة SSL مجانية',
				'استضافة مجانية لسنة كاملة',
				'دعم فني لمدة 3 أشهر'
			],
			notIncluded: ['متجر إلكتروني', 'تحليلات متقدمة', 'تكامل أنظمة خارجية'],
			deliveryTime: '7-10 أيام',
			cta: 'ابدأ مشروعك',
			ctaLink: `${base}/contact?package=starter`
		},
		{
			id: 'business',
			name: 'الباقة التجارية',
			subtitle: 'الأكثر طلباً للشركات المتنامية',
			price: '4,500',
			originalPrice: '6,000',
			duration: 'ريال سعودي',
			popular: true,
			badge: 'الأكثر طلباً',
			description: 'موقع إلكتروني متكامل مع أدوات تسويقية متقدمة لنمو أعمالك بسرعة',
			features: [
				'كل مميزات الباقة الأساسية',
				'حتى 10 صفحات رئيسية',
				'متجر إلكتروني (حتى 50 منتج)',
				'نظام إدارة المحتوى',
				'تحليلات Google Analytics',
				'تحسين متقدم لمحركات البحث',
				'تكامل مع وسائل الدفع',
				'نظام إدارة العملاء الأساسي',
				'تصميم 3 بانرات إعلانية',
				'دعم فني لمدة 6 أشهر'
			],
			notIncluded: ['تطبيق جوال', 'تكامل أنظمة ERP', 'تسويق رقمي'],
			deliveryTime: '10-14 يوم',
			cta: 'اختر الباقة التجارية',
			ctaLink: `${base}/contact?package=business`
		},
		{
			id: 'enterprise',
			name: 'الباقة المتقدمة',
			subtitle: 'للشركات الكبيرة والمؤسسات',
			price: '8,500',
			originalPrice: '12,000',
			duration: 'ريال سعودي',
			popular: false,
			badge: 'حل متكامل',
			description: 'منصة رقمية شاملة مع تكامل كامل لأنظمة الشركة وأدوات تسويقية متطورة',
			features: [
				'كل مميزات الباقة التجارية',
				'صفحات غير محدودة',
				'متجر إلكتروني متقدم (منتجات غير محدودة)',
				'تطبيق جوال أساسي',
				'تكامل مع أنظمة ERP/CRM',
				'لوحة تحكم متقدمة',
				'تحليلات وتقارير مفصلة',
				'نظام إدارة المخزون',
				'تسويق عبر البريد الإلكتروني',
				'دعم فني لمدة سنة كاملة',
				'تدريب فريق العمل'
			],
			notIncluded: [],
			deliveryTime: '21-30 يوم',
			cta: 'احصل على عرض مخصص',
			ctaLink: `${base}/contact?package=enterprise`
		}
	];

	let selectedPackage = $state('business');
</script>

<section
	id="pricing"
	class="relative overflow-hidden bg-[var(--color-background)] py-32 transition-colors duration-1000"
	dir={data?.lang === 'ar' ? 'rtl' : 'ltr'}
>
	<!-- Unified Spotlight - Radial gradient replaces blur for better performance -->
	<div class="pointer-events-none absolute inset-0 z-0 opacity-20">
		<div
			class="absolute left-1/2 top-1/2 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-1000"
			style="background: radial-gradient(circle, {currentTheme === 'dark'
				? 'var(--color-brand-blue-glow)'
				: 'var(--color-brand-blue)'} 0%, {currentTheme === 'dark'
				? 'rgba(0, 153, 255, 0.08)'
				: 'rgba(0, 119, 255, 0.03)'} 40%, transparent 70%); opacity: {currentTheme === 'dark'
				? 0.1
				: 0.05};"
		></div>
	</div>

	<div class="container relative z-10 mx-auto px-6">
		<!-- Section Header -->
		<div
			class="{data?.lang === 'ar'
				? 'items-end text-right'
				: 'items-start text-left'} mb-24 flex max-w-3xl flex-col space-y-8"
		>
			<div
				class="cinematic-glass text-brand-blue inline-flex items-center gap-3 rounded-full border border-[var(--glass-border)] px-6 py-2 text-xs font-black uppercase tracking-widest"
			>
				<Crown class="h-4 w-4" />
				<span>{data?.lang === 'ar' ? 'باقات حصرية' : 'Exclusive Packages'}</span>
			</div>

			<h2
				class="text-4xl font-black leading-tight tracking-tight text-[var(--color-text-base)] md:text-5xl"
			>
				{data?.lang === 'ar' ? 'اختر الباقة المناسبة' : 'Choose the Right Package'}
				<br />
				<span class="text-brand-blue"
					>{data?.lang === 'ar' ? 'لنمو أعمالك' : 'for Your Business Growth'}</span
				>
			</h2>

			<p class="text-lg font-medium leading-relaxed text-[var(--color-text-muted)] md:text-xl">
				{data?.lang === 'ar'
					? 'باقات مصممة خصيصاً لتلبية احتياجات شركتك وتحقيق أهدافك التجارية بأفضل الأسعار'
					: 'Packages specially designed to meet your company needs and achieve your business goals at the best prices'}
			</p>
		</div>

		<!-- Pricing Cards -->
		<div class="mx-auto grid max-w-7xl gap-8 lg:grid-cols-3">
			{#each packages as pkg}
				<div
					class="interactive-card cinematic-glass group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-[var(--glass-border)] bg-[var(--color-surface)] {pkg.popular
						? 'border-brand-blue/40 ring-brand-blue/20 ring-1'
						: ''}"
				>
					<!-- Dynamic Spotlight Glow - Radial gradient replaces blur -->
					<div
						class="card-glow pointer-events-none absolute h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
						style="left: 0; top: 0; background: radial-gradient(circle, {currentTheme === 'dark'
							? 'rgba(11, 157, 217, 0.15)'
							: 'transparent'} 0%, {currentTheme === 'dark'
							? 'rgba(11, 157, 217, 0.05)'
							: 'transparent'} 50%, transparent 80%);"
					></div>

					{#if pkg.popular}
						<div class="absolute right-6 top-6 z-20">
							<div
								class="bg-brand-blue shadow-brand-blue/20 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-xl"
							>
								<Star class="h-3 w-3" />
								{pkg.badge}
							</div>
						</div>
					{/if}

					<!-- Package Header -->
					<div class="relative z-10 p-10 pb-6">
						<h3
							class="group-hover:text-brand-blue mb-2 text-2xl font-black text-[var(--color-text-base)] transition-colors duration-500"
						>
							{pkg.name}
						</h3>

						<!-- Bottom Accent Line -->
						<div
							class="bg-brand-blue/30 absolute bottom-0 left-0 h-[3px] w-0 shadow-[0_0_20px_rgba(0,119,255,0.3)] transition-all duration-1000 group-hover:w-full"
						></div>

						<p
							class="mb-8 text-sm font-bold uppercase tracking-widest text-[var(--color-text-muted)] opacity-60"
						>
							{pkg.subtitle}
						</p>

						<!-- Pricing -->
						<div class="mb-8">
							<div class="mb-4 flex items-baseline gap-2">
								<span class="text-5xl font-black tracking-tighter text-[var(--color-text-base)]"
									>{pkg.price}</span
								>
								<div class="flex flex-col">
									<span class="text-brand-blue text-[10px] font-black uppercase tracking-widest"
										>{pkg.duration}</span
									>
									{#if pkg.originalPrice}
										<span
											class="text-sm font-medium text-[var(--color-text-muted)] line-through opacity-40"
											>{pkg.originalPrice}</span
										>
									{/if}
								</div>
							</div>
							<p class="text-sm font-medium leading-relaxed text-[var(--color-text-muted)]">
								{pkg.description}
							</p>
						</div>

						<!-- Delivery Time -->
						<div
							class="group-hover:border-brand-blue/20 group-hover:bg-brand-blue/5 inline-flex items-center gap-3 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-highlight)] px-5 py-2 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] transition-all duration-500"
						>
							<Zap class="text-brand-blue h-3.5 w-3.5" />
							<span
								>{data?.lang === 'ar' ? 'التسليم خلال' : 'Delivery within'} {pkg.deliveryTime}</span
							>
						</div>
					</div>

					<!-- Features List -->
					<div class="relative z-10 flex flex-grow flex-col px-10 pb-10">
						<div class="mb-8 h-px w-full bg-[var(--glass-border)]"></div>

						<ul class="mb-10 flex-grow space-y-4">
							{#each pkg.features as feature}
								<li
									class="flex items-center gap-4 text-sm font-medium text-[var(--color-text-muted)] transition-colors group-hover:text-[var(--color-text-base)]"
								>
									<div
										class="border-brand-blue/20 bg-brand-blue/10 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border"
									>
										<Check class="text-brand-blue h-3 w-3" />
									</div>
									<span>{feature}</span>
								</li>
							{/each}

							{#each pkg.notIncluded as feature}
								<li
									class="flex items-center gap-4 text-sm font-medium text-[var(--color-text-muted)] opacity-40"
								>
									<div
										class="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--glass-highlight)]"
									>
										<X class="h-2.5 w-2.5 text-[var(--color-text-muted)] opacity-40" />
									</div>
									<span>{feature}</span>
								</li>
							{/each}
						</ul>

						<!-- CTA Button -->
						<a
							href={pkg.ctaLink}
							class="flex w-full items-center justify-center gap-3 rounded-2xl px-6 py-5 text-sm font-black uppercase tracking-[0.2em] shadow-2xl transition-all duration-500 {pkg.popular
								? 'bg-brand-blue shadow-brand-blue/20 hover:shadow-brand-blue/40 text-white hover:-translate-y-1'
								: 'cinematic-glass hover:border-brand-blue/40 hover:bg-brand-blue/5 border border-[var(--glass-border)] text-[var(--color-text-base)] hover:-translate-y-1'}"
						>
							<span>{pkg.cta}</span>
							<ArrowRight class="h-5 w-5" />
						</a>
					</div>
				</div>
			{/each}
		</div>

		<!-- Custom Package CTA -->
		<div class="mx-auto mt-24 max-w-5xl">
			<div
				class="interactive-card cinematic-glass group relative overflow-hidden rounded-[3rem] border border-[var(--glass-border)] bg-[var(--color-surface)] p-10 md:p-16"
			>
				<!-- Subtle overlay -->
				<div
					class="bg-brand-blue/5 absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
				></div>

				<div class="relative z-10 flex flex-col items-center justify-between gap-12 md:flex-row">
					<div class="max-w-xl text-center md:text-right" class:md:text-left={data?.lang !== 'ar'}>
						<h3
							class="mb-6 text-3xl font-black leading-tight tracking-tight text-[var(--color-text-base)] md:text-4xl"
						>
							{data?.lang === 'ar' ? 'تحتاج حلول مخصصة لشركتك؟' : 'Need Custom Solutions?'}
						</h3>
						<p class="text-lg font-medium leading-relaxed text-[var(--color-text-muted)]">
							{data?.lang === 'ar'
								? 'نقدم حلولاً مخصصة تلبي احتياجات عملك الفريدة وتساعدك على تحقيق أهدافك الرقمية.'
								: 'We offer custom solutions that meet your unique business needs and help you achieve your digital goals.'}
						</p>
					</div>

					<div class="flex w-full flex-col gap-6 sm:flex-row md:w-auto">
						<a
							href="{base}/contact?custom=true"
							class="bg-brand-blue shadow-brand-blue/20 hover:shadow-brand-blue/40 rounded-2xl px-10 py-5 text-center text-sm font-black uppercase tracking-widest text-white shadow-2xl transition-all duration-500 hover:-translate-y-1"
						>
							{data?.lang === 'ar' ? 'احصل على عرض مخصص' : 'Get Custom Quote'}
						</a>
						<a
							href="https://wa.me/201112419980?text=%D9%83%D9%86%D8%AA%20%D8%B9%D8%A7%D9%8A%D8%B2%20%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%B1%20%D8%B9%D9%86%20%D8%AA%D9%81%D8%A7%D8%B5%D9%8A%D9%84%20%D8%AA%D8%B5%D9%85%D9%8A%D9%85%20%D8%A7%D9%84%D9%85%D9%88%D9%82%D8%B9"
							target="_blank"
							rel="noopener noreferrer"
							class="cinematic-glass hover:border-brand-blue/40 hover:bg-brand-blue/5 rounded-2xl border border-[var(--glass-border)] px-10 py-5 text-center text-sm font-black uppercase tracking-widest text-[var(--color-text-base)] transition-all duration-500 hover:-translate-y-1"
						>
							{data?.lang === 'ar' ? 'اتصل بنا مباشرة' : 'Call Us Directly'}
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
