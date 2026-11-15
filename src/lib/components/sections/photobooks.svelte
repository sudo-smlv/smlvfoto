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

	<!--
		Gallery across the full width. On laptops/desktops the photos share the row equally and the
		one under the pointer widens; on phones it is a sideways-scrolling strip.
	-->
	<ul
		class="mt-8 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 sm:scroll-px-8 [scrollbar-width:none] sm:px-8 lg:mt-10 lg:h-[clamp(260px,calc(100svh-28rem),520px)] lg:snap-none lg:gap-3 lg:overflow-visible lg:px-5 [&::-webkit-scrollbar]:hidden"
	>
		{#each photos as photo, i (i)}
			<li
				class="group relative shrink-0 snap-start overflow-hidden rounded-2xl lg:shrink lg:flex-[1_1_0%] lg:transition-[flex-grow] lg:duration-500 lg:ease-out lg:hover:grow-[2.6]"
			>
				<img
					src={photo.src}
					alt={photo.alt}
					width={photo.width}
					height={photo.height}
					loading="lazy"
					decoding="async"
					class="h-[clamp(240px,52svh,420px)] w-auto object-cover lg:h-full lg:w-full lg:transition-transform lg:duration-700 lg:group-hover:scale-[1.03]"
				/>
				{#if photo.caption}
					<span class="font-hand bg-paper/90 text-bark absolute bottom-3 left-3 rounded-full px-4 py-1 text-xl whitespace-nowrap">
						{photo.caption}
					</span>
				{/if}
			</li>
		{/each}
	</ul>
</section>
