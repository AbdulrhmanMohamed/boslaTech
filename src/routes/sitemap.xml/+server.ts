import type { RequestHandler } from './$types';

export const prerender = true;

const siteUrl = 'https://hafatalnjom.com';

const pages = [
	{ path: '', priority: '1.0', changefreq: 'weekly' },
	{ path: 'about', priority: '0.7', changefreq: 'monthly' },
	{ path: 'services', priority: '0.9', changefreq: 'weekly' },
	{ path: 'services/web-development', priority: '0.8', changefreq: 'monthly' },
	{ path: 'services/seo', priority: '0.8', changefreq: 'monthly' },
	{ path: 'services/digital-marketing', priority: '0.8', changefreq: 'monthly' },
	{ path: 'contact', priority: '0.6', changefreq: 'monthly' },
];

export const GET: RequestHandler = async () => {
	const urls = pages.flatMap((p) => [
		`<url><loc>${siteUrl}/${p.path}</loc><priority>${p.priority}</priority><changefreq>${p.changefreq}</changefreq></url>`,
		`<url><loc>${siteUrl}/${p.path}?lang=en</loc><priority>${p.priority}</priority><changefreq>${p.changefreq}</changefreq></url>`,
	]);

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	${urls.join('\n\t')}
</urlset>`;

	return new Response(xml, {
		headers: { 'Content-Type': 'application/xml' },
	});
};
