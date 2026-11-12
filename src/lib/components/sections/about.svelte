<script lang="ts">
	import { useI18n } from '$lib/i18n.svelte';
	const i18n = useI18n();
	const content = $derived(i18n.content);

	const t = $derived(content.about);
</script>

<section id="about" class="bg-background py-20 sm:py-32" aria-labelledby="about-title">
	<div class="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
		<div class="grid items-stretch gap-0 lg:grid-cols-2">
			<figure
				class="relative aspect-[3/4] overflow-hidden bg-foreground sm:aspect-[4/5] lg:aspect-auto lg:h-full group"
			>
				<img
					src={t.portrait.src}
					alt={t.portrait.alt}
					width={t.portrait.width}
					height={t.portrait.height}
					fetchpriority="high"
					decoding="async"
					class="absolute inset-0 h-full w-full object-cover grayscale contrast-[1.03] transition-transform duration-700 group-hover:scale-105"
				/>
				<div
					class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"
					aria-hidden="true"
				></div>
				<figcaption
					class="absolute right-4 bottom-4 left-4 font-mono text-[10px] tracking-[0.3em] text-white/90 uppercase sm:right-6 sm:bottom-6 sm:left-6 sm:text-xs"
				>
					{t.caption}
				</figcaption>
			</figure>

			<div
				class="flex flex-col justify-center gap-8 px-4 py-12 sm:gap-10 sm:px-8 sm:py-16 lg:px-16 lg:py-20"
			>
				<div class="flex flex-col gap-5">
					<p
						class="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase sm:text-xs"
					>
						{content.sectionLabels.about}
					</p>
					<h2
						id="about-title"
						class="font-serif text-3xl leading-[1.05] font-medium tracking-tight text-balance sm:text-5xl lg:text-6xl xl:text-7xl"
					>
						{t.heading}
					</h2>
				</div>

				<blockquote class="border-foreground/20 border-l-2 pl-4 sm:border-l-[3px] sm:pl-6">
					<p class="font-serif text-lg leading-snug font-medium italic sm:text-2xl lg:text-3xl">
						{t.statement}
					</p>
				</blockquote>

				<dl
					class="border-foreground/15 grid grid-cols-2 divide-x divide-y divide-foreground/15 border-y sm:grid-cols-4 sm:divide-y-0"
				>
					{#each t.stats as s, i (i)}
						<div class="flex flex-col gap-1 px-3 py-4 sm:px-5 sm:py-5">
							<dt
								class="font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase sm:text-[11px]"
							>
								0{i + 1}
							</dt>
							<dd class="font-serif text-3xl font-medium leading-none sm:text-4xl">
								{s.value}
							</dd>
							<dd class="text-muted-foreground text-xs sm:text-sm">
								{s.label}
							</dd>
						</div>
					{/each}
				</dl>
			</div>
		</div>
	</div>
</section>
