<script lang="ts">
	import { useI18n } from '$lib/i18n.svelte';
	const i18n = useI18n();
	const content = $derived(i18n.content);
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardDescription, CardTitle } from '$lib/components/ui/card';
	import Check from '@lucide/svelte/icons/check';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import { createServicesState } from '$lib/state/services.svelte';

	const t = $derived(content.services);
	const srv = createServicesState(i18n);
</script>

<section
	id="services"
	class="bg-foreground text-background py-20 sm:py-32"
	aria-labelledby="services-title"
>
	<div class="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
		<header class="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
			<div class="max-w-2xl">
				<p class="font-mono text-[10px] tracking-[0.3em] text-background/60 uppercase sm:text-xs">
					{content.sectionLabels.services}
				</p>
				<h2
					id="services-title"
					class="mt-4 font-serif text-4xl leading-[0.95] font-medium tracking-tight text-balance sm:text-5xl lg:text-6xl xl:text-7xl"
				>
					{t.heading}
				</h2>
				<p class="text-background/70 mt-6 text-base sm:text-lg">
					{t.subheading}
				</p>
			</div>

			<div class="text-background/60 flex items-center gap-4 text-xs sm:text-sm">
				<span class="font-mono tracking-[0.2em] uppercase">{t.coverage}</span>
			</div>
		</header>

		<div class="mt-12 sm:mt-16 lg:mt-20 grid gap-6 sm:gap-8 lg:gap-px lg:grid-cols-[1.4fr_1fr]">
			<Card
				class="relative z-10 gap-0 overflow-hidden rounded-none border border-background/20 lg:border-0 bg-foreground p-0 text-background lg:sticky lg:top-16 lg:self-start"
			>
				<Badge
					variant="outline"
					class="absolute top-6 right-6 z-10 rounded-none border-background/40 bg-foreground px-3 py-1 text-background sm:top-8 sm:right-8"
				>
					<Sparkles data-icon="inline-start" />
					{t.popularBadge}
				</Badge>

				<div class="relative flex flex-col gap-8 p-6 sm:gap-10 sm:p-10 lg:p-14">
					<div class="flex flex-col gap-4">
						<p
							class="font-mono text-[10px] tracking-[0.3em] text-background/55 uppercase sm:text-xs"
						>
							0{srv.packages.indexOf(srv.popular) + 1} / {srv.popular.label}
						</p>
						<CardTitle
							class="text-background font-serif text-5xl leading-[0.95] font-medium tracking-tight sm:text-6xl lg:text-7xl"
						>
							{srv.popular.name}
						</CardTitle>
						<CardDescription class="text-background/75 text-base sm:text-lg">
							{srv.popular.description}
						</CardDescription>
					</div>

					<div class="flex items-baseline gap-3">
						<span
							class="font-serif text-6xl leading-none font-medium tracking-tight sm:text-7xl lg:text-8xl"
						>
							€{srv.formatter.format(srv.popular.price.amount)}
						</span>
						<span class="text-background/55 text-sm sm:text-base">{t.priceUnit}</span>
						<Badge
							variant="outline"
							class="ml-auto rounded-none border-background/30 bg-foreground px-3 py-1 text-background/70"
						>
							{srv.popular.deliveryDays}
						</Badge>
					</div>

					<ul class="flex flex-col gap-3 border-t border-background/20 pt-6 sm:gap-4 sm:pt-8">
						{#each srv.popular.features as feature, i (i)}
							<li class="flex items-start gap-3 text-sm sm:text-base">
								<span
									class="font-mono mt-0.5 shrink-0 text-[10px] tracking-wider text-background/45 uppercase sm:text-xs"
									>0{i + 1}</span
								>
								<span class="text-background/85">{feature}</span>
							</li>
						{/each}
					</ul>

					<Button
						size="lg"
						class="bg-background text-foreground hover:bg-background/90 w-full"
						onclick={() => srv.selectPackage(srv.popular.id)}
					>
						{srv.popular.cta}
					</Button>
				</div>
			</Card>

			<div class="flex flex-col gap-px">
				{#each srv.others as p, i (i)}
					<Card
						class="bg-foreground text-background flex-1 gap-0 overflow-hidden rounded-none border-0 p-0 ring-0"
					>
						<div class="flex h-full flex-col gap-6 p-6 sm:gap-8 sm:p-10 lg:p-12">
							<div class="flex flex-col gap-3">
								<p
									class="font-mono text-[10px] tracking-[0.3em] text-background/55 uppercase sm:text-xs"
								>
									0{srv.packages.findIndex((x: any) => x.id === p.id) + 1} / {p.label}
								</p>
								<CardTitle
									class="text-background font-serif text-3xl leading-[0.95] font-medium tracking-tight sm:text-4xl"
								>
									{p.name}
								</CardTitle>
								<CardDescription class="text-background/65 text-sm">
									{p.description}
								</CardDescription>
							</div>

							<div class="flex items-baseline gap-2">
								<span
									class="font-serif text-4xl leading-none font-medium tracking-tight sm:text-5xl"
								>
									€{srv.formatter.format(p.price.amount)}
								</span>
								<span class="text-background/55 text-xs">{t.priceUnit}</span>
								<Badge
									variant="outline"
									class="ml-auto rounded-none border-background/30 bg-transparent px-3 py-1 text-background/70"
								>
									{p.deliveryDays}
								</Badge>
							</div>

							<ul class="flex flex-col gap-2.5 border-t border-background/15 pt-4">
								{#each p.features as feature, fi (fi)}
									<li class="flex items-start gap-2.5 text-xs sm:text-sm">
										<Check data-icon="inline-start" class="mt-0.5 shrink-0" />
										<span class="text-background/80">{feature}</span>
									</li>
								{/each}
							</ul>

							<Button
								variant="outline"
								size="default"
								class="w-full border-background/40 bg-transparent text-background hover:bg-background hover:text-foreground"
								onclick={() => srv.selectPackage(p.id)}
							>
								{p.cta}
							</Button>
						</div>
					</Card>
				{/each}
			</div>
		</div>
	</div>
</section>
