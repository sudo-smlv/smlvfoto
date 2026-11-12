<script lang="ts">
	import './layout.css';
	import { Toaster } from '$lib/components/ui/sonner';
	import { TooltipProvider } from '$lib/components/ui/tooltip';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/stores';
	import { initI18n } from '$lib/i18n.svelte';
	import { site } from '$lib/config/site';

	let { children, data } = $props();

	// Initialize i18n with the current language from the URL parameter (or default to 'de')
	const initialLang = ($page.params.lang as 'en' | 'de' | 'ru') || 'de';
	const i18n = initI18n(initialLang);
	
	const currentLang = $derived(($page.params.lang as 'en' | 'de' | 'ru') || 'de');
	$effect(() => {
		i18n.locale = currentLang;
	});
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
