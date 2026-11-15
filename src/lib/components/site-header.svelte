<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { useI18n } from '$lib/i18n.svelte';
	const i18n = useI18n();
	const content = $derived(i18n.content);
	const site = $derived(i18n.site);
	import { cn } from '$lib/utils';
	import Menu from '@lucide/svelte/icons/menu';
	import X from '@lucide/svelte/icons/x';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import { Button } from '$lib/components/ui/button';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';

	type Props = { class?: string };
	let { class: className = '' }: Props = $props();

	const sections = $derived([
		{ id: 'about', label: content.nav.about, num: '01' },
		{ id: 'portfolio', label: content.nav.portfolio, num: '02' },
		{ id: 'services', label: content.nav.services, num: '03' },
		{ id: 'locations', label: content.nav.locations, num: '04' },
		{ id: 'photobooks', label: content.nav.photobooks, num: '05' },
		{ id: 'faq', label: content.nav.faq, num: '06' },
		{ id: 'contact', label: content.nav.contact, num: '07' }
	]);

	let active = $state<string>('hero');
	let scrolled = $state(false);
	let mobileOpen = $state(false);

	onMount(() => {
		const allSections = [{ id: 'hero', label: content.nav.home, num: '00' }, ...sections];
		const onScroll = () => {
			scrolled = window.scrollY > 8;
			const headerHeight = 64;
			let current = allSections[0].id;
			for (const s of allSections) {
				const el = document.getElementById(s.id);
				if (!el) continue;
				const rect = el.getBoundingClientRect();
				if (rect.top - headerHeight <= 1) current = s.id;
			}
			active = current;
		};
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

	function go(id: string) {
		mobileOpen = false;
		document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}
</script>

<header
	class={cn(
		'bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50 w-full backdrop-blur transition-all duration-300',
		scrolled
			? 'border-border border-b shadow-[0_1px_0_rgba(0,0,0,0.04)]'
			: 'border-b border-transparent',
		className
	)}
>
	<div
		class={cn(
			'hidden h-8 items-center justify-between border-b border-border/60 font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase transition-all duration-300 lg:flex',
			scrolled ? 'max-h-0 overflow-hidden opacity-0' : 'max-h-8 opacity-100'
		)}
	>
		<div
			class="mx-auto flex w-full max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8"
		>
			<span>{content.footer.basedIn}</span>
			<span class="flex items-center gap-2">
				<span class="bg-foreground size-1.5 shrink-0 rounded-full" aria-hidden="true"></span>
				{content.footer.availability}
			</span>
		</div>
	</div>

	<nav
		class="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
		aria-label={content.a11y.mainNav}
	>
		<button
			type="button"
			onclick={() => go('hero')}
			class="font-serif text-xl font-semibold tracking-tight transition-opacity hover:opacity-80 sm:text-2xl"
		>
			{site.shortName}<sup class="ml-0.5 text-[0.6em] font-normal align-super">®</sup>
		</button>

		<ul class="hidden items-center gap-1 text-sm md:flex">
			{#each sections as s (s.id)}
				<li>
					<button
						type="button"
						data-slot="nav-link"
						aria-current={active === s.id ? 'page' : undefined}
						onclick={() => go(s.id)}
						class={cn(
							'relative px-3 py-2 transition-colors',
							active === s.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
						)}
					>
						{s.label}
						{#if active === s.id}
							<span class="bg-foreground absolute inset-x-3 -bottom-px h-px" aria-hidden="true"
							></span>
						{/if}
					</button>
				</li>
			{/each}
		</ul>

		<div class="hidden items-center gap-3 md:flex">
			<LanguageSwitcher />
			<Button
				size="sm"
				onclick={() => go('contact')}
				class="bg-foreground text-background hover:bg-foreground/90"
			>
				{content.hero.cta}
				<ArrowUpRight data-icon="inline-end" class="ml-0.5" />
			</Button>
		</div>

		<div class="flex items-center gap-2 md:hidden">
			<LanguageSwitcher />
			<button
				type="button"
				class="text-foreground"
				aria-label={mobileOpen ? content.a11y.closeMenu : content.a11y.openMenu}
				aria-expanded={mobileOpen}
				onclick={() => (mobileOpen = !mobileOpen)}
			>
				{#if mobileOpen}
					<X class="size-6" />
				{:else}
					<Menu class="size-6" />
				{/if}
			</button>
		</div>
	</nav>

	{#if mobileOpen}
		<div
			class="border-border bg-background fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto border-t md:hidden"
			transition:fade={{ duration: 200 }}
		>
			<div class="flex h-full flex-col px-4 py-6 sm:px-6">
				<ul class="flex flex-1 flex-col divide-y divide-border">
					{#each sections as s (s.id)}
						<li>
							<button
								type="button"
								onclick={() => go(s.id)}
								class="group flex w-full items-baseline gap-4 py-4 text-left"
							>
								<span
									class="font-mono text-[10px] tracking-[0.25em] text-muted-foreground tabular-nums sm:text-xs"
								>
									{s.num}
								</span>
								<span
									class={cn(
										'font-serif text-2xl leading-none transition-colors sm:text-3xl',
										active === s.id
											? 'text-foreground'
											: 'text-muted-foreground group-hover:text-foreground'
									)}
								>
									{s.label}
								</span>
								<ArrowUpRight
									class="ml-auto size-5 shrink-0 translate-y-1 text-muted-foreground opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100"
									aria-hidden="true"
								/>
							</button>
						</li>
					{/each}
				</ul>

				<div class="mt-6 flex flex-col gap-3 border-t border-border pt-6">
					<Button
						size="lg"
						class="bg-foreground text-background hover:bg-foreground/90 w-full"
						onclick={() => go('contact')}
					>
						{content.hero.cta}
						<ArrowUpRight data-icon="inline-end" class="ml-0.5" />
					</Button>
					<p
						class="text-center font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase"
					>
						{content.footer.availability}
					</p>
				</div>
			</div>
		</div>
	{/if}
</header>
