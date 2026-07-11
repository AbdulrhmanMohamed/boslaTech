import type { LayoutLoad } from './$types';
import { loadLanguage } from '$lib/utils/language';
import type { Site } from '$lib/types';
import { browser } from '$app/environment';

// Enable prerendering for static deployment
export const prerender = true;

export const load: LayoutLoad = async ({ url, depends }) => {
	// Register dependency on the 'lang' search param
	depends('app:language');

	// Get language from URL parameters, default to Arabic
	let lang: 'en' | 'ar' = 'ar';

	// Try to get language from URL parameters
	try {
		let langParam: string | null = null;
		if (browser) {
			// In browser, use window.location.searchParams for the most up-to-date URL
			langParam = new URLSearchParams(window.location.search).get('lang');
		} else {
			// On server or during initial load, use the URL provided by SvelteKit
			langParam = url?.searchParams?.get('lang');
		}

		if (langParam === 'en' || langParam === 'ar') {
			lang = langParam as 'en' | 'ar';
		}
	} catch {
		// If URL parsing fails, keep default
	}

	// Load site data from src/lang files
	const siteData = await loadLanguage(lang);

	// Extract site-specific data from the language file
	const site: Site = {
		siteName: 'BOSLA',
		tagline: lang === 'ar' ? 'الحلول الرقمية' : 'Digital Solutions',
		description:
			lang === 'ar'
				? 'نحن شركة رائدة في تطوير المواقع والحلول الرقمية، نساعد الشركات على النمو والازدهار في العالم الرقمي.'
				: 'We are a leading web development and digital solutions company, helping businesses grow and thrive in the digital world.',
		ogImage: '/images/logos/bosla-logo.png',
		nav: {
			home: siteData.nav.home,
			about: siteData.nav.about,
			services: lang === 'ar' ? 'خدماتنا' : 'Services',
			portfolio: siteData.nav.portfolio || (lang === 'ar' ? 'أعمالنا' : 'Portfolio'),
			contact: siteData.nav.contact
		},
		langLabel: {
			en: 'English',
			ar: 'العربية'
		},
		registeredAs: 'مؤسسة حافة النجوم',
		commercialRegistration: '7050568158',
		registeredAddress: 'حي الملز، الرياض، المملكة العربية السعودية'
	};

	// Return as Record<string, unknown> to avoid type conflicts, include home data
	return { site, lang, home: siteData } as Record<string, unknown>;
};
