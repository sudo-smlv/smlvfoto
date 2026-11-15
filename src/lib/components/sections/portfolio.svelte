<script lang="ts">
	import { useI18n, type PortfolioStory } from '$lib/i18n.svelte';
	import { fill } from '$lib/content/build';
	import AllStoriesDialog from './all-stories-dialog.svelte';

	const i18n = useI18n();
	const content = $derived(i18n.content);
	const t = $derived(content.portfolio);

	let allStoriesOpen = $state(false);
	let selectedStory = $state<PortfolioStory | null>(null);
	let strip = $state<HTMLElement | null>(null);
	let atStart = $state(true);
	let atEnd = $state(false);

	// The six newest stories hang on a single line; each is pinned a little differently.
	const mainItems = $derived(t.items.slice(0, 6));
	const pins = [
		{ tilt: '-rotate-[2deg]', tape: 'left-6 -rotate-[8deg]' },
		{ tilt: 'rotate-[1.5deg]', tape: 'right-8 rotate-[6deg]' },
		{ tilt: '-rotate-[1deg]', tape: 'left-1/2 -translate-x-1/2 rotate-[2deg]' },
		{ tilt: 'rotate-[2deg]', tape: 'left-1/2 -translate-x-1/2 -rotate-[3deg]' },
		{ tilt: '-rotate-[1.5deg]', tape: 'right-6 rotate-[8deg]' },
		{ tilt: 'rotate-[1deg]', tape: 'left-8 -rotate-[5deg]' }
	] as const;

	function open(story: PortfolioStory | null) {
		selectedStory = story;
		allStoriesOpen = true;
	}

	function updateEdges() {
		if (!strip) return;
		atStart = strip.scrollLeft < 8;
		atEnd = strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 8;
	}

	function scrollBy(dir: 1 | -1) {
		if (!strip) return;
		strip.scrollBy({ left: dir * strip.clientWidth * 0.8, behavior: 'smooth' });
	}

	$effect(() => {
		updateEdges();
	});
</script>

{#snippet arrow(dir: 1 | -1, disabled: boolean, label: string)}
	<button
		type="button"
		onclick={() => scrollBy(dir)}
		{disabled}
		aria-label={label}
		class="border-bark/20 bg-paper hover:bg-honey hover:border-honey flex size-12 items-center justify-center rounded-full border transition-colors disabled:opacity-35 disabled:hover:bg-paper"
	>
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
			<path d={dir === 1 ? 'M9 6l6 6-6 6' : 'M15 6l-6 6 6 6'} />
		</svg>
	</button>
{/snippet}

<section id="portfolio" class="screen bg-cream relative" aria-labelledby="portfolio-title">
	<div class="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
		<header class="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
			<div class="flex max-w-2xl flex-col gap-3">
				<p class="hand-note">{content.sectionLabels.portfolio}</p>
				<h2 id="portfolio-title" class="text-4xl leading-[1.05] lg:text-[clamp(2.25rem,5.4svh,3rem)]">{t.heading}</h2>
				<p class="text-bark-soft">{t.intro}</p>
			</div>
			<div class="flex items-center gap-3">
				{#if t.metaYears.trim()}
					<span class="font-hand text-bark-soft mr-2 hidden text-xl sm:inline">{t.metaYears}</span>
				{/if}
				{@render arrow(-1, atStart, t.prev)}
				{@render arrow(1, atEnd, t.next)}
			</div>
		</header>
	</div>

	<ul
		bind:this={strip}
		onscroll={updateEdges}
		class="mt-8 flex snap-x snap-mandatory scroll-px-5 gap-8 sm:scroll-px-8 overflow-x-auto px-[max(1.25rem,calc((100vw-1400px)/2+2rem))] sm:px-[max(2rem,calc((100vw-1400px)/2+2rem))] pt-6 pb-8 [scrollbar-width:none] lg:mt-10 [&::-webkit-scrollbar]:hidden"
	>
		{#each mainItems as story, i (i)}
			{@const pin = pins[i % pins.length]}
			<li class="shrink-0 snap-start">
				<button
					type="button"
					onclick={() => open(story)}
					class="polaroid group relative block text-left transition-transform duration-500 ease-out hover:-translate-y-2 hover:rotate-0 {pin.tilt}"
				>
					<span class="tape -top-3 {pin.tape}" aria-hidden="true"></span>
					<span class="relative block overflow-hidden">
						<img
							src={story.src}
							alt={story.alt}
							loading="lazy"
							decoding="async"
							class="aspect-[4/5] h-[clamp(240px,43svh,440px)] w-auto object-cover transition-transform duration-700 group-hover:scale-105"
						/>
						{#if story.images.length > 1}
							<span class="bg-paper/90 text-bark absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur">
								{fill(t.texts.photoCount, { count: story.images.length })}
							</span>
						{/if}
					</span>
					<span class="flex flex-col px-2 pt-3 pb-4">
						<span class="font-hand text-bark text-[1.6rem] leading-none">{story.caption}</span>
						{#if story.location || story.year}
							<span class="text-bark-soft mt-1.5 text-sm">{[story.location, story.year].filter(Boolean).join(' · ')}</span>
						{/if}
					</span>
				</button>
			</li>
		{/each}
		<li class="shrink-0 snap-start self-center">
			<button
				type="button"
				onclick={() => open(null)}
				class="bg-fir text-milk hover:bg-fir-soft flex aspect-square h-[clamp(200px,32svh,300px)] flex-col items-center justify-center gap-3 rounded-full text-center transition-colors"
			>
				<span class="font-display text-6xl">{t.items.length}</span>
				<span class="px-6 font-semibold">{t.viewAll}</span>
				<svg width="28" height="16" viewBox="0 0 34 18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M2 12c8-8 18-9 28-4M24 3l6 5-7 3" /></svg>
			</button>
		</li>
	</ul>

	<p class="sr-only">{fill(t.texts.shownOfTotal, { count: mainItems.length, total: t.items.length })}</p>

	<AllStoriesDialog bind:open={allStoriesOpen} bind:initialStory={selectedStory} />
</section>
