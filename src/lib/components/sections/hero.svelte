<script lang="ts">
	import { focusCrop } from '$lib/actions/focus-crop';
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

	function scrollTo(id: string) {
		document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<!-- Exactly one screen tall: viewport minus the floating header (4.75rem). -->
<section
	id="hero"
	class="relative h-[calc(100svh-4.75rem)] min-h-[34rem] overflow-x-clip"
	aria-labelledby="hero-title"
>
	<div
		class="pointer-events-none absolute -top-40 right-[-10%] size-[46rem] rounded-full bg-[radial-gradient(circle,rgb(227_166_70/0.28),transparent_65%)]"
		aria-hidden="true"
	></div>

	<div
		class="relative mx-auto grid h-full max-w-[1400px] grid-rows-[auto_minmax(0,1fr)] gap-6 px-5 pt-4 pb-6 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:grid-rows-1 lg:gap-12 lg:pt-6 lg:pb-8"
	>
		<div class="flex flex-col justify-center gap-6 lg:gap-8">
			<h1
				id="hero-title"
				class="text-bark text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-[clamp(3.5rem,6vw,5.6rem)] lg:leading-[0.98]"
			>
				{titleParts.head}
				<span class="relative inline-block italic">
					<span class="text-honey-ink relative z-10">{titleParts.tail}</span>
					<svg
						class="text-honey absolute -bottom-2 left-0 h-4 w-full"
						viewBox="0 0 300 20"
						preserveAspectRatio="none"
						fill="none"
						aria-hidden="true"
					>
						<path d="M3 14 C 60 4, 120 4, 170 10 S 260 18, 297 6" stroke="currentColor" stroke-width="5" stroke-linecap="round" />
					</svg>
				</span>
			</h1>

			<div class="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
				<button
					type="button"
					onclick={() => scrollTo('contact')}
					class="group bg-honey text-bark inline-flex min-h-14 items-center gap-3 rounded-full py-2 pr-2 pl-7 text-base font-semibold transition-transform hover:-translate-y-0.5"
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
		</div>

		<div class="bg-blush relative min-h-0 overflow-hidden rounded-t-[999px] rounded-b-[2rem] max-lg:rounded-t-[2rem]">
			<img
				src={t.background.src}
				alt={t.background.alt}
				width={t.background.width}
				height={t.background.height}
				fetchpriority="high"
				decoding="async"
				use:focusCrop={t.background.focus}
				style:object-position={t.background.focus
					? `${t.background.focus.x * 100}% ${t.background.focus.y * 100}%`
					: undefined}
				class={['absolute inset-0 h-full w-full object-cover object-center', !t.backgroundInColor && 'grayscale']}
			/>
		</div>
	</div>
</section>
