import { type CurrencyCode, CURRENCIES, calculatePrice, formatPrice } from '$lib/data/pricing';
import { detectCountry, detectFromTimezone } from '$lib/utils/geolocation';
import { browser } from '$app/environment';

class PricingStore {
	currency = $state<CurrencyCode>('usd');
	isLoading = $state(true);
	isDetecting = $state(false);
	detectionMethod = $state<'api' | 'timezone' | 'fallback' | null>(null);

	constructor() {
		if (browser) {
			this.init();
		}
	}

	async init() {
		this.isLoading = true;
		this.isDetecting = true;

		try {
			const result = await detectCountry();

			this.currency = result.currency;
			this.detectionMethod = result.cached ? 'api' : 'api';
		} catch {
			const timezoneCurrency = detectFromTimezone();

			if (timezoneCurrency === 'sar') {
				this.currency = 'sar';
				this.detectionMethod = 'timezone';
			} else {
				this.currency = 'usd';
				this.detectionMethod = 'fallback';
			}
		} finally {
			this.isLoading = false;
			this.isDetecting = false;
		}
	}

	get currencyConfig() {
		return CURRENCIES[this.currency];
	}

	get symbol() {
		return CURRENCIES[this.currency].symbol;
	}

	convert(priceInSAR: number): number {
		return calculatePrice(priceInSAR, this.currency);
	}

	display(priceInSAR: number): string {
		const converted = this.convert(priceInSAR);
		return formatPrice(converted, this.currency);
	}

	salePrice(originalPrice: number, salePercent: number): number {
		const salePrice = originalPrice * (1 - salePercent / 100);
		return this.convert(salePrice);
	}

	displaySalePrice(originalPrice: number, salePercent: number): string {
		const price = this.salePrice(originalPrice, salePercent);
		return formatPrice(price, this.currency);
	}

	displayOriginal(priceInSAR: number): string {
		return formatPrice(priceInSAR, this.currency);
	}
}

export const pricing = new PricingStore();
