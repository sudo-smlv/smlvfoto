<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { useI18n } from '$lib/i18n.svelte';
	import { cn } from '$lib/utils';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';

	const i18n = useI18n();
	const content = $derived(i18n.content);
	const site = $derived(i18n.site);

	type Props = { class?: string };
	let { class: className = '' }: Props = $props();

	const sections = $derived([
		{ id: 'about', label: content.nav.about },
		{ id: 'portfolio', label: content.nav.portfolio },
		{ id: 'services', label: content.nav.services },
		{ id: 'locations', label: content.nav.locations },
		{ id: 'photobooks', label: content.nav.photobooks },
		{ id: 'faq', label: content.nav.faq },
		{ id: 'contact', label: content.nav.contact }
	]);

	let active = $state<string>('hero');
	let scrolled = $state(false);
	let mobileOpen = $state(false);

	onMount(() => {
		const onScroll = () => {
			scrolled = window.scrollY > 24;
			let current = 'hero';
			for (const s of sections) {
				const el = document.getElementById(s.id);
				if (el && el.getBoundingClientRect().top - 120 <= 0) current = s.id;
			}
			active = current;
		};
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

	$effect(() => {
		document.documentElement.style.overflow = mobileOpen ? 'hidden' : '';
	});

	function go(id: string) {
		mobileOpen = false;
		document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}
</script>

<header class={cn('sticky top-0 z-50 w-full px-3 pt-3 sm:px-5', className)}>
	<nav
		aria-label={content.a11y.mainNav}
		class={cn(
			'mx-auto flex max-w-[1400px] items-center justify-between gap-3 rounded-full border px-3 py-2 transition-all duration-500 sm:px-4',
			scrolled
				? 'border-line bg-paper/90 backdrop-blur-md'
				: 'border-transparent bg-transparent'
		)}
	>
		<button
			type="button"
			onclick={() => go('hero')}
			class="flex min-h-11 items-center gap-2.5 rounded-full pr-2 pl-1 text-left"
		>
			<span
				class="bg-honey text-bark flex size-10 items-center justify-center rounded-full font-display text-xl italic"
				aria-hidden="true">{site.shortName.charAt(0)}</span
			>
			<span class="flex flex-col leading-none">
				<span class="font-display text-xl font-semibold tracking-tight">{site.shortName}</span>
				<span class="font-hand text-honey-ink -mt-0.5 hidden text-[1.05rem] whitespace-nowrap sm:block">{content.hero.card.body}</span>
			</span>
		</button>

		<ul class="hidden items-center gap-0.5 xl:flex">
			{#each sections as s (s.id)}
				<li>
					<button
						type="button"
						data-slot="nav-link"
						aria-current={active === s.id ? 'page' : undefined}
						onclick={() => go(s.id)}
						class={cn(
							'relative min-h-11 rounded-full px-3.5 text-[0.92rem] font-medium transition-colors',
							active === s.id ? 'bg-cream text-bark' : 'text-bark-soft hover:text-bark'
						)}
					>
						{#if active === s.id}
							<span
								class="bg-honey absolute top-1.5 left-1/2 size-1.5 -translate-x-1/2 rounded-full"
								aria-hidden="true"
							></span>
						{/if}
						{s.label}
					</button>
				</li>
			{/each}
		</ul>

		<div class="flex items-center gap-2">
			<LanguageSwitcher />
			<button
				type="button"
				onclick={() => go('contact')}
				class="bg-fir text-milk hover:bg-fir-soft hidden min-h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors sm:inline-flex"
			>
				<span class="bg-honey size-2 rounded-full" aria-hidden="true"></span>
				{content.hero.cta}
			</button>
			<button
				type="button"
				class="border-line bg-paper flex size-11 items-center justify-center rounded-full border xl:hidden"
				aria-label={mobileOpen ? content.a11y.closeMenu : content.a11y.openMenu}
				aria-expanded={mobileOpen}
				onclick={() => (mobileOpen = !mobileOpen)}
			>
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
					{#if mobileOpen}
						<path d="M6 6l12 12M18 6L6 18" />
					{:else}
						<path d="M4 8c3-1.5 6 1.5 9 0s5-1.5 7 0M4 16c3-1.5 6 1.5 9 0s5-1.5 7 0" />
					{/if}
				</svg>
			</button>
		</div>
	</nav>

	{#if mobileOpen}
		<div
			class="bg-fir text-milk fixed inset-0 top-0 -z-10 overflow-y-auto px-6 pt-28 pb-10 xl:hidden"
			transition:fade={{ duration: 200 }}
		>
			<ul class="flex flex-col gap-1">
				{#each sections as s, i (s.id)}
					<li in:fly={{ y: 16, delay: 40 * i, duration: 300 }}>
						<button
							type="button"
							onclick={() => go(s.id)}
							class="flex min-h-14 w-full items-baseline gap-4 text-left"
						>
							<span class="font-hand text-honey-light text-2xl">{i + 1}</span>
							<span class="font-display text-4xl">{s.label}</span>
						</button>
					</li>
				{/each}
			</ul>
			<button
				type="button"
				onclick={() => go('contact')}
				class="bg-honey text-bark mt-10 flex min-h-14 w-full items-center justify-center rounded-full text-base font-semibold"
			>
				{content.hero.cta}
			</button>
			<p class="font-hand text-honey-light mt-6 text-center text-2xl">{content.footer.availability}</p>
		</div>
	{/if}
</header>
