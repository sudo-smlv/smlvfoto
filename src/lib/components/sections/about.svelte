<script lang="ts">
	import { useI18n } from '$lib/i18n.svelte';

	const i18n = useI18n();
	const content = $derived(i18n.content);
	const t = $derived(content.about);

	// Each stat gets its own hand-drawn ring, slightly different so they feel drawn.
	const rings = [
		'M8 30 C 8 12, 30 4, 52 6 S 92 18, 90 34 S 66 58, 44 56 S 6 48, 10 28',
		'M12 26 C 14 8, 44 2, 66 8 S 94 26, 86 42 S 52 60, 30 54 S 4 40, 14 22',
		'M6 34 C 4 16, 26 6, 50 6 S 90 14, 92 32 S 74 56, 48 56 S 10 52, 8 30',
		'M10 28 C 10 10, 38 2, 60 6 S 94 22, 88 38 S 60 60, 36 56 S 4 44, 12 24'
	];
</script>

<section id="about" class="relative py-24 sm:py-32" aria-labelledby="about-title">
	<div
		class="mx-auto grid max-w-[1400px] items-center gap-16 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24"
	>
		<div class="relative mx-auto w-full max-w-[460px]">
			<div class="bg-sage absolute -inset-4 rotate-[4deg] rounded-[46%_54%_42%_58%/55%_45%_55%_45%]" aria-hidden="true"></div>
			<img
				src={t.portrait.src}
				alt={t.portrait.alt}
				width={t.portrait.width}
				height={t.portrait.height}
				loading="lazy"
				decoding="async"
				class="relative aspect-[4/5] w-full rounded-[46%_54%_42%_58%/55%_45%_55%_45%] object-cover object-[50%_30%]"
			/>
			<p
				class="font-hand text-bark bg-paper absolute -right-2 bottom-6 rotate-[-4deg] rounded-full px-5 py-2 text-2xl shadow-[0_10px_24px_-14px_rgb(46_36_25/0.5)] sm:-right-8"
			>
				{t.caption}
			</p>
		</div>

		<div class="flex flex-col gap-8">
			<p class="hand-note">{content.sectionLabels.about}</p>
			<h2 id="about-title" class="text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">{t.heading}</h2>
			<blockquote class="border-honey relative border-l-0 pl-0">
				<svg class="text-honey -mb-4 h-12 w-14" viewBox="0 0 48 40" fill="currentColor" aria-hidden="true"><path d="M0 40V22C0 9 7 2 19 0l2 6c-7 2-10 6-10 13h9v21H0zm27 0V22C27 9 34 2 46 0l2 6c-7 2-10 6-10 13h9v21H27z" /></svg>
				<p class="font-display text-bark text-2xl leading-snug italic sm:text-[1.9rem]">{t.statement}</p>
			</blockquote>

			<dl class="mt-2 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
				{#each t.stats as s, i (i)}
					<div class="flex flex-col items-center gap-1 text-center">
						<dt class="sr-only">{s.label}</dt>
						<dd class="relative flex h-16 w-24 items-center justify-center">
							<svg class="text-honey absolute inset-0 size-full" viewBox="0 0 100 62" fill="none" aria-hidden="true">
								<path d={rings[i % rings.length]} stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
							</svg>
							<span class="font-display text-bark relative text-4xl">{s.value}</span>
						</dd>
						<span class="text-bark-soft text-sm font-medium" aria-hidden="true">{s.label}</span>
					</div>
				{/each}
			</dl>
		</div>
	</div>
</section>
