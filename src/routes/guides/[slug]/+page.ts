import type { PageLoad } from './$types';
import guides_i18n from '$lib/content/guides.i18n.json';
import { error } from '@sveltejs/kit';

export const prerender = true;

export const load: PageLoad = async ({ parent, params }) => {
	const parentData = await parent();
	const lang = (parentData as { lang: 'en' | 'ar' }).lang;
	const pageData = guides_i18n[lang as 'en' | 'ar'];

	const guide = (pageData as any)[params.slug];

	if (!guide) {
		throw error(404, { message: lang === 'ar' ? 'الدليل غير موجود' : 'Guide not found' });
	}

	return {
		...parentData,
		guide
	} as unknown as ReturnType<PageLoad>;
};
