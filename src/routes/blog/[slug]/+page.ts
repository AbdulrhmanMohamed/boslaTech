import type { PageLoad } from './$types';
import blog_i18n from '$lib/content/blog.i18n.json';
import { error } from '@sveltejs/kit';

export const prerender = true;

export const load: PageLoad = async ({ parent, params }) => {
	const parentData = await parent();
	const lang = (parentData as { lang: 'en' | 'ar' }).lang;
	const pageData = blog_i18n[lang as 'en' | 'ar'];

	const post = (pageData as any).posts?.find((p: any) => p.slug === params.slug);

	if (!post) {
		throw error(404, { message: lang === 'ar' ? 'المقال غير موجود' : 'Post not found' });
	}

	return {
		...parentData,
		blogPage: pageData,
		post
	} as unknown as ReturnType<PageLoad>;
};
