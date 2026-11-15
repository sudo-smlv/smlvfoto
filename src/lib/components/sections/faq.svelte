<script lang="ts">
	import { slide } from 'svelte/transition';
	import { useI18n } from '$lib/i18n.svelte';
	import { squareCrop } from '$lib/sanity/config';

	const i18n = useI18n();
	const content = $derived(i18n.content);
	const site = $derived(i18n.site);
	const t = $derived(content.faq);
	// Answers come "from" the photographer: her About portrait, cropped around the focal point set in Sanity.
	const avatar = $derived(squareCrop(content.about.portrait, 96));

	let openIndex = $state(0);

	function scrollToContact() {
		document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<section id="faq" class="bg-cream relative screen" aria-labelledby="faq-title">
	<div class="mx-auto grid w-full max-w-[1400px] gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
		<div class="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
			<p class="hand-note">{content.sectionLabels.faq}</p>
			<h2 id="faq-title" class="text-4xl leading-[1.05] lg:text-[clamp(2.25rem,5.4svh,3rem)]">{t.heading}</h2>
			<p class="text-bark-soft text-lg">{t.intro}</p>

			<div class="bg-paper relative mt-4 rotate-[-1.5deg] rounded-2xl p-7 shadow-[0_20px_40px_-26px_rgb(46_36_25/0.5)]">
				<span class="tape -top-3 left-8 rotate-[-6deg]" aria-hidden="true"></span>
				<p class="font-hand text-bark text-3xl leading-tight">{t.sidebar.heading}</p>
				<p class="text-bark-soft mt-3">{t.sidebar.body}</p>
				<button
					type="button"
					onclick={scrollToContact}
					class="bg-honey text-bark mt-5 min-h-11 rounded-full px-6 font-semibold"
				>
					{t.cta}
				</button>
			</div>
		</div>

		<ul class="flex flex-col gap-3.5">
			{#each t.items as item, i (i)}
				{@const isOpen = openIndex === i}
				<li class="flex flex-col gap-3">
					<button
						type="button"
						aria-expanded={isOpen}
						aria-controls="faq-answer-{i}"
						onclick={() => (openIndex = isOpen ? -1 : i)}
						class={[
							'group relative ml-auto flex max-w-[92%] items-center gap-4 rounded-[1.6rem] rounded-br-md px-6 py-4 text-left transition-colors sm:max-w-[80%]',
							isOpen ? 'bg-fir text-milk' : 'bg-paper text-bark hover:bg-[var(--milk)]'
						]}
					>
						<span class="font-display text-lg leading-snug sm:text-xl">{item.q}</span>
						<span
							class={[
								'flex size-8 shrink-0 items-center justify-center rounded-full transition-transform',
								isOpen ? 'bg-honey text-bark rotate-45' : 'bg-cream text-bark'
							]}
							aria-hidden="true"
						>
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14M5 12h14" /></svg>
						</span>
					</button>

					{#if isOpen}
						<div id="faq-answer-{i}" class="flex max-w-[92%] items-end gap-3 sm:max-w-[80%]" transition:slide={{ duration: 260 }}>
							<img src={avatar} alt="" class="ring-paper size-11 shrink-0 rounded-full object-cover ring-2" />
							<div class="bg-honey/90 text-bark rounded-[1.6rem] rounded-bl-md px-6 py-4">
								<p class="font-hand text-bark/70 text-lg leading-none">{site.shortName}</p>
								<p class="mt-1.5 leading-relaxed">{item.a}</p>
							</div>
						</div>
					{/if}
				</li>
			{/each}
		</ul>
	</div>
</section>
