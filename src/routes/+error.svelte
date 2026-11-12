<script lang="ts">
	import { page } from '$app/stores';
	import { useI18n } from '$lib/i18n.svelte';
	import { Button } from '$lib/components/ui/button';

	const i18n = useI18n();
	const t = $derived(i18n?.content?.error || {
		title: 'Ein Fehler ist aufgetreten',
		description: 'Entschuldigung, die von Ihnen gesuchte Seite konnte nicht gefunden werden oder es ist ein Fehler aufgetreten.',
		homeButton: 'Zur Startseite'
	});
</script>

<svelte:head>
	<title>{$page.status} | Viktoria</title>
</svelte:head>

<div class="flex min-h-screen w-full flex-col items-center justify-center bg-background px-4 text-center text-foreground">
	<h1 class="font-serif text-8xl font-medium tracking-tight text-foreground/20 sm:text-9xl">
		{$page.status}
	</h1>
	<h2 class="mt-4 font-serif text-3xl font-medium tracking-tight sm:text-5xl">
		{t.title}
	</h2>
	<p class="text-muted-foreground mt-4 max-w-md text-base sm:text-lg">
		{$page.error?.message || t.description}
	</p>
	<Button href="/" class="mt-8 rounded-none bg-foreground text-background hover:bg-foreground/90" size="lg">
		{t.homeButton}
	</Button>
</div>
