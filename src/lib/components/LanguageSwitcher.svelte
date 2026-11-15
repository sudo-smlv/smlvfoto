<script lang="ts">
	import { page } from '$app/stores';
	import { useI18n, type ContentLocale } from '$lib/i18n.svelte';
	import Globe from '@lucide/svelte/icons/globe';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	
	const i18n = useI18n();
	
	const languages: { code: ContentLocale, label: string }[] = [
		{ code: 'de', label: 'DE' },
		{ code: 'en', label: 'EN' },
		{ code: 'ru', label: 'RU' }
	];

	let open = $state(false);
	
	function switchLanguage(code: ContentLocale) {
		open = false;
		if (i18n.locale === code) return;
		const currentPath = $page.url.pathname as string;
		const currentLang = $page.params.lang || 'de';
		let newPath = currentPath;
		
		if (currentPath.startsWith(`/${currentLang}`)) {
			newPath = currentPath.replace(`/${currentLang}`, `/${code}`);
		} else {
			newPath = `/${code}${currentPath === '/' ? '' : currentPath}`;
		}
		
		window.location.href = newPath + $page.url.search;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') open = false;
	}
</script>

<svelte:window on:click={() => open = false} on:keydown={handleKeydown} />

<div class="relative inline-block text-left" on:click|stopPropagation>
	<button
		type="button"
		class="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-line bg-paper px-3.5 text-sm font-semibold text-bark transition-colors hover:bg-cream"
		on:click={() => open = !open}
		aria-expanded={open}
		aria-haspopup="true"
	>
		<Globe class="h-4 w-4" />
		<span class="uppercase font-semibold tracking-wide">{i18n.locale}</span>
		<ChevronDown class="h-3 w-3 opacity-50 transition-transform {open ? 'rotate-180' : ''}" />
	</button>

	{#if open}
		<div
			class="absolute right-0 z-50 mt-2 w-32 origin-top-right rounded-2xl border border-line bg-paper p-1.5 text-bark outline-none animate-in fade-in-80 zoom-in-95"
			role="menu"
		>
			{#each languages as lang}
				<button
					class="w-full relative flex min-h-10 cursor-pointer select-none items-center rounded-xl px-3 text-sm font-semibold outline-none transition-colors hover:bg-cream {i18n.locale === lang.code ? 'bg-honey' : ''}"
					role="menuitem"
					on:click={() => switchLanguage(lang.code)}
				>
					{lang.label}
				</button>
			{/each}
		</div>
	{/if}
</div>
