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
		popular: false
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
		popular: true
	},
	{
		id: 'company-catalog',
		name: {
			ar: 'موقع شركة + كتالوج',
			en: 'Corporate + Product Catalog'
		},
		description: {
			ar: 'موقع شركتك مع كتالوج منتجات (بدون دفع)، جاهز خلال 5 أيام.',
			en: 'Your company website with a product catalog (no payments), ready in 5 days.'
		},
		features: {
			ar: [
				'صفحات غير محدودة',
				'كتالوج منتجات (منتجات غير محدودة + تصنيفات)',
				'صفحات تفاصيل لكل منتج',
				'تواصل عبر واتساب (بدون دفع)',
				'لوحة تحكم لإدارة المنتجات والصفحات',
				'نماذج تواصل متعددة',
				'ربط بحسابات التواصل الاجتماعي',
				'تهيئة متقدمة لمحركات البحث',
				'دعم فني لمدة 3 أشهر'
			],
			en: [
				'Unlimited pages',
				'Product catalog (unlimited products + categories)',
				'Product detail pages',
				'WhatsApp contact (no payment)',
				'Control panel for products & pages',
				'Multiple contact forms',
				'Social media integration',
				'Advanced SEO',
				'3 months technical support'
			]
		},
		originalPrice: 3000,
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
			ar: 'المتجر الأساسي',
			en: 'Basic Store'
		},
		description: {
			ar: 'كل ما تحتاجه لتبدأ البيع أونلاين.',
			en: 'Everything you need to start selling online.'
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
			ar: 'المتجر الاحترافي',
			en: 'Pro Store'
		},
		description: {
			ar: 'متجر بتصميم مخصص لعلامتك، وأدوات تزيد مبيعاتك.',
			en: 'A store custom-designed for your brand, with tools that grow your sales.'
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
			ar: 'متجر مخصص',
			en: 'Custom Store'
		},
		description: {
			ar: 'عندك فكرة أو احتياج خاص؟ نبرمج لك متجرك بالمميزات اللي تحتاجها بالضبط. تواصل معنا ونجهز لك عرض سعر.',
			en: 'Have a special idea or requirement? We build your store with exactly the features you need. Contact us for a quote.'
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

export interface StoreComparisonRow {
	feature: { ar: string; en: string };
	basic: string;
	pro: string;
	custom: string;
}

export const STORE_COMPARISON: StoreComparisonRow[] = [
	{ feature: { ar: 'المنتجات', en: 'Products' }, basic: 'غير محدودة', pro: 'غير محدودة', custom: 'غير محدودة' },
	{ feature: { ar: 'التصنيفات', en: 'Categories' }, basic: 'حتى 5', pro: 'غير محدودة', custom: 'غير محدودة' },
	{ feature: { ar: 'خيارات ووصف المنتج (leurs, مقاسات)', en: 'Product options & descriptions (colors, sizes)' }, basic: '✓', pro: '✓', custom: '✓' },
	{ feature: { ar: 'أطقم المنتجات (باندل)', en: 'Product bundles' }, basic: '✗', pro: '✓', custom: '✓' },
	{ feature: { ar: 'الخصومات', en: 'Discounts' }, basic: 'خصم مباشر', pro: 'كوبونات + فلاش سيل', custom: 'كل ما سبق + any system' },
	{ feature: { ar: 'بوابات الدفع (مدى، STC Pay، Apple Pay)', en: 'Payment gateways (Mada, STC Pay, Apple Pay)' }, basic: '✓', pro: '✓', custom: '✓ + any' },
	{ feature: { ar: 'ربط شركات الشحن', en: 'Shipping integration' }, basic: '✓', pro: '✓', custom: '✓' },
	{ feature: { ar: 'تذكير السلة المتروكة بالإيميل', en: 'Abandoned cart email reminders' }, basic: '✗', pro: '✓', custom: '✓' },
	{ feature: { ar: 'اللغة', en: 'Language' }, basic: 'لغة واحدة', pro: 'لغتين', custom: 'حسب الطلب' },
	{ feature: { ar: 'مستخدمو لوحة التحكم', en: 'Control panel users' }, basic: 'مستخدم واحد', pro: 'متعددون', custom: 'حسب الطلب' },
	{ feature: { ar: 'التقارير', en: 'Reports' }, basic: 'الطلبات والمبيعات', pro: 'تقارير مفصلة', custom: 'حسب الطلب' },
	{ feature: { ar: 'التصميم', en: 'Design' }, basic: 'قالب بوصلة', pro: 'تصميم مخصص', custom: 'تصميم وبرمجة مخصصة' },
	{ feature: { ar: 'تهيئة محركات البحث', en: 'Search engine setup' }, basic: '✓', pro: '✓', custom: '✓' },
	{ feature: { ar: 'الدعم الفني', en: 'Technical support' }, basic: 'شهر', pro: '3 شهور', custom: 'حسب الاتفاق' },
	{ feature: { ar: 'مدة التسليم', en: 'Delivery time' }, basic: 'أسبوع', pro: '10 أيام', custom: 'حسب حجم المشروع' },
	{ feature: { ar: 'السعر', en: 'Price' }, basic: 'كما في الموقع', pro: 'كما في الموقع', custom: 'تواصل معنا' }
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
