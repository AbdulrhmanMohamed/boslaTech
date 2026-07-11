<script lang="ts">
	import { inView } from '$lib/actions/inView';
	import { Phone, ArrowUpRight, Globe, Smartphone, ShoppingBag } from '@lucide/svelte';
	import type { Site } from '$lib/types';
	import { theme } from '$lib/stores/theme.svelte';
	import { base } from '$app/paths';

	let { data }: { data: { site: Site; lang: 'en' | 'ar' } } = $props();

	const logoSrc = `${base}/images/blue-logo.png`;
	const year = new Date().getFullYear();
	const currentTheme = $derived(theme.current);

	const logoWidth = 150;
	const logoHeight = (logoWidth * 310) / 900; // ~51.6px
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
						href="https://wa.me/966576704683?text=%D9%83%D9%86%D8%AA%20%D8%B9%D8%A7%D9%8A%D8%B2%20%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%B1%20%D8%B9%D9%86%20%D8%AA%D9%81%D8%A7%D8%B5%D9%8A%D9%84%20%D8%AA%D8%B5%D9%85%D9%8A%D9%85%20%D8%A7%D9%84%D9%85%D9%88%D9%82%D8%B9"
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
								<span dir="ltr">+966 57 670 4683</span>
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
							{#each [{ label: data.site?.nav?.home ?? 'Home', href: `${base}/` }, { label: data.site?.nav?.about ?? 'About', href: `${base}/about` }, { label: data.lang === 'ar' ? 'تواصل معنا' : 'Contact', href: `${base}/contact` }] as link}
								<a
									href={link.href}
									use:inView
									class="group flex items-center justify-between text-lg font-bold text-[var(--color-text-muted)] transition-colors hover:text-brand-blue [&.in-view]:text-brand-blue"
								>
									{link.label}
									<div
										class:rotate-180={data.lang === 'ar'}
										use:inView
										class="translate-x-1 -translate-y-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 group-[.in-view]:translate-x-0 group-[.in-view]:translate-y-0 group-[.in-view]:opacity-100"
									>
										<ArrowUpRight class="h-5 w-5" />
									</div>
								</a>
							{/each}
						</nav>
					</div>

					<!-- Services Mini Grid -->
					<div>
						<h4
							class="mb-8 text-[10px] font-black tracking-[0.2em] text-[var(--color-text-dim)] uppercase"
						>
							{data.lang === 'ar' ? 'خبراتنا' : 'Expertise'}
						</h4>
						<div class="grid gap-4">
							{#each [{ label: data.lang === 'ar' ? 'تطوير المواقع' : 'Web Dev', icon: Globe }, { label: data.lang === 'ar' ? 'تطبيقات الجوال' : 'Mobile Apps', icon: Smartphone }, { label: data.lang === 'ar' ? 'التجارة الإلكترونية' : 'E-commerce', icon: ShoppingBag }] as service}
								<div
									use:inView
									class="obsidian-card group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-[var(--glass-border)] p-4 transition-all hover:border-brand-blue/30 [&.in-view]:border-brand-blue/30"
								>
									<!-- Bottom Accent Line -->
									<div
										use:inView
										class="absolute bottom-0 left-0 h-[2px] w-0 bg-brand-blue/30 shadow-[0_0_15px_rgba(0,119,255,0.2)] transition-all duration-700 group-hover:w-full group-[.in-view]:w-full"
									></div>

									<div
										use:inView
										class="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--glass-border)] bg-[var(--glass-highlight)] transition-all group-hover:border-brand-blue/20 group-[.in-view]:border-brand-blue/20"
									>
										<service.icon
											class="h-5 w-5 text-brand-blue transition-all group-hover:scale-110 group-hover:text-brand-blue-glow group-[.in-view]:scale-110 group-[.in-view]:text-brand-blue-glow"
										/>
									</div>
									<span
										class="font-bold text-[var(--color-text-muted)] transition-colors group-hover:text-[var(--color-text-base)] group-[.in-view]:text-[var(--color-text-base)]"
										>{service.label}</span
									>
								</div>
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
								{data.lang === 'ar' ? 'هل أنت مستعد للبدء؟' : 'Ready to start?'}
							</h3>
							<p class="text-lg leading-relaxed font-medium text-[var(--color-text-muted)]">
								{data.lang === 'ar'
									? 'دعنا نحول رؤيتك إلى واقع رقمي مذهل.'
									: 'Let’s turn your vision into a stunning digital reality.'}
							</p>
						</div>
						<a
							href={`${base}/contact`}
							use:inView
							class="w-full rounded-2xl bg-brand-blue px-12 py-6 text-center text-sm font-black tracking-widest text-white uppercase shadow-[0_20px_50px_rgba(0,119,255,0.3)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(0,119,255,0.5)] md:w-auto [&.in-view]:-translate-y-2 [&.in-view]:shadow-[0_25px_60px_rgba(0,119,255,0.5)]"
						>
							{data.lang === 'ar' ? 'ابدأ مشروعك' : 'Start Project'}
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
