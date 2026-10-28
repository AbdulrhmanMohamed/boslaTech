import { type CurrencyCode, CURRENCIES, formatPrice, calculatePrice } from '$lib/data/pricing';

class PricingStore {
	// SAR only — no currency detection, no USD
	currency = $state<CurrencyCode>('sar');
	isLoading = $state(false);
	isDetecting = $state(false);
	detectionMethod = $state<'api' | 'timezone' | 'fallback' | null>(null);

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
		return formatPrice(this.convert(priceInSAR), this.currency);
	}

	salePrice(originalPrice: number, salePercent: number): number {
		return this.convert(originalPrice * (1 - salePercent / 100));
	}

	displaySalePrice(originalPrice: number, salePercent: number): string {
		return formatPrice(this.salePrice(originalPrice, salePercent), this.currency);
	}

	displayOriginal(priceInSAR: number): string {
		return formatPrice(this.convert(priceInSAR), this.currency);
	}
}

export const pricing = new PricingStore();
