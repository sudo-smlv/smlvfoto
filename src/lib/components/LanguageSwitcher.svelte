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
		class="inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-colors"
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
			class="absolute right-0 z-50 mt-2 w-32 origin-top-right rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none animate-in fade-in-80 zoom-in-95"
			role="menu"
		>
			{#each languages as lang}
				<button
					class="w-full relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 {i18n.locale === lang.code ? 'bg-accent/50 font-medium' : ''}"
					role="menuitem"
					on:click={() => switchLanguage(lang.code)}
				>
					{lang.label}
				</button>
			{/each}
		</div>
	{/if}
</div>
