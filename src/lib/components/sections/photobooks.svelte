<script lang="ts">
	import { Dialog } from 'bits-ui';
	import { fly } from 'svelte/transition';
	import { focusCrop } from '$lib/actions/focus-crop';
	import { useI18n } from '$lib/i18n.svelte';
	import { fill } from '$lib/content/build';
	import type { CmsImage } from '$lib/content/localize';

	const i18n = useI18n();
	const content = $derived(i18n.content);
	const t = $derived(content.photobooks);
	const tx = $derived(content.portfolio.texts);

	// The photos of real books are shown whole, side by side, in their own proportions.
	const items = $derived(
		t.gallery.length ? t.gallery : [{ ...t.hero, caption: '', photos: [t.hero] as CmsImage[] }]
	);

	// Opening a card shows all of its photos in a viewer.
	let viewer = $state<{ item: number; photo: number } | null>(null);
	const open = $derived(viewer !== null);
	const current = $derived(viewer ? items[viewer.item] : null);
	const photo = $derived(current && viewer ? current.photos[viewer.photo] : null);

	function step(dir: 1 | -1) {
		if (!viewer || !current) return;
		const n = current.photos.length;
		viewer = { ...viewer, photo: (viewer.photo + dir + n) % n };
	}

	function onKey(e: KeyboardEvent) {
		if (!viewer) return;
		if (e.key === 'ArrowRight') step(1);
		else if (e.key === 'ArrowLeft') step(-1);
	}

	let touchX = 0;
</script>

<svelte:window onkeydown={onKey} />

<section id="photobooks" class="screen bg-blush relative" aria-labelledby="photobooks-title">
	<div class="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
		<header class="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-14">
			<div class="flex flex-col gap-3">
				<p class="hand-note">{content.sectionLabels.photobooks}</p>
				<h2 id="photobooks-title" class="text-4xl leading-[1.05] lg:text-[clamp(2.25rem,5.4svh,3rem)]">{t.heading}</h2>
				<p class="text-bark-soft max-w-xl">{t.intro}</p>
			</div>

			<div class="flex flex-col gap-4">
				<ol class="grid gap-4 sm:grid-cols-3">
					{#each t.features as feature, i (i)}
						<li class="flex flex-col gap-1">
							<span class="font-hand text-honey-ink text-xl leading-none">{i + 1} · {feature.title}</span>
							<span class="text-bark-soft text-sm">{feature.description}</span>
						</li>
					{/each}
				</ol>
				<div class="flex flex-wrap items-center gap-x-5 gap-y-2">
					<button
						type="button"
						onclick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
						class="bg-fir text-milk hover:bg-fir-soft min-h-12 shrink-0 rounded-full px-7 font-semibold transition-colors"
					>
						{t.cta}
					</button>
					<span class="font-hand text-bark-soft text-xl leading-tight">{t.coverage}</span>
				</div>
			</div>
		</header>
	</div>

	<!--
		Gallery across the full width. On laptops/desktops the photos share the row equally and the
		one under the pointer widens; on phones it is a sideways-scrolling strip.
	-->
	<ul
		class="mt-8 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 sm:scroll-px-8 [scrollbar-width:none] sm:px-8 lg:mt-10 lg:h-[clamp(260px,calc(100svh-28rem),520px)] lg:snap-none lg:gap-3 lg:overflow-visible lg:px-5 [&::-webkit-scrollbar]:hidden"
	>
		{#each items as item, i (i)}
			<li
				class="group relative shrink-0 snap-start overflow-hidden rounded-2xl lg:shrink lg:flex-[1_1_0%] lg:transition-[flex-grow] lg:duration-500 lg:ease-out lg:hover:grow-[2.6]"
			>
				<button
					type="button"
					onclick={() => (viewer = { item: i, photo: 0 })}
					class="block h-full w-full cursor-zoom-in text-left"
					aria-label={item.caption || item.alt}
				>
					<img
						src={item.src}
						alt={item.alt}
						width={item.width}
						height={item.height}
						loading="lazy"
						decoding="async"
						use:focusCrop={item.focus}
						class="h-[clamp(240px,52svh,420px)] w-auto object-cover lg:h-full lg:w-full lg:transition-transform lg:duration-700 lg:group-hover:scale-[1.03]"
					/>
					{#if item.photos.length > 1}
						<span class="bg-paper/90 text-bark absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur">
							{fill(tx.photoCount, { count: item.photos.length })}
						</span>
					{/if}
					{#if item.caption}
						<span class="font-hand bg-paper/90 text-bark absolute bottom-3 left-3 rounded-full px-4 py-1 text-xl whitespace-nowrap">
							{item.caption}
						</span>
					{/if}
				</button>
			</li>
		{/each}
	</ul>

	<Dialog.Root open={open} onOpenChange={(v) => !v && (viewer = null)}>
		<Dialog.Portal>
			<Dialog.Overlay class="bg-bark/92 fixed inset-0 z-50 backdrop-blur-md" />
			<Dialog.Content
				class="text-milk fixed inset-0 z-50 flex flex-col outline-none"
				onclick={(e) => e.target === e.currentTarget && (viewer = null)}
			>
				{#if current && photo && viewer}
					<div class="flex shrink-0 items-center justify-between gap-3 px-4 py-4 sm:px-8">
						<div class="min-w-0">
							<Dialog.Title class="font-hand text-honey-light truncate text-2xl leading-none sm:text-3xl">
								{current.caption || t.heading}
							</Dialog.Title>
							{#if current.photos.length > 1}
								<p class="text-milk/75 mt-1 text-sm">
									{fill(tx.frameOf, { current: viewer.photo + 1, total: current.photos.length })}
								</p>
							{/if}
						</div>
						<Dialog.Close class="bg-milk/10 hover:bg-milk/20 flex size-11 shrink-0 items-center justify-center rounded-full">
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
							<span class="sr-only">{tx.closeViewer}</span>
						</Dialog.Close>
					</div>

					<div
						class="relative flex min-h-0 flex-1 items-center justify-center gap-2 px-2 pb-6 sm:gap-6 sm:px-8"
						role="region"
						aria-label={tx.viewerLabel}
					>
						{#if current.photos.length > 1}
							<button type="button" onclick={() => step(-1)} aria-label={tx.prevPhoto} class="bg-milk/10 hover:bg-honey hover:text-bark flex size-12 shrink-0 items-center justify-center rounded-full transition-colors">
								<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
							</button>
						{/if}
						<div
							role="presentation"
							class="flex h-full min-w-0 flex-1 touch-pan-y items-center justify-center"
							ontouchstart={(e) => (touchX = e.touches[0].clientX)}
							ontouchend={(e) => {
								const dx = e.changedTouches[0].clientX - touchX;
								if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
							}}
						>
							{#key photo.src}
								<img
									src={photo.src}
									alt={photo.alt}
									decoding="async"
									in:fly={{ x: 24, duration: 260 }}
									class="max-h-full max-w-full rounded-2xl object-contain select-none"
								/>
							{/key}
						</div>
						{#if current.photos.length > 1}
							<button type="button" onclick={() => step(1)} aria-label={tx.nextPhoto} class="bg-milk/10 hover:bg-honey hover:text-bark flex size-12 shrink-0 items-center justify-center rounded-full transition-colors">
								<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
							</button>
						{/if}
					</div>
					<Dialog.Description class="sr-only">{photo.alt}</Dialog.Description>
					<!-- warm the cache so flipping to the next photo is instant -->
					<div class="hidden" aria-hidden="true">
						{#each current.photos as p, pi (pi)}<img src={p.src} alt="" />{/each}
					</div>
				{/if}
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>
</section>
