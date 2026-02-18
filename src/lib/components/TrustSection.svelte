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
						title: 'ضمان استرداد المال',
						description: 'ضمان كامل لاسترداد المال خلال 30 يوم إذا لم تكن راضياً تماماً عن النتيجة',
						highlight: '30 يوم'
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
						title: 'Money Back Guarantee',
						description:
							"Full money-back guarantee within 30 days if you're not completely satisfied with the result",
						highlight: '30 days'
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
						icon: Users,
						number: 'موثوق',
						label: 'عميل راضٍ',
						description: 'عملاء حققوا نجاحاً مع مواقعنا'
					},
					{
						icon: Star,
						number: '4.9/5',
						label: 'تقييم العملاء',
						description: 'متوسط تقييمات عملائنا'
					},
					{
						icon: Award,
						number: 'مثبت',
						label: 'سنوات خبرة',
						description: 'في تطوير المواقع الإلكترونية'
					},
					{
						icon: Zap,
						number: '98%',
						label: 'معدل النجاح',
						description: 'نسبة المشاريع المكتملة بنجاح'
					}
				]
			: [
					{
						icon: Users,
						number: 'Trusted',
						label: 'Satisfied Clients',
						description: 'Clients who achieved success with our websites'
					},
					{
						icon: Star,
						number: '4.9/5',
						label: 'Client Rating',
						description: 'Average rating from our clients'
					},
					{
						icon: Award,
						number: 'Proven',
						label: 'Years Experience',
						description: 'In web development'
					},
					{
						icon: Zap,
						number: '98%',
						label: 'Success Rate',
						description: 'Percentage of successfully completed projects'
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
		class="container relative z-10 mx-auto px-6"
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
				<Sparkles class="text-brand-orange h-4 w-4" />
				<span
					class="text-xs font-black uppercase tracking-widest text-[var(--color-text-base)] opacity-80"
				>
					{data?.lang === 'ar' ? 'الثقة والأمان' : 'Trust & Security'}
				</span>
			</div>

			<h2
				class="text-4xl font-black leading-[1.1] tracking-tighter text-[var(--color-text-base)] md:text-6xl"
			>
				{data?.lang === 'ar' ? 'نحن نضمن' : 'We Guarantee'}
				<span class="text-brand-blue"
					>{data?.lang === 'ar' ? 'نجاحك الرقمي' : 'Your Digital Success'}</span
				>
			</h2>

			<p
				class="max-w-3xl text-lg font-medium leading-relaxed text-[var(--color-text-muted)] md:text-xl"
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
					class="interactive-card cinematic-glass hover:border-brand-blue/40 group relative overflow-hidden rounded-[2.5rem] border border-[var(--glass-border)] p-10 text-center transition-all duration-500"
				>
					<!-- Dynamic Spotlight Glow - Radial gradient replaces blur -->
					<div
						class="card-glow pointer-events-none absolute h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
						style="left: 0; top: 0; background: radial-gradient(circle, {currentTheme === 'dark'
							? 'rgba(var(--color-brand-blue-rgb), 0.15)'
							: 'rgba(var(--color-brand-blue-rgb), 0.1)'} 0%, {currentTheme === 'dark'
							? 'rgba(0, 119, 255, 0.05)'
							: 'rgba(0, 119, 255, 0.03)'} 50%, transparent 80%);"
					></div>

					<div class="relative z-10">
						<div
							class="group-hover:border-brand-blue/20 group-hover:bg-brand-blue/10 mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-[1.5rem] border border-[var(--glass-border)] bg-[var(--glass-highlight)] transition-all duration-500 group-hover:rotate-3 group-hover:scale-110"
						>
							<Icon
								class="group-hover:text-brand-blue h-10 w-10 text-[var(--color-text-base)] transition-colors duration-500"
							/>
						</div>

						<div
							class="border-brand-blue/30 bg-brand-blue/20 text-brand-blue mb-6 inline-block rounded-full border px-4 py-1 text-xs font-black uppercase tracking-widest"
						>
							{guarantee.highlight}
						</div>

						<h3
							class="group-hover:text-brand-blue mb-4 text-2xl font-black tracking-tight text-[var(--color-text-base)] transition-colors duration-500"
						>
							{guarantee.title}
						</h3>

						<!-- Bottom Accent Line -->
						<div
							class="bg-brand-blue/30 absolute bottom-0 left-0 h-[3px] w-0 shadow-[0_0_20px_rgba(0,119,255,0.3)] transition-all duration-1000 group-hover:w-full"
						></div>

						<p
							class="text-base font-medium leading-relaxed text-[var(--color-text-muted)] transition-colors duration-500 group-hover:text-[var(--color-text-base)]"
						>
							{guarantee.description}
						</p>
					</div>
				</div>
			{/each}
		</div>

		<!-- Trust Statistics -->
		<div class="group relative mb-32 overflow-hidden rounded-[3.5rem] p-16">
			<!-- Background with subtle movement -->
			<div
				class="group-hover:border-brand-blue/30 absolute inset-0 border border-[var(--glass-border)] backdrop-blur-3xl transition-all duration-700"
				style="background: {currentTheme === 'dark'
					? 'rgba(11, 157, 217, 0.1)'
					: 'rgba(255, 255, 255, 0.4)'};"
			></div>
			<div
				class="absolute -right-24 -top-24 h-96 w-96 rounded-full transition-all duration-700 group-hover:opacity-80"
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
						<div class="group/stat text-center">
							<div
								class="group-hover/stat:bg-brand-blue/10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-highlight)] transition-all duration-500 group-hover/stat:scale-110"
							>
								<Icon
									class="group-hover/stat:text-brand-blue h-10 w-10 text-[var(--color-text-base)] transition-colors duration-500"
								/>
							</div>
							<div class="text-brand-blue mb-3 text-5xl font-black tracking-tighter">
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
				class="cinematic-glass group relative overflow-hidden rounded-[3rem] border border-[var(--glass-border)] p-12"
			>
				<div
					class="bg-brand-blue/5 absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
				></div>
				<div class="relative z-10">
					<div class="mb-10 flex items-center gap-4">
						<div
							class="border-brand-blue/20 bg-brand-blue/10 flex h-14 w-14 items-center justify-center rounded-2xl border"
						>
							<Award class="text-brand-blue h-7 w-7" />
						</div>
						<h3 class="text-3xl font-black tracking-tight text-[var(--color-text-base)]">
							{data?.lang === 'ar' ? 'شهادات واعتمادات' : 'Certifications & Accreditations'}
						</h3>
					</div>

					<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
						{#each certifications as cert}
							<div
								class="hover:border-brand-blue/30 flex items-center gap-5 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-highlight)] p-6 transition-all duration-500"
							>
								<div
									class="bg-brand-blue/10 flex h-14 w-14 items-center justify-center rounded-full text-2xl"
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
				class="cinematic-glass group relative overflow-hidden rounded-[3rem] border border-[var(--glass-border)] p-12"
			>
				<div
					class="bg-brand-blue/5 absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
				></div>
				<div class="relative z-10">
					<div class="mb-10 flex items-center gap-4">
						<div
							class="border-brand-blue/20 bg-brand-blue/10 flex h-14 w-14 items-center justify-center rounded-2xl border"
						>
							<Lock class="text-brand-blue h-7 w-7" />
						</div>
						<h3 class="text-3xl font-black tracking-tight text-[var(--color-text-base)]">
							{data?.lang === 'ar' ? 'الأمان والحماية' : 'Security & Protection'}
						</h3>
					</div>

					<div class="space-y-6">
						{#each [{ title: data?.lang === 'ar' ? 'تشفير SSL مجاني' : 'Free SSL Encryption', desc: data?.lang === 'ar' ? 'حماية كاملة لبيانات موقعك وزوارك' : 'Complete protection for your website data and visitors' }, { title: data?.lang === 'ar' ? 'نسخ احتياطية يومية' : 'Daily Backups', desc: data?.lang === 'ar' ? 'حفظ تلقائي لجميع بيانات موقعك' : 'Automatic backup of all your website data' }, { title: data?.lang === 'ar' ? 'حماية من الهجمات' : 'Attack Protection', desc: data?.lang === 'ar' ? 'جدار حماية متقدم ضد التهديدات' : 'Advanced firewall against threats' }, { title: data?.lang === 'ar' ? 'مراقبة 24/7' : '24/7 Monitoring', desc: data?.lang === 'ar' ? 'مراقبة مستمرة لأداء وأمان الموقع' : 'Continuous monitoring of website performance and security' }] as feature}
							<div class="group/item flex items-start gap-5">
								<div
									class="bg-brand-blue/20 group-hover/item:bg-brand-blue mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full transition-colors"
								>
									<CheckCircle
										class="text-brand-blue h-4 w-4 group-hover/item:text-[var(--color-background)]"
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
		<div class="group relative overflow-hidden rounded-[4rem] p-20 text-center">
			<!-- High-end gradient background -->
			<div
				class="group-hover:border-brand-blue/40 absolute inset-0 border border-[var(--glass-border)] transition-all duration-700"
				style="background: {currentTheme === 'dark' ? '#0a0a0a' : '#ffffff'};"
			></div>
			<div
				class="absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 rounded-full"
				style="background: radial-gradient(ellipse at center, rgba(0, 119, 255, 0.15) 0%, rgba(0, 119, 255, 0.05) 40%, transparent 70%);"
			></div>

			<div class="relative z-10 mx-auto max-w-4xl">
				<div
					class="bg-brand-blue mx-auto mb-10 flex h-24 w-24 rotate-12 items-center justify-center rounded-3xl shadow-[0_0_50px_rgba(0,119,255,0.4)] transition-transform duration-700 group-hover:rotate-0"
				>
					<Shield class="h-12 w-12 text-white" />
				</div>

				<h3
					class="mb-10 text-4xl font-black leading-tight tracking-tighter text-[var(--color-text-base)] md:text-6xl"
				>
					{data?.lang === 'ar' ? 'ضمان استرداد المال 100%' : '100% Money Back Guarantee'}
				</h3>

				<p
					class="mb-12 text-xl font-medium leading-relaxed text-[var(--color-text-muted)] md:text-2xl"
				>
					{data?.lang === 'ar'
						? 'نحن واثقون من جودة عملنا لدرجة أننا نقدم ضمان كامل لاسترداد المال خلال 30 يوم. إذا لم تكن راضياً تماماً عن موقعك، سنعيد لك أموالك بالكامل بدون أي أسئلة.'
						: "We are so confident in our work quality that we offer a full money-back guarantee within 30 days. If you're not completely satisfied with your website, we'll refund your money completely with no questions asked."}
				</p>

				<div class="mb-16 grid gap-8 md:grid-cols-3">
					{#each [{ label: data?.lang === 'ar' ? 'بدون أسئلة' : 'No Questions' }, { label: data?.lang === 'ar' ? 'استرداد كامل' : 'Full Refund' }, { label: data?.lang === 'ar' ? 'خلال 30 يوم' : 'Within 30 Days' }] as item}
						<div
							class="flex items-center justify-center gap-3 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-highlight)] px-8 py-4"
						>
							<CheckCircle class="text-brand-blue h-5 w-5" />
							<span
								class="text-sm font-black uppercase tracking-widest text-[var(--color-text-base)]"
								>{item.label}</span
							>
						</div>
					{/each}
				</div>

				<div class="flex flex-col items-center justify-center gap-6 sm:flex-row">
					<a
						href="{base}/contact"
						class="bg-brand-blue rounded-2xl px-10 py-5 text-lg font-black uppercase tracking-widest text-white transition-all duration-500 hover:scale-105 hover:bg-[#0066ee] hover:shadow-[0_20px_40px_rgba(0,119,255,0.3)]"
					>
						{data?.lang === 'ar' ? 'ابدأ مشروعك بثقة تامة' : 'Start Project Now'}
					</a>
					<a
						href="{base}/about"
						class="cinematic-glass hover:border-brand-blue/30 rounded-2xl border border-[var(--glass-border)] px-10 py-5 text-lg font-black uppercase tracking-widest text-[var(--color-text-base)] transition-all duration-500"
					>
						{data?.lang === 'ar' ? 'تعرف علينا أكثر' : 'Learn More'}
					</a>
				</div>
			</div>
		</div>
	</div>
</section>
