<script lang="ts">
	import { useI18n } from '$lib/i18n.svelte';
	const i18n = useI18n();
	const content = $derived(i18n.content);
	import {
		Accordion,
		AccordionContent,
		AccordionItem,
		AccordionTrigger
	} from '$lib/components/ui/accordion';
	import { Button } from '$lib/components/ui/button';
	import Headset from '@lucide/svelte/icons/headset';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';

	const t = $derived(content.faq);

	function scrollToContact() {
		document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<section id="faq" class="bg-foreground text-background py-20 sm:py-32" aria-labelledby="faq-title">
	<div class="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
		<header class="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
			<div class="max-w-2xl">
				<p class="font-mono text-[10px] tracking-[0.3em] text-background/60 uppercase sm:text-xs">
					{content.sectionLabels.faq}
				</p>
				<h2
					id="faq-title"
					class="mt-4 font-serif text-4xl leading-[0.95] font-medium tracking-tight text-balance sm:text-5xl lg:text-6xl xl:text-7xl"
				>
					{t.heading}
				</h2>
				<p class="text-background/70 mt-6 text-base sm:text-lg">{t.intro}</p>
			</div>

			<div class="text-background/60 flex items-center gap-4 text-xs sm:text-sm">
				<span class="font-mono tracking-[0.2em] uppercase">{t.coverage}</span>
			</div>
		</header>

		<div class="mt-14 grid gap-px sm:mt-20 lg:grid-cols-12">
			<aside
				class="flex flex-col gap-8 p-6 sm:gap-10 sm:p-10 lg:col-span-4 lg:p-14 lg:sticky lg:top-16 lg:self-start"
			>
				<div
					class="bg-background text-foreground flex size-14 shrink-0 items-center justify-center rounded-none sm:size-16"
					aria-hidden="true"
				>
					<Headset class="size-6 sm:size-7" />
				</div>

				<div class="flex flex-col gap-4">
					<h3 class="font-serif text-2xl leading-tight font-medium sm:text-3xl">
						{t.sidebar.heading}
					</h3>
					<p class="text-background/70 text-sm leading-relaxed sm:text-base">
						{t.sidebar.body}
					</p>
				</div>

				<Button
					size="lg"
					class="bg-background text-foreground hover:bg-background/90 w-full"
					onclick={scrollToContact}
				>
					{t.cta}
					<ArrowUpRight data-icon="inline-end" class="ml-1" />
				</Button>
			</aside>

			<div class="lg:col-span-8 lg:pl-px">
				<Accordion type="single" class="w-full">
					{#each t.items as item, i (i)}
						<AccordionItem
							value={`q-${i}`}
							class="border-background/15 border-b border-t-0 first:border-t"
						>
							<AccordionTrigger
								class="font-serif hover:no-underline text-background group flex items-center gap-5 py-6 text-left text-lg font-medium sm:text-xl sm:py-8"
							>
								<span
									class="font-mono text-background/45 text-xs tracking-[0.2em] shrink-0 tabular-nums sm:text-sm"
								>
									0{i + 1}
								</span>
								<span class="flex-1 leading-snug">{item.q}</span>
							</AccordionTrigger>
							<AccordionContent
								class="text-background/70 pl-9 text-base leading-relaxed sm:pl-12 sm:text-lg"
							>
								{item.a}
							</AccordionContent>
						</AccordionItem>
					{/each}
				</Accordion>
			</div>
		</div>
	</div>
</section>
