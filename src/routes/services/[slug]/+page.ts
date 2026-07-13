import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ parent, params }) => {
	const parentData = await parent();
	const lang = (parentData as { lang: 'en' | 'ar' }).lang;
	const { default: services_i18n } = await import('$lib/content/services.i18n.json');
	const pageData = services_i18n[lang as 'en' | 'ar'];

	const category = (pageData as any).categories?.find(
		(c: any) => c.slug === params.slug
	);

	if (!category) {
		throw error(404, { message: lang === 'ar' ? 'الصفحة غير موجودة' : 'Page not found' });
	}

	return {
		...parentData,
		servicesPage: pageData,
		category
	} as unknown as ReturnType<PageLoad>;
};
