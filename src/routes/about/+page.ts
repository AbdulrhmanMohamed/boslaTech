import type { PageLoad } from './$types';
import about_i18n from '$lib/content/about.i18n.json';
import site_i18n from '$lib/content/site.i18n.json';

export const load: PageLoad = async ({ parent }) => {
	// Get parent data to get language info
	const parentData = await parent();
	const lang = (parentData as { lang: 'en' | 'ar' }).lang;

	const site = site_i18n[lang as 'en' | 'ar'];
	const about = about_i18n[lang as 'en' | 'ar'];

	return {
		...parentData,
		site,
		about
	} as unknown as ReturnType<PageLoad>;
};
