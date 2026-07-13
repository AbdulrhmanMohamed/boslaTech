import type { PageLoad } from './$types';
import blog_i18n from '$lib/content/blog.i18n.json';

export const prerender = true;

export const load: PageLoad = async ({ parent }) => {
	const parentData = await parent();
	const lang = (parentData as { lang: 'en' | 'ar' }).lang;
	const pageData = blog_i18n[lang as 'en' | 'ar'];

	return {
		...parentData,
		blogPage: pageData
	} as unknown as ReturnType<PageLoad>;
};
