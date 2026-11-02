<script lang="ts">
	import { theme } from '$lib/stores/theme.svelte';
	import DrawerNavigation from './DrawerNavigation.svelte';
	import ThemeToggle from './ThemeToggle.svelte';
	import { goto, invalidate, afterNavigate } from '$app/navigation';	import { page } from '$app/stores';
	import { clearLanguageCache } from '$lib/utils/language';
	import { base } from '$app/paths';
	import { inView } from '$lib/actions/inView';
	import { onMount } from 'svelte';
	import { ChevronDown, ChevronRight, ExternalLink } from '@lucide/svelte';

	const props = $props<{ site?: any; lang: 'en' | 'ar' }>();
	const site = $derived(props.site);
	const lang = $derived(props.lang);

	const logoSrc = `${base}/images/blue-logo.webp`;
	const logoWidth = 180;
	const logoHeight = (logoWidth * 334) / 1139;

	async function handleLanguageSwitch(next: 'en' | 'ar') {
		const url = new URL(window.location.href);
		url.searchParams.set('lang', next);
		clearLanguageCache();
		await goto(url.pathname + url.search, { replaceState: true, noScroll: true, keepFocus: true });
		await invalidate('app:language');
	}

	function hrefWithLang(next: 'en' | 'ar') {
		if (typeof window !== 'undefined' && $page?.url) {
			const p = $page.url.pathname;
			const q = new URLSearchParams($page.url.search);
			q.set('lang', next);
			return `${p}?${q.toString()}`;
		}
		return `/?lang=${next}`;
	}

	function link(path: string) {
		if (typeof window !== 'undefined' && $page?.url) {
			const q = new URLSearchParams($page.url.search);
			const qs = q.toString();
			if (path.includes('#')) {
				const [basePath, hash] = path.split('#');
				return qs ? `${basePath}?${qs}#${hash}` : path;
			}
			return qs ? `${path}?${qs}` : path;
		}
		return path;
	}

	const currentPage = $derived.by(() => $page?.url?.pathname || '/');
	const currentTheme = $derived(theme.current);

	let navRefs = $state<Record<string, HTMLElement>>({});
	let mounted = $state(false);
	onMount(() => {
		mounted = true;
	});
	let pillStyles = $state({ left: 0, width: 0, height: 0, opacity: 0 });
	let serviceMenuOpen = $state(false);
	let serviceMenuRef = $state<HTMLElement | null>(null);

	function toggleServiceMenu(e: Event) {
		e.preventDefault();
		serviceMenuOpen = !serviceMenuOpen;
	}

	afterNavigate(() => {
		serviceMenuOpen = false;
	});

	$effect(() => {
		if (!serviceMenuOpen) return;
		function handleClickOutside(e: MouseEvent) {
			const target = e.target as HTMLElement;
			if (serviceMenuRef && !serviceMenuRef.contains(target)) {
				serviceMenuOpen = false;
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	});

	function navLinkClass(path: string) {
		const active = isActive(path);
		return `relative inline-flex items-center gap-1 text-sm md:text-base px-6 py-2 rounded-full transition-colors duration-500 group overflow-hidden whitespace-nowrap z-10 ${
			active
				? 'bg-brand-blue text-white font-black scale-105'
				: 'text-[var(--color-text-muted)] hover:text-[var(--color-text-base)] group-[.in-view]:text-[var(--color-text-base)] font-bold hover:bg-[var(--glass-highlight)] group-[.in-view]:bg-[var(--glass-highlight)]'
		}`;
	}

	$effect(() => {
		const path = $page?.url?.pathname || '/';
		const items = navItems;
		const refs = navRefs;

		let activePath = '';
		for (const item of items) {
			const isExactMatch = path === item.path;
			const isPrefixMatch = path.startsWith(item.path) && item.path !== `${base}/`;
			if (isExactMatch || isPrefixMatch) {
				if (item.path.length > activePath.length) {
					activePath = item.path;
				}
			}
		}

		if (activePath && refs[activePath]) {
			const el = refs[activePath];
			const ul = el.closest('ul');
			if (ul && el) {
				const elRect = el.getBoundingClientRect();
				const ulRect = ul.getBoundingClientRect();
				pillStyles = {
					left: elRect.left - ulRect.left,
					width: elRect.width,
					height: elRect.height,
					opacity: 1
				};
			}
		} else {
			pillStyles = { left: 0, width: 0, height: 0, opacity: 0 };
		}
	});

	const navItems = $derived([
		{ path: `${base}/`, label: site?.nav?.home || (lang === 'ar' ? 'الرئيسية' : 'Home') },
		{
			path: `${base}/stores`,
			label: site?.nav?.stores || (lang === 'ar' ? 'المتاجر الإلكترونية' : 'Online Stores')
		},
		{ path: `${base}/#pricing`, label: site?.nav?.pricing || (lang === 'ar' ? 'الأسعار' : 'Pricing') },
		{ path: `${base}/about`, label: site?.nav?.about || (lang === 'ar' ? 'من نحن' : 'About') },
		{ path: `${base}/contact`, label: site?.nav?.contact || (lang === 'ar' ? 'تواصل معنا' : 'Contact') }
	]);

	const serviceCategories = $derived([
		{
			slug: 'web-development',
			name: lang === 'ar' ? 'تطوير المواقع' : 'Web Development',
			desc: lang === 'ar' ? 'مواقع متوافقة مع SEO وبوابات دفع سعودية' : 'SEO-ready sites with Saudi payment gateways',
			guide: `${base}/guides/web-development`,
			children: [
				{ slug: 'custom-websites', name: lang === 'ar' ? 'تصميم مواقع شركات' : 'Custom Websites', popular: true, topics: lang === 'ar' ? ['صفحات هبوط', 'مواقع شركات', 'مواقع معرض أعمال'] : ['Landing Pages', 'Corporate Sites', 'Portfolio Sites'] },
				{ slug: 'wordpress-development', name: lang === 'ar' ? 'تطوير ووردبريس' : 'WordPress', topics: lang === 'ar' ? ['WooCommerce', 'قوالب مخصصة', 'إضافات'] : ['WooCommerce', 'Custom Themes', 'Plugins'] },
				{ slug: 'online-stores', name: lang === 'ar' ? 'متاجر إلكترونية' : 'Online Stores', popular: true, topics: lang === 'ar' ? ['شوبيفاي', 'سلة', 'زد'] : ['Shopify', 'Salla', 'Zid'] },
				{ slug: 'website-redesign', name: lang === 'ar' ? 'إعادة تصميم المواقع' : 'Redesign & Migration', topics: lang === 'ar' ? ['ترحيل المنصة', 'تحسين الأداء'] : ['Platform Migration', 'Performance'] },
				{ slug: 'maintenance-and-support', name: lang === 'ar' ? 'الصيانة والدعم' : 'Maintenance & Support', topics: lang === 'ar' ? ['تحديثات الأمان', 'مراقبةوقت التشغيل'] : ['Security Updates', 'Uptime Monitoring'] }
			]
		},
		{
			slug: 'seo',
			name: lang === 'ar' ? 'تحسين محركات البحث' : 'SEO',
			desc: lang === 'ar' ? 'نضمن ظهورك في أول صفحة جوجل' : 'First page Google rankings',
			guide: `${base}/guides/seo`,
			children: [
				{ slug: 'seo-audit', name: lang === 'ar' ? 'تدقيق SEO' : 'SEO Audit', popular: true, topics: lang === 'ar' ? ['تدقيق تقني', 'تحليل المنافسين'] : ['Technical Audit', 'Competitor Analysis'] },
				{ slug: 'technical-seo', name: lang === 'ar' ? 'SEO التقني' : 'Technical SEO', topics: lang === 'ar' ? ['Core Web Vitals', 'بيانات Schema', 'السرعة'] : ['Core Web Vitals', 'Schema', 'Site Speed'] },
				{ slug: 'content-seo', name: lang === 'ar' ? 'SEO بالمحتوى' : 'Content SEO', topics: lang === 'ar' ? ['بحث الكلمات', 'استراتيجية المدونة'] : ['Keywords', 'Blog Strategy'] },
				{ slug: 'link-building', name: lang === 'ar' ? 'بناء الروابط' : 'Link Building', topics: lang === 'ar' ? ['التدوين الضيف', 'العلاقات العامة'] : ['Guest Posting', 'Digital PR'] },
				{ slug: 'local-seo', name: lang === 'ar' ? 'SEO المحلي' : 'Local SEO', popular: true, topics: lang === 'ar' ? ['Google Business Profile', 'الاقتباسات', 'صفحات المدن'] : ['GBP', 'Citations', 'City Pages'] },
				{ slug: 'ecommerce-seo', name: lang === 'ar' ? 'SEO المتاجر' : 'E-commerce SEO', topics: lang === 'ar' ? ['تحسين المنتجات', 'بيانات المراجعات'] : ['Product Pages', 'Review Schema'] }
			]
		},
		{
			slug: 'digital-marketing',
			name: lang === 'ar' ? 'التسويق الرقمي' : 'Digital Marketing',
			desc: lang === 'ar' ? 'حملات إعلانية على سناب وتيك توك وجوجل' : 'Snapchat, TikTok & Google ad campaigns',
			guide: `${base}/guides/digital-marketing`,
			children: [
				{ slug: 'google-ads', name: lang === 'ar' ? 'إعلانات جوجل' : 'Google Ads', popular: true, topics: lang === 'ar' ? ['إعلانات البحث', 'إعلانات العرض', 'إعلانات التسوق'] : ['Search Ads', 'Display Ads', 'Shopping Ads'] },
				{ slug: 'snapchat-tiktok-ads', name: lang === 'ar' ? 'سناب وتيك توك' : 'Snapchat & TikTok', topics: lang === 'ar' ? ['إنتاج الفيديو', 'استهداف الجمهور'] : ['Video Production', 'Audience Targeting'] },
				{ slug: 'social-media-marketing', name: lang === 'ar' ? 'وسائل التواصل' : 'Social Media', topics: lang === 'ar' ? ['إنستغرام', 'تويتر', 'سناب شات'] : ['Instagram', 'Twitter/X', 'Snapchat'] },
				{ slug: 'content-marketing', name: lang === 'ar' ? 'التسويق بالمحتوى' : 'Content Marketing', topics: lang === 'ar' ? ['كتابة المدونات', 'فيديوهات', 'إنفوجرافيك'] : ['Blog Writing', 'Video', 'Infographics'] },
				{ slug: 'email-marketing', name: lang === 'ar' ? 'البريد الإلكتروني' : 'Email Marketing', topics: lang === 'ar' ? ['تسلسلات الترحيب', 'الحملات الترويجية'] : ['Welcome Sequences', 'Promotions'] },
				{ slug: 'brand-identity', name: lang === 'ar' ? 'الهوية البصرية' : 'Brand Identity', topics: lang === 'ar' ? ['تصميم الشعار', 'نظام الألوان', 'الخطوط'] : ['Logo Design', 'Color System', 'Typography'] }
			]
		}
	]);

	const isActive = (path: string) => {
		const currentPath = $page?.url?.pathname || '/';
		if (path === `${base}/`) return currentPath === `${base}/`;
		return currentPath.startsWith(path);
	};

	let scrollY = $state(0);
</script>

<svelte:window bind:scrollY />

<header
	class="pointer-events-none fixed top-6 right-0 left-0 z-[100] flex justify-center px-6 transition-transform duration-500 {scrollY >
	20
		? '-translate-y-2'
		: ''}"
>
	<nav
		class="cinematic-glass pointer-events-auto container grid max-w-5xl grid-cols-2 items-center rounded-full px-4 transition-[background-color,box-shadow,backdrop-filter] duration-500 lg:grid-cols-3 lg:px-8 {scrollY >
		20
			? 'bg-[var(--glass-bg)]/90 py-3 shadow-xl backdrop-blur-xl'
			: 'py-4'}"
		dir={lang === 'ar' ? 'rtl' : 'ltr'}
		style="contain: layout style;"
	>
		<!-- Logo Section -->
		<div class="flex items-center justify-start">
			<a
				use:inView
				href={link(`${base}/`)}
				class="group relative flex flex-col items-start"
				aria-label="Orcado Home"
			>
				<div
					class="logo-container relative w-[150px] transition-transform duration-500 group-hover:scale-105 group-[.in-view]:scale-105 md:w-[180px]"
					style="height: {logoHeight}px"
				>
					<img
						src={logoSrc}
						alt="Bosla Logo"
						width="150"
						height="52"
						class="h-full w-full object-contain"
						loading="eager"
						fetchpriority="high"
					/>
				</div>
			</a>
		</div>

		<!-- Desktop Navigation - Centered -->
		<div class="hidden items-center justify-center lg:flex">
			<ul class="relative flex items-center gap-1">
				<!-- Moving Highlight Pill -->
				<div
					class="pointer-events-none absolute left-0 top-1/2 rounded-full bg-brand-blue shadow-[0_10px_20px_rgba(0,119,255,0.3)] {mounted
						? 'transition-[transform,opacity] duration-500 ease-out'
						: ''}"
					style="width: {pillStyles.width}px; height: {pillStyles.height}px; opacity: {pillStyles.opacity}; transform: translateX({pillStyles.left}px) translateY(-50%);"
				></div>

				{#each navItems as item}
					<li bind:this={navRefs[item.path]}>
						<a use:inView class={navLinkClass(item.path)} href={link(item.path)}>
							<span class="relative z-10">{item.label}</span>
							{#if !isActive(item.path)}
								<div class="absolute inset-0 translate-y-full bg-brand-blue/10 transition-transform duration-500 group-hover:translate-y-0 group-[.in-view]:translate-y-0"></div>
							{/if}
						</a>
					</li>
				{/each}
			</ul>
		</div>

		<!-- Right Section: Theme Toggle, Language Toggle & Mobile Menu -->
		<div class="flex items-center justify-end gap-2 md:gap-3">
			<!-- Live Demo (mobile) -->
			<a
				href="https://demo.boslatech.com"
				target="_blank"
				rel="noopener noreferrer"
				class="relative inline-flex items-center gap-1.5 rounded-full bg-brand-orange px-3.5 py-2 text-[11px] font-black text-white shadow-[0_8px_20px_rgba(255,107,0,0.3)] transition-transform duration-300 hover:scale-105 lg:hidden"
			>
				<span class="relative flex h-1.5 w-1.5">
					<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
					<span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-white"></span>
				</span>
				{lang === 'ar' ? 'جرّب المتجر' : 'Live Demo'}
				<ExternalLink class="h-3 w-3" />
			</a>

			<!-- Theme Toggle -->
			<div class="hidden lg:block">
				<ThemeToggle />
			</div>

			<!-- Desktop Language Toggle -->
			<div
				class="hidden items-center gap-1 rounded-full border border-[var(--glass-border)] bg-[var(--glass-highlight)] p-1 backdrop-blur-md lg:flex"
			>
				<button
					onclick={() => handleLanguageSwitch('en')}
					use:inView
					class="rounded-full px-4 py-1.5 text-xs font-black transition-[color,background-color,box-shadow,transform] duration-500 hover:scale-105 active:scale-95 [&.in-view]:scale-105 {lang ===
					'en'
						? 'bg-brand-blue text-white shadow-lg'
						: 'bg-brand-orange/20 text-brand-orange hover:bg-brand-orange/30 [&.in-view]:bg-brand-orange/30'}"
				>
					EN
				</button>
				<button
					onclick={() => handleLanguageSwitch('ar')}
					use:inView
					class="rounded-full px-4 py-1.5 text-xs font-black transition-[color,background-color,box-shadow,transform] duration-500 hover:scale-105 active:scale-95 [&.in-view]:scale-105 {lang ===
					'ar'
						? 'bg-brand-blue text-white shadow-lg'
						: 'bg-brand-orange/20 text-brand-orange hover:bg-brand-orange/30 [&.in-view]:bg-brand-orange/30'}"
				>
					AR
				</button>
			</div>

			<!-- Mobile Menu Trigger -->
			<div class="lg:hidden">
				<DrawerNavigation />
			</div>
		</div>
	</nav>
</header>

<style>
	:global(.mega-menu-panel) {
		background: color-mix(in srgb, var(--color-background) 92%, transparent);
		border: 1px solid var(--glass-border);
		box-shadow:
			inset 0 0 0 1px var(--glass-highlight),
			0 25px 50px -12px rgba(0, 0, 0, 0.4);
	}
	:global([data-theme='light'] .mega-menu-panel) {
		background: color-mix(in srgb, var(--color-surface) 92%, transparent);
		box-shadow:
			inset 0 0 0 1px var(--glass-highlight),
			0 20px 40px -10px rgba(11, 157, 217, 0.12), 0 10px 20px -5px rgba(0, 0, 0, 0.04);
	}
</style>
