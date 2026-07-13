import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const prerender = true;

export const load: PageLoad = async ({ parent, params }) => {
	const parentData = await parent();
	const lang = (parentData as { lang: 'en' | 'ar' }).lang;
	const { default: cities_i18n } = await import('$lib/content/cities.i18n.json');
	const cities = cities_i18n[lang as 'en' | 'ar'] as any[];
	const city = cities.find((c: any) => c.slug === params.city);

	if (!city) {
		throw error(404, { message: lang === 'ar' ? 'المدينة غير موجودة' : 'City not found' });
	}

	const { default: services_i18n } = await import('$lib/content/services.i18n.json');
	const serviceData = services_i18n[lang as 'en' | 'ar'];

	return {
		...parentData,
		city,
		serviceData
	} as unknown as ReturnType<PageLoad>;
};
