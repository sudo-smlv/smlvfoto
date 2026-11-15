<script lang="ts">
	import { useI18n } from '$lib/i18n.svelte';
	const i18n = useI18n();
	const content = $derived(i18n.content);
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { AspectRatio } from '$lib/components/ui/aspect-ratio';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Calendar from '@lucide/svelte/icons/calendar';

	const t = $derived(content.hero);

	const plusPositions = [
		{ top: 'top-[18%]', left: 'left-[6%]' },
		{ top: 'top-[60%]', left: 'left-[12%]' },
		{ top: 'top-[30%]', left: 'left-[38%]' },
		{ top: 'top-[66%]', left: 'left-[52%]' },
		{ top: 'top-[22%]', left: 'left-[70%]' }
	] as const;
</script>

<!--
	Hero height = viewport height minus the sticky SiteHeader (h-16 = 4rem)
	minus the section's own vertical padding (py-3 = 0.75rem on each side).
	`svh` is the small viewport height (accounts for mobile address bars).
	`max-h-[82svh]` caps the hero so it never dominates very short viewports.
-->
<section id="hero" class="bg-background py-3 sm:py-4">
	<div
		class="mx-auto h-[calc(100svh-5.5rem)] max-h-[82svh] w-full max-w-[1600px] px-4 sm:h-[calc(100svh-6.5rem)] sm:px-6 lg:h-[calc(100svh-7.5rem)] lg:px-8"
	>
		<div
			class="relative h-full w-full overflow-hidden rounded-2xl border border-foreground/15 bg-foreground shadow-2xl"
		>
			<img
				src={t.background.src}
				alt={t.background.alt}
				width="2400"
				height="1350"
				fetchpriority="high"
				decoding="async"
				class={['absolute inset-0 h-full w-full object-cover', !t.backgroundInColor && 'grayscale']}
			/>

			<!-- A colour photo is brighter, so it gets a slightly deeper shade behind the white text. -->
			<div
				class={[
					'absolute inset-0 bg-gradient-to-r',
					t.backgroundInColor
						? 'from-black/75 via-black/40 to-black/10'
						: 'from-black/70 via-black/35 to-black/15'
				]}
				aria-hidden="true"
			></div>
			{#if t.backgroundInColor}
				<div
					class="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent"
					aria-hidden="true"
				></div>
			{/if}

			<div class="absolute inset-0 p-3 text-white sm:p-5 lg:p-8">
				<span
					aria-hidden="true"
					class="absolute top-2 left-2 h-4 w-4 border-t-2 border-l-2 border-white/90 sm:top-3 sm:left-3 sm:h-7 sm:w-7 sm:border-t-[3px] sm:border-l-[3px] lg:top-4 lg:left-4 lg:h-10 lg:w-10"
				></span>
				<span
					aria-hidden="true"
					class="absolute top-2 right-2 h-4 w-4 border-t-2 border-r-2 border-white/90 sm:top-3 sm:right-3 sm:h-7 sm:w-7 sm:border-t-[3px] sm:border-r-[3px] lg:top-4 lg:right-4 lg:h-10 lg:w-10"
				></span>
				<span
					aria-hidden="true"
					class="absolute bottom-2 right-2 h-4 w-4 border-b-2 border-r-2 border-white/90 sm:bottom-3 sm:right-3 sm:h-7 sm:w-7 sm:border-b-[3px] sm:border-r-[3px] lg:bottom-4 lg:right-4 lg:h-10 lg:w-10"
				></span>
				<span
					aria-hidden="true"
					class="absolute bottom-2 left-2 h-4 w-4 border-b-2 border-l-2 border-white/90 sm:bottom-3 sm:left-3 sm:h-7 sm:w-7 sm:border-b-[3px] sm:border-l-[3px] lg:bottom-4 lg:left-4 lg:h-10 lg:w-10"
				></span>

				{#each plusPositions as p, i (i)}
					<span
						aria-hidden="true"
						class="absolute font-mono font-light text-white/55 sm:text-lg md:text-xl {p.top} {p.left}"
						>+</span
					>
				{/each}

				<div
					class="absolute top-4 left-4 right-4 sm:top-7 sm:left-7 sm:right-7 lg:top-10 lg:left-10 lg:right-10"
				>
					<p
						class="font-mono text-[9px] tracking-[0.4em] text-white/70 uppercase sm:text-[10px] sm:tracking-[0.45em]"
					>
						{t.eyebrow}
					</p>
					<h1
						id="hero-title"
						class="mt-1 max-w-4xl font-serif text-[1.75rem] leading-[0.95] font-medium tracking-tight text-balance sm:mt-2 sm:text-4xl md:text-5xl lg:text-6xl xl:text-[5.5rem]"
					>
						{t.title}
					</h1>
				</div>

				<div
					class="absolute right-4 bottom-4 left-4 sm:right-7 sm:bottom-7 sm:left-7 lg:right-10 lg:bottom-10 lg:left-10"
				>
					<p class="text-[11px] text-white/65 sm:text-xs">{t.locations}</p>

					<div class="mt-3 flex flex-wrap items-center gap-2 sm:mt-5 sm:gap-3">
						<Button
							size="sm"
							class="bg-white text-black hover:bg-white/90 sm:size-default"
							onclick={() =>
								document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
						>
							{t.viewPortfolio}
							<ArrowRight data-icon="inline-end" />
						</Button>
					</div>
				</div>

				<div
					class="absolute right-3 bottom-4 hidden sm:right-5 sm:bottom-7 md:block lg:right-8 lg:bottom-10 xl:block"
				>
					<Card.Root
						class="bg-background w-44 gap-3 overflow-hidden rounded-xl border-0 p-0 shadow-2xl sm:w-52 lg:w-56"
					>
						<AspectRatio ratio={4 / 5}>
							<img
								src={t.card.src}
								alt={t.card.body}
								width="320"
								height="400"
								loading="lazy"
								decoding="async"
								class="h-full w-full object-cover grayscale"
							/>
						</AspectRatio>
						<div class="flex flex-col gap-2 p-3 sm:p-4">
							<p
								class="font-mono text-[9px] tracking-[0.3em] text-muted-foreground uppercase sm:text-[10px]"
							>
								{t.card.title}
							</p>
							<p class="font-serif text-sm leading-tight font-medium sm:text-base">
								{t.card.body}
							</p>
							<Button
								size="sm"
								class="w-full"
								onclick={() =>
									document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
							>
								<Calendar data-icon="inline-start" />
								{t.cta}
							</Button>
						</div>
					</Card.Root>
				</div>
			</div>
		</div>
	</div>
</section>
