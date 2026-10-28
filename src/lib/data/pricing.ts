export const CURRENCIES = {
	sar: {
		code: 'SAR',
		symbol: 'ر.س',
		symbolAlign: 'right',
		exchangeRate: 1,
		name: 'Saudi Riyal'
	}
};

export type CurrencyCode = 'sar';

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
	popular?: boolean;
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

// Launch offer deadline (fixed — countdown does not reset between visits)
export const OFFER_DEADLINE = '2026-11-30T23:59:59+03:00';
export const OFFER_DISCOUNT_PERCENT = 50;

export const PACKAGES: PricingPackage[] = [
	{
		id: 'one-page',
		name: {
			ar: 'صفحة واحدة',
			en: 'One Page'
		},
		description: {
			ar: 'موقع احترافي في صفحة واحدة، جاهز خلال 48 ساعة.',
			en: 'A professional one-page website, ready in 48 hours.'
		},
		features: {
			ar: [
				'تصميم احترافي متجاوب مع الجوال',
				'لوحة تحكم لإدارة المحتوى',
				'تهيئة لمحركات البحث (SEO)',
				'دعم العربية والإنجليزية',
				'شهادة أمان SSL مجانية',
				'دعم فني لمدة شهر'
			],
			en: [
				'Professional, mobile-responsive design',
				'Content management control panel',
				'Search engine optimization (SEO)',
				'Arabic & English support',
				'Free SSL certificate',
				'1 month technical support'
			]
		},
		originalPrice: 699,
		salePercent: 50,
		showOriginalPrice: true,
		allowAddons: false,
		popular: false
	},
	{
		id: 'corporate',
		name: {
			ar: 'موقع شركة أو معرض أعمال',
			en: 'Corporate / Portfolio'
		},
		description: {
			ar: 'موقع متكامل لشركتك مع عرض خدماتك، جاهز خلال 4 أيام.',
			en: 'A complete company website showcasing your services, ready in 4 days.'
		},
		features: {
			ar: [
				'حتى 7 صفحات',
				'معرض أعمال أو منتجات تفاعلي',
				'لوحة تحكم متقدمة',
				'نماذج تواصل متعددة وربط بواتساب',
				'ربط بحسابات التواصل الاجتماعي',
				'تهيئة متقدمة لمحركات البحث',
				'دعم فني لمدة 3 أشهر'
			],
			en: [
				'Up to 7 pages',
				'Interactive portfolio or product gallery',
				'Advanced control panel',
				'Multiple contact forms + WhatsApp integration',
				'Social media integration',
				'Advanced SEO',
				'3 months technical support'
			]
		},
		originalPrice: 1499,
		salePercent: 50,
		showOriginalPrice: true,
		allowAddons: true,
		popular: true
	},
	{
		id: 'animated',
		name: {
			ar: 'موقع تفاعلي متحرك',
			en: 'Animated Interactive'
		},
		description: {
			ar: 'موقع بتصميم مخصص بالكامل وتأثيرات متحركة تميز علامتك.',
			en: 'A fully custom website with motion effects that set your brand apart.'
		},
		features: {
			ar: [
				'تصميم مخصص بالكامل لهويتك',
				'تأثيرات حركية وتفاعلات احترافية',
				'معرض أعمال متقدم',
				'ربط مع الأنظمة التي تستخدمها',
				'دعم فني لمدة 6 أشهر'
			],
			en: [
				'Fully custom design for your brand',
				'Professional motion effects and interactions',
				'Advanced portfolio',
				'Integration with the systems you use',
				'6 months technical support'
			]
		},
		originalPrice: 2299,
		salePercent: 50,
		showOriginalPrice: true,
		allowAddons: true,
		popular: false
	}
];

export interface StorePackage {
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
	allowAddons?: boolean;
	popular?: boolean;
}

// NOTE: store package prices are suggested — client will confirm final numbers.
export const STORE_PACKAGES: StorePackage[] = [
	{
		id: 'store-standard',
		name: {
			ar: 'متجر أساسي',
			en: 'Starter Store'
		},
		description: {
			ar: 'متجر إلكتروني متكامل يعرض منتجاتك ويستقبل طلباتك، جاهز خلال أسبوع.',
			en: 'A complete online store to showcase products and receive orders, ready in one week.'
		},
		features: {
			ar: [
				'منتجات غير محدودة مع تصنيفات',
				'سلة شراء ونظام طلبات كامل',
				'ربط بوابات الدفع (مدى، STC Pay، Apple Pay)',
				'لوحة تحكم لإدارة المنتجات والطلبات',
				'تهيئة لمحركات البحث',
				'دعم فني لمدة شهر'
			],
			en: [
				'Unlimited products with categories',
				'Shopping cart and order system',
				'Payment gateways (Mada, STC Pay, Apple Pay)',
				'Products and orders control panel',
				'Search engine optimization',
				'1 month technical support'
			]
		},
		originalPrice: 4900,
		salePercent: 50,
		showOriginalPrice: true,
		allowAddons: false,
		popular: false
	},
	{
		id: 'store-pro',
		name: {
			ar: 'متجر برو',
			en: 'Pro Store'
		},
		description: {
			ar: 'متجر متقدم بهوية مخصصة وأدوات نمو، جاهز خلال 10 أيام.',
			en: 'An advanced store with a custom identity and growth tools, ready in 10 days.'
		},
		features: {
			ar: [
				'تصميم هوية مخصصة للمتجر',
				'كل مميزات المتجر القياسي',
				'ديزاينر فني لصفحات المنتوجات',
				'تكامل مع الشحن (أرامكس، سمسا)',
				'ربط أنظمة المحاسبة والمخزون',
				'دعم فني لمدة 3 أشهر'
			],
			en: [
				'Custom store branding',
				'Everything in the Standard Store',
				'Professional product page designer',
				'Shipping integration (Aramex, SMSA)',
				'Accounting and inventory integration',
				'3 months technical support'
			]
		},
		originalPrice: 8900,
		salePercent: 50,
		showOriginalPrice: true,
		allowAddons: false,
		popular: true
	},
	{
		id: 'store-custom',
		name: {
			ar: 'متجر مخصص بالكامل',
			en: 'Fully Custom Store'
		},
		description: {
			ar: 'متجر مبني من الصفر باحتياجاتك الخاصة وخصائص متقدمة.',
			en: 'A store built from scratch with your own requirements and advanced features.'
		},
		features: {
			ar: [
				'برمجة مخصصة من الصفر',
				'كل مميزات متجر برو',
				'خصائص متقدمة بتقنية الاشتراكات وحسابات البائعين',
				'ربط مع الأنظمة التي تستخدمها',
				'تهيئة متقدمة لمحركات البحث',
				'دعم فني لمدة 6 أشهر'
			],
			en: [
				'Custom development from scratch',
				'Everything in the Pro Store',
				'Advanced features like subscriptions and vendor accounts',
				'Integration with the systems you use',
				'Advanced SEO',
				'6 months technical support'
			]
		},
		originalPrice: 14900,
		salePercent: 50,
		showOriginalPrice: true,
		allowAddons: false,
		popular: false
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
				'تواريخ مخصصة',
				'تقارير مفصلة'
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

export function calculatePrice(price: number, currency: CurrencyCode = 'sar'): number {
	return Math.round(price / CURRENCIES[currency].exchangeRate);
}

export function formatPrice(price: number, currency: CurrencyCode = 'sar'): string {
	const config = CURRENCIES[currency];
	return `${price.toLocaleString()} ${config.symbol}`;
}
