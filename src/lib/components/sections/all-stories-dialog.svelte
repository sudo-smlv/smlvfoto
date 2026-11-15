<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { AspectRatio } from '$lib/components/ui/aspect-ratio';
	import { useI18n, type PortfolioStory } from '$lib/i18n.svelte';
	const i18n = useI18n();
	const content = $derived(i18n.content);
	const tx = $derived(content.portfolio.texts);
	import { fill } from '$lib/content/build';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import Calendar from '@lucide/svelte/icons/calendar';
	import Eye from '@lucide/svelte/icons/eye';
	import X from '@lucide/svelte/icons/x';
	import Images from '@lucide/svelte/icons/images';
	import { createPortfolioGallery } from '$lib/state/portfolio.svelte';

	let {
		open = $bindable(false),
		initialStory = $bindable(null)
	}: {
		open?: boolean;
		initialStory?: PortfolioStory | null;
	} = $props();

	const gallery = createPortfolioGallery(i18n);

	$effect(() => {
		if (open && initialStory) {
			gallery.activeStory = initialStory;
			gallery.activePhotoIndex = 0;
		}
	});
</script>

<svelte:window onkeydown={gallery.handleKeydown} />

<Dialog.Root bind:open>
	<Dialog.Content
		class="sm:max-w-6xl sm:h-[90vh] flex flex-col gap-0 p-0 sm:border border-border/80 shadow-2xl sm:rounded-2xl"
	>
		<!-- Inner wrapper to clip the grid to Dialog.Content's rounded corners, allowing activeStory to break out -->
		<div class="flex flex-col h-full w-full rounded-[inherit] overflow-hidden">
			<!-- Dialog Header with Navigation & Filter Bar -->
			<div
				class="flex flex-col gap-2 sm:gap-3 border-b border-border/40 px-3.5 py-2.5 sm:px-8 sm:py-4 bg-card/70 shrink-0"
			>
				<div class="flex items-center justify-between gap-3 pr-8 sm:pr-10">
					<div class="flex items-baseline gap-2 sm:gap-3">
						<Dialog.Title class="font-serif text-lg sm:text-3xl font-medium tracking-tight">
							{tx.dialogTitle}
						</Dialog.Title>
						<Badge
							variant="outline"
							class="font-mono text-[9px] sm:text-xs px-2 py-0 sm:py-0.5 bg-background/80"
						>
							{fill(tx.shootCount, { count: gallery.filteredStories.length })}
						</Badge>
					</div>
					<Dialog.Description class="sr-only">
						{fill(tx.shootCountLong, { count: gallery.filteredStories.length })}
					</Dialog.Description>
				</div>

			<!-- Filter Chips (Horizontally Scrollable on Mobile) -->
			<div
				class="flex items-center gap-1.5 overflow-x-auto pb-0.5 pt-0.5 -mx-1 px-1 sm:mx-0 sm:px-0 sm:flex-wrap"
			>
				{#each gallery.filterOptions as f, fi (fi)}
					<Button
						variant={gallery.activeFilter === f.id ? 'default' : 'outline'}
						size="sm"
						class="text-[11px] sm:text-xs rounded-full h-6 sm:h-7 px-2.5 sm:px-3 font-normal transition-all shrink-0 cursor-pointer"
						onclick={() => (gallery.activeFilter = f.id)}
					>
						{f.label}
						{#if gallery.activeFilter === f.id}
							<span class="ml-1 text-[9px] sm:text-[10px] opacity-70"
								>({gallery.filteredStories.length})</span
							>
						{/if}
					</Button>
				{/each}
			</div>
		</div>

		<!-- Scrollable Stories Grid -->
		<div class="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 overscroll-contain">
			{#if gallery.filteredStories.length === 0}
				<div class="flex flex-col items-center justify-center py-20 text-center gap-3">
					<p class="font-serif text-2xl text-muted-foreground">{tx.empty}</p>
					<Button variant="outline" size="sm" onclick={() => (gallery.activeFilter = 'all')}>
						{tx.showAll}
					</Button>
				</div>
			{:else}
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
					{#each gallery.displayedStories as story, i (story.id)}
						{@const photoCount = story.images && story.images.length > 0 ? story.images.length : 1}
						<button
							type="button"
							class="group relative isolate overflow-hidden rounded-xl bg-foreground border border-border/40 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 cursor-pointer text-left w-full p-0 outline-none focus-visible:ring-2 focus-visible:ring-ring [content-visibility:auto] [contain-intrinsic-size:350px]"
							onclick={() => gallery.openStory(story)}
						>
							<AspectRatio ratio={4 / 5} class="overflow-hidden">
								<img
									src={story.src}
									alt={story.alt}
									loading="lazy"
									decoding="async"
									class="h-full w-full object-cover grayscale transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0"
								/>
								<div
									class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity"
									aria-hidden="true"
								></div>
							</AspectRatio>

							<!-- Top Tags & Photo Count Badge -->
							<div
								class="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none"
							>
								<div class="flex items-center gap-1.5">
									<span
										class="font-mono text-[10px] tracking-wider text-white/80 bg-black/40 backdrop-blur-md px-2.5 py-0.5 rounded-full uppercase"
									>
										№0{i + 1}
									</span>
									{#if story.category}
										<Badge
											variant="secondary"
											class="bg-white/90 text-black text-[10px] px-2 py-0.5 rounded-full font-medium"
										>
											{story.category}
										</Badge>
									{/if}
								</div>

								<!-- Multi-Photo Badge indicator -->
								{#if photoCount > 1}
									<span
										class="inline-flex items-center gap-1 font-mono text-[10px] tracking-wider text-white bg-black/60 backdrop-blur-md border border-white/20 px-2 py-0.5 rounded-full"
									>
										<Images class="size-3 text-white/90" />
										<span>{fill(tx.photoCount, { count: photoCount })}</span>
									</span>
								{:else}
									<span
										class="font-mono text-[9px] tracking-wider text-white/60 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full"
									>
										{fill(tx.photoCount, { count: 1 })}
									</span>
								{/if}
							</div>

							<!-- Bottom Metadata Overlay -->
							<div
								class="absolute inset-x-0 bottom-0 p-4 text-white flex flex-col gap-1.5 pointer-events-none"
							>
								<div class="flex items-center gap-2 text-[11px] text-white/70 font-mono">
									<span class="inline-flex items-center gap-1">
										<MapPin class="size-3" />
										{story.location}
									</span>
									<span>·</span>
									<span>{story.year}</span>
								</div>

								<div class="flex items-end justify-between gap-2">
									<h3
										class="font-serif text-lg leading-tight font-medium text-white group-hover:text-white/95"
									>
										{story.caption}
									</h3>
									<span
										class="size-7 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
									>
										<Eye class="size-4" />
									</span>
								</div>
							</div>
						</button>
					{/each}
				</div>

				<!-- Infinite Scroll Sentinel & Stream Loader -->
				{#if gallery.hasMore}
					<div
						bind:this={gallery.sentinelEl}
						class="flex flex-col items-center justify-center py-10 gap-2.5 text-muted-foreground"
					>
						<div
							class="size-5 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-foreground"
						></div>
						<p class="font-mono text-[10px] tracking-widest uppercase">
							{fill(tx.loading, {
								count: gallery.displayedStories.length,
								total: gallery.filteredStories.length
							})}
						</p>
					</div>
				{/if}
			{/if}
		</div>

		<!-- Footer CTA -->
		<div
			class="border-t border-border/40 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-card/50"
		>
			<p class="text-xs text-muted-foreground text-center sm:text-left">
				{tx.ctaText}
			</p>
			<Button
				size="sm"
				class="w-full sm:w-auto cursor-pointer"
				onclick={() => {
					open = false;
					setTimeout(() => {
						document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
					}, 150);
				}}
			>
				<Calendar data-icon="inline-start" class="mr-1.5 size-4" />
				{tx.ctaButton}
				<ArrowUpRight data-icon="inline-end" class="ml-1 size-3.5" />
			</Button>
		</div>
	</div>

	<!-- Full-Screen Lightbox View for Active Story with Multi-Photo Gallery Carousel -->
	{#if gallery.activeStory}
		<div
			class="absolute top-1/2 left-1/2 w-[100vw] h-[100dvh] -translate-x-1/2 -translate-y-1/2 z-[100] flex flex-col items-center justify-between bg-black/95 text-white p-3 sm:p-6 lg:p-8 animate-in fade-in-0 duration-200 select-none"
			role="dialog"
			tabindex="-1"
			aria-modal="true"
			aria-label={gallery.activeStory.caption}
		>
		<!-- Top Controls & Story Header -->
		<div class="w-full flex items-center justify-between z-20 shrink-0 gap-2">
			<div class="flex items-center gap-2 sm:gap-3 min-w-0">
				<Badge
					variant="outline"
					class="font-mono text-[11px] sm:text-xs border-white/30 text-white bg-black/40 px-2 py-0.5 shrink-0"
				>
					{gallery.currentStoryIndex + 1} / {content.portfolio.items.length}
				</Badge>
				<div class="truncate">
					<span class="font-serif text-xs sm:text-base text-white/95 font-medium">
						{gallery.activeStory.caption}
					</span>
					<span class="text-[11px] sm:text-xs text-white/60 font-mono ml-2 hidden sm:inline">
						· {gallery.activeStory.location} ({gallery.activeStory.year})
					</span>
					{#if gallery.currentStoryImages.length > 1}
						<span
							class="text-[10px] sm:text-xs text-white/80 bg-white/15 px-2 py-0.5 rounded-full font-mono ml-2"
						>
							{fill(tx.frameOf, {
								current: gallery.activePhotoIndex + 1,
								total: gallery.currentStoryImages.length
							})}
						</span>
					{/if}
				</div>
			</div>

			<div class="flex items-center gap-2 shrink-0">
				<!-- Prev/Next Story Switcher -->
				<div class="hidden md:flex items-center gap-1 mr-2 border-r border-white/20 pr-3">
					<Button
						variant="ghost"
						size="sm"
						class="text-white/80 hover:text-white hover:bg-white/10 text-xs h-8 px-2.5 font-mono cursor-pointer"
						onclick={gallery.prevStoryDirect}
					>
						{tx.prevStory}
					</Button>
					<Button
						variant="ghost"
						size="sm"
						class="text-white/80 hover:text-white hover:bg-white/10 text-xs h-8 px-2.5 font-mono cursor-pointer"
						onclick={gallery.nextStoryDirect}
					>
						{tx.nextStory}
					</Button>
				</div>

				<Button
					variant="outline"
					size="sm"
					class="border-white/30 bg-white/10 text-white hover:bg-white/20 text-xs hidden sm:inline-flex cursor-pointer"
					onclick={() => gallery.activeStory && gallery.selectForBooking(gallery.activeStory, (val) => open = val)}
				>
					{tx.bookStory}
				</Button>
				<Button
					variant="ghost"
					size="icon-sm"
					class="text-white hover:bg-white/20 rounded-full size-8 sm:size-9 cursor-pointer"
					onclick={() => (gallery.activeStory = null)}
				>
					<X class="size-5" />
					<span class="sr-only">{tx.closeViewer}</span>
				</Button>
			</div>
		</div>

		<!-- Middle Presentation Row: Left Arrow + Photo + Right Arrow (100% Reliable Touch on iPad/Mobile) -->
		<div
			class="relative flex items-center justify-between w-full flex-1 max-h-[65svh] sm:max-h-[72vh] my-auto overflow-hidden px-1 sm:px-6"
			role="region"
			aria-label={tx.viewerLabel}
		>
			<!-- Left Arrow Button -->
			<button
				type="button"
				class="z-30 size-11 sm:size-14 rounded-full bg-black/80 hover:bg-black/95 text-white active:bg-black transition-colors flex items-center justify-center backdrop-blur-md border border-white/30 shadow-2xl cursor-pointer select-none shrink-0"
				onclick={(e) => {
					e.stopPropagation();
					gallery.prevPhoto();
				}}
				aria-label={tx.prevPhoto}
			>
				<ChevronLeft class="size-6 sm:size-7 pointer-events-none" />
			</button>

			<!-- Photo Container (Touch Swipe Zone) -->
			<div
				role="presentation"
				class="relative flex items-center justify-center flex-1 h-full px-2 sm:px-4 max-w-full overflow-hidden touch-pan-y"
				ontouchstart={gallery.handleImageTouchStart}
				ontouchend={gallery.handleImageTouchEnd}
			>
				<img
					src={gallery.currentPhoto}
					alt={gallery.activeStory.alt}
					decoding="async"
					class="max-h-full max-w-full object-contain rounded-md sm:rounded-lg shadow-2xl transition-all select-none pointer-events-none"
				/>
			</div>

			<!-- Right Arrow Button -->
			<button
				type="button"
				class="z-30 size-11 sm:size-14 rounded-full bg-black/80 hover:bg-black/95 text-white active:bg-black transition-colors flex items-center justify-center backdrop-blur-md border border-white/30 shadow-2xl cursor-pointer select-none shrink-0"
				onclick={(e) => {
					e.stopPropagation();
					gallery.nextPhoto();
				}}
				aria-label={tx.nextPhoto}
			>
				<ChevronRight class="size-6 sm:size-7 pointer-events-none" />
			</button>
		</div>

		<!-- Multi-Photo Filmstrip Thumbnails Bar (when story has multiple photos) -->
		{#if gallery.currentStoryImages.length > 1}
			<div
				class="flex items-center justify-center gap-2 py-2 overflow-x-auto max-w-full z-20 shrink-0"
			>
				{#each gallery.currentStoryImages as imgUrl, idx (idx)}
					<button
						type="button"
						class="relative size-12 sm:size-14 rounded-md overflow-hidden border-2 transition-all duration-200 cursor-pointer p-0 shrink-0 {gallery.activePhotoIndex ===
						idx
							? 'border-white ring-2 ring-white/50 scale-105 opacity-100'
							: 'border-white/30 opacity-50 hover:opacity-100'}"
						onclick={() => (gallery.activePhotoIndex = idx)}
					>
						<img src={imgUrl} alt={tx.thumbnail} class="h-full w-full object-cover" />
					</button>
				{/each}
			</div>
		{/if}

		<!-- Bottom Story Info & Action -->
		<div
			class="flex flex-col sm:flex-row items-center justify-between w-full max-w-4xl gap-2 sm:gap-3 text-center sm:text-left z-20 shrink-0 pt-1"
		>
			<div>
				<h4 class="font-serif text-base sm:text-xl font-medium">{gallery.activeStory.caption}</h4>
				<p class="text-[11px] sm:text-xs text-white/70 font-mono mt-0.5">
					📍 {gallery.activeStory.location} · {gallery.activeStory.year}
					{#if gallery.activeStory.category}
						· {gallery.activeStory.category}
					{/if}
					{#if gallery.currentStoryImages.length > 1}
						· {fill(tx.frameOf, {
							current: gallery.activePhotoIndex + 1,
							total: gallery.currentStoryImages.length
						})}
					{/if}
				</p>
			</div>

			<Button
				size="sm"
				class="bg-white text-black hover:bg-white/90 text-xs px-5 w-full sm:w-auto h-9 font-medium cursor-pointer"
				onclick={() => gallery.activeStory && gallery.selectForBooking(gallery.activeStory, (val) => open = val)}
			>
				{tx.ctaButton}
				<ArrowUpRight data-icon="inline-end" class="ml-1.5 size-3.5" />
			</Button>
		</div>
		</div>
	{/if}
</Dialog.Content>
</Dialog.Root>
