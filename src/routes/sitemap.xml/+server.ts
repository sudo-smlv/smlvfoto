import { site } from '$lib/config/site';

export const GET = async () => {
	const languages = ['de', 'en', 'ru'];
	const baseUrl = site.url;

	const generateUrlNode = (path: string) => {
		const links = languages.map(
			(lang) => `<xhtml:link rel="alternate" hreflang="${lang}" href="${baseUrl}/${lang}${path}" />`
		);
		// Add x-default pointing to the root redirect
		links.push(`<xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}${path}" />`);

		return `
	<url>
		<loc>${baseUrl}/de${path}</loc>
		${links.join('\n\t\t')}
		<changefreq>weekly</changefreq>
		<priority>${path === '' ? '1.0' : '0.8'}</priority>
	</url>
	<url>
		<loc>${baseUrl}/en${path}</loc>
		${links.join('\n\t\t')}
		<changefreq>weekly</changefreq>
		<priority>${path === '' ? '1.0' : '0.8'}</priority>
	</url>
	<url>
		<loc>${baseUrl}/ru${path}</loc>
		${links.join('\n\t\t')}
		<changefreq>weekly</changefreq>
		<priority>${path === '' ? '1.0' : '0.8'}</priority>
	</url>`;
	};

	const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<urlset
	xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
	xmlns:xhtml="https://www.w3.org/1999/xhtml"
>
	${generateUrlNode('')}
</urlset>`;

	return new Response(xml.trim(), {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
};
