<script lang="ts">
	import { useI18n } from '$lib/i18n.svelte';

	const i18n = useI18n();
	const content = $derived(i18n.content);
	const t = $derived(content.locations);

	const grounds = ['bg-blush', 'bg-sage'];
</script>

<section id="locations" class="screen relative" aria-labelledby="locations-title">
	<div class="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
		<header class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
			<div class="flex max-w-2xl flex-col gap-3">
				<p class="hand-note">{content.sectionLabels.locations}</p>
				<h2 id="locations-title" class="text-4xl leading-[1.05] lg:text-[clamp(2.25rem,5.4svh,3rem)]">{t.heading}</h2>
				<p class="text-bark-soft max-w-xl">{t.intro}</p>
			</div>
		</header>

		<div class="mt-6 grid gap-6 lg:grid-cols-2">
			{#each t.items as item, i (i)}
				<article class="{grounds[i % grounds.length]} relative flex flex-col rounded-[2rem] p-3 shadow-[0_30px_60px_-36px_rgb(46_36_25/0.5)]">
					<div class="relative overflow-hidden rounded-[1.5rem]">
						<img
							src={item.image.src}
							alt={item.image.alt}
							width={item.image.width}
							height={item.image.height}
							loading="lazy"
							decoding="async"
							class="h-[clamp(180px,calc(100svh-38.5rem),420px)] w-full object-cover"
						/>
						<!-- stamp -->
						<div class="ticket bg-paper absolute top-3 right-3 flex w-20 flex-col items-center rounded-md px-2 py-2.5 text-center shadow-md [--hole:5px]">
							<span class="text-xl leading-none" aria-hidden="true">{item.icon}</span>
							<span class="font-display text-bark text-lg leading-none">{item.number}</span>
							<span class="text-bark-soft text-[0.6rem] font-bold tracking-[0.14em] uppercase">
								{item.type === 'NATURE' ? t.locationLabels.nature : t.locationLabels.urban}
							</span>
						</div>
					</div>

					<div class="flex flex-1 flex-col gap-2.5 px-3 pt-5 pb-3 sm:px-4">
						<div class="flex flex-wrap items-baseline justify-between gap-x-4">
							<h3 class="text-3xl">{item.title}</h3>
							{#if t.shootCounts[i]}
								<p class="text-bark-soft text-sm">
									<span class="font-display text-bark text-xl">{t.shootCounts[i]}</span>
									{t.locationLabels.shoots}
								</p>
							{/if}
						</div>
						<p class="font-hand text-honey-ink text-xl leading-tight">{item.subtitle}</p>
						<p class="text-bark-soft text-[0.95rem]">{item.description}</p>
						<div class="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
							<ul class="flex flex-wrap gap-2">
								{#each item.tags as tag, ti (ti)}
									<li class="bg-paper/80 text-bark rounded-full px-3 py-1 text-sm font-semibold">#{tag}</li>
								{/each}
							</ul>
							<button
								type="button"
								onclick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
								class="text-bark decoration-honey-ink inline-flex min-h-11 items-center gap-2 font-semibold underline decoration-2 underline-offset-[6px]"
							>
								{t.viewLocation}
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8" /></svg>
							</button>
						</div>
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>
