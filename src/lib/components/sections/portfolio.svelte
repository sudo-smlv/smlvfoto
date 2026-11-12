<script lang="ts">
	import { useI18n, type PortfolioStory } from '$lib/i18n.svelte';
	const i18n = useI18n();
	const content = $derived(i18n.content);
	import { AspectRatio } from '$lib/components/ui/aspect-ratio';
	import AllStoriesDialog from './all-stories-dialog.svelte';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import Images from '@lucide/svelte/icons/images';

	const t = $derived(content.portfolio);
	let allStoriesOpen = $state(false);
	let selectedStory = $state<PortfolioStory | null>(null);

	// Exactly maximum 6 latest photos on the main page
	const mainItems = $derived(t.items.slice(0, 6));

	const layoutPatterns = [
		{ span: 'lg:col-span-7 lg:row-span-2', aspect: 'aspect-[4/5] sm:aspect-[4/3] lg:aspect-auto' },
		{ span: 'lg:col-span-5', aspect: 'aspect-[4/5] sm:aspect-[4/3] lg:aspect-[16/9]' },
		{ span: 'lg:col-span-5', aspect: 'aspect-[4/5] sm:aspect-[4/3] lg:aspect-[16/9]' },
		{ span: 'lg:col-span-4', aspect: 'aspect-[4/5] sm:aspect-[4/3]' },
		{ span: 'lg:col-span-4', aspect: 'aspect-[4/5] sm:aspect-[4/3]' },
		{ span: 'lg:col-span-4', aspect: 'aspect-[4/5] sm:aspect-[4/3]' }
	] as const;

	const cols = $derived(
		mainItems.map((item, idx) => {
			const pattern = layoutPatterns[idx % layoutPatterns.length];
			return {
				item,
				span: pattern.span,
				aspect: pattern.aspect
			};
		})
	);
</script>

<section
	id="portfolio"
	class="bg-background py-16 sm:py-24 lg:py-32"
	aria-labelledby="portfolio-title"
>
	<div class="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
		<header
			class="flex flex-col items-start justify-between gap-4 sm:gap-6 md:flex-row md:items-end"
		>
			<div class="max-w-2xl">
				<p
					class="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase sm:text-xs"
				>
					{content.sectionLabels.portfolio}
				</p>
				<h2
					id="portfolio-title"
					class="mt-3 sm:mt-4 font-serif text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-medium tracking-tight text-balance leading-[0.95]"
				>
					{t.heading}
				</h2>
				<p class="text-muted-foreground mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg">{t.intro}</p>
			</div>

			<div
				class="flex items-center gap-4 text-xs sm:text-sm text-muted-foreground self-start md:self-end"
			>
				<span class="font-mono tracking-[0.2em] uppercase"
					>{mainItems.length} из {t.items.length} историй</span
				>
				<span aria-hidden="true">·</span>
				<span>{t.metaYears}</span>
			</div>
		</header>

		<!-- Responsive Fluid Grid: 1 col on mobile, 2 col on tablet, 12 col bento on desktop -->
		<div
			class="mt-10 sm:mt-14 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-12 lg:auto-rows-[minmax(0,180px)]"
		>
			{#each cols as col, i (col.item.src)}
				<button
					type="button"
					class="group relative isolate overflow-hidden rounded-none bg-foreground {col.span} cursor-pointer text-left w-full p-0 outline-none focus-visible:ring-2 focus-visible:ring-ring"
					onclick={() => {
						selectedStory = col.item;
						allStoriesOpen = true;
					}}
				>
					<AspectRatio ratio={4 / 5} class={col.aspect}>
						<img
							src={col.item.src}
							alt={col.item.alt}
							loading="lazy"
							decoding="async"
							class="absolute inset-0 h-full w-full object-cover grayscale transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0"
						/>
						<div
							class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent sm:from-black/80 sm:via-black/0 sm:to-black/0 transition-opacity group-hover:from-black/85"
							aria-hidden="true"
						></div>
					</AspectRatio>

					{#if col.item.images && col.item.images.length > 1}
						<div class="absolute top-3 right-3 sm:top-4 sm:right-4 pointer-events-none z-10">
							<span
								class="inline-flex items-center gap-1 font-mono text-[10px] tracking-wider text-white/90 bg-black/60 backdrop-blur-md border border-white/20 px-2.5 py-0.5 rounded-full"
							>
								<Images class="size-3 text-white/90" />
								<span>{col.item.images.length} фото</span>
							</span>
						</div>
					{/if}

					<div
						class="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-6 pointer-events-none"
					>
						<div class="text-white">
							<p class="font-mono text-[10px] tracking-[0.25em] text-white/70 uppercase sm:text-xs">
								№0{i + 1} · {col.item.location} · {col.item.year}
							</p>
							<h3
								class="font-serif mt-1 text-base sm:text-xl lg:text-2xl leading-tight font-medium"
							>
								{col.item.caption}
							</h3>
						</div>
						<span
							aria-hidden="true"
							class="text-white/80 translate-y-0 sm:translate-y-1 opacity-90 sm:opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100"
						>
							<ArrowUpRight class="size-4 sm:size-6" />
						</span>
					</div>
				</button>
			{/each}
		</div>

		<!-- Minimalist Editorial "Все истории" Button in true site aesthetic -->
		<div class="mt-12 sm:mt-16 flex justify-center">
			<button
				type="button"
				class="group relative inline-flex items-center gap-3 border border-foreground/25 hover:border-foreground bg-transparent hover:bg-foreground hover:text-background px-7 py-3.5 transition-all duration-300 font-mono text-[11px] sm:text-xs tracking-[0.25em] uppercase cursor-pointer"
				onclick={() => {
					selectedStory = null;
					allStoriesOpen = true;
				}}
			>
				<span>{t.viewAll}</span>
				<span class="text-muted-foreground group-hover:text-background/70 font-mono text-[10px]">
					[{t.items.length}]
				</span>
				<ArrowUpRight
					class="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
				/>
			</button>
		</div>

		<AllStoriesDialog bind:open={allStoriesOpen} bind:initialStory={selectedStory} />
	</div>
</section>
