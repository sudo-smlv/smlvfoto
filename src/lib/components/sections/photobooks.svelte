<script lang="ts">
	import { useI18n } from '$lib/i18n.svelte';

	const i18n = useI18n();
	const content = $derived(i18n.content);
	const t = $derived(content.photobooks);

	// First gallery photo fills the left page, the next three share the right page.
	const featured = $derived(t.gallery[0] ?? t.hero);
	const rest = $derived(t.gallery.slice(1, 4));
</script>

<section id="photobooks" class="bg-blush relative screen" aria-labelledby="photobooks-title">
	<div class="mx-auto grid w-full max-w-[1400px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
		<!-- open book -->
		<div class="relative mx-auto w-full max-w-[min(100%,calc(60svh*1.25))]">
			<div class="bg-paper relative grid grid-cols-2 rounded-[1.75rem] p-3 shadow-[0_40px_70px_-36px_rgb(46_36_25/0.6)] sm:p-5">
				<div class="pointer-events-none absolute inset-y-3 left-1/2 w-10 -translate-x-1/2 bg-gradient-to-r from-transparent via-[rgb(46_36_25/0.14)] to-transparent sm:inset-y-5" aria-hidden="true"></div>

				<figure class="flex flex-col gap-2 pr-2 sm:pr-4">
					<img
						src={featured.src}
						alt={featured.alt}
						loading="lazy"
						decoding="async"
						class="aspect-[3/4] w-full rounded-l-xl rounded-r-sm object-cover"
					/>
					{#if 'caption' in featured}
						<figcaption class="font-hand text-bark-soft text-center text-xl">{featured.caption}</figcaption>
					{/if}
				</figure>

				<div class="flex flex-col gap-3 pl-2 sm:gap-4 sm:pl-4">
					{#each rest as item, i (i)}
						<figure class="flex items-center gap-3">
							<img
								src={item.src}
								alt={item.alt}
								loading="lazy"
								decoding="async"
								class="aspect-square w-1/2 shrink-0 rounded-r-xl rounded-l-sm object-cover sm:w-3/5"
							/>
							<figcaption class="font-hand text-bark text-lg leading-tight sm:text-xl">
								<span class="text-honey-ink block">{t.galleryLabels[i + 1]}</span>
								{item.caption}
							</figcaption>
						</figure>
					{/each}
				</div>
			</div>
			<!-- ribbon bookmark -->
			<span class="bg-honey absolute -top-3 right-[22%] h-24 w-6 [clip-path:polygon(0_0,100%_0,100%_100%,50%_82%,0_100%)]" aria-hidden="true"></span>
		</div>

		<div class="flex flex-col gap-4">
			<p class="hand-note">{content.sectionLabels.photobooks}</p>
			<h2 id="photobooks-title" class="text-4xl leading-[1.05] lg:text-[clamp(2.25rem,5.4svh,3rem)]">{t.heading}</h2>
			<p class="text-bark-soft">{t.intro}</p>

			<div class="flex flex-col gap-1">
				<h3 class="font-hand text-bark text-2xl">{t.featuresHeading}</h3>
				<ol class="flex flex-col">
					{#each t.features as feature, i (i)}
						<li class="border-bark/10 flex gap-4 border-b py-2 last:border-b-0">
							<span class="bg-paper text-honey-ink font-display flex size-10 shrink-0 items-center justify-center rounded-full text-lg italic">{i + 1}</span>
							<div class="flex flex-col gap-1">
								<span class="font-display text-xl">{feature.title}</span>
								<span class="text-bark-soft text-sm">{feature.description}</span>
							</div>
						</li>
					{/each}
				</ol>
			</div>

			<div class="flex items-center gap-5 pt-1">
				<button
					type="button"
					onclick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
					class="bg-fir text-milk hover:bg-fir-soft min-h-14 shrink-0 rounded-full px-8 font-semibold transition-colors"
				>
					{t.cta}
				</button>
				<span class="font-hand text-bark-soft text-xl leading-tight">{t.coverage}</span>
			</div>
		</div>
	</div>
</section>
