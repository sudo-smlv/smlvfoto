<script lang="ts">
	import { fade } from 'svelte/transition';
	import { useI18n } from '$lib/i18n.svelte';
	import { createServicesState } from '$lib/state/services.svelte';

	const i18n = useI18n();
	const content = $derived(i18n.content);
	const t = $derived(content.services);
	const srv = createServicesState(i18n);

	// Which package is open on the right; starts on the popular one.
	let picked = $state<number | null>(null);
	const activeIndex = $derived(picked ?? Math.max(0, srv.packages.indexOf(srv.popular)));
	const active = $derived(srv.packages[activeIndex]);

	// Delivery time is often already one of the bullet points; show it separately only when it isn't.
	function deliveryNotListed(p: { features: readonly string[]; deliveryDays: string }) {
		return Boolean(p.deliveryDays) && !p.features.some((f) => f.includes(p.deliveryDays));
	}

	function onKey(e: KeyboardEvent) {
		const n = srv.packages.length;
		if (e.key === 'ArrowDown' || e.key === 'ArrowRight') picked = (activeIndex + 1) % n;
		else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') picked = (activeIndex - 1 + n) % n;
		else return;
		e.preventDefault();
		document.getElementById(`pkg-tab-${picked}`)?.focus();
	}
</script>

{#snippet check(cls: string)}
	<svg class="mt-1 shrink-0 {cls}" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 13c2 1.5 3.5 3 5 5 3-6 6.5-9.5 11-12" /></svg>
{/snippet}

<section id="services" class="screen bg-fir text-milk relative overflow-hidden" aria-labelledby="services-title">
	<div class="pointer-events-none absolute -bottom-60 -left-60 size-[44rem] rounded-full bg-[radial-gradient(circle,rgb(227_166_70/0.16),transparent_65%)]" aria-hidden="true"></div>

	<div class="relative mx-auto w-full max-w-[1400px] px-5 sm:px-8">
		<header class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
			<div class="flex max-w-2xl flex-col gap-3">
				<p class="font-hand text-honey-light text-[1.6rem] leading-none">{content.sectionLabels.services}</p>
				<h2 id="services-title" class="text-4xl leading-[1.05] lg:text-[clamp(2.25rem,5.4svh,3rem)]">{t.heading}</h2>
			</div>
			<p class="text-milk/75 max-w-md text-[0.95rem]">{t.subheading}</p>
		</header>

		<div class="mt-6 grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-6">
			<!-- package list -->
			<div role="tablist" aria-label={t.heading} aria-orientation="vertical" class="grid grid-cols-[minmax(0,1fr)] gap-3" tabindex="-1" onkeydown={onKey}>
				{#each srv.packages as p, i (i)}
					{@const selected = i === activeIndex}
					{@const popular = p === srv.popular}
					<button
						type="button"
						role="tab"
						id="pkg-tab-{i}"
						aria-selected={selected}
						aria-controls="pkg-panel"
						tabindex={selected ? 0 : -1}
						onclick={() => (picked = i)}
						class={[
							'ticket group relative flex min-h-[clamp(4.25rem,9.5svh,5.25rem)] items-center justify-between gap-3 rounded-2xl px-5 py-4 text-left sm:gap-4 sm:px-6 transition-colors [--hole:9px]',
							selected ? (popular ? 'bg-honey text-bark' : 'bg-paper text-bark') : 'bg-fir-soft/70 text-milk hover:bg-fir-soft'
						]}
					>
						<span class="flex min-w-0 flex-col">
							<span class="flex items-center gap-2">
								<span class={['font-display min-w-0 text-xl leading-tight sm:text-2xl', selected ? '' : 'text-milk']}>{p.name}</span>
								{#if popular}
									<span class={['rounded-full px-2.5 py-0.5 text-[0.7rem] font-bold tracking-wide uppercase', selected ? 'bg-bark text-honey-light' : 'bg-honey text-bark']}>{p.label}</span>
								{/if}
							</span>
							<span class={['truncate text-sm', selected ? 'text-bark/75' : 'text-milk/70']}>{p.tagline}</span>
						</span>
						<span class="font-display shrink-0 text-2xl sm:text-3xl">€{srv.formatter.format(p.price.amount)}</span>
					</button>
				{/each}
			</div>

			<!-- selected package -->
			{#if active}
				{@const popular = active === srv.popular}
				<div
					id="pkg-panel"
					role="tabpanel"
					aria-labelledby="pkg-tab-{activeIndex}"
					class={['relative flex flex-col rounded-[2rem] p-7 sm:p-8', popular ? 'bg-honey text-bark' : 'bg-paper text-bark']}
				>
					{#key activeIndex}
						<div class="flex h-full flex-col" in:fade={{ duration: 200 }}>
							<div class="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
								<div class="flex flex-col gap-1">
									<p class={['font-hand text-2xl leading-none', popular ? 'text-bark' : 'text-honey-ink']}>
										{popular ? t.popularBadge : active.label}
									</p>
									<h3 class="text-4xl">{active.name}</h3>
									<p class="font-semibold">{active.tagline}</p>
								</div>
								<div class="flex flex-col sm:items-end">
									<span class="font-display text-[3.25rem] leading-none">€{srv.formatter.format(active.price.amount)}</span>
									<span class={['mt-1 text-xs font-semibold', popular ? 'text-bark/70' : 'text-bark-soft']}>{t.priceUnit}</span>
								</div>
							</div>

							<p class={['mt-3 max-w-2xl text-[0.95rem]', popular ? 'text-bark/80' : 'text-bark-soft']}>{active.description}</p>

							<ul class={['mt-4 grid gap-x-8 gap-y-2 border-t pt-4 text-[0.95rem] sm:grid-cols-2', popular ? 'border-bark/15' : 'border-line']}>
								{#each active.features as feature, fi (fi)}
									<li class="flex gap-2.5">{@render check(popular ? 'text-bark' : 'text-honey-ink')}<span>{feature}</span></li>
								{/each}
							</ul>

							<div class="mt-auto flex flex-wrap items-center justify-between gap-4 pt-5">
								<span class="font-hand text-xl">{deliveryNotListed(active) ? active.deliveryDays : t.coverage}</span>
								<button
									type="button"
									onclick={() => srv.selectPackage(active.id)}
									class={['min-h-13 rounded-full px-8 py-3.5 font-semibold transition-colors', popular ? 'bg-bark text-milk hover:bg-fir' : 'bg-fir text-milk hover:bg-fir-soft']}
								>
									{active.cta}
								</button>
							</div>
						</div>
					{/key}
				</div>
			{/if}
		</div>
	</div>
</section>
