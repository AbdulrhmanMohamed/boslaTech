import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const parentData = await parent();
	const lang = (parentData as { lang: 'en' | 'ar' }).lang;
	const { default: services_i18n } = await import('$lib/content/services.i18n.json');
	const servicesPage = services_i18n[lang as 'en' | 'ar'];

	return {
		...parentData,
		servicesPage
	} as unknown as ReturnType<PageLoad>;
};
