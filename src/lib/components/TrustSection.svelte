<script lang="ts">
	import {
		Shield,
		Award,
		Clock,
		Users,
		Star,
		CheckCircle,
		Lock,
		Headphones,
		RefreshCw,
		Zap,
		Sparkles
	} from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { theme } from '$lib/stores/theme.svelte';
	import { base } from '$app/paths';
	import { inView } from '$lib/actions/inView';

	let { data } = $props();
	let container = $state<HTMLElement>();
	let mouseX = $state(0);
	let mouseY = $state(0);
	let isHovering = $state(false);
	const currentTheme = $derived(theme.current);

	function handleMouseMove(e: MouseEvent) {
		if (!container) return;
		const rect = container.getBoundingClientRect();
		mouseX = e.clientX - rect.left;
		mouseY = e.clientY - rect.top;
	}

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

	// Language-aware guarantees
	const guarantees = $derived(
		data?.lang === 'ar'
			? [
					{
						icon: Shield,
						title: 'رضاك هدفنا',
						description: 'نعمل معك حتى تحصل على نتيجة ترضيك تماماً — مع مراجعات مجانية غير محدودة',
						highlight: 'رضا مضمون'
					},
					{
						icon: Clock,
						title: 'ضمان التسليم في الموعد',
						description: 'نلتزم بتسليم مشروعك في الموعد المحدد أو نقدم خصم 20% على المشروع',
						highlight: '100% التزام'
					},
					{
						icon: RefreshCw,
						title: 'مراجعات مجانية',
						description: '3 جولات مراجعة مجانية لضمان حصولك على موقع يلبي توقعاتك بالضبط',
						highlight: '3 مراجعات'
					},
					{
						icon: Headphones,
						title: 'دعم فني مجاني',
						description: 'دعم فني مجاني لمدة 6 أشهر بعد تسليم الموقع مع رد خلال 24 ساعة',
						highlight: '6 أشهر'
					}
				]
			: [
					{
						icon: Shield,
						title: 'Satisfaction Guaranteed',
						description:
							'We work with you until you are completely satisfied — with unlimited free revisions',
						highlight: '100% effort'
					},
					{
						icon: Clock,
						title: 'On-time Delivery',
						description:
							'We commit to delivering your project on schedule or provide a 20% discount',
						highlight: '100% commitment'
					},
					{
						icon: RefreshCw,
						title: 'Free Revisions',
						description:
							'3 rounds of free revisions to ensure you get a site that perfectly meets your expectations',
						highlight: '3 revisions'
					},
					{
						icon: Headphones,
						title: 'Free Technical Support',
						description:
							'Free technical support for 6 months after delivery with response within 24 hours',
						highlight: '6 months'
					}
				]
	);

	// Language-aware trust indicators
	const trustIndicators = $derived(
		data?.lang === 'ar'
			? [
					{
						icon: Star,
						number: 'سعودي',
						label: 'مقرنا الرياض',
						description: 'نخدم الشركات في جميع المملكة'
					},
					{
						icon: Award,
						number: 'معتمد',
						label: 'سجل تجاري',
						description: '7050568158 — مؤسسة حافة النجوم'
					},
					{
						icon: Users,
						number: 'متخصص',
						label: 'ووردبريس - شوبيفاي - سلة - زد',
						description: 'منصات نعمل عليها'
					},
					{
						icon: Zap,
						number: 'سريع',
						label: 'تسليم خلال أيام',
						description: 'مواقع بسيطة 7-10 أيام، متاجر 2-3 أسابيع'
					}
				]
			: [
					{
						icon: Star,
						number: 'Saudi',
						label: 'Based in Riyadh',
						description: 'Serving businesses across the Kingdom'
					},
					{
						icon: Award,
						number: 'Licensed',
						label: 'Commercial Registration',
						description: '7050568158 — Hafat Alnjom Est.'
					},
					{
						icon: Users,
						number: 'Specialist',
						label: 'Platforms We Use',
						description: 'WordPress, Shopify, Salla, Zid'
					},
					{
						icon: Zap,
						number: 'Fast',
						label: 'Delivery Timeline',
						description: 'Simple sites 7-10 days, stores 2-3 weeks'
					}
				]
	);

	// Language-aware certifications
	const certifications = $derived(
		data?.lang === 'ar'
			? [
					{
						name: 'Google Partner',
						description: 'شريك معتمد من جوجل',
						badge: '🏆'
					},
					{
						name: 'SSL Certified',
						description: 'مواقع آمنة ومشفرة',
						badge: '🔒'
					},
					{
						name: 'Mobile Optimized',
						description: 'متوافق مع الهواتف',
						badge: '📱'
					},
					{
						name: 'SEO Ready',
						description: 'محسن لمحركات البحث',
						badge: '🚀'
					}
				]
			: [
					{
						name: 'Google Partner',
						description: 'Certified Google Partner',
						badge: '🏆'
					},
					{
						name: 'SSL Certified',
						description: 'Secure and encrypted websites',
						badge: '🔒'
					},
					{
						name: 'Mobile Optimized',
						description: 'Mobile-friendly',
						badge: '📱'
					},
					{
						name: 'SEO Ready',
						description: 'Search engine optimized',
						badge: '🚀'
					}
				]
	);
</script>

<section
	bind:this={container}
	onmousemove={handleMouseMove}
	onmouseenter={() => (isHovering = true)}
	onmouseleave={() => (isHovering = false)}
	aria-label={data?.lang === 'ar' ? 'قسم الثقة والأمان' : 'Trust and Security Section'}
	class="group/spotlight-container relative overflow-hidden bg-[var(--color-background)] py-32"
	dir={data?.lang === 'ar' ? 'rtl' : 'ltr'}
>
	<!-- Global Spotlight Mask -->
	<div
		class="pointer-events-none absolute inset-0 z-[5] transition-opacity duration-700"
		style="
      background: {currentTheme === 'dark' ? 'rgba(0,119,255,0.08)' : 'rgba(0,119,255,0.04)'};
      opacity: {isHovering ? (currentTheme === 'dark' ? 0.15 : 0.05) : 0};
    "
	></div>

	<!-- Content with Reveal Mask -->
	<div
		class="relative z-10 container mx-auto px-6"
		style="
      mask-image: radial-gradient(circle 350px at ${mouseX}px ${mouseY}px, black 0%, black 70%, rgba(0,0,0,0.2) 100%);
      -webkit-mask-image: radial-gradient(circle 350px at ${mouseX}px ${mouseY}px, black 0%, black 70%, rgba(0,0,0,0.2) 100%);
    "
	>
		<!-- Section Header -->
		<div
			class="mb-24 flex flex-col space-y-8 {data?.lang === 'ar'
				? 'items-end text-right'
				: 'items-start text-left'}"
		>
			<div
				class="cinematic-glass mb-4 inline-flex items-center gap-3 rounded-full border border-[var(--glass-border)] px-6 py-2"
			>
				<Sparkles class="h-4 w-4 text-brand-orange" />
				<span
					class="text-xs font-black tracking-widest text-[var(--color-text-base)] uppercase opacity-80"
				>
					{data?.lang === 'ar' ? 'الثقة والأمان' : 'Trust & Security'}
				</span>
			</div>

			<h2
				class="text-4xl leading-[1.1] font-black tracking-tighter text-[var(--color-text-base)] md:text-6xl"
			>
				{data?.lang === 'ar' ? 'نحن نضمن' : 'We Guarantee'}
				<span class="text-brand-blue"
					>{data?.lang === 'ar' ? 'نجاحك الرقمي' : 'Your Digital Success'}</span
				>
			</h2>

			<p
				class="max-w-3xl text-lg leading-relaxed font-medium text-[var(--color-text-muted)] md:text-xl"
			>
				{data?.lang === 'ar'
					? 'نقدم ضمانات شاملة وخدمات موثوقة لضمان راحة بالك ونجاح مشروعك'
					: 'We provide comprehensive guarantees and reliable services to ensure your peace of mind and project success'}
			</p>
		</div>

		<!-- Guarantees Grid -->
		<div class="mb-32 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
			{#each guarantees as guarantee}
				{@const Icon = guarantee.icon}
				<div
					use:inView
					class="interactive-card cinematic-glass group relative overflow-hidden rounded-[2.5rem] border border-[var(--glass-border)] p-10 text-center transition-all duration-500 hover:border-brand-blue/40 [&.in-view]:border-brand-blue/40"
				>
					<!-- Dynamic Spotlight Glow - Radial gradient replaces blur -->
					<div
						class="card-glow pointer-events-none absolute h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 group-[.in-view]:opacity-100"
						style="left: 0; top: 0; background: radial-gradient(circle, {currentTheme === 'dark'
							? 'rgba(var(--color-brand-blue-rgb), 0.15)'
							: 'rgba(var(--color-brand-blue-rgb), 0.1)'} 0%, {currentTheme === 'dark'
							? 'rgba(0, 119, 255, 0.05)'
							: 'rgba(0, 119, 255, 0.03)'} 50%, transparent 80%);"
					></div>

					<div class="relative z-10">
						<div
							class="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-[1.5rem] border border-[var(--glass-border)] bg-[var(--glass-highlight)] transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:border-brand-blue/20 group-hover:bg-brand-blue/10 group-[.in-view]:scale-110 group-[.in-view]:rotate-3 group-[.in-view]:border-brand-blue/20 group-[.in-view]:bg-brand-blue/10"
						>
							<Icon
								class="h-10 w-10 text-[var(--color-text-base)] transition-colors duration-500 group-hover:text-brand-blue group-[.in-view]:text-brand-blue"
							/>
						</div>

						<div
							class="mb-6 inline-block rounded-full border border-brand-blue/30 bg-brand-blue/20 px-4 py-1 text-xs font-black tracking-widest text-brand-blue uppercase"
						>
							{guarantee.highlight}
						</div>

						<h3
							class="mb-4 text-2xl font-black tracking-tight text-[var(--color-text-base)] transition-colors duration-500 group-hover:text-brand-blue group-[.in-view]:text-brand-blue"
						>
							{guarantee.title}
						</h3>

						<!-- Bottom Accent Line -->
						<div
							class="absolute bottom-0 left-0 h-[3px] w-0 bg-brand-blue/30 shadow-[0_0_20px_rgba(0,119,255,0.3)] transition-all duration-1000 group-hover:w-full group-[.in-view]:w-full"
						></div>

						<p
							class="text-base leading-relaxed font-medium text-[var(--color-text-muted)] transition-colors duration-500 group-hover:text-[var(--color-text-base)] group-[.in-view]:text-[var(--color-text-base)]"
						>
							{guarantee.description}
						</p>
					</div>
				</div>
			{/each}
		</div>

		<!-- Trust Statistics -->
		<div use:inView class="group relative mb-32 overflow-hidden rounded-[3.5rem] p-16">
			<!-- Background with subtle movement -->
			<div
				class="absolute inset-0 border border-[var(--glass-border)] backdrop-blur-3xl transition-all duration-700 group-hover:border-brand-blue/30 group-[.in-view]:border-brand-blue/30"
				style="background: {currentTheme === 'dark'
					? 'rgba(11, 157, 217, 0.1)'
					: 'rgba(255, 255, 255, 0.4)'};"
			></div>
			<div
				class="absolute -top-24 -right-24 h-96 w-96 rounded-full transition-all duration-700 group-hover:opacity-80 group-[.in-view]:opacity-80"
				style="background: radial-gradient(circle, rgba(0, 119, 255, 0.15) 0%, rgba(0, 119, 255, 0.05) 40%, transparent 70%);"
			></div>

			<div class="relative z-10">
				<div class="mb-16 text-center">
					<h3
						class="mb-6 text-3xl font-black tracking-tight text-[var(--color-text-base)] md:text-4xl"
					>
						{data?.lang === 'ar' ? 'أرقام تتحدث عن نفسها' : 'Numbers That Speak For Themselves'}
					</h3>
					<p class="text-lg font-medium text-[var(--color-text-muted)]">
						{data?.lang === 'ar'
							? 'إنجازاتنا وثقة عملائنا بنا'
							: "Our achievements and our clients' trust in us"}
					</p>
				</div>

				<div class="grid gap-12 md:grid-cols-4">
					{#each trustIndicators as indicator}
						{@const Icon = indicator.icon}
						<div use:inView class="group/stat text-center">
							<div
								class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-highlight)] transition-all duration-500 group-hover/stat:scale-110 group-hover/stat:bg-brand-blue/10 group-[.in-view]/stat:scale-110 group-[.in-view]/stat:bg-brand-blue/10"
							>
								<Icon
									class="h-10 w-10 text-[var(--color-text-base)] transition-colors duration-500 group-hover/stat:text-brand-blue group-[.in-view]/stat:text-brand-blue"
								/>
							</div>
							<div class="mb-3 text-5xl font-black tracking-tighter text-brand-blue">
								{indicator.number}
							</div>
							<div class="mb-2 text-xl font-black text-[var(--color-text-base)]">
								{indicator.label}
							</div>
							<div class="text-sm font-medium text-[var(--color-text-dim)]">
								{indicator.description}
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Certifications and Security -->
		<div class="mb-32 grid gap-12 lg:grid-cols-2">
			<!-- Certifications -->
			<div
				use:inView
				class="cinematic-glass group relative overflow-hidden rounded-[3rem] border border-[var(--glass-border)] p-12"
			>
				<div
					class="absolute inset-0 bg-brand-blue/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-[.in-view]:opacity-100"
				></div>
				<div class="relative z-10">
					<div class="mb-10 flex items-center gap-4">
						<div
							class="flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-blue/20 bg-brand-blue/10"
						>
							<Award class="h-7 w-7 text-brand-blue" />
						</div>
						<h3 class="text-3xl font-black tracking-tight text-[var(--color-text-base)]">
							{data?.lang === 'ar' ? 'شهادات واعتمادات' : 'Certifications & Accreditations'}
						</h3>
					</div>

					<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
						{#each certifications as cert}
							<div
								use:inView
								class="flex items-center gap-5 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-highlight)] p-6 transition-all duration-500 hover:border-brand-blue/30 [&.in-view]:border-brand-blue/30"
							>
								<div
									class="flex h-14 w-14 items-center justify-center rounded-full bg-brand-blue/10 text-2xl"
								>
									{cert.badge}
								</div>
								<div>
									<div class="text-lg font-black text-[var(--color-text-base)]">{cert.name}</div>
									<div class="text-sm font-medium text-[var(--color-text-dim)]">
										{cert.description}
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- Security Features -->
			<div
				use:inView
				class="cinematic-glass group relative overflow-hidden rounded-[3rem] border border-[var(--glass-border)] p-12"
			>
				<div
					class="absolute inset-0 bg-brand-blue/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-[.in-view]:opacity-100"
				></div>
				<div class="relative z-10">
					<div class="mb-10 flex items-center gap-4">
						<div
							class="flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-blue/20 bg-brand-blue/10"
						>
							<Lock class="h-7 w-7 text-brand-blue" />
						</div>
						<h3 class="text-3xl font-black tracking-tight text-[var(--color-text-base)]">
							{data?.lang === 'ar' ? 'الأمان والحماية' : 'Security & Protection'}
						</h3>
					</div>

					<div class="space-y-6">
						{#each [{ title: data?.lang === 'ar' ? 'تشفير SSL مجاني' : 'Free SSL Encryption', desc: data?.lang === 'ar' ? 'حماية كاملة لبيانات موقعك وزوارك' : 'Complete protection for your website data and visitors' }, { title: data?.lang === 'ar' ? 'نسخ احتياطية يومية' : 'Daily Backups', desc: data?.lang === 'ar' ? 'حفظ تلقائي لجميع بيانات موقعك' : 'Automatic backup of all your website data' }, { title: data?.lang === 'ar' ? 'حماية من الهجمات' : 'Attack Protection', desc: data?.lang === 'ar' ? 'جدار حماية متقدم ضد التهديدات' : 'Advanced firewall against threats' }, { title: data?.lang === 'ar' ? 'مراقبة 24/7' : '24/7 Monitoring', desc: data?.lang === 'ar' ? 'مراقبة مستمرة لأداء وأمان الموقع' : 'Continuous monitoring of website performance and security' }] as feature}
							<div use:inView class="group/item flex items-start gap-5">
								<div
									class="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-blue/20 transition-colors group-hover/item:bg-brand-blue group-[.in-view]/item:bg-brand-blue"
								>
									<CheckCircle
										class="h-4 w-4 text-brand-blue group-hover/item:text-[var(--color-background)] group-[.in-view]/item:text-[var(--color-background)]"
									/>
								</div>
								<div>
									<div class="mb-1 text-lg font-black text-[var(--color-text-base)]">
										{feature.title}
									</div>
									<div class="text-base font-medium text-[var(--color-text-dim)]">
										{feature.desc}
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>

		<!-- Money Back Guarantee CTA -->
		<div use:inView class="group relative overflow-hidden rounded-[4rem] p-20 text-center">
			<!-- High-end gradient background -->
			<div
				class="absolute inset-0 border border-[var(--glass-border)] transition-all duration-700 group-hover:border-brand-blue/40 group-[.in-view]:border-brand-blue/40"
				style="background: {currentTheme === 'dark' ? '#0a0a0a' : '#ffffff'};"
			></div>
			<div
				class="absolute top-0 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full"
				style="background: radial-gradient(ellipse at center, rgba(0, 119, 255, 0.15) 0%, rgba(0, 119, 255, 0.05) 40%, transparent 70%);"
			></div>

			<div class="relative z-10 mx-auto max-w-4xl">
				<div
					class="mx-auto mb-10 flex h-24 w-24 rotate-12 items-center justify-center rounded-3xl bg-brand-blue shadow-[0_0_50px_rgba(0,119,255,0.4)] transition-transform duration-700 group-hover:rotate-0 group-[.in-view]:rotate-0"
				>
					<Shield class="h-12 w-12 text-white" />
				</div>

				<h3
					class="mb-10 text-4xl leading-tight font-black tracking-tighter text-[var(--color-text-base)] md:text-6xl"
				>
					{data?.lang === 'ar' ? 'جاهز لتطوير أعمالك الرقمية؟' : 'Ready to Grow Your Digital Presence?'}
				</h3>

				<p
					class="mb-12 text-xl leading-relaxed font-medium text-[var(--color-text-muted)] md:text-2xl"
				>
					{data?.lang === 'ar'
						? 'نحن نعمل معك خطوة بخطوة من التخطيط إلى الإطلاق. نقدم استشارة مجانية لفهم احتياجك وتقديم عرض سعر مناسب.'
						: 'We work with you step by step — from planning to launch. Get a free consultation to discuss your project needs and receive a tailored quote.'}
				</p>

				<div class="flex flex-col items-center justify-center gap-6 sm:flex-row">
					<a
						href="{base}/contact"
						use:inView
						class="rounded-2xl bg-brand-blue px-10 py-5 text-lg font-black tracking-widest text-white uppercase transition-all duration-500 hover:scale-105 hover:bg-[#0066ee] hover:shadow-[0_20px_40px_rgba(0,119,255,0.3)] [&.in-view]:scale-105 [&.in-view]:bg-[#0066ee] [&.in-view]:shadow-[0_20px_40px_rgba(0,119,255,0.3)]"
					>
						{data?.lang === 'ar' ? 'احصل على استشارتك المجانية' : 'Get Free Consultation'}
					</a>
					<a
						href="{base}/about"
						class="cinematic-glass rounded-2xl border border-[var(--glass-border)] px-10 py-5 text-lg font-black tracking-widest text-[var(--color-text-base)] uppercase transition-all duration-500 hover:border-brand-blue/30"
					>
						{data?.lang === 'ar' ? 'تعرف علينا أكثر' : 'Learn More'}
					</a>
				</div>
			</div>
		</div>
	</div>
</section>
