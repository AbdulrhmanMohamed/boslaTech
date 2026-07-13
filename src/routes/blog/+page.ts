import type { PageLoad } from './$types';

export const prerender = true;

export const load: PageLoad = async ({ parent }) => {
	const parentData = await parent();
	const lang = (parentData as { lang: 'en' | 'ar' }).lang;
	const { default: blog_i18n } = await import('$lib/content/blog.i18n.json');
	const pageData = blog_i18n[lang as 'en' | 'ar'];

	return {
		...parentData,
		blogPage: pageData
	} as unknown as ReturnType<PageLoad>;
};
