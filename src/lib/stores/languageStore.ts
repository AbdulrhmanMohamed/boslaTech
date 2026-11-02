import { writable } from 'svelte/store';
import type { SupportedLanguage } from '$lib/utils/language';

// Reactive language store
export const currentLanguage = writable<SupportedLanguage>('en');

// Store for language change listeners
export const languageListeners = new Set<(lang: SupportedLanguage) => void>();

// Subscribe to language changes
currentLanguage.subscribe((lang) => {
	languageListeners.forEach((listener) => listener(lang));
});

// Function to change language reactively
export function changeLanguage(newLang: SupportedLanguage) {
	currentLanguage.set(newLang);

	// Update URL without navigation
	const currentUrl = new URL(window.location.href);
	currentUrl.searchParams.set('lang', newLang);
	window.history.replaceState({}, '', currentUrl.toString());
}

// Function to initialize language from URL
export function initializeLanguage(): SupportedLanguage {
	const url = new URL(window.location.href);
	const langParam = url.searchParams.get('lang') as SupportedLanguage;
	const lang = langParam === 'ar' || langParam === 'en' ? langParam : 'en';

	currentLanguage.set(lang);
	return lang;
}
