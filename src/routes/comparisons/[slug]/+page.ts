import type { PageLoad } from './$types';
import comparisons_i18n from '$lib/content/comparisons.i18n.json';
import { error } from '@sveltejs/kit';

export const prerender = true;

export const load: PageLoad = async ({ parent, params }) => {
	const parentData = await parent();
	const lang = (parentData as { lang: 'en' | 'ar' }).lang;
	const pageData = comparisons_i18n[lang as 'en' | 'ar'];

	const comparison = (pageData as any)[params.slug];

	if (!comparison) {
		throw error(404, { message: lang === 'ar' ? 'المقارنة غير موجودة' : 'Comparison not found' });
	}

	return {
		...parentData,
		comparison
	} as unknown as ReturnType<PageLoad>;
};
