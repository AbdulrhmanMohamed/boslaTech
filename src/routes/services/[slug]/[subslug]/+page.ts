import type { PageLoad } from './$types';
import services_i18n from '$lib/content/services.i18n.json';
import { error } from '@sveltejs/kit';

export const prerender = true;

export const load: PageLoad = async ({ parent, params }) => {
	const parentData = await parent();
	const lang = (parentData as { lang: 'en' | 'ar' }).lang;
	const pageData = services_i18n[lang as 'en' | 'ar'];

	const category = (pageData as any).categories?.find(
		(c: any) => c.slug === params.slug
	);

	if (!category) {
		throw error(404, { message: lang === 'ar' ? 'الصفحة غير موجودة' : 'Page not found' });
	}

	const service = category.items?.find((i: any) => i.slug === params.subslug);

	if (!service) {
		throw error(404, { message: lang === 'ar' ? 'الخدمة غير موجودة' : 'Service not found' });
	}

	return {
		...parentData,
		servicesPage: pageData,
		category,
		service
	} as unknown as ReturnType<PageLoad>;
};
