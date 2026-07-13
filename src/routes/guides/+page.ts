import type { PageLoad } from './$types';

export const prerender = true;

export const load: PageLoad = async ({ parent }) => {
	const parentData = await parent();
	return parentData as unknown as ReturnType<PageLoad>;
};
