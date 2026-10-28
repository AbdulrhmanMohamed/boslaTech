import type { PageLoad } from './$types';
import stores_i18n from '$lib/content/stores.i18n.json';

export const load: PageLoad = async ({ parent }) => {
	const parentData = await parent();
	const lang = (parentData as { lang: 'en' | 'ar' }).lang;

	const stores = stores_i18n[lang as 'en' | 'ar'];

	return {
		...parentData,
		stores
	} as unknown as ReturnType<PageLoad>;
};
