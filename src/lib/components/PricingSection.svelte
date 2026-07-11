<script lang="ts">
	import { inView } from '$lib/actions/inView';
	import { Check, Star, Zap, Crown, ArrowRight, Clock, Shield, X, Sparkles } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import SplitType from 'split-type';
	import { theme } from '$lib/stores/theme.svelte';
	import { pricing } from '$lib/stores/pricing.svelte';
	import { PACKAGES, ADDONS, formatPrice, type CurrencyCode } from '$lib/data/pricing';
	import { base } from '$app/paths';

	if (typeof window !== 'undefined') {
		gsap.registerPlugin(ScrollTrigger);
	}

	let { data } = $props();
	const currentTheme = $derived(theme.current);

	// Mobile Scroll Interaction (Auto-active cards)
	$effect(() => {
		if (typeof window === 'undefined') return;

		const observerOptions = {
			root: null,
			rootMargin: '-20% 0px -20% 0px', // Active when in the middle 60% of screen
			threshold: 0.5
		};

		const observerCallback = (entries: IntersectionObserverEntry[]) => {
			const isMobile = window.matchMedia('(max-width: 768px)').matches;
			if (!isMobile) return;

			entries.forEach((entry) => {
				const cardWrapper = entry.target;
				const card = cardWrapper.querySelector('.interactive-card');
				if (entry.isIntersecting) {
					card?.classList.add('active-card');
				} else {
					card?.classList.remove('active-card');
				}
			});
		};

		const observer = new IntersectionObserver(observerCallback, observerOptions);
		const cards = document.querySelectorAll('.pricing-card-wrapper');
		cards.forEach((card) => observer.observe(card));

		return () => observer.disconnect();
	});

	$effect(() => {
		if (typeof window === 'undefined') return;

		const ctx = gsap.context(() => {
			// Title Animation
			const titleElement = document.querySelector('#pricing .section-title') as HTMLElement;
			const badgeElement = document.querySelector('#pricing .section-badge');
			const descElement = document.querySelector('#pricing .section-description') as HTMLElement;

			if (titleElement) {
				const isAr = data?.lang === 'ar';
				const mainTitle = titleElement.querySelector('.pricing-title-main') as HTMLElement;
				const subTitle = titleElement.querySelector('.pricing-title-sub') as HTMLElement;

				// Force explicit direction and reset content safely
				if (mainTitle) {
					mainTitle.setAttribute('dir', isAr ? 'rtl' : 'ltr');
					mainTitle.textContent = isAr ? 'اختر الباقة المناسبة' : 'Choose the Right Package';
				}
				if (subTitle) {
					subTitle.setAttribute('dir', isAr ? 'rtl' : 'ltr');
					subTitle.textContent = isAr ? 'لنمو أعمالك' : 'for Your Business Growth';
				}
				if (descElement) {
					descElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');
					descElement.textContent = isAr
						? 'باقات مصممة خصيصاً لتلبية احتياجات شركتك وتحقيق أهدافك التجارية بأفضل الأسعار'
						: 'Packages specially designed to meet your company needs and achieve your business goals at the best prices';
				}

				const tl = gsap.timeline({
					scrollTrigger: {
						trigger: '#pricing',
						start: 'top 80%',
						toggleActions: 'play none none none'
					}
				});

				// Clear existing props
				gsap.set([badgeElement, mainTitle, subTitle, descElement], {
					clearProps: 'all',
					opacity: 0
				});

				if (isAr) {
					// Arabic Reveal Logic (ClipPath - No SplitText to avoid character breaking)
					gsap.set([mainTitle, subTitle, descElement], {
						opacity: 1,
						clipPath: 'inset(0 0 0 100%)'
					});
					gsap.set(badgeElement, { y: 20 });

					tl.to(badgeElement, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })
						.to(
							mainTitle,
							{ clipPath: 'inset(0 0 0 0%)', duration: 1.2, ease: 'power2.inOut' },
							'-=0.3'
						)
						.to(
							subTitle,
							{ clipPath: 'inset(0 0 0 0%)', duration: 1.2, ease: 'power2.inOut' },
							'-=1.0'
						)
						.to(
							descElement,
							{ clipPath: 'inset(0 0 0 0%)', duration: 1, ease: 'power2.inOut' },
							'-=0.8'
						);
				} else {
					// English Character Logic (SplitType)
					gsap.set([mainTitle, subTitle, descElement], { opacity: 1 });
					gsap.set(badgeElement, { y: 20, opacity: 0 });

					if (mainTitle && subTitle && descElement) {
						const mainSplit = new SplitType(mainTitle, { types: 'chars,words' });
						const subSplit = new SplitType(subTitle, { types: 'chars,words' });
						const descSplit = new SplitType(descElement, { types: 'chars' });

						tl.to(badgeElement, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })
							.from(
								mainSplit.chars,
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
								subSplit.chars,
								{
									opacity: 0,
									y: 20,
									stagger: 0.02,
									duration: 0.6,
									ease: 'power3.out'
								},
								'-=0.5'
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
			}

			// Cards Staggered Animation
			const cards = document.querySelectorAll('.pricing-card-wrapper');
			gsap.set(cards, { opacity: 0, y: 50 });

			ScrollTrigger.batch(cards, {
				start: 'top bottom-=100',
				onEnter: (batch) => {
					gsap.to(batch, {
						opacity: 1,
						y: 0,
						stagger: 0.15,
						duration: 0.8,
						ease: 'power3.out',
						overwrite: true
					});
				}
			});

			// Interactive Card Effects (Mouse Move)
			const interactiveCards = document.querySelectorAll('.interactive-card');
			interactiveCards.forEach((card) => {
				const glow = card.querySelector('.card-glow') as HTMLElement;
				if (!glow) return;

				const xTo = gsap.quickTo(card, 'x', { duration: 0.6, ease: 'power2.out' });
				const yTo = gsap.quickTo(card, 'y', { duration: 0.6, ease: 'power2.out' });
				const rotateX = gsap.quickTo(card, 'rotateX', { duration: 0.6, ease: 'power2.out' });
				const rotateY = gsap.quickTo(card, 'rotateY', { duration: 0.6, ease: 'power2.out' });
				const glowXTo = gsap.quickTo(glow, 'x', { duration: 0.4, ease: 'power2.out' });
				const glowYTo = gsap.quickTo(glow, 'y', { duration: 0.4, ease: 'power2.out' });

				let rect = card.getBoundingClientRect();

				const onMouseEnter = () => {
					if (theme.current === 'light') return;
					rect = card.getBoundingClientRect();
					gsap.to(glow, { opacity: 1, duration: 0.4 });
				};

				const onMouseMove = (e: any) => {
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
				};

				const onMouseLeave = () => {
					xTo(0);
					yTo(0);
					rotateX(0);
					rotateY(0);
					gsap.to(glow, { opacity: 0, duration: 0.6 });
				};

				card.addEventListener('mouseenter', onMouseEnter);
				card.addEventListener('mousemove', onMouseMove);
				card.addEventListener('mouseleave', onMouseLeave);

				// Cleanup function for this card's listeners
				(card as any)._cleanup = () => {
					card.removeEventListener('mouseenter', onMouseEnter);
					card.removeEventListener('mousemove', onMouseMove);
					card.removeEventListener('mouseleave', onMouseLeave);
				};
			});
		});

		return () => {
			ctx.revert();
			const interactiveCards = document.querySelectorAll('.interactive-card');
			interactiveCards.forEach((card: any) => {
				if (card._cleanup) card._cleanup();
			});
		};
	});

	const lang = $derived(data?.lang as 'ar' | 'en');
	const isAr = $derived(lang === 'ar');

	let selectedPackage = $state<string | null>(null);
	let selectedAddons = $state<string[]>([]);

	const packages = $derived(
		PACKAGES.map((pkg) => {
			const salePrice = pkg.originalPrice * (1 - pkg.salePercent / 100);
			const currency = pricing.currency;
			const isSelected = selectedPackage === pkg.id;
			const isPopular = pkg.id === 'corporate' || pkg.id === 'animated';

			return {
				id: pkg.id,
				name: pkg.name[lang],
				subtitle: pkg.description[lang],
				price: pricing.display(salePrice),
				originalPrice: pricing.display(pkg.originalPrice),
				duration: pricing.currencyConfig.symbol,
				popular: isSelected && isPopular,
				isSelected: isSelected,
				badge: `${pkg.salePercent}% OFF`,
				description: pkg.description[lang],
				features: pkg.features[lang],
				notIncluded: [],
				deliveryTime:
					pkg.id === 'one-page' ? '5-7 Days' : pkg.id === 'corporate' ? '10-14 Days' : '14-21 Days',
				cta: isAr ? 'اطلب الآن' : 'Order Now',
				allowAddons: pkg.allowAddons,
				salePriceRaw: pricing.convert(salePrice)
			};
		})
	);

	function togglePackage(packageId: string) {
		const pkg = PACKAGES.find((p) => p.id === packageId);
		if (!pkg?.allowAddons) {
			selectedPackage = selectedPackage === packageId ? null : packageId;
			selectedAddons = [];
			return;
		}

		if (selectedPackage === packageId) {
			selectedPackage = null;
			selectedAddons = [];
		} else {
			selectedPackage = packageId;
			selectedAddons = [];
		}
	}

	function toggleAddon(addonId: string) {
		if (!selectedPackage) return;

		const addon = ADDONS.find((a) => a.id === addonId);
		if (!addon || !addon.allowedPackages.includes(selectedPackage)) return;

		if (selectedAddons.includes(addonId)) {
			selectedAddons = selectedAddons.filter((id) => id !== addonId);
		} else {
			selectedAddons = [...selectedAddons, addonId];
		}
	}

	function isAddonDisabled(addon: (typeof ADDONS)[0]): boolean {
		if (!selectedPackage) return true;
		return !addon.allowedPackages.includes(selectedPackage);
	}

	function calculateTotal(): number {
		if (!selectedPackage) return 0;

		const pkg = PACKAGES.find((p) => p.id === selectedPackage);
		if (!pkg) return 0;

		const pkgPrice = pkg.originalPrice * (1 - pkg.salePercent / 100);

		const addonsTotal = selectedAddons.reduce((total: number, addonId: string) => {
			const addon = ADDONS.find((a) => a.id === addonId);
			return total + (addon?.price || 0);
		}, 0);

		return pricing.convert(pkgPrice + addonsTotal);
	}

	function getAddonPrice(price: number): string {
		return pricing.display(price);
	}

	const WHATSAPP_NUMBER = '966576704683';

	function generateWhatsAppMessage(): string {
		if (!selectedPackage) return '';

		const pkg = PACKAGES.find((p) => p.id === selectedPackage);
		if (!pkg) return '';

		const pkgSalePrice = pkg.originalPrice * (1 - pkg.salePercent / 100);
		const pkgPriceDisplay = pricing.display(pkgSalePrice);

		let message = isAr
			? `مرحباً، أريد طلب الباقة التالية:\n\n`
			: `Hello, I would like to order the following package:\n\n`;

		// Package details
		message += isAr ? `📦 الباقة:\n` : `📦 Package:\n`;
		message += `• ${pkg.name[lang]} - ${pkgPriceDisplay}\n`;
		message += isAr ? `  (السعر بعد الخصم)\n` : `  (Price after discount)\n\n`;

		// Add-ons
		if (selectedAddons.length > 0) {
			message += isAr ? `➕ الإضافات:\n` : `➕ Add-ons:\n`;
			selectedAddons.forEach((addonId) => {
				const addon = ADDONS.find((a) => a.id === addonId);
				if (addon) {
					message += `• ${addon.name[lang]} - ${pricing.display(addon.price)}\n`;
				}
			});
			message += '\n';
		}

		// Total
		message += isAr
			? `💰 الإجمالي: ${formatPrice(calculateTotal(), pricing.currency)}`
			: `💰 Total: ${formatPrice(calculateTotal(), pricing.currency)}`;

		// Language indicator
		message += isAr ? `\n\n🌐 اللغة: العربية` : `\n\n🌐 Language: English`;

		return encodeURIComponent(message);
	}

	function getWhatsAppLink(): string {
		const message = generateWhatsAppMessage();
		return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
	}

	function generatePackageWhatsAppMessage(pkgId: string): string {
		const pkg = PACKAGES.find((p) => p.id === pkgId);
		if (!pkg) return '';

		const pkgSalePrice = pkg.originalPrice * (1 - pkg.salePercent / 100);
		const pkgPriceDisplay = pricing.display(pkgSalePrice);

		let message = isAr
			? `مرحباً، أريد الاستفسار عن الباقة التالية:\n\n`
			: `Hello, I would like to inquire about the following package:\n\n`;

		message += isAr ? `📦 الباقة:\n` : `📦 Package:\n`;
		message += `• ${pkg.name[lang]} - ${pkgPriceDisplay}\n`;
		message += isAr ? `  (السعر بعد خصم 50%)\n` : `  (Price after 50% discount)\n\n`;

		// Features
		message += isAr ? `✨ مميزات الباقة:\n` : `✨ Package Features:\n`;
		pkg.features[lang].forEach((f: string) => {
			message += `• ${f}\n`;
		});

		if (pkg.allowAddons) {
			message += isAr
				? `\n➕ يمكن إضافة: متجر إلكتروني، نظام حجوزات، كتالوج منتجات`
				: `\n➕ Can add: E-commerce, Reservation System, Product Catalog`;
		}

		message += isAr ? `\n\n🌐 اللغة: العربية` : `\n\n🌐 Language: English`;

		return encodeURIComponent(message);
	}

	function getPackageWhatsAppLink(pkgId: string): string {
		const message = generatePackageWhatsAppMessage(pkgId);
		return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
	}
</script>

<section
	id="pricing"
	class="relative overflow-hidden bg-[var(--color-background)] py-32 transition-colors duration-1000"
	dir={data?.lang === 'ar' ? 'rtl' : 'ltr'}
>
	<!-- Unified Spotlight - Radial gradient replaces blur for better performance -->
	<div class="pointer-events-none absolute inset-0 z-0 opacity-20">
		<div
			class="absolute top-1/2 left-1/2 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-1000"
			style="background: radial-gradient(circle, {currentTheme === 'dark'
				? 'var(--color-brand-orange)'
				: 'var(--color-brand-orange)'} 0%, {currentTheme === 'dark'
				? 'rgba(251, 98, 32, 0.08)'
				: 'rgba(251, 98, 32, 0.03)'} 40%, transparent 70%); opacity: {currentTheme === 'dark'
				? 0.1
				: 0.05};"
		></div>
	</div>

	<div class="relative z-10 container mx-auto px-6">
		<!-- Loading State -->
		{#if pricing.isLoading}
			<div class="flex min-h-[50vh] items-center justify-center">
				<div class="text-center">
					<div
						class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-brand-blue border-t-transparent"
					></div>
					<p class="text-lg text-[var(--color-text-muted)]">
						{isAr ? 'جاري تحديد السعر...' : 'Detecting location for accurate pricing...'}
					</p>
				</div>
			</div>
		{:else}
			<!-- Section Header -->
			<div class="mx-auto mb-24 flex max-w-3xl flex-col items-center space-y-8 text-center">
				<div
					class="section-badge cinematic-glass inline-flex items-center gap-3 rounded-full border border-[var(--glass-border)] px-6 py-2 text-xs font-black tracking-widest text-brand-orange uppercase"
				>
					<Sparkles class="h-4 w-4" />
					<span>{isAr ? 'باقات حصرية' : 'Exclusive Packages'}</span>
					<span class="text-[10px] opacity-60">
						({pricing.currency === 'sar' ? 'SAR' : 'USD'})
					</span>
				</div>

				{#key data?.lang}
					<h2
						class="section-title text-4xl leading-tight font-black tracking-tight text-brand-orange md:text-5xl"
						dir={isAr ? 'rtl' : 'ltr'}
					>
						<span class="pricing-title-main inline-block">
							{isAr ? 'اختر الباقة المناسبة' : 'Choose the Right Package'}
						</span>
						<br />
						<span class="pricing-title-sub inline-block text-[var(--color-text-base)]">
							{isAr ? 'لنمو أعمالك' : 'for Your Business Growth'}
						</span>
					</h2>
				{/key}

				{#key data?.lang}
					<p
						class="section-description text-lg leading-relaxed font-medium text-[var(--color-text-muted)] md:text-xl"
						dir={isAr ? 'rtl' : 'ltr'}
					>
						{isAr
							? `باقات مصممة خصيصاً لتلبية احتياجات شركتك. احصل على خصم 50% الآن!`
							: `Packages specially designed for your business. Get 50% OFF now!`}
					</p>
				{/key}
			</div>

			<!-- Hint for Add-ons -->
			<div class="mb-8 text-center">
				<p class="text-sm text-[var(--color-text-muted)]">
					{isAr
						? '💡 اختر الباقة الثانية أو الثالثة لإضافة الإضافات (متجر إلكتروني - نظام حجوزات - كتالوج منتجات)'
						: '💡 Select Package 2 or 3 to add extras (E-commerce - Reservation System - Product Catalog)'}
				</p>
			</div>

			<!-- Pricing Cards -->
			<div class="mx-auto grid max-w-6xl items-start gap-8 md:grid-cols-3">
				{#each packages as pkg}
					<!-- Card Wrapper for Scale/Layout Transforms -->
					<div
						class="pricing-card-wrapper relative transition-transform duration-500 {pkg.isSelected
							? 'z-10 scale-105'
							: ''} hover:-translate-y-2 {selectedPackage === pkg.id ? 'selected' : ''}"
						onclick={() => togglePackage(pkg.id)}
						role="radio"
						tabindex="0"
						aria-checked={pkg.isSelected}
						onkeydown={(e) => e.key === 'Enter' && togglePackage(pkg.id)}
					>
						<!-- Inner Card for 3D/Interactive Transforms -->
						<div
							class="interactive-card cinematic-glass group relative flex h-full flex-col overflow-hidden rounded-[2.5rem] bg-[var(--color-surface)] transition-all duration-500
                        {pkg.isSelected && pkg.allowAddons
								? 'border-2 !border-brand-orange !shadow-[0_0_40px_rgba(251,98,32,0.2)] ring-1 ring-brand-orange hover:!border-brand-orange hover:!shadow-[0_0_40px_rgba(251,98,32,0.2)]'
								: 'border border-brand-blue/50 shadow-[0_0_30px_rgba(0,153,255,0.05)] group-[.active-card]:!border-brand-orange group-[.active-card]:!shadow-[0_20px_40px_rgba(251,98,32,0.15)] hover:!border-brand-orange hover:!shadow-[0_20px_40px_rgba(251,98,32,0.15)]'}"
						>
							<!-- Radio Button on Left -->
							{#if pkg.allowAddons}
								<div class="absolute top-6 left-6 z-20 flex items-center gap-3">
									<div
										class="group relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 transition-all duration-300 {pkg.isSelected
											? 'border-brand-orange bg-brand-orange shadow-[0_0_25px_rgba(251,98,32,0.6)]'
											: 'border-[var(--glass-border)] hover:border-brand-orange/70 hover:shadow-[0_0_15px_rgba(251,98,32,0.3)]'}"
									>
										{#if pkg.isSelected}
											<svg
												class="animate-scale-in h-5 w-5 text-white"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="3"
													d="M5 13l4 4L19 7"
												/>
											</svg>
										{/if}
									</div>
									<span
										class="text-xs font-bold {pkg.isSelected
											? 'text-brand-orange'
											: 'text-[var(--color-text-muted)]'}"
									>
										{pkg.isSelected ? (isAr ? 'محدد' : 'Selected') : isAr ? 'اختر' : 'Select'}
									</span>
								</div>
							{/if}
							<!-- Dynamic Spotlight Glow -->
							<div
								class="card-glow pointer-events-none absolute h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-[.active-card]:opacity-100 group-[.in-view]:opacity-100"
								style="left: 0; top: 0; background: radial-gradient(circle, {currentTheme === 'dark'
									? 'rgba(251, 98, 32, 0.15)'
									: 'transparent'} 0%, {currentTheme === 'dark'
									? 'rgba(251, 98, 32, 0.05)'
									: 'transparent'} 50%, transparent 80%);"
							></div>

							{#if pkg.isSelected && pkg.allowAddons}
								<div class="absolute top-6 right-6 z-20">
									<div
										class="inline-flex animate-pulse items-center gap-2 rounded-full bg-brand-orange px-4 py-1.5 text-[10px] font-black tracking-widest text-white uppercase shadow-xl shadow-brand-orange/20"
									>
										<Star class="h-3 w-3" />
										{isAr ? 'الأكثر طلباً' : 'Most Popular'}
									</div>
								</div>
							{:else if pkg.badge}
								<div class="absolute top-6 right-6 z-20">
									<div
										class="inline-flex items-center gap-2 rounded-full bg-brand-blue px-4 py-1.5 text-[10px] font-black tracking-widest text-white uppercase shadow-xl shadow-brand-blue/20 transition-colors duration-500 group-hover:bg-brand-orange group-hover:shadow-brand-orange/20 group-[.active-card]:bg-brand-orange group-[.active-card]:shadow-brand-orange/20"
									>
										<Star class="h-3 w-3" />
										{pkg.badge}
									</div>
								</div>
							{/if}

							<!-- Package Header -->
							<div class="relative z-10 p-10 pb-6">
								<h3
									class="mb-2 text-2xl font-black text-[var(--color-text-base)] transition-colors duration-500 group-hover:text-brand-orange group-[.active-card]:text-brand-orange"
								>
									{pkg.name}
								</h3>

								<!-- Bottom Accent Line -->
								<div
									class="absolute bottom-0 left-0 h-[3px] w-0 bg-brand-orange/30 shadow-[0_0_20px_rgba(251,98,32,0.3)] transition-all duration-1000
							{pkg.popular ? 'w-full' : 'group-hover:w-full group-[.active-card]:w-full'}"
								></div>

								<p
									class="mb-8 text-sm font-bold tracking-widest text-[var(--color-text-muted)] uppercase opacity-60"
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
											<span
												class="text-[10px] font-black tracking-widest text-brand-blue uppercase transition-colors duration-500 group-hover:text-brand-orange group-[.active-card]:text-brand-orange"
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
									<p class="text-sm leading-relaxed font-medium text-[var(--color-text-muted)]">
										{pkg.description}
									</p>
								</div>

								<!-- Delivery Time -->
								<div
									class="inline-flex items-center gap-3 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-highlight)] px-5 py-2 text-[10px] font-black tracking-widest text-[var(--color-text-muted)] uppercase transition-all duration-500 group-hover:border-brand-orange/20 group-hover:bg-brand-orange/5 group-[.active-card]:border-brand-orange/20 group-[.active-card]:bg-brand-orange/5"
								>
									<Zap
										class="h-3.5 w-3.5 text-brand-blue transition-colors duration-500 group-hover:text-brand-orange group-[.active-card]:text-brand-orange"
									/>
									<span
										>{data?.lang === 'ar' ? 'التسليم خلال' : 'Delivery within'}
										{pkg.deliveryTime}</span
									>
								</div>
							</div>

							<!-- Features List -->
							<div class="relative z-10 flex flex-grow flex-col px-10 pb-10">
								<div class="mb-8 h-px w-full bg-[var(--glass-border)]"></div>

								<ul class="mb-10 flex-grow space-y-4">
									{#each pkg.features as feature}
										<li
											class="flex items-center gap-4 text-sm font-medium text-[var(--color-text-muted)] transition-colors group-hover:text-[var(--color-text-base)] group-[.active-card]:text-[var(--color-text-base)]"
										>
											<div
												class="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-brand-blue/20 bg-brand-blue/10 transition-colors duration-500 group-hover:border-brand-orange/20 group-hover:bg-brand-orange/10 group-[.active-card]:border-brand-orange/20 group-[.active-card]:bg-brand-orange/10"
											>
												<Check
													class="h-3 w-3 text-brand-blue transition-colors duration-500 group-hover:text-brand-orange group-[.active-card]:text-brand-orange"
												/>
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
									href={getPackageWhatsAppLink(pkg.id)}
									target="_blank"
									rel="noopener noreferrer"
									class="cinematic-glass flex w-full items-center justify-center gap-3 rounded-2xl border border-[var(--glass-border)] px-6 py-5 text-sm font-black tracking-[0.2em] text-[var(--color-text-base)]
                             uppercase shadow-2xl transition-all duration-500
                             group-[.active-card]:-translate-y-1 group-[.active-card]:border-brand-orange/40 group-[.active-card]:bg-brand-orange/5 group-[.active-card]:text-brand-orange group-[.active-card]:shadow-brand-orange/20
                             hover:-translate-y-1 hover:border-brand-orange/40 hover:bg-brand-orange/5 hover:text-brand-orange hover:shadow-brand-orange/20
                             {pkg.popular ? 'border-brand-blue/20 shadow-brand-blue/5' : ''}"
								>
									<span>{pkg.cta}</span>
									<ArrowRight class="h-5 w-5" />
								</a>
							</div>
						</div>
					</div>
				{/each}
			</div>

			<!-- Add-ons Section -->
			{#if selectedPackage}
				{@const selectedPkg = PACKAGES.find((p) => p.id === selectedPackage)}
				{#if selectedPkg?.allowAddons}
					<div class="mt-16">
						<h3 class="mb-8 text-center text-2xl font-black text-[var(--color-text-base)]">
							{isAr ? 'الإضافات' : 'Add-ons'}
							<span class="text-sm font-normal text-[var(--color-text-muted)]">
								({isAr ? 'اختياري' : 'Optional'})
							</span>
						</h3>

						<div class="grid gap-6 md:grid-cols-3">
							{#each ADDONS as addon}
								{@const isAddonSelected = selectedAddons.includes(addon.id)}
								{@const isDisabled = isAddonDisabled(addon)}

								<div
									class="addon-card relative cursor-pointer rounded-[2rem] border p-6 transition-all duration-300"
									class:selected={isAddonSelected}
									class:opacity-50={isDisabled}
									class:cursor-not-allowed={isDisabled}
									onclick={() => !isDisabled && toggleAddon(addon.id)}
									role="checkbox"
									aria-checked={isAddonSelected}
									tabindex={isDisabled ? -1 : 0}
									onkeydown={(e) => e.key === 'Enter' && !isDisabled && toggleAddon(addon.id)}
								>
									<div class="flex items-start justify-between">
										<div>
											<h4 class="mb-1 text-lg font-black text-[var(--color-text-base)]">
												{addon.name[lang]}
											</h4>
											<p class="mb-3 text-sm text-[var(--color-text-muted)]">
												{addon.description[lang]}
											</p>
										</div>

										<div class="text-right">
											<p class="text-xl font-black text-brand-orange">
												+{getAddonPrice(addon.price)}
											</p>
										</div>
									</div>

									<ul class="mt-4 space-y-2">
										{#each addon.features[lang].slice(0, 3) as feature}
											<li class="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
												<svg
													class="h-4 w-4 text-brand-blue"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M5 13l4 4L19 7"
													/>
												</svg>
												{feature}
											</li>
										{/each}
									</ul>

									<!-- Checkbox indicator -->
									<div
										class="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all"
										class:border-brand-blue={isAddonSelected}
										class:bg-brand-blue={isAddonSelected}
									>
										{#if isAddonSelected}
											<svg
												class="h-4 w-4 text-white"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M5 13l4 4L19 7"
												/>
											</svg>
										{/if}
									</div>
								</div>
							{/each}
						</div>

						<!-- Total & CTA -->
						<div class="mt-12 text-center">
							<div
								class="mb-6 inline-block rounded-[2rem] border border-[var(--glass-border)] bg-[var(--glass-bg)] px-8 py-4"
							>
								<p class="text-sm text-[var(--color-text-muted)]">
									{isAr ? 'السعر الإجمالي' : 'Total Price'}
								</p>
								<p class="text-3xl font-black text-brand-blue">
									{formatPrice(calculateTotal(), pricing.currency)}
								</p>
							</div>

							<div>
								<a
									href={getWhatsAppLink()}
									target="_blank"
									rel="noopener noreferrer"
									class="btn-primary inline-flex"
								>
									<span class="flex items-center gap-3">
										{isAr ? 'اطلب الآن' : 'Order Now'}
										<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M17 8l4 4m0 0l-4 4m4-4H3"
											/>
										</svg>
									</span>
								</a>
							</div>
						</div>
					</div>
				{/if}
			{/if}
		{/if}
	</div>
</section>

<style>
	@keyframes scaleIn {
		0% {
			transform: scale(0);
			opacity: 0;
		}
		50% {
			transform: scale(1.2);
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}

	.animate-scale-in {
		animation: scaleIn 0.3s ease-out forwards;
	}
</style>
