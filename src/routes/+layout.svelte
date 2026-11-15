<script lang="ts">
	import './layout.css';
	import { Toaster } from '$lib/components/ui/sonner';
	import { TooltipProvider } from '$lib/components/ui/tooltip';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/stores';
	import { initI18n } from '$lib/i18n.svelte';

	let { children, data } = $props();

	// Content and contacts come from Sanity via +layout.server.ts, already in the page's language.
	const i18n = initI18n(() => data);
	const site = $derived(i18n.site);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	
	<!-- Hreflang Tags for SEO -->
	{#if $page.params.lang}
		<link rel="alternate" hreflang="de" href="{site.url}/de{$page.url.pathname.replace(`/${$page.params.lang}`, '')}" />
		<link rel="alternate" hreflang="en" href="{site.url}/en{$page.url.pathname.replace(`/${$page.params.lang}`, '')}" />
		<link rel="alternate" hreflang="ru" href="{site.url}/ru{$page.url.pathname.replace(`/${$page.params.lang}`, '')}" />
		<link rel="alternate" hreflang="x-default" href="{site.url}/" />
	{/if}
</svelte:head>

<TooltipProvider delayDuration={150} disableHoverableContent>
	<Toaster richColors position="top-right" />

	{@render children()}
</TooltipProvider>
