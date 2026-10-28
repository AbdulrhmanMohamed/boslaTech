import type { RequestHandler } from './$types';
import services_i18n from '$lib/content/services.i18n.json';
import blog_i18n from '$lib/content/blog.i18n.json';
import guides_i18n from '$lib/content/guides.i18n.json';

export const prerender = true;

const siteUrl = 'https://boslatech.com';

const cities = ['riyadh', 'jeddah', 'dammam', 'khobar', 'mecca', 'medina'];

const basePages = [
	{ path: '', priority: '1.0', changefreq: 'weekly' },
	{ path: 'stores', priority: '0.9', changefreq: 'weekly' },
	{ path: 'about', priority: '0.7', changefreq: 'monthly' },
	{ path: 'services', priority: '0.9', changefreq: 'weekly' },
	{ path: 'services/web-development', priority: '0.8', changefreq: 'monthly' },
	{ path: 'services/seo', priority: '0.8', changefreq: 'monthly' },
	{ path: 'services/digital-marketing', priority: '0.8', changefreq: 'monthly' },
	{ path: 'contact', priority: '0.6', changefreq: 'monthly' },
	{ path: 'blog', priority: '0.8', changefreq: 'weekly' },
	{ path: 'guides', priority: '0.8', changefreq: 'monthly' },
	...cities.map((c) => ({ path: `locations/${c}`, priority: '0.6', changefreq: 'monthly' })),
];

function subServicePages() {
	const sub: { path: string; priority: string; changefreq: string }[] = [];
	const en = services_i18n.en;
	for (const cat of en.categories) {
		for (const item of cat.items) {
			sub.push({ path: `services/${cat.slug}/${item.slug}`, priority: '0.7', changefreq: 'monthly' });
		}
	}
	return sub;
}

function blogPages() {
	return (blog_i18n.en.posts || []).map((p) => ({ path: `blog/${p.slug}`, priority: '0.7', changefreq: 'monthly' }));
}

function guidePages() {
	return Object.keys(guides_i18n.en).map((slug) => ({
		path: `guides/${slug}`,
		priority: '0.8',
		changefreq: 'monthly'
	}));
}

export const GET: RequestHandler = async () => {
	const pages = [...basePages, ...subServicePages(), ...blogPages(), ...guidePages()];
	const urls = pages.map((p) => {
		const loc = `${siteUrl}/${p.path}`;
		const en = `${siteUrl}/${p.path}?lang=en`;
		return `<url><loc>${loc}</loc><xhtml:link rel="alternate" hreflang="ar" href="${loc}"/><xhtml:link rel="alternate" hreflang="en" href="${en}"/><xhtml:link rel="alternate" hreflang="x-default" href="${loc}"/><priority>${p.priority}</priority><changefreq>${p.changefreq}</changefreq></url>`;
	});

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
	${urls.join('\n\t')}
</urlset>`;

	return new Response(xml, {
		headers: { 'Content-Type': 'application/xml' },
	});
};
