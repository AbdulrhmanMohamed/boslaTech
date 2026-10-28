<script lang="ts">
	import { inView } from '$lib/actions/inView';
	import { ChevronDown, MessageCircle, Phone, Sparkles } from '@lucide/svelte';
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

	gsap.registerPlugin(ScrollTrigger);

	import { theme } from '$lib/stores/theme.svelte';

	const props = $props<{ data: any }>();
	const data = $derived(props.data);
	const currentTheme = $derived(theme.current);

	// FAQ state management
	let openFAQ = $state(-1);
	let titleElement: HTMLElement | undefined = $state();
	let descElement: HTMLElement | undefined = $state();
	let badgeElement: HTMLElement | undefined = $state();
	let interactiveCards: HTMLElement[] = [];
	let questionElements: HTMLElement[] = [];
	let answerElements: HTMLElement[] = [];
	let categoryElements: HTMLElement[] = [];
	let glowElements: HTMLElement[] = [];

	const translations = {
		en: {
			header: {
				badge: 'FAQ',
				title: 'Frequently Asked Questions',
				subtitle:
					'Here are the most important questions our clients ask about website development and our services'
			},
			contact: {
				title: 'Have another question?',
				subtitle: 'Our team is ready to answer all your inquiries and help you at any time',
				whatsapp: {
					label: 'WhatsApp',
					description: 'Instant reply within minutes'
				},
				phone: {
					label: 'Direct call',
					description: 'Available 24/7'
				},
				button: 'Contact us now'
			},
			faqs: [
				{
					category: 'Ownership',
					question: 'Do I fully own my website?',
					answer: 'Yes. The design, code and content are yours, with no monthly subscription.'
				},
				{
					category: 'What is included',
					question: 'What does the price include?',
					answer: 'The price covers the full design and code of your website with its control panel. Domain and hosting are included for the first year, then a small yearly renewal. (To be confirmed before publishing)'
				},
				{
					category: 'Timeline',
					question: 'When does the delivery time start?',
					answer: 'As soon as we receive all your content and images.'
				},
				{
					category: 'Payment',
					question: 'How do I pay?',
					answer: '50% upfront and 50% after you review and approve the website.'
				},
				{
					category: 'Content',
					question: "I don't have content ready. What now?",
					answer: 'Send us the basic information and our writers will prepare your website copy.'
				},
				{
					category: 'Editing',
					question: 'Can I edit the website myself?',
					answer: 'Yes, from the control panel — no developer needed.'
				}
			]
		},
		ar: {
			header: {
				badge: 'أسئلة شائعة',
				title: 'أسئلة شائعة',
				subtitle: 'إليك أهم الأسئلة التي يطرحها عملاؤنا قبل البدء'
			},
			contact: {
				title: 'لديك سؤال آخر؟',
				subtitle: 'فريقنا جاهز للإجابة على جميع استفساراتك ومساعدتك في أي وقت',
				whatsapp: {
					label: 'واتساب',
					description: 'رد فوري خلال دقائق'
				},
				phone: {
					label: 'اتصال مباشر',
					description: 'متاح 24/7'
				},
				button: 'تواصل معنا الآن'
			},
			faqs: [
				{
					category: 'الملكية',
					question: 'هل الموقع ملكي بالكامل؟',
					answer: 'نعم. التصميم والكود والمحتوى ملكك، بدون أي اشتراك شهري.'
				},
				{
					category: 'ماذا يشمل',
					question: 'ماذا يشمل السعر؟',
					answer: 'يشمل السعر كامل تصميم وبرمجة موقعك مع لوحة التحكم. الدومين والاستضافة مشمولان لأول سنة، ثم تجديد سنوي رمزي. (قيد التأكيد قبل النشر)'
				},
				{
					category: 'التوقيت',
					question: 'متى تبدأ مدة التسليم؟',
					answer: 'من لحظة استلام المحتوى والصور كاملة.'
				},
				{
					category: 'الدفع',
					question: 'كيف يتم الدفع؟',
					answer: '50% مقدمًا و50% بعد مراجعة الموقع والموافقة عليه.'
				},
				{
					category: 'المحتوى',
					question: 'ليس لدي محتوى جاهز، ماذا أفعل؟',
					answer: 'أرسل لنا المعلومات الأساسية، ونتولى كتابة نصوص موقعك باحترافية.'
				},
				{
					category: 'التعديل',
					question: 'هل أستطيع تعديل الموقع بنفسي؟',
					answer: 'نعم، من لوحة التحكم وبدون الحاجة إلى مبرمج.'
				}
			]
		}
	};

	// Make FAQs reactive using $derived to support language switching
	const faqs = $derived.by(() => {
		const lang = data?.lang === 'ar' ? 'ar' : 'en';
		const currentLangFaqs = translations[lang].faqs; // Get FAQs for the current language

		return currentLangFaqs.map((item, i) => ({
			id: i,
			category: data?.home?.faq?.[`q${i + 1}`]?.category ?? item.category,
			question: item.question,
			answer: item.answer
		}));
	});

	// Section header content
	const sectionHeader = $derived.by(() => {
		const lang = data?.lang === 'ar' ? 'ar' : 'en';
		console.log('wht this returned: ', lang, translations[lang].header);
		return translations[lang].header;
	});

	// Contact CTA content
	const contactCTA = $derived.by(() => {
		const lang = data?.lang === 'ar' ? 'ar' : 'en';

		return translations[lang].contact;
	});

	function toggleFAQ(index: number, event?: Event) {
		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}
		openFAQ = openFAQ === index ? -1 : index;
	}

	// Unified GSAP Animations
	$effect(() => {
		if (typeof window === 'undefined') return;

		const lang = data?.lang;
		const headerTitle = sectionHeader.title;
		const headerSubtitle = sectionHeader.subtitle;

		const ctx = gsap.context(() => {
			const faqsData = faqs;
			const isAr = lang === 'ar';

			if (!titleElement) return;

			titleElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');
			if (descElement) descElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');

			titleElement.textContent = headerTitle;
			if (descElement) descElement.textContent = headerSubtitle;

			const words = headerTitle.split(' ');
			if (words.length >= 2) {
				const lastWord = words.pop();
				const rest = words.join(' ');
				titleElement.innerHTML = `${rest} <span class="text-brand-orange">${lastWord}</span>`;
			}

			const animatableElements = [badgeElement, titleElement, descElement].filter(
				Boolean
			) as HTMLElement[];

			gsap.killTweensOf(animatableElements);
			gsap.set(animatableElements, {
				clearProps: 'all',
				opacity: 0,
				visibility: 'visible'
			});

			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: '#faq-section',
					start: 'top 85%',
					toggleActions: 'play none none none'
				}
			});

			if (isAr) {
				const titleDescElements = [titleElement, descElement].filter(Boolean) as HTMLElement[];
				gsap.set(titleDescElements, { opacity: 1, clipPath: 'inset(0 0 0 100%)' });

				if (badgeElement) {
					tl.to(badgeElement, {
						y: 0,
						opacity: 1,
						duration: 0.5,
						ease: 'power2.out',
						startAt: { y: 20 }
					});
				}
				if (titleElement) {
					tl.to(
						titleElement,
						{
							clipPath: 'inset(0 0 0 0%)',
							duration: 1.2,
							ease: 'power2.inOut'
						},
						'-=0.2'
					);
				}
				if (descElement) {
					tl.to(
						descElement,
						{
							clipPath: 'inset(0 0 0 0%)',
							duration: 1,
							ease: 'power2.inOut'
						},
						'-=0.4'
					);
				}
			} else {
				const titleDescElements = [titleElement, descElement].filter(Boolean) as HTMLElement[];
				gsap.set(titleDescElements, { opacity: 1, clipPath: 'inset(0 100% 0 0)' });

				if (badgeElement) {
					tl.to(badgeElement, {
						y: 0,
						opacity: 1,
						duration: 0.5,
						ease: 'power2.out',
						startAt: { y: 20 }
					});
				}
				if (titleElement) {
					tl.to(
						titleElement,
						{
							clipPath: 'inset(0 0% 0 0)',
							duration: 1.2,
							ease: 'power2.inOut'
						},
						'-=0.2'
					);
				}
				if (descElement) {
					tl.to(
						descElement,
						{
							clipPath: 'inset(0 0% 0 0)',
							duration: 1,
							ease: 'power2.inOut'
						},
						'-=0.4'
					);
				}
			}

			// FAQ Cards & Contact Cards Interactions
			interactiveCards.forEach((card: any, i) => {
				const questionElement = questionElements[i];
				const answerElement = answerElements[i];
				const categoryElement = categoryElements[i];

				if (faqsData[i]) {
					if (questionElement) questionElement.textContent = faqsData[i].question;
					if (answerElement) answerElement.textContent = faqsData[i].answer;
					if (categoryElement) categoryElement.textContent = faqsData[i].category;
				}

				const glow = glowElements[i];
				if (!glow) return;

				gsap.set(glow, { clearProps: 'all', opacity: 0 });
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
		});

		return () => {
			ctx.revert();
			interactiveCards.forEach((card: any) => {
				if (card._cleanup) card._cleanup();
			});
		};
	});
</script>

<section
	id="faq-section"
	class="relative overflow-hidden bg-[var(--color-background)] py-32"
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
		<!-- Section Header -->
		<div class="mx-auto mb-24 flex max-w-4xl flex-col items-center space-y-8 text-center">
			<div
				bind:this={badgeElement}
				class="cinematic-glass-badge cinematic-glass mb-4 inline-flex items-center gap-3 rounded-full border border-[var(--glass-border)] px-6 py-2"
			>
				<Sparkles class="h-4 w-4 text-brand-orange" />
				<span class="text-xs font-bold tracking-widest text-brand-blue uppercase">
					{sectionHeader.badge}
				</span>
			</div>

			{#key data.lang}
				<div class="contents">
					<h2
						bind:this={titleElement}
						class="section-title text-4xl leading-[1.1] font-black tracking-tighter text-[var(--color-text-base)] md:text-5xl"
					>
						{sectionHeader.title}
					</h2>

					<p
						bind:this={descElement}
						class="section-description max-w-2xl text-lg leading-relaxed font-medium text-[var(--color-text-muted)] md:text-xl"
					>
						{sectionHeader.subtitle}
					</p>
				</div>
			{/key}
		</div>

		<!-- FAQ List - "Expanding Data Nodes" -->
		<div class="relative mx-auto max-w-4xl space-y-6">
			<!-- Vertical Connection Line (Data Backbone) -->
			<div
				class="pointer-events-none absolute start-[23px] top-0 bottom-0 hidden w-[2px] bg-[var(--color-brand-blue)] opacity-10 md:block"
			></div>

			{#each faqs as faq, index (faq.id + '-' + data.lang)}
				<div
					bind:this={interactiveCards[index]}
					use:inView
					class="interactive-card cinematic-glass group relative overflow-hidden rounded-2xl border border-[var(--glass-border)] transition-all duration-500 hover:bg-[var(--glass-bg)] [&.in-view]:bg-[var(--glass-bg)] {openFAQ ===
					index
						? 'border-brand-blue/30 bg-[var(--glass-bg)]'
						: 'bg-[var(--color-surface)]'}"
				>
					<!-- Dynamic Spotlight Glow - Radial gradient replaces blur -->
					<div
						bind:this={glowElements[index]}
						class="card-glow pointer-events-none absolute h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
						style="left: 0; top: 0; background: radial-gradient(circle, {currentTheme === 'dark'
							? 'rgba(var(--color-brand-blue-rgb), 0.15)'
							: 'transparent'} 0%, {currentTheme === 'dark'
							? 'rgba(0, 119, 255, 0.05)'
							: 'transparent'} 50%, transparent 80%); opacity: {currentTheme === 'dark' ? 1 : 0};"
					></div>

					<!-- Inner Shadow -->
					<div
						class="pointer-events-none absolute inset-0"
						style="box-shadow: {currentTheme === 'dark'
							? 'inset 0 0 40px rgba(255,255,255,0.02)'
							: 'inset 0 0 40px rgba(0,0,0,0.01)'};"
					></div>

					<!-- Connection Node -->
					<div
						use:inView
						class="absolute start-[19px] top-8 z-20 hidden h-[10px] w-[10px] rounded-full border border-brand-blue/40 bg-brand-blue/20 transition-all duration-500 group-hover:border-brand-orange group-hover:bg-brand-orange group-hover:shadow-[0_0_15px_rgba(251,98,32,0.5)] group-[.in-view]:border-brand-orange group-[.in-view]:bg-brand-orange group-[.in-view]:shadow-[0_0_15px_rgba(251,98,32,0.5)] md:block {openFAQ ===
						index
							? 'scale-125 border-brand-orange bg-brand-orange shadow-[0_0_15px_rgba(251,98,32,0.5)]'
							: ''}"
					></div>

					<button
						class="relative z-10 flex w-full items-center justify-between p-8 transition-colors duration-500"
						onclick={(event) => toggleFAQ(index, event)}
					>
						<div class="flex-1 ps-12 text-start">
							<div class="mb-4 flex items-center gap-3">
								<span
									bind:this={categoryElements[index]}
									class="faq-category-tag inline-block rounded-full bg-[var(--glass-bg)] px-4 py-1 text-[10px] font-black tracking-widest text-brand-blue uppercase transition-colors group-hover:bg-brand-blue/20 group-[.in-view]:bg-brand-blue/20"
								>
									{faq.category}
								</span>
								<div
									use:inView
									class="h-[1px] flex-1 bg-[var(--glass-border)] transition-all duration-700 group-hover:bg-brand-blue/20 group-[.in-view]:bg-brand-blue/20"
								></div>
							</div>

							<h3
								bind:this={questionElements[index]}
								class="text-xl font-black tracking-tight text-[var(--color-text-base)] transition-colors duration-500 group-hover:text-brand-blue group-[.in-view]:text-brand-blue md:text-2xl"
							>
								{faq.question}
							</h3>
						</div>

						<div
							use:inView
							class="ms-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--glass-bg)] transition-all duration-500 group-hover:bg-brand-orange/10 group-[.in-view]:bg-brand-orange/10"
						>
							<ChevronDown
								class="h-6 w-6 text-brand-orange transition-all duration-500 {openFAQ === index
									? 'rotate-180'
									: ''}"
							/>
						</div>
					</button>

					{#if openFAQ === index}
						<div
							class="relative z-10 overflow-hidden bg-[var(--glass-bg)] px-8 pb-8 opacity-50"
							transition:slide={{ duration: 300, easing: cubicOut }}
						>
							<div class="border-t border-[var(--glass-border)] ps-12 pt-8 text-start">
								<p
									bind:this={answerElements[index]}
									class="faq-answer-text text-lg leading-relaxed font-medium text-[var(--color-text-muted)]"
								>
									{faq.answer}
								</p>
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<!-- Contact CTA -->
		<div class="mx-auto mt-24 max-w-4xl text-center">
			<h3 class="mb-4 text-3xl font-black text-[var(--color-text-base)] md:text-4xl">
				{contactCTA.title}
			</h3>
			<p
				class="mb-12 text-lg leading-relaxed font-medium text-[var(--color-text-muted)] md:text-xl"
			>
				{contactCTA.subtitle}
			</p>
			<a
				href="https://wa.me/966576944605?text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%D8%8C%20%D8%A3%D8%A8%D8%BA%D9%89%20%D8%A3%D8%B3%D8%AA%D9%81%D8%B3%D8%B1%20%D8%B9%D9%86%20%D8%B9%D8%B1%D8%B6%20%D8%A7%D9%84%D8%A5%D8%B7%D9%84%D8%A7%D9%82"
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center justify-center rounded-full bg-brand-blue px-8 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:bg-brand-orange hover:shadow-brand-orange/50 focus:ring-4 focus:ring-brand-blue/50 focus:outline-none [&.in-view]:bg-brand-orange [&.in-view]:shadow-brand-orange/50"
			>
				<MessageCircle class="me-3 h-6 w-6" />
				{contactCTA.button}
			</a>
			<div class="mt-12 flex flex-col justify-center gap-8 sm:flex-row">
				<div class="flex items-center gap-4">
					<div class="rounded-full bg-brand-blue/10 p-3 text-brand-blue">
						<MessageCircle class="h-6 w-6" />
					</div>
					<div>
						<p class="font-bold text-[var(--color-text-base)]">{contactCTA.whatsapp.label}</p>
						<p class="text-sm text-[var(--color-text-muted)]">{contactCTA.whatsapp.description}</p>
					</div>
				</div>
				<div class="flex items-center gap-4">
					<div class="rounded-full bg-brand-blue/10 p-3 text-brand-blue">
						<Phone class="h-6 w-6" />
					</div>
					<div>
						<p class="font-bold text-[var(--color-text-base)]">{contactCTA.phone.label}</p>
						<p class="text-sm text-[var(--color-text-muted)]">{contactCTA.phone.description}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
