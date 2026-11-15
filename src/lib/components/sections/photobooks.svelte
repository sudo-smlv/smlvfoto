<script lang="ts">
	import { useI18n } from '$lib/i18n.svelte';

	const i18n = useI18n();
	const content = $derived(i18n.content);
	const t = $derived(content.photobooks);

	// The photos of real books are shown whole, side by side, in their own proportions.
	const photos = $derived(t.gallery.length ? t.gallery : [{ ...t.hero, caption: '' }]);
</script>

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

	<!-- gallery: whole photos, no cropping; scrolls sideways on narrow screens -->
	<ul
		class="mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[max(1.25rem,calc((100vw-1400px)/2+2rem))] pb-2 [scrollbar-width:none] sm:px-[max(2rem,calc((100vw-1400px)/2+2rem))] lg:mt-10 lg:justify-center lg:gap-8 [&::-webkit-scrollbar]:hidden"
	>
		{#each photos as photo, i (i)}
			<li class="shrink-0 snap-start">
				<figure class="flex flex-col gap-2">
					<img
						src={photo.src}
						alt={photo.alt}
						width={photo.width}
						height={photo.height}
						loading="lazy"
						decoding="async"
						class="h-[clamp(240px,calc(100svh-30rem),500px)] w-auto rounded-2xl"
					/>
					{#if photo.caption}
						<figcaption class="font-hand text-bark text-xl">{photo.caption}</figcaption>
					{/if}
				</figure>
			</li>
		{/each}
	</ul>
</section>
