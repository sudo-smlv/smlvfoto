<script lang="ts">
	import { useI18n, type PortfolioStory } from '$lib/i18n.svelte';
	import { fill } from '$lib/content/build';
	import AllStoriesDialog from './all-stories-dialog.svelte';

	const i18n = useI18n();
	const content = $derived(i18n.content);
	const t = $derived(content.portfolio);

	let allStoriesOpen = $state(false);
	let selectedStory = $state<PortfolioStory | null>(null);

	// The six newest stories hang on the "wall"; each one is pinned a little differently.
	const mainItems = $derived(t.items.slice(0, 6));
	const pins = [
		{ tilt: '-rotate-[3deg]', tape: 'left-6 -rotate-[8deg]', offset: 'lg:mt-0' },
		{ tilt: 'rotate-[2deg]', tape: 'right-8 rotate-[6deg]', offset: 'lg:mt-16' },
		{ tilt: '-rotate-[1.5deg]', tape: 'left-1/2 -translate-x-1/2 rotate-[2deg]', offset: 'lg:mt-6' },
		{ tilt: 'rotate-[2.5deg]', tape: 'left-1/2 -translate-x-1/2 -rotate-[3deg]', offset: 'lg:-mt-6' },
		{ tilt: '-rotate-[2deg]', tape: 'right-6 rotate-[8deg]', offset: 'lg:mt-10' },
		{ tilt: 'rotate-[1.5deg]', tape: 'left-8 -rotate-[5deg]', offset: 'lg:mt-0' }
	] as const;

	function open(story: PortfolioStory | null) {
		selectedStory = story;
		allStoriesOpen = true;
	}
</script>

<section id="portfolio" class="bg-cream relative py-24 sm:py-32" aria-labelledby="portfolio-title">
	<!-- soft wave where the page paper meets the cream band -->
	<svg class="text-milk absolute -top-px left-0 h-8 w-full" viewBox="0 0 1200 32" preserveAspectRatio="none" fill="currentColor" aria-hidden="true">
		<path d="M0 0h1200v14c-150 18-300-10-450 4S300 30 150 18 0 14 0 14z" />
	</svg>

	<div class="mx-auto max-w-[1400px] px-5 sm:px-8">
		<header class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
			<div class="flex max-w-2xl flex-col gap-5">
				<p class="hand-note">{content.sectionLabels.portfolio}</p>
				<h2 id="portfolio-title" class="text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">{t.heading}</h2>
				<p class="text-bark-soft text-lg">{t.intro}</p>
			</div>
			<p class="font-hand text-bark-soft text-2xl">
				{fill(t.texts.shownOfTotal, { count: mainItems.length, total: t.items.length })} · {t.metaYears}
			</p>
		</header>

		<ul class="mt-16 grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-14">
			{#each mainItems as story, i (i)}
				{@const pin = pins[i % pins.length]}
				<li class={pin.offset}>
					<button
						type="button"
						onclick={() => open(story)}
						class="polaroid group relative block w-full text-left transition-transform duration-500 ease-out hover:z-10 hover:-translate-y-2 hover:rotate-0 hover:scale-[1.02] {pin.tilt}"
					>
						<span class="tape -top-3 {pin.tape}" aria-hidden="true"></span>
						<span class="relative block overflow-hidden">
							<img
								src={story.src}
								alt={story.alt}
								loading="lazy"
								decoding="async"
								class="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
							/>
							{#if story.images.length > 1}
								<span
									class="bg-paper/90 text-bark absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur"
								>
									{fill(t.texts.photoCount, { count: story.images.length })}
								</span>
							{/if}
						</span>
						<span class="flex items-end justify-between gap-3 px-2 pt-3 pb-4">
							<span class="flex flex-col">
								<span class="font-hand text-bark text-[1.75rem] leading-none">{story.caption}</span>
								<span class="text-bark-soft mt-1.5 text-sm">{story.location} · {story.year}</span>
							</span>
							<span
								class="border-line text-bark group-hover:bg-honey group-hover:border-honey flex size-10 shrink-0 items-center justify-center rounded-full border transition-colors"
								aria-hidden="true"
							>
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M7 17L17 7M9 7h8v8" /></svg>
							</span>
						</span>
					</button>
				</li>
			{/each}
		</ul>

		<div class="mt-20 flex justify-center">
			<button
				type="button"
				onclick={() => open(null)}
				class="group bg-fir text-milk hover:bg-fir-soft inline-flex min-h-14 items-center gap-4 rounded-full py-2 pr-2 pl-7 font-semibold transition-colors"
			>
				{t.viewAll}
				<span class="bg-honey text-bark flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-bold">
					{t.items.length}
				</span>
			</button>
		</div>

		<AllStoriesDialog bind:open={allStoriesOpen} bind:initialStory={selectedStory} />
	</div>
</section>
