<script lang="ts">
	import { useI18n } from '$lib/i18n.svelte';
	const i18n = useI18n();
	const content = $derived(i18n.content);
	import { AspectRatio } from '$lib/components/ui/aspect-ratio';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';

	const t = $derived(content.locations);
	const items = $derived(t.items);
</script>

<section
	id="locations"
	class="bg-foreground text-background py-20 sm:py-32"
	aria-labelledby="locations-title"
>
	<div class="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
		<header class="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
			<div class="max-w-2xl">
				<p class="font-mono text-[10px] tracking-[0.3em] text-background/60 uppercase sm:text-xs">
					{content.sectionLabels.locations}
				</p>
				<h2
					id="locations-title"
					class="mt-4 font-serif text-4xl leading-[0.95] font-medium tracking-tight text-balance sm:text-5xl lg:text-6xl xl:text-7xl"
				>
					{t.heading}
				</h2>
				<p class="text-background/70 mt-6 text-base sm:text-lg">{t.intro}</p>
			</div>

			<p class="font-mono text-[10px] tracking-[0.3em] text-background/55 uppercase sm:text-xs">
				{t.coverage}
			</p>
		</header>

		<div class="mt-16 flex flex-col gap-16 sm:mt-20 sm:gap-24 lg:gap-32">
			{#each items as item, i (item.title)}
				{@const reverse = i % 2 === 1}
				<article
					class="group grid items-center gap-8 sm:gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16 xl:gap-24"
				>
					<figure class="relative overflow-hidden rounded-none {reverse ? 'lg:order-2' : ''}">
						<AspectRatio ratio={4 / 3} class="overflow-hidden">
							<img
								src={item.image.src}
								alt={item.image.alt}
								width={item.image.width}
								height={item.image.height}
								loading="lazy"
								decoding="async"
								class="h-full w-full object-cover grayscale transition-transform duration-700 group-hover:scale-105"
							/>
							<div
								class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
								aria-hidden="true"
							></div>
						</AspectRatio>

						<div class="absolute top-4 left-4 flex items-center gap-2 sm:top-6 sm:left-6">
							<span
								class="bg-background text-foreground flex size-9 items-center justify-center rounded-full font-mono text-xs font-medium sm:size-11 sm:text-sm"
							>
								{item.number}
							</span>
							<span
								class="font-mono text-[10px] tracking-[0.3em] text-background/85 uppercase sm:text-xs"
							>
								{item.type}
							</span>
						</div>

						<div
							class="absolute right-4 bottom-4 left-4 flex flex-wrap items-end justify-between gap-2 sm:right-6 sm:bottom-6 sm:left-6"
						>
							<div class="flex flex-wrap gap-1.5">
								{#each item.tags as tag (tag)}
									<span
										class="bg-foreground/70 text-background border-background/20 rounded-full border px-2 py-0.5 text-[10px] tracking-wider uppercase backdrop-blur sm:text-xs"
									>
										{tag}
									</span>
								{/each}
							</div>
						</div>
					</figure>

					<div class="flex flex-col gap-5">
						<div class="flex items-center gap-3">
							<span
								class="bg-background text-foreground flex size-9 shrink-0 items-center justify-center rounded-full font-mono text-sm font-medium sm:hidden"
								aria-hidden="true"
							>
								{item.number}
							</span>
							<span aria-hidden="true" class="font-serif text-2xl sm:hidden">{item.icon}</span>
						</div>

						<div class="flex flex-col gap-2">
							<p
								class="font-mono text-[10px] tracking-[0.3em] text-background/55 uppercase sm:text-xs"
							>
								{item.icon} · {item.subtitle}
							</p>
							<h3
								class="font-serif text-4xl leading-[0.95] font-medium tracking-tight text-balance sm:text-5xl lg:text-6xl"
							>
								{item.title}
							</h3>
						</div>

						<p class="text-background/75 max-w-prose text-base leading-relaxed sm:text-lg">
							{item.description}
						</p>

						<dl class="border-background/15 mt-2 grid grid-cols-2 gap-px border-y sm:grid-cols-3">
							<div class="flex flex-col gap-1 py-3 sm:py-4">
								<dt class="font-mono text-[10px] tracking-[0.25em] text-background/55 uppercase">
									{t.locationLabels.bestTime}
								</dt>
								<dd class="font-serif text-base sm:text-lg">{item.bestTime}</dd>
							</div>
							<div class="flex flex-col gap-1 py-3 sm:py-4">
								<dt class="font-mono text-[10px] tracking-[0.25em] text-background/55 uppercase">
									{t.locationLabels.shoots}
								</dt>
								<dd class="font-serif text-base sm:text-lg">
									{t.shootCounts[i]}
								</dd>
							</div>
							<div class="flex flex-col gap-1 sm:col-span-1 py-3 sm:py-4">
								<dt class="font-mono text-[10px] tracking-[0.25em] text-background/55 uppercase">
									{t.locationLabels.type}
								</dt>
								<dd class="font-serif text-base sm:text-lg">
									{item.type === 'URBAN' ? t.locationLabels.urban : t.locationLabels.nature}
								</dd>
							</div>
						</dl>

						<a
							href="#portfolio"
							onclick={(e) => {
								e.preventDefault();
								document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
							}}
							class="group/link mt-2 inline-flex w-fit items-center gap-2 font-mono text-[10px] tracking-[0.3em] uppercase sm:text-xs"
						>
							<span
								class="border-background/40 group-hover/link:border-background border-b pb-0.5 transition-colors"
							>
								{t.viewLocation}
							</span>
							<ArrowUpRight
								class="size-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
							/>
						</a>
					</div>
				</article>
			{/each}
		</div>

		<dl
			class="border-background/15 mt-16 grid grid-cols-2 divide-x divide-y divide-background/15 border-y sm:mt-20 sm:grid-cols-4 sm:divide-y-0"
		>
			{#each t.stats as stat (stat.label)}
				<div class="flex flex-col gap-1 px-4 py-5 sm:py-6">
					<dt class="font-mono text-[10px] tracking-[0.25em] text-background/55 uppercase">
						{stat.label}
					</dt>
					<dd class="font-serif text-2xl sm:text-3xl">{stat.value}</dd>
				</div>
			{/each}
		</dl>
	</div>
</section>
