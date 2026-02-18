import type { PageLoad } from './$types';
import contact_i18n from '$lib/content/contact.i18n.json';

export const load: PageLoad = async ({ parent, url }) => {
	// Get parent data to get language info
	const parentData = await parent();
	const lang = (parentData as { lang: 'en' | 'ar' }).lang;

	// Get contact data for the current language
	const contact = contact_i18n[lang as 'en' | 'ar'];

	return {
		...parentData,
		contact,
		// Pass the raw language data for client-side reactivity
		contact_i18n
	} as unknown as ReturnType<PageLoad>;
};
