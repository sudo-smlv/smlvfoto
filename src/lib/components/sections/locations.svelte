<script lang="ts">
	import { useI18n } from '$lib/i18n.svelte';

	const i18n = useI18n();
	const content = $derived(i18n.content);
	const t = $derived(content.locations);

	const tilts = ['lg:-rotate-[1.5deg]', 'lg:rotate-[1.5deg] lg:mt-20'];
	const grounds = ['bg-blush', 'bg-sage'];
</script>

<section id="locations" class="relative py-24 sm:py-32" aria-labelledby="locations-title">
	<div class="mx-auto max-w-[1400px] px-5 sm:px-8">
		<header class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
			<div class="flex max-w-2xl flex-col gap-5">
				<p class="hand-note">{content.sectionLabels.locations}</p>
				<h2 id="locations-title" class="text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">{t.heading}</h2>
				<p class="text-bark-soft text-lg">{t.intro}</p>
			</div>
			<p class="font-hand text-bark-soft text-2xl">{t.coverage}</p>
		</header>

		<div class="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-16">
			{#each t.items as item, i (i)}
				<article class="{grounds[i % grounds.length]} {tilts[i % tilts.length]} relative rounded-[2rem] p-3 shadow-[0_30px_60px_-36px_rgb(46_36_25/0.5)] sm:p-4">
					<div class="relative overflow-hidden rounded-[1.5rem]">
						<img
							src={item.image.src}
							alt={item.image.alt}
							width={item.image.width}
							height={item.image.height}
							loading="lazy"
							decoding="async"
							class="aspect-[4/3] w-full object-cover"
						/>
						<!-- stamp -->
						<div class="ticket bg-paper absolute top-4 right-4 flex w-24 flex-col items-center gap-0.5 rounded-md px-2 py-3 text-center shadow-md [--hole:5px]">
							<span class="text-2xl leading-none" aria-hidden="true">{item.icon}</span>
							<span class="font-display text-bark text-xl leading-none">{item.number}</span>
							<span class="text-bark-soft text-[0.65rem] font-bold tracking-[0.14em] uppercase">
								{item.type === 'NATURE' ? t.locationLabels.nature : t.locationLabels.urban}
							</span>
						</div>
						<!-- postmark -->
						<div class="border-paper text-paper absolute bottom-4 left-4 flex size-28 rotate-[-12deg] flex-col items-center justify-center rounded-full border-2 border-dashed bg-[rgb(46_36_25/0.35)] text-center backdrop-blur-[2px]">
							<span class="text-[0.6rem] font-bold tracking-[0.16em] uppercase">{t.locationLabels.bestTime}</span>
							<span class="font-hand px-2 text-xl leading-tight">{item.bestTime}</span>
						</div>
					</div>

					<div class="flex flex-col gap-4 px-3 pt-7 pb-5 sm:px-5">
						<h3 class="text-3xl sm:text-4xl">{item.title}</h3>
						<p class="font-hand text-honey-ink text-2xl leading-tight">{item.subtitle}</p>
						<p class="text-bark-soft">{item.description}</p>
						<div class="flex flex-wrap items-center justify-between gap-4 pt-2">
							<ul class="flex flex-wrap gap-2">
								{#each item.tags as tag, ti (ti)}
									<li class="bg-paper/80 text-bark rounded-full px-3.5 py-1.5 text-sm font-semibold">#{tag}</li>
								{/each}
							</ul>
							{#if t.shootCounts[i]}
								<p class="text-bark-soft text-sm">
									<span class="font-display text-bark text-2xl">{t.shootCounts[i]}</span>
									{t.locationLabels.shoots}
								</p>
							{/if}
						</div>
						<button
							type="button"
							onclick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
							class="text-bark decoration-honey-ink mt-2 inline-flex min-h-11 items-center gap-2 self-start font-semibold underline decoration-2 underline-offset-[6px]"
						>
							{t.viewLocation}
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8" /></svg>
						</button>
					</div>
				</article>
			{/each}
		</div>

		<!-- route of facts -->
		<ol class="relative mt-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
			<svg class="text-honey-ink/50 absolute top-[11px] left-0 hidden h-3 w-full lg:block" viewBox="0 0 1000 12" preserveAspectRatio="none" fill="none" aria-hidden="true">
				<path d="M0 6 C 150 -2, 250 14, 400 6 S 700 -2, 1000 6" stroke="currentColor" stroke-width="2" stroke-dasharray="2 8" stroke-linecap="round" />
			</svg>
			{#each t.stats as stat, si (si)}
				<li class="relative flex flex-col gap-2">
					<span class="bg-honey ring-milk relative z-10 size-6 rounded-full ring-4" aria-hidden="true"></span>
					<span class="font-hand text-honey-ink text-2xl leading-none">{stat.label}</span>
					<span class="font-display text-bark text-xl">{stat.value}</span>
				</li>
			{/each}
		</ol>
	</div>
</section>
