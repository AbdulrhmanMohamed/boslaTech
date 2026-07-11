import type { PageLoad } from './$types';
import services_i18n from '$lib/content/services.i18n.json';

export const load: PageLoad = async ({ parent }) => {
	const parentData = await parent();
	const lang = (parentData as { lang: 'en' | 'ar' }).lang;
	const servicesPage = services_i18n[lang as 'en' | 'ar'];

	return {
		...parentData,
		servicesPage
	} as unknown as ReturnType<PageLoad>;
};
