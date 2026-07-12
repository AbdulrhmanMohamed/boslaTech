import type { PageLoad } from './$types';
import case_studies_i18n from '$lib/content/case-studies.i18n.json';
import { error } from '@sveltejs/kit';

export const prerender = true;

export const load: PageLoad = async ({ parent, params }) => {
	const parentData = await parent();
	const lang = (parentData as { lang: 'en' | 'ar' }).lang;
	const pageData = case_studies_i18n[lang as 'en' | 'ar'];

	const study = (pageData as any)[params.slug];

	if (!study) {
		throw error(404, { message: lang === 'ar' ? 'دراسة الحالة غير موجودة' : 'Case study not found' });
	}

	return {
		...parentData,
		study
	} as unknown as ReturnType<PageLoad>;
};
