import type { PageLoad } from './$types';
import cities_i18n from '$lib/content/cities.i18n.json';
import services_i18n from '$lib/content/services.i18n.json';
import { error } from '@sveltejs/kit';

export const prerender = true;

export const load: PageLoad = async ({ parent, params }) => {
	const parentData = await parent();
	const lang = (parentData as { lang: 'en' | 'ar' }).lang;
	const cities = cities_i18n[lang as 'en' | 'ar'] as any[];
	const city = cities.find((c: any) => c.slug === params.city);

	if (!city) {
		throw error(404, { message: lang === 'ar' ? 'المدينة غير موجودة' : 'City not found' });
	}

	const serviceData = services_i18n[lang as 'en' | 'ar'];

	return {
		...parentData,
		city,
		serviceData
	} as unknown as ReturnType<PageLoad>;
};
