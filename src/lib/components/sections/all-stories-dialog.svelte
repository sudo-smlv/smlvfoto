<script lang="ts">
	import { Dialog } from 'bits-ui';
	import { untrack } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { useI18n, type PortfolioStory } from '$lib/i18n.svelte';
	import { fill } from '$lib/content/build';
	import { createPortfolioGallery } from '$lib/state/portfolio.svelte';

	let {
		open = $bindable(false),
		initialStory = $bindable(null)
	}: {
		open?: boolean;
		initialStory?: PortfolioStory | null;
	} = $props();

	const i18n = useI18n();
	const content = $derived(i18n.content);
	const tx = $derived(content.portfolio.texts);
	const gallery = createPortfolioGallery(i18n);

	const tilts = ['-rotate-[1.5deg]', 'rotate-[1.2deg]', '-rotate-[0.8deg]', 'rotate-[1.8deg]'];

	// Every opening starts from "all shoots" (plus the story that was clicked, if any);
	// closing the window also closes the viewer so it never reappears on the next opening.
	let wasOpen = false;
	$effect(() => {
		const isOpen = open;
		const story = initialStory;
		untrack(() => {
			if (isOpen && !wasOpen) {
				gallery.activeFilter = 'all';
				gallery.activeStory = story;
				gallery.activePhotoIndex = 0;
			} else if (!isOpen) {
				gallery.activeStory = null;
			}
			wasOpen = isOpen;
		});
	});

	function bookShoot() {
		open = false;
		setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 150);
	}
</script>

<svelte:window onkeydown={gallery.handleKeydown} />

<Dialog.Root bind:open>
	<Dialog.Portal>
		<Dialog.Overlay class="bg-bark/55 fixed inset-0 z-50 backdrop-blur-sm" />
		<Dialog.Content
			escapeKeydownBehavior={gallery.activeStory ? 'ignore' : 'close'}
			class="bg-milk text-bark fixed inset-0 z-50 flex flex-col overflow-hidden outline-none sm:inset-6 sm:rounded-[2rem]"
		>
			<!-- Header -->
			<div class="border-line flex shrink-0 flex-col gap-4 border-b px-5 pt-5 pb-4 sm:px-10 sm:pt-8">
				<div class="flex items-start justify-between gap-4">
					<div class="flex flex-wrap items-baseline gap-x-4 gap-y-1">
						<Dialog.Title class="font-display text-3xl sm:text-5xl">{tx.dialogTitle}</Dialog.Title>
						<span class="font-hand text-honey-ink text-2xl">
							{fill(tx.shootCount, { count: gallery.filteredStories.length })}
						</span>
					</div>
					<Dialog.Close
						class="border-line bg-paper hover:bg-cream flex size-11 shrink-0 items-center justify-center rounded-full border transition-colors"
					>
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
						<span class="sr-only">{tx.closeViewer}</span>
					</Dialog.Close>
				</div>
				<Dialog.Description class="sr-only">
					{fill(tx.shootCountLong, { count: gallery.filteredStories.length })}
				</Dialog.Description>

				<div class="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
					{#each gallery.filterOptions as f, fi (fi)}
						<button
							type="button"
							aria-pressed={gallery.activeFilter === f.id}
							onclick={() => (gallery.activeFilter = f.id)}
							class={[
								'min-h-11 shrink-0 rounded-full border px-4 text-sm font-semibold transition-colors',
								gallery.activeFilter === f.id
									? 'bg-honey border-honey text-bark'
									: 'border-line bg-paper text-bark-soft hover:text-bark'
							]}
						>
							{f.label}
							{#if gallery.activeFilter === f.id}
								<span class="ml-1 opacity-70">{gallery.filteredStories.length}</span>
							{/if}
						</button>
					{/each}
				</div>
			</div>

			<!-- Grid -->
			<div class="flex-1 overflow-y-auto overscroll-contain px-5 py-8 sm:px-10">
				{#if gallery.filteredStories.length === 0}
					<div class="flex flex-col items-center gap-5 py-24 text-center">
						<p class="font-hand text-bark-soft text-3xl">{tx.empty}</p>
						<button
							type="button"
							onclick={() => (gallery.activeFilter = 'all')}
							class="bg-fir text-milk min-h-11 rounded-full px-6 font-semibold"
						>
							{tx.showAll}
						</button>
					</div>
				{:else}
					<ul class="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{#each gallery.displayedStories as story, i (story.id)}
							<li>
								<button
									type="button"
									onclick={() => gallery.openStory(story)}
									class="polaroid group block w-full text-left transition-transform duration-300 hover:-translate-y-1 hover:rotate-0 {tilts[i % tilts.length]} [content-visibility:auto] [contain-intrinsic-size:420px]"
								>
									<span class="relative block overflow-hidden">
										<img
											src={story.src}
											alt={story.alt}
											loading="lazy"
											decoding="async"
											class="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
										/>
										{#if story.category}
											<span class="bg-paper/90 text-bark absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-semibold">
												{story.category}
											</span>
										{/if}
										<span class="bg-bark/70 text-milk absolute top-3 right-3 rounded-full px-2.5 py-1 text-xs font-semibold">
											{fill(tx.photoCount, { count: story.images.length || 1 })}
										</span>
									</span>
									<span class="flex flex-col px-1.5 pt-3 pb-4">
										<span class="font-hand text-bark text-2xl leading-none">{story.caption}</span>
										{#if story.location || story.year}
											<span class="text-bark-soft mt-1.5 text-sm">{[story.location, story.year].filter(Boolean).join(' · ')}</span>
										{/if}
									</span>
								</button>
							</li>
						{/each}
					</ul>

					{#if gallery.hasMore}
						<div bind:this={gallery.sentinelEl} class="text-bark-soft flex flex-col items-center gap-3 py-12">
							<span class="border-line border-t-honey size-6 animate-spin rounded-full border-2" aria-hidden="true"></span>
							<p class="font-hand text-xl">
								{fill(tx.loading, { count: gallery.displayedStories.length, total: gallery.filteredStories.length })}
							</p>
						</div>
					{/if}
				{/if}
			</div>

			<!-- Footer -->
			<div class="bg-cream flex shrink-0 flex-col items-center justify-between gap-3 px-5 py-4 sm:flex-row sm:px-10">
				<p class="font-hand text-bark text-2xl">{tx.ctaText}</p>
				<button
					type="button"
					onclick={bookShoot}
					class="bg-honey text-bark min-h-11 w-full rounded-full px-6 font-semibold sm:w-auto"
				>
					{tx.ctaButton}
				</button>
			</div>

			<!-- Lightbox -->
			{#if gallery.activeStory}
				<div
					class="bg-fir text-milk absolute inset-0 z-10 flex flex-col"
					role="dialog"
					tabindex="-1"
					aria-modal="true"
					aria-label={gallery.activeStory.caption}
					transition:fade={{ duration: 180 }}
				>
					<div class="flex shrink-0 items-center justify-between gap-3 px-4 py-4 sm:px-8">
						<div class="min-w-0">
							<p class="font-hand text-honey-light truncate text-2xl leading-none sm:text-3xl">
								{gallery.activeStory.caption}
							</p>
							<p class="text-milk/75 mt-1 truncate text-sm">
								{[
									gallery.activeStory.location,
									gallery.activeStory.year,
									gallery.activeStory.category,
									gallery.currentStoryImages.length > 1
										? fill(tx.frameOf, {
												current: gallery.activePhotoIndex + 1,
												total: gallery.currentStoryImages.length
											})
										: ''
								]
									.filter(Boolean)
									.join(' · ')}
							</p>
						</div>
						<div class="flex shrink-0 items-center gap-2">
							<button type="button" onclick={gallery.prevStoryDirect} class="text-milk/80 hover:text-milk hidden min-h-11 rounded-full px-3 text-sm font-semibold md:block">{tx.prevStory}</button>
							<button type="button" onclick={gallery.nextStoryDirect} class="text-milk/80 hover:text-milk hidden min-h-11 rounded-full px-3 text-sm font-semibold md:block">{tx.nextStory}</button>
							<button
								type="button"
								onclick={() => gallery.activeStory && gallery.selectForBooking(gallery.activeStory, (v) => (open = v))}
								class="bg-honey text-bark hidden min-h-11 rounded-full px-5 text-sm font-semibold sm:block"
							>
								{tx.bookStory}
							</button>
							<button
								type="button"
								onclick={() => (gallery.activeStory = null)}
								class="bg-milk/10 hover:bg-milk/20 flex size-11 items-center justify-center rounded-full"
							>
								<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
								<span class="sr-only">{tx.closeViewer}</span>
							</button>
						</div>
					</div>

					<div class="relative flex min-h-0 flex-1 items-center justify-center gap-2 px-2 sm:gap-6 sm:px-8" role="region" aria-label={tx.viewerLabel}>
						<button type="button" onclick={gallery.prevPhoto} aria-label={tx.prevPhoto} class="bg-milk/10 hover:bg-honey hover:text-bark flex size-12 shrink-0 items-center justify-center rounded-full transition-colors">
							<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
						</button>
						<div
							role="presentation"
							class="flex h-full min-w-0 flex-1 touch-pan-y items-center justify-center"
							ontouchstart={gallery.handleImageTouchStart}
							ontouchend={gallery.handleImageTouchEnd}
						>
							{#key gallery.currentPhoto}
								<img
									src={gallery.currentPhoto}
									alt={gallery.activeStory.alt}
									decoding="async"
									in:fly={{ x: 24, duration: 260 }}
									class="max-h-full max-w-full rounded-2xl object-contain select-none"
								/>
							{/key}
						</div>
						<button type="button" onclick={gallery.nextPhoto} aria-label={tx.nextPhoto} class="bg-milk/10 hover:bg-honey hover:text-bark flex size-12 shrink-0 items-center justify-center rounded-full transition-colors">
							<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
						</button>
					</div>

					<div class="flex shrink-0 flex-col items-center gap-3 px-4 py-4">
						{#if gallery.currentStoryImages.length > 1}
							<div class="flex max-w-full gap-2 overflow-x-auto">
								{#each gallery.currentStoryImages as imgUrl, idx (idx)}
									<button
										type="button"
										onclick={() => (gallery.activePhotoIndex = idx)}
										aria-current={gallery.activePhotoIndex === idx}
										class={[
											'size-14 shrink-0 overflow-hidden rounded-xl border-2 transition',
											gallery.activePhotoIndex === idx ? 'border-honey' : 'border-transparent opacity-55 hover:opacity-100'
										]}
									>
										<img src={imgUrl} alt={tx.thumbnail} class="h-full w-full object-cover" />
									</button>
								{/each}
							</div>
						{/if}
						<button
							type="button"
							onclick={() => gallery.activeStory && gallery.selectForBooking(gallery.activeStory, (v) => (open = v))}
							class="bg-honey text-bark min-h-11 w-full rounded-full px-6 text-sm font-semibold sm:hidden"
						>
							{tx.ctaButton}
						</button>
					</div>
				</div>
			{/if}
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
