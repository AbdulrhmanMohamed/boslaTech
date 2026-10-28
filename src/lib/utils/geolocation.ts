import type { CurrencyCode } from '$lib/data/pricing';

export interface GeoResult {
	countryCode: string;
	currency: CurrencyCode;
	cached: boolean;
}

// All prices are now SAR-only, so geolocation no longer switches currency.
export function getCurrencyFromCountry(countryCode: string): CurrencyCode {
	return 'sar';
}

export async function detectCountry(): Promise<GeoResult> {
	return {
		countryCode: 'SA',
		currency: 'sar',
		cached: false
	};
}

export function detectFromTimezone(): CurrencyCode {
	return 'sar';
}
