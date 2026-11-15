<script lang="ts">
	import { useI18n } from '$lib/i18n.svelte';
	import { createServicesState } from '$lib/state/services.svelte';

	const i18n = useI18n();
	const content = $derived(i18n.content);
	const t = $derived(content.services);
	const srv = createServicesState(i18n);

	const badgeRing = $derived(`${t.popularBadge} · `.repeat(t.popularBadge.length < 16 ? 3 : 2));

	// Delivery time is often already one of the bullet points; show it separately only when it isn't.
	function deliveryNotListed(p: { features: readonly string[]; deliveryDays: string }) {
		return Boolean(p.deliveryDays) && !p.features.some((f) => f.includes(p.deliveryDays));
	}
</script>

{#snippet check(cls: string)}
	<svg class="mt-1 shrink-0 {cls}" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 13c2 1.5 3.5 3 5 5 3-6 6.5-9.5 11-12" /></svg>
{/snippet}

<section id="services" class="bg-fir text-milk relative overflow-hidden py-24 sm:py-32" aria-labelledby="services-title">
	<div class="pointer-events-none absolute -bottom-60 -left-60 size-[44rem] rounded-full bg-[radial-gradient(circle,rgb(227_166_70/0.16),transparent_65%)]" aria-hidden="true"></div>

	<div class="relative mx-auto max-w-[1400px] px-5 sm:px-8">
		<header class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
			<div class="flex max-w-2xl flex-col gap-5">
				<p class="font-hand text-honey-light text-[1.6rem] leading-none">{content.sectionLabels.services}</p>
				<h2 id="services-title" class="text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">{t.heading}</h2>
				<p class="text-milk/80 text-lg">{t.subheading}</p>
			</div>
			<p class="text-milk/70 flex items-center gap-2 text-sm">
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
				{t.coverage}
			</p>
		</header>

		<!--
			Three-column grid: the two lighter packages side by side, the premium one wide underneath,
			and the popular package on the right spanning both rows, so the columns end together.
		-->
		<div class="mt-16 grid gap-6 lg:grid-flow-row-dense lg:grid-cols-3">
			{#each srv.others as p, i (i)}
				{@const wide = srv.others.length % 2 === 1 && i === srv.others.length - 1}
				<article class="ticket bg-paper text-bark flex flex-col gap-5 rounded-3xl p-7 sm:p-8 {wide ? 'lg:col-span-2' : ''}">
					<div class="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
						<div class="flex flex-col gap-1.5">
							<p class="font-hand text-honey-ink text-2xl leading-none">{p.label}</p>
							<h3 class="text-3xl sm:text-[2.1rem]">{p.name}</h3>
							<p class="text-bark-soft font-semibold">{p.tagline}</p>
						</div>
						<div class="flex flex-col">
							<span class="font-display text-5xl leading-none">€{srv.formatter.format(p.price.amount)}</span>
							<span class="text-bark-soft mt-1.5 text-xs font-semibold">{t.priceUnit}</span>
						</div>
					</div>
					<p class="text-bark-soft text-[0.95rem]">{p.description}</p>
					<ul class="border-line grid gap-x-6 gap-y-2.5 border-t-2 border-dashed pt-5 text-[0.93rem] {wide ? 'sm:grid-cols-2' : ''}">
						{#each p.features as feature, fi (fi)}
							<li class="flex gap-2.5">{@render check('text-honey-ink')}<span>{feature}</span></li>
						{/each}
					</ul>
					<div class="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
						{#if deliveryNotListed(p)}
							<span class="font-hand text-bark-soft text-xl">{p.deliveryDays}</span>
						{/if}
						<button
							type="button"
							onclick={() => srv.selectPackage(p.id)}
							class="bg-fir text-milk hover:bg-fir-soft ml-auto min-h-11 rounded-full px-6 text-sm font-semibold transition-colors"
						>
							{p.cta}
						</button>
					</div>
				</article>
			{/each}

			{#if srv.popular}
				{@const p = srv.popular}
				<article class="bg-honey text-bark relative order-first flex flex-col rounded-[2.5rem] p-8 shadow-[0_40px_80px_-40px_rgb(0_0_0/0.6)] sm:p-10 lg:order-none lg:col-start-3 lg:row-span-2 lg:row-start-1">
					<div class="absolute -top-8 -right-3 flex size-28 items-center justify-center rounded-full bg-[var(--milk)] sm:-right-6 sm:size-32" aria-hidden="true">
						<svg viewBox="0 0 100 100" class="animate-spin-slow absolute inset-0 size-full">
							<defs><path id="popular-ring" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" /></defs>
							<text class="fill-[var(--honey-ink)] font-sans text-[8px] font-bold tracking-[0.16em] uppercase"><textPath href="#popular-ring" textLength="230" lengthAdjust="spacingAndGlyphs">{badgeRing}</textPath></text>
						</svg>
						<svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" class="text-honey"><path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z" /></svg>
					</div>
					<p class="sr-only">{t.popularBadge}</p>

					<p class="font-hand text-2xl">{p.label}</p>
					<h3 class="mt-2 text-5xl sm:text-6xl">{p.name}</h3>
					<p class="mt-3 text-lg font-semibold">{p.tagline}</p>
					<p class="text-bark/80 mt-3">{p.description}</p>

					<div class="mt-8 flex flex-wrap items-end gap-x-4 gap-y-1">
						<span class="font-display text-7xl leading-none">€{srv.formatter.format(p.price.amount)}</span>
						<span class="text-bark/75 pb-2 text-sm font-semibold">{t.priceUnit}</span>
					</div>

					<ul class="border-bark/15 mt-8 flex flex-col gap-3.5 border-t pt-8">
						{#each p.features as feature, fi (fi)}
							<li class="flex gap-3">{@render check('text-bark')}<span>{feature}</span></li>
						{/each}
					</ul>

					<div class="mt-auto flex flex-wrap items-center justify-between gap-4 pt-10">
						{#if deliveryNotListed(p)}
							<span class="font-hand text-2xl">{p.deliveryDays}</span>
						{/if}
						<button
							type="button"
							onclick={() => srv.selectPackage(p.id)}
							class="bg-bark text-milk hover:bg-fir ml-auto min-h-14 rounded-full px-8 font-semibold transition-colors"
						>
							{p.cta}
						</button>
					</div>
				</article>
			{/if}
		</div>
	</div>
</section>
