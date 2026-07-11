export const SAR_TO_USD_RATE = 3.75;

export const CURRENCIES = {
	sar: {
		code: 'SAR',
		symbol: 'ر.س',
		symbolAlign: 'right',
		exchangeRate: 1,
		name: 'Saudi Riyal'
	},
	usd: {
		code: 'USD',
		symbol: '$',
		symbolAlign: 'left',
		exchangeRate: SAR_TO_USD_RATE,
		name: 'US Dollar'
	}
};

export const GCC_COUNTRIES = ['SA', 'AE', 'OM', 'QA', 'KW', 'BH'];

export type CurrencyCode = 'sar' | 'usd';

export interface PricingPackage {
	id: string;
	name: {
		ar: string;
		en: string;
	};
	description: {
		ar: string;
		en: string;
	};
	features: {
		ar: string[];
		en: string[];
	};
	originalPrice: number;
	salePercent: number;
	showOriginalPrice: boolean;
	allowAddons: boolean;
}

export interface PricingAddon {
	id: string;
	name: {
		ar: string;
		en: string;
	};
	description: {
		ar: string;
		en: string;
	};
	features: {
		ar: string[];
		en: string[];
	};
	price: number;
	allowedPackages: string[];
}

export const PACKAGES: PricingPackage[] = [
	{
		id: 'one-page',
		name: {
			ar: 'صفحة واحدة',
			en: 'One Page'
		},
		description: {
			ar: 'موقع احترافي في صفحة واحدة مع نظام إدارة محتوى سهل',
			en: 'Professional one-page website with easy CMS'
		},
		features: {
			ar: [
				'تصميم احترافي متجاوب',
				'نظام إدارة محتوى (CMS)',
				'تحسين محركات البحث (SEO)',
				'دعم العربية والإنجليزية',
				'شهادة SSL مجانية',
				'دعم فني لمدة شهر'
			],
			en: [
				'Professional responsive design',
				'Content Management System (CMS)',
				'Search Engine Optimization (SEO)',
				'Arabic & English support',
				'Free SSL certificate',
				'1 month technical support'
			]
		},
		originalPrice: 1298,
		salePercent: 50,
		showOriginalPrice: true,
		allowAddons: false
	},
	{
		id: 'corporate',
		name: {
			ar: 'موقع شركة أو معرض أعمال',
			en: 'Corporate / Portfolio'
		},
		description: {
			ar: 'موقع متكامل لأعمالك مع معرض أعمال تفاعلي',
			en: 'Complete business website with interactive portfolio'
		},
		features: {
			ar: [
				'حتى 7 صفحات',
				'معرض أعمال تفاعلي',
				'نظام إدارة محتوى متقدم',
				'نموذج اتصال متعدد',
				'تكامل مع وسائل التواصل',
				'تحسين محركات البحث المتقدم',
				'دعم فني لمدة 3 أشهر'
			],
			en: [
				'Up to 7 pages',
				'Interactive portfolio',
				'Advanced CMS',
				'Multiple contact forms',
				'Social media integration',
				'Advanced SEO',
				'3 months technical support'
			]
		},
		originalPrice: 1698,
		salePercent: 50,
		showOriginalPrice: true,
		allowAddons: true
	},
	{
		id: 'animated',
		name: {
			ar: 'موقع تفاعلي متحرك',
			en: 'Animated Interactive'
		},
		description: {
			ar: 'موقع فريد مع مؤثرات ثلاثية الأبعاد وتفاعلات متعددة',
			en: 'Unique website with 3D effects and multiple interactions'
		},
		features: {
			ar: [
				'تأثيرات ثلاثية الأبعاد',
				'تفاعلات متحركة احترافية',
				'تصميم مخصص بالكامل',
				'معرض أعمال متقدم',
				'تكامل مع الأنظمة',
				'دعم فني لمدة 6 أشهر'
			],
			en: [
				'3D effects',
				'Professional animated interactions',
				'Fully custom design',
				'Advanced portfolio',
				'System integration',
				'6 months technical support'
			]
		},
		originalPrice: 2200,
		salePercent: 50,
		showOriginalPrice: true,
		allowAddons: true
	}
];

export const ADDONS: PricingAddon[] = [
	{
		id: 'catalog',
		name: {
			ar: 'كتالوج منتجات',
			en: 'Product Catalog'
		},
		description: {
			ar: 'عرض منتجاتك بشكل جميل بدون دفع أو سلة',
			en: 'Display your products beautifully without payment or cart'
		},
		features: {
			ar: [
				'غير محدود للمنتجات',
				'تصنيفات متعددة',
				'فلترة متقدمة',
				'صفحات تفاصيل المنتج',
				'نظام إدارة محتوى'
			],
			en: [
				'Unlimited products',
				'Multiple categories',
				'Advanced filtering',
				'Product detail pages',
				'CMS included'
			]
		},
		price: 600,
		allowedPackages: ['corporate', 'animated']
	},
	{
		id: 'ecommerce',
		name: {
			ar: 'متجر إلكتروني',
			en: 'E-commerce'
		},
		description: {
			ar: 'متجر كامل مع دفع وسلة و بوابة دفع',
			en: 'Full store with payment and payment gateway'
		},
		features: {
			ar: [
				'سلة شراء',
				'بوابات دفع متعددة',
				'نظام طلبات',
				'لوحة تحكم البائع',
				'إشعارات فورية',
				'تكامل الشحن'
			],
			en: [
				'Shopping cart',
				'Multiple payment gateways',
				'Order management',
				'Seller dashboard',
				'Instant notifications',
				'Shipping integration'
			]
		},
		price: 1700,
		allowedPackages: ['corporate', 'animated']
	},
	{
		id: 'reservation',
		name: {
			ar: 'نظام حجوزات',
			en: 'Reservation System'
		},
		description: {
			ar: 'نظام حجوزات مواعيد متكامل',
			en: 'Complete appointment booking system'
		},
		features: {
			ar: [
				'تقويم حجوزات',
				'إدارة المواعيد',
				'إشعارات العميل',
				'لوحة التحكم',
				'تارير مخصصة',
				'تقريرات مفصلة'
			],
			en: [
				'Booking calendar',
				'Appointment management',
				'Client notifications',
				'Dashboard',
				'Custom schedules',
				'Detailed reports'
			]
		},
		price: 800,
		allowedPackages: ['corporate', 'animated']
	}
];

export function calculatePrice(
	price: number,
	currency: CurrencyCode,
	currencyConfig = CURRENCIES
): number {
	const convertedPrice = price / currencyConfig[currency].exchangeRate;
	return Math.round(convertedPrice);
}

export function formatPrice(price: number, currency: CurrencyCode): string {
	const config = CURRENCIES[currency];
	if (currency === 'sar') {
		return `${price.toLocaleString()} ${config.symbol}`;
	}
	return `${config.symbol}${price.toLocaleString()}`;
}
