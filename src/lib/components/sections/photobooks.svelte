<script lang="ts">
	import { useI18n } from '$lib/i18n.svelte';
	const i18n = useI18n();
	const content = $derived(i18n.content);
	import { Button } from '$lib/components/ui/button';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';

	const t = $derived(content.photobooks);

	// First gallery photo is the large one, the next three form the strip below.
	const featured = $derived(t.gallery[0] ?? t.hero);
	const filmstrip = $derived(t.gallery.slice(1, 4));
</script>

<section id="photobooks" class="bg-background py-20 sm:py-32" aria-labelledby="photobooks-title">
	<div class="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
		<header class="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
			<div class="max-w-2xl">
				<p
					class="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase sm:text-xs"
				>
					{content.sectionLabels.photobooks}
				</p>
				<h2
					id="photobooks-title"
					class="mt-4 font-serif text-4xl leading-[0.95] font-medium tracking-tight text-balance sm:text-5xl lg:text-6xl xl:text-7xl"
				>
					{t.heading}
				</h2>
				<p class="text-muted-foreground mt-6 text-base sm:text-lg">{t.intro}</p>
			</div>

			<div class="text-muted-foreground flex items-center gap-4 text-xs sm:text-sm">
				<span class="font-mono tracking-[0.2em] uppercase">{t.coverage}</span>
			</div>
		</header>

		<div class="mt-14 grid gap-8 sm:mt-16 lg:grid-cols-12 lg:gap-12">
			<div class="lg:col-span-7">
				<div
					class="group relative overflow-hidden rounded-xl bg-card border border-border/40 shadow-sm"
				>
					<img
						src={featured.src}
						alt={featured.alt}
						loading="lazy"
						decoding="async"
						class="aspect-[4/3] w-full object-cover grayscale contrast-[1.02] transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0"
					/>
				</div>
			</div>

			<div
				class="flex flex-col justify-center gap-8 lg:col-span-5 lg:gap-10 lg:sticky lg:top-16 lg:self-start"
			>
				<p
					class="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase sm:text-xs"
				>
					{t.featuresHeading}
				</p>

				<div class="flex flex-col">
					{#each t.features as feature, i (i)}
						<div
							class="flex flex-col gap-2 border-t border-foreground/10 py-6 first:border-t-0 first:pt-0 sm:py-7"
						>
							<div class="flex items-baseline gap-3">
								<span
									class="font-mono text-[10px] tracking-[0.2em] text-muted-foreground tabular-nums sm:text-xs"
								>
									0{i + 1}
								</span>
								<h3 class="font-serif text-xl font-medium sm:text-2xl">
									{feature.title}
								</h3>
							</div>
							<p class="text-muted-foreground pl-7 text-sm leading-relaxed sm:text-base">
								{feature.description}
							</p>
						</div>
					{/each}
				</div>

				<Button
					size="lg"
					class="bg-foreground text-background hover:bg-foreground/90 w-full"
					onclick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
				>
					{t.cta}
					<ArrowUpRight data-icon="inline-end" class="ml-0.5" />
				</Button>
			</div>
		</div>

		<div class="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
			{#each filmstrip as item, i (i)}
				<figure
					class="group relative overflow-hidden rounded-xl bg-card border border-border/40 shadow-sm transition-all duration-300 hover:shadow-lg"
				>
					<div class="aspect-[3/4] sm:aspect-[4/5] w-full overflow-hidden bg-foreground/5 relative">
						<img
							src={item.src}
							alt={item.alt}
							loading="lazy"
							decoding="async"
							class="h-full w-full object-cover object-center grayscale contrast-[1.02] transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0"
						/>
						<div
							class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"
							aria-hidden="true"
						></div>
					</div>

					<figcaption
						class="absolute inset-x-0 bottom-0 p-4 text-white flex items-end justify-between gap-2 pointer-events-none"
					>
						<div>
							<p class="font-mono text-[10px] tracking-[0.25em] text-white/70 uppercase">
								0{i + 1} · {item.caption}
							</p>
							<p class="font-serif text-sm font-medium leading-tight text-white/95 mt-0.5">
								{item.alt}
							</p>
						</div>
					</figcaption>
				</figure>
			{/each}
		</div>
	</div>
</section>
