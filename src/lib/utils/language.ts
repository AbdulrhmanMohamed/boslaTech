// Define interfaces for better type safety
interface HeroData {
	headline: string;
	subheadline: string;
	ctaPrimary: { label: string; href: string };
	ctaSecondary: { label: string; href: string };
	image: { url: string; alt: string };
}

interface Highlight {
	value: string;
	label: string;
}

interface Service {
	title: string;
	description: string;
	icon: string;
}

interface Client {
	title: string;
	subtitle: string;
	logos: string[];
	images: string[];
	empty?: string;
}

interface Section2 {
	head: string;
	sub: string;
	items: Array<{ head: string; content: string }>;
	cta: string;
}

interface Section4 {
	head: string;
	sub: string;
	items: Array<{ head: string; content: string }>;
}

interface CTAData {
	title: string;
	subtitle: string;
	buttonText: string;
}

interface NavData {
	home: string;
	about: string;
	contact: string;
	services: string;
	stores?: string;
	pricing?: string;
	portfolio?: string;
}

interface ProcessStep {
	title: string;
	desc: string;
	timeline: string;
}

interface KPI {
	label: string;
}

interface Quote {
	quote: string;
	author: string;
}

interface Testimonials {
	title: string;
	kpis: KPI[];
	quotes: Quote[];
}

interface Process {
	title: string;
	steps: ProcessStep[];
}

interface ServicesPage {
	process: Process;
	testimonials: Testimonials;
}

export interface LanguageData {
	hero: HeroData;
	highlights: Highlight[];
	metrics: Highlight[];
	vision: { title: string; headline: string; content: string; region: string; icon: string };
	mission: { title: string; headline: string; content: string; icon: string };
	section2: Section2;
	services: Service[];
	section4: Section4;
	clients: Client;
	servicesPage: ServicesPage;
	cta: CTAData;
	nav: NavData;
}

// Language cache to avoid loading files multiple times
const languageCache = new Map<SupportedLanguage, LanguageData>();

export type SupportedLanguage = 'en' | 'ar';

export function clearLanguageCache() {
	languageCache.clear();
}

export async function loadLanguage(lang: SupportedLanguage): Promise<LanguageData> {
	if (languageCache.has(lang)) {
		return languageCache.get(lang)!;
	}

	try {
		const module = await import(`../../lang/${lang}.json`);
		const data = module.default as LanguageData;
		languageCache.set(lang, data);
		return data;
	} catch (error) {
		console.error(`Failed to load language file for ${lang}:`, error);
		// Fallback to English if Arabic fails
		if (lang === 'ar' && languageCache.has('en')) {
			return languageCache.get('en')!;
		}
		return {} as LanguageData;
	}
}

export function getNestedValue(obj: LanguageData | undefined, path: string): string | undefined {
	const keys = path.split('.');
	let current: unknown = obj;

	for (const key of keys) {
		if (current && typeof current === 'object') {
			const obj = current as Record<string, unknown>;
			if (key in obj) {
				current = obj[key];
			} else {
				return undefined;
			}
		} else {
			return undefined;
		}
	}

	return current as string | undefined;
}

export function translate(langData: LanguageData, key: string, fallback?: string): string {
	const value = getNestedValue(langData, key);
	return value || fallback || key;
}

// Helper function to get current language from URL parameters
export function getCurrentLanguage(url: URL): SupportedLanguage {
	const langParam = url.searchParams.get('lang');
	if (langParam === 'ar' || langParam === 'en') {
		return langParam;
	}
	// Default to English
	return 'en';
}

// Helper function to generate href with language parameter
export function hrefWithLang(pathname: string, targetLang: SupportedLanguage, url: URL): string {
	const searchParams = new URLSearchParams(url.search);
	searchParams.set('lang', targetLang);
	const searchString = searchParams.toString();
	return searchString ? `${pathname}?${searchString}` : pathname;
}
