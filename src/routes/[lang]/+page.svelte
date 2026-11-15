<script lang="ts">
	import SiteHeader from '$lib/components/site-header.svelte';
	import SiteFooter from '$lib/components/site-footer.svelte';
	import Hero from '$lib/components/sections/hero.svelte';
	import About from '$lib/components/sections/about.svelte';
	import Portfolio from '$lib/components/sections/portfolio.svelte';
	import Services from '$lib/components/sections/services.svelte';
	import Locations from '$lib/components/sections/locations.svelte';
	import Photobooks from '$lib/components/sections/photobooks.svelte';
	import Faq from '$lib/components/sections/faq.svelte';
	import Contact from '$lib/components/sections/contact.svelte';
	import { useI18n } from '$lib/i18n.svelte';
	const i18n = useI18n();
	const content = $derived(i18n.content);
	const site = $derived(i18n.site);
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const pageUrl = $derived(`${site.url}/${data.lang}`);
	const ogImageUrl = $derived(site.ogImage);
	const ogLocale = $derived(
		data.lang === 'de' ? 'de_DE' : data.lang === 'en' ? 'en_US' : 'ru_RU'
	);

	const jsonLd = $derived(
		JSON.stringify({
			'@context': 'https://schema.org',
			'@type': ['Person', 'LocalBusiness'],
			name: site.name,
			description: site.description,
			image: ogImageUrl,
			url: pageUrl,
			telephone: site.phone,
			email: site.email,
			address: {
				'@type': 'PostalAddress',
				addressLocality: 'Freiburg',
				addressRegion: 'Baden-Württemberg',
				addressCountry: 'DE'
			},
			areaServed: ['Freiburg', 'Basel', 'Baden-Baden', 'Europe'],
			sameAs: [site.instagram.url]
		}).replace(/</g, '\\u003c') // texts come from the CMS: never let them close the <script> tag
	);
</script>

<svelte:head>
	<title>{site.name} — {content.hero.title}</title>
	<meta name="description" content={site.description} />
	<link rel="canonical" href={pageUrl} />

	<meta property="og:type" content="website" />
	<meta property="og:locale" content={ogLocale} />
	<meta property="og:site_name" content={site.name} />
	<meta property="og:title" content={site.name} />
	<meta property="og:description" content={site.description} />
	<meta property="og:url" content={pageUrl} />
	<meta property="og:image" content={ogImageUrl} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={site.name} />
	<meta name="twitter:description" content={site.description} />
	<meta name="twitter:image" content={ogImageUrl} />

	<!-- eslint-disable-next-line svelte/no-at-html-tags -- JSON-LD is a safe, site-owned string -->
	{@html `<script type="application/ld+json">${jsonLd}</scr` + `ipt>`}
</svelte:head>

<SiteHeader />

<main class="overflow-x-clip">
	<Hero />
	<About />
	<Portfolio />
	<Services />
	<Locations />
	<Photobooks />
	<Faq />
	<Contact {form} {data} />
</main>

<SiteFooter />
