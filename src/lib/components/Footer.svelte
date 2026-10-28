<script lang="ts">
	import { inView } from '$lib/actions/inView';
	import { Phone, ArrowUpRight, Globe, Smartphone, ShoppingBag } from '@lucide/svelte';
	import type { Site } from '$lib/types';
	import { theme } from '$lib/stores/theme.svelte';
	import { base } from '$app/paths';

	let { data }: { data: { site: Site; lang: 'en' | 'ar' } } = $props();

	const logoSrc = `${base}/images/blue-logo.webp`;
	const year = new Date().getFullYear();
	const currentTheme = $derived(theme.current);

	const logoWidth = 150;
	const logoHeight = (logoWidth * 334) / 1139; // ~44px
</script>

<footer
	class="relative mt-20 overflow-hidden py-20 transition-colors duration-1000"
	dir={data.lang === 'ar' ? 'rtl' : 'ltr'}
>
	<!-- Background Glows - Radial gradients replace blur -->
	<div
		class="absolute -top-24 -left-24 h-96 w-96 rounded-full transition-colors duration-1000"
		style="background: radial-gradient(circle, {currentTheme === 'dark'
			? 'rgba(11, 157, 217, 0.15)'
			: 'rgba(11, 157, 217, 0.08)'} 0%, {currentTheme === 'dark'
			? 'rgba(11, 157, 217, 0.05)'
			: 'rgba(11, 157, 217, 0.02)'} 40%, transparent 70%);"
	></div>
	<div
		class="absolute -right-24 -bottom-24 h-96 w-96 rounded-full transition-colors duration-1000"
		style="background: radial-gradient(circle, {currentTheme === 'dark'
			? 'rgba(11, 157, 217, 0.15)'
			: 'rgba(11, 157, 217, 0.08)'} 0%, {currentTheme === 'dark'
			? 'rgba(11, 157, 217, 0.05)'
			: 'rgba(11, 157, 217, 0.02)'} 40%, transparent 70%);"
	></div>

	<div class="relative z-10 container mx-auto px-6">
		<div class="grid grid-cols-1 gap-16 lg:grid-cols-12">
			<!-- Brand Section -->
			<div class="lg:col-span-5">
				<div class="logo-container relative mb-8 w-[150px]" style="height: {logoHeight}px">
					<img src={logoSrc} alt="Bosla Logo" class="h-full w-full object-contain" />
				</div>
				<p
					class="mb-10 max-w-md text-base leading-relaxed font-medium text-[var(--color-text-muted)] md:text-lg"
				>
					{data.site?.description}
				</p>

				<div class="space-y-6">
					<a
						href="https://wa.me/966576944605?text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%D8%8C%20%D8%A3%D8%A8%D8%BA%D9%89%20%D8%A3%D8%B3%D8%AA%D9%81%D8%B3%D8%B1%20%D8%B9%D9%86%20%D8%B9%D8%B1%D8%B6%20%D8%A7%D9%84%D8%A5%D8%B7%D9%84%D8%A7%D9%82"
						target="_blank"
						rel="noopener noreferrer"
						use:inView
						class="group flex items-center gap-4 text-[var(--color-text-base)] transition-colors hover:text-brand-blue [&.in-view]:text-brand-blue"
					>
						<div
							use:inView
							class="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--glass-highlight)] transition-transform group-hover:scale-110 group-hover:border-brand-blue/30 group-hover:bg-brand-blue/5 group-[.in-view]:scale-110 group-[.in-view]:border-brand-blue/30 group-[.in-view]:bg-brand-blue/5"
						>
							<Phone class="h-5 w-5" />
						</div>
						<div>
							<div
								class="text-[10px] font-black tracking-widest text-[var(--color-text-dim)] uppercase"
							>
								{data.lang === 'ar' ? 'اتصل بنا' : 'Call Us'}
							</div>
							<div class="text-lg font-bold tracking-tight text-[var(--color-text-base)]">
								<span dir="ltr">+966 57 694 4605</span>
							</div>
						</div>
					</a>
				</div>
			</div>

			<!-- Links & Services -->
			<div class="lg:col-span-7">
				<div class="grid grid-cols-1 gap-12 sm:grid-cols-2">
					<!-- Navigation -->
					<div>
						<h4
							class="mb-8 text-[10px] font-black tracking-[0.2em] text-[var(--color-text-dim)] uppercase"
						>
							{data.lang === 'ar' ? 'التنقل' : 'Navigation'}
						</h4>
						<nav class="flex flex-col gap-4">
							{#each [
									{ label: data.site?.nav?.home ?? 'Home', href: `${base}/` },
									{ label: data.lang === 'ar' ? 'المتاجر الإلكترونية' : 'Online Stores', href: `${base}/stores` },
									{ label: data.lang === 'ar' ? 'الباقات' : 'Pricing', href: `${base}/#pricing` },
									{ label: data.site?.nav?.about ?? 'About', href: `${base}/about` },
									{ label: data.lang === 'ar' ? 'تواصل معنا' : 'Contact', href: `${base}/contact` }
								] as link}
								<a
									href={link.href}
									use:inView
									class="group flex items-center justify-between text-lg font-bold text-[var(--color-text-muted)] transition-colors hover:text-brand-blue [&.in-view]:text-brand-blue"
								>
									{link.label}
									<div
										class:rotate-180={data.lang === 'ar'}
										use:inView
										class="translate-x-1 -translate-y-1 opacity-0 transition-[transform,opacity] group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 group-[.in-view]:translate-x-0 group-[.in-view]:translate-y-0 group-[.in-view]:opacity-100"
									>
										<ArrowUpRight class="h-5 w-5" />
									</div>
								</a>
							{/each}
						</nav>

						<a
							href="https://demo.boslatech.com"
							target="_blank"
							rel="noopener noreferrer"
							class="mt-6 inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-orange/10 px-4 py-2 text-xs font-black text-brand-orange transition-colors hover:bg-brand-orange/20"
						>
							<span class="relative flex h-2 w-2">
								<span
									class="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-orange opacity-75"
								></span>
								<span class="relative inline-flex h-2 w-2 rounded-full bg-brand-orange"></span>
							</span>
							{data.lang === 'ar' ? 'جرّب المتجر التجريبي' : 'Try the Demo Store'}
							<ArrowUpRight class="h-4 w-4" />
						</a>
					</div>

					<!-- Services Mini Grid -->
					<div>
						<h4
							class="mb-8 text-[10px] font-black tracking-[0.2em] text-[var(--color-text-dim)] uppercase"
						>
							{data.lang === 'ar' ? 'خبراتنا' : 'Expertise'}
						</h4>
						<div class="grid gap-4">
							{#each [
									{ label: data.lang === 'ar' ? 'مواقع شركات' : 'Corporate Websites', icon: Globe, href: `${base}/services/web-development/custom-websites` },
									{ label: data.lang === 'ar' ? 'متاجر إلكترونية' : 'Online Stores', icon: ShoppingBag, href: `${base}/stores` },
									{ label: data.lang === 'ar' ? 'تحسين محركات البحث' : 'SEO Services', icon: Smartphone, href: `${base}/services/seo` }
								] as service}
								<a
									href={service.href}
									use:inView
									class="obsidian-card group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-[var(--glass-border)] p-4 transition-[border-color] hover:border-brand-blue/30 [&.in-view]:border-brand-blue/30"
								>
									<!-- Bottom Accent Line -->
									<div
										use:inView
										class="absolute bottom-0 left-0 h-[2px] w-0 bg-brand-blue/30 shadow-[0_0_15px_rgba(0,119,255,0.2)] transition-[width] duration-700 group-hover:w-full group-[.in-view]:w-full"
									></div>

									<div
										use:inView
										class="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--glass-border)] bg-[var(--glass-highlight)] transition-[border-color] group-hover:border-brand-blue/20 group-[.in-view]:border-brand-blue/20"
									>
										<service.icon
											class="h-5 w-5 text-brand-blue transition-[transform,color] group-hover:scale-110 group-hover:text-brand-blue-glow group-[.in-view]:scale-110 group-[.in-view]:text-brand-blue-glow"
										/>
									</div>
									<span
										class="font-bold text-[var(--color-text-muted)] transition-colors group-hover:text-[var(--color-text-base)] group-[.in-view]:text-[var(--color-text-base)]"
										>{service.label}</span
									>
								</a>
							{/each}
						</div>
					</div>
				</div>

				<!-- CTA Box -->
				<div
					use:inView
					class="obsidian-card group relative mt-12 overflow-hidden rounded-[2.5rem] border border-brand-blue/20 p-8 md:p-12"
				>
					<div
						use:inView
						class="absolute inset-0 bg-gradient-to-br from-brand-blue/10 via-transparent to-transparent opacity-0 transition-opacity duration-1000 group-hover:opacity-100 group-[.in-view]:opacity-100"
					></div>
					<div
						use:inView
						class="absolute -top-20 -right-20 h-80 w-80 rounded-full opacity-0 transition-opacity duration-1000 group-hover:opacity-100 group-[.in-view]:opacity-100"
						style="background: radial-gradient(circle, rgba(0, 119, 255, 0.25) 0%, rgba(0, 119, 255, 0.08) 40%, transparent 70%);"
					></div>

					<div class="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row">
						<div
							class:text-right={data.lang === 'ar'}
							class:text-left={data.lang !== 'ar'}
							class="max-w-md"
						>
						<h3
							class="mb-4 text-3xl leading-tight font-black tracking-tight text-[var(--color-text-base)] md:text-4xl"
						>
							{data.lang === 'ar' ? 'جاهز تطلق موقعك؟' : 'Ready to launch?'}
						</h3>
						<p class="text-lg leading-relaxed font-medium text-[var(--color-text-muted)]">
							{data.lang === 'ar'
								? 'ابدأ من واتساب اليوم.'
								: 'Start with a WhatsApp message today.'}
						</p>
					</div>
					<a
						href="https://wa.me/966576944605?text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%D8%8C%20%D8%A3%D8%A8%D8%BA%D9%89%20%D8%A3%D8%B3%D8%AA%D9%81%D8%B3%D8%B1%20%D8%B9%D9%86%20%D8%B9%D8%B1%D8%B6%20%D8%A7%D9%84%D8%A5%D8%B7%D9%84%D8%A7%D9%82"
						target="_blank"
						rel="noopener noreferrer"
						use:inView
						class="group2 w-full rounded-2xl bg-brand-blue px-12 py-6 text-center text-sm font-black tracking-widest text-white uppercase shadow-[0_20px_50px_rgba(0,119,255,0.3)] transition-[transform,box-shadow] duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(0,119,255,0.5)] md:w-auto [&.in-view]:-translate-y-2 [&.in-view]:shadow-[0_25px_60px_rgba(0,119,255,0.5)]"
					>
						{data.lang === 'ar' ? 'كلمنا واتساب' : 'Chat on WhatsApp'}
					</a>
					</div>
				</div>
			</div>
		</div>

		<!-- Bottom Bar -->
		<div
			class="mt-20 flex flex-col items-center justify-between gap-6 border-t border-[var(--glass-border)] pt-10 text-base text-[var(--color-text-dim)] sm:flex-row"
		>
			<p>© {year} Bosla. {data.lang === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</p>
			<div class="text-center text-sm leading-relaxed opacity-70 sm:text-left">
				{data.site?.registeredAs} | س.ت {data.site?.commercialRegistration} | {data.site?.registeredAddress}
			</div>
			<div class="flex gap-8">
				<span class="opacity-50">{data.lang === 'ar' ? 'الخصوصية' : 'Privacy Policy'}</span>
				<span class="opacity-50">{data.lang === 'ar' ? 'الشروط' : 'Terms of Service'}</span>
			</div>
		</div>
	</div>
</footer>

<style>
	footer {
		/* Ensuring the cinematic feel */
		background: radial-gradient(circle at 50% -20%, var(--color-surface), var(--color-background));
		transition: background 1s ease;
	}
</style>
