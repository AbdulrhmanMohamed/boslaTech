import type { PageLoad } from './$types';
import { clients } from '$lib/data/clients';

export const load: PageLoad = async ({ parent }) => {
	// Get data from parent (layout) - this includes home, site, lang
	const parentData = await parent();

	// Add clients to the existing data
	return {
		...parentData,
		clients
	} as unknown as ReturnType<PageLoad>;
};
