import { browser } from '$app/environment';
import { GCC_COUNTRIES, type CurrencyCode } from '$lib/data/pricing';

const CACHE_KEY = 'user_country_code';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000;

export interface GeoResult {
	countryCode: string;
	currency: CurrencyCode;
	cached: boolean;
}

function getFromCache(): GeoResult | null {
	if (!browser) return null;

	try {
		const cached = localStorage.getItem(CACHE_KEY);
		if (!cached) return null;

		const { code, timestamp } = JSON.parse(cached);

		if (Date.now() - timestamp > CACHE_DURATION) {
			localStorage.removeItem(CACHE_KEY);
			return null;
		}

		return {
			countryCode: code,
			currency: getCurrencyFromCountry(code),
			cached: true
		};
	} catch {
		return null;
	}
}

function setCache(countryCode: string): void {
	if (!browser) return;

	try {
		localStorage.setItem(
			CACHE_KEY,
			JSON.stringify({
				code: countryCode,
				timestamp: Date.now()
			})
		);
	} catch {
		console.warn('Failed to cache geolocation data');
	}
}

export function getCurrencyFromCountry(countryCode: string): CurrencyCode {
	if (GCC_COUNTRIES.includes(countryCode)) {
		return 'sar';
	}
	return 'usd';
}

export async function detectCountry(): Promise<GeoResult> {
	const cached = getFromCache();
	if (cached) {
		return cached;
	}

	try {
		const response = await fetch('https://ipapi.co/json/', {
			headers: {
				Accept: 'application/json'
			}
		});

		if (!response.ok) {
			throw new Error('Geolocation API failed');
		}

		const data = await response.json();
		const countryCode = data.country_code || 'US';

		setCache(countryCode);

		return {
			countryCode,
			currency: getCurrencyFromCountry(countryCode),
			cached: false
		};
	} catch (error) {
		console.warn('Geolocation detection failed, falling back to USD:', error);

		return {
			countryCode: 'US',
			currency: 'usd',
			cached: false
		};
	}
}

export function detectFromTimezone(): CurrencyCode {
	if (!browser) return 'usd';

	try {
		const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

		const gccTimezones = [
			'Asia/Riyadh',
			'Asia/Dubai',
			'Asia/Muscat',
			'Asia/Qatar',
			'Asia/Kuwait',
			'Asia/Bahrain'
		];

		if (gccTimezones.some((tz) => timezone.includes(tz.split('/')[1]))) {
			return 'sar';
		}
	} catch {
		console.warn('Timezone detection failed');
	}

	return 'usd';
}
