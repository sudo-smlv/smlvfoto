<script lang="ts">
	import { useI18n } from '$lib/i18n.svelte';

	const i18n = useI18n();
	const content = $derived(i18n.content);
	const t = $derived(content.hero);

	// The last two words of the headline get the hand-drawn highlight.
	const titleParts = $derived.by(() => {
		const words = t.title.trim().split(/\s+/);
		const tail = words.length > 3 ? 2 : 1;
		return { head: words.slice(0, -tail).join(' '), tail: words.slice(-tail).join(' ') };
	});

	// Circular sticker text, repeated so it fills the ring.
	const ring = $derived(`${t.card.title} · ${t.card.body} · `);

	const ribbon = $derived(Array.from({ length: 6 }, () => t.stat));

	function scrollTo(id: string) {
		document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<section id="hero" class="relative overflow-hidden pt-6 pb-10 sm:pt-10" aria-labelledby="hero-title">
	<!-- soft sun behind everything -->
	<div
		class="bg-honey/25 pointer-events-none absolute -top-40 right-[-10%] size-[46rem] rounded-full blur-3xl"
		aria-hidden="true"
	></div>

	<div
		class="relative mx-auto grid max-w-[1400px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-8"
	>
		<div class="relative z-10 flex flex-col gap-7 lg:py-10">
			<p class="hand-note">{t.eyebrow}</p>

			<h1
				id="hero-title"
				class="text-bark text-[2.9rem] leading-[1.02] sm:text-6xl lg:text-[5.4rem] lg:leading-[0.98]"
			>
				{titleParts.head}
				<span class="relative inline-block whitespace-nowrap italic">
					<span class="text-honey-ink relative z-10">{titleParts.tail}</span>
					<svg
						class="text-honey absolute -bottom-2 left-0 h-4 w-full"
						viewBox="0 0 300 20"
						preserveAspectRatio="none"
						fill="none"
						aria-hidden="true"
					>
						<path
							d="M3 14 C 60 4, 120 4, 170 10 S 260 18, 297 6"
							stroke="currentColor"
							stroke-width="5"
							stroke-linecap="round"
						/>
					</svg>
				</span>
			</h1>

			<p class="text-bark-soft max-w-xl text-lg leading-relaxed sm:text-xl">{t.subtitle}</p>

			<div class="flex flex-wrap items-center gap-x-6 gap-y-4">
				<button
					type="button"
					onclick={() => scrollTo('contact')}
					class="group bg-honey text-bark inline-flex min-h-14 items-center gap-3 rounded-full py-2 pr-2 pl-7 text-base font-semibold shadow-[0_12px_30px_-12px_rgb(143_87_16/0.6)] transition-transform hover:-translate-y-0.5"
				>
					{t.cta}
					<span
						class="bg-bark text-milk flex size-10 items-center justify-center rounded-full transition-transform group-hover:rotate-[-35deg]"
						aria-hidden="true"
					>
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
					</span>
				</button>
				<button
					type="button"
					onclick={() => scrollTo('portfolio')}
					class="text-bark decoration-honey inline-flex min-h-11 items-center gap-2 text-base font-semibold underline decoration-2 underline-offset-[6px] hover:decoration-[3px]"
				>
					{t.viewPortfolio}
					<svg width="34" height="18" viewBox="0 0 34 18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M2 12c8-8 18-9 28-4M24 3l6 5-7 3" /></svg>
				</button>
			</div>

			<p class="text-bark-soft flex items-start gap-2 text-sm sm:text-base">
				<svg class="text-honey-ink mt-0.5 shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
				<span>{t.locations.replace(/^📍\s*/, '')}</span>
			</p>
		</div>

		<!-- Photo composition -->
		<div class="relative mx-auto w-full max-w-[560px] lg:max-w-none">
			<div
				class="bg-blush relative aspect-[4/5] w-full overflow-hidden rounded-t-full rounded-b-[2.5rem] shadow-[0_40px_80px_-40px_rgb(46_36_25/0.55)] sm:aspect-[5/6]"
			>
				<img
					src={t.background.src}
					alt={t.background.alt}
					width={t.background.width}
					height={t.background.height}
					fetchpriority="high"
					decoding="async"
					class={[
						'absolute inset-0 h-full w-full object-cover object-center',
						!t.backgroundInColor && 'grayscale'
					]}
				/>
			</div>

			<!-- polaroid with the photographer -->
			<figure
				class="polaroid absolute -bottom-8 -left-3 w-[38%] max-w-[210px] rotate-[-7deg] sm:-left-10"
			>
				<span class="tape -top-3 left-1/2 -translate-x-1/2 rotate-[4deg]" aria-hidden="true"></span>
				<img
					src={t.card.src}
					alt={t.card.title}
					loading="eager"
					class="aspect-[4/5] w-full object-cover"
				/>
				<figcaption class="font-hand text-bark py-2 text-center text-xl leading-tight sm:text-2xl">
					{t.card.title}
				</figcaption>
			</figure>

			<!-- rotating sticker -->
			<div
				class="bg-fir text-milk absolute -top-2 right-0 flex size-28 items-center justify-center rounded-full sm:-right-4 sm:size-36"
				aria-hidden="true"
			>
				<svg viewBox="0 0 100 100" class="animate-spin-slow absolute inset-0 size-full">
					<defs>
						<path id="hero-ring" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
					</defs>
					<text class="fill-honey-light font-sans text-[8.4px] font-semibold tracking-[0.18em] uppercase">
						<textPath href="#hero-ring" textLength="236" lengthAdjust="spacingAndGlyphs">{ring}</textPath>
					</text>
				</svg>
				<svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor" class="text-honey"><path d="M12 21s-7.5-4.6-9.3-9.2C1.4 8.4 3.6 5 7 5c2 0 3.4 1.1 5 3 1.6-1.9 3-3 5-3 3.4 0 5.6 3.4 4.3 6.8C19.5 16.4 12 21 12 21z" /></svg>
			</div>
		</div>
	</div>

	<!-- Ribbon -->
	<div class="relative mt-20 -rotate-[1.6deg] sm:mt-24" aria-hidden="true">
		<div class="bg-honey text-bark flex overflow-hidden py-3.5 whitespace-nowrap">
			<div class="animate-marquee flex shrink-0 items-center gap-8 pr-8">
				{#each [...ribbon, ...ribbon] as line, i (i)}
					<span class="font-display text-xl italic sm:text-2xl">{line}</span>
					<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z" /></svg>
				{/each}
			</div>
		</div>
	</div>
	<p class="sr-only">{t.stat}</p>
</section>
