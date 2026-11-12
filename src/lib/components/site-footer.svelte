<script lang="ts">
	import { useI18n } from '$lib/i18n.svelte';
	const i18n = useI18n();
	const content = $derived(i18n.content);
	import { site } from '$lib/config/site';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import Instagram from '$lib/components/icons/instagram.svelte';
	import MessageCircle from '@lucide/svelte/icons/message-circle';
	import Mail from '@lucide/svelte/icons/mail';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import Clock from '@lucide/svelte/icons/clock';

	const t = $derived(content.footer);

	const navItems = [
		{ id: 'about', label: content.nav.about },
		{ id: 'portfolio', label: content.nav.portfolio },
		{ id: 'services', label: content.nav.services },
		{ id: 'locations', label: content.nav.locations },
		{ id: 'photobooks', label: content.nav.photobooks },
		{ id: 'faq', label: content.nav.faq },
		{ id: 'contact', label: content.nav.contact }
	];

	const channels = [
		{
			href: site.instagram.url,
			label: content.channels.instagram.label,
			hint: `@${site.instagram.handle}`,
			icon: Instagram,
			external: true
		},
		{
			href: `https://wa.me/${site.whatsapp}`,
			label: content.channels.whatsapp.label,
			hint: site.phone,
			icon: MessageCircle,
			external: true
		},
		{
			href: `mailto:${site.email}`,
			label: content.channels.email.label,
			hint: site.email,
			icon: Mail,
			external: false
		}
	] as const;

	function go(id: string) {
		document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	const year = new Date().getFullYear();
</script>

<footer class="bg-foreground text-background" aria-labelledby="footer-heading">
	<h2 id="footer-heading" class="sr-only">{content.a11y.footerHeading}</h2>

	<div class="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
		<div class="py-16 sm:py-20 lg:py-24">
			<div
				class="flex flex-col items-start justify-between gap-10 border-b border-background/15 pb-12 lg:flex-row lg:items-end lg:gap-16"
			>
				<div class="max-w-xl">
					<p class="font-mono text-[10px] tracking-[0.3em] text-background/60 uppercase sm:text-xs">
						{t.ctaHeading}
					</p>
					<p
						class="mt-4 font-serif text-3xl leading-[0.95] font-medium tracking-tight text-balance sm:text-4xl lg:text-5xl xl:text-6xl"
					>
						{t.tagline}
					</p>
				</div>
				<Button
					size="lg"
					class="bg-background text-foreground hover:bg-background/90 shrink-0"
					onclick={() => go('contact')}
				>
					{t.ctaButton}
					<ArrowUpRight data-icon="inline-end" class="ml-0.5" />
				</Button>
			</div>

			<div class="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:py-16">
				<div class="flex flex-col gap-4 lg:col-span-1">
					<button
						type="button"
						onclick={() => go('hero')}
						class="font-serif text-3xl font-semibold tracking-tight transition-opacity hover:opacity-80 sm:text-4xl"
					>
						{site.shortName}<sup class="ml-0.5 text-[0.6em] font-normal align-super">®</sup>
					</button>
					<p class="text-background/65 text-sm leading-relaxed">
						{site.description}
					</p>
				</div>

				<div class="flex flex-col gap-4">
					<h3
						class="font-mono text-[10px] tracking-[0.3em] text-background/50 uppercase sm:text-xs"
					>
						{t.columns.navigation}
					</h3>
					<ul class="flex flex-col gap-2.5">
						{#each navItems as item (item.id)}
							<li>
								<button
									type="button"
									onclick={() => go(item.id)}
									class="group inline-flex items-center gap-1.5 text-sm text-background/75 transition-colors hover:text-background"
								>
									<span
										class="border-background/40 group-hover:border-background border-b pb-0.5 transition-colors"
									>
										{item.label}
									</span>
									<ArrowUpRight
										class="size-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
										aria-hidden="true"
									/>
								</button>
							</li>
						{/each}
					</ul>
				</div>

				<div class="flex flex-col gap-4">
					<h3
						class="font-mono text-[10px] tracking-[0.3em] text-background/50 uppercase sm:text-xs"
					>
						{t.columns.contacts}
					</h3>
					<ul class="flex flex-col gap-3">
						{#each channels as channel (channel.label)}
							{@const Icon = channel.icon}
							<li>
								<a
									href={channel.href}
									target={channel.external ? '_blank' : undefined}
									rel={channel.external ? 'noopener noreferrer' : undefined}
									class="group flex items-center gap-3"
								>
									<span
										class="flex size-8 shrink-0 items-center justify-center rounded-full border border-background/20 transition-colors group-hover:border-background/60"
										aria-hidden="true"
									>
										<Icon class="size-3.5" />
									</span>
									<span class="flex flex-col">
										<span class="text-sm font-medium">{channel.label}</span>
										<span class="text-background/55 text-xs">{channel.hint}</span>
									</span>
								</a>
							</li>
						{/each}
					</ul>
				</div>

				<div class="flex flex-col gap-4">
					<h3
						class="font-mono text-[10px] tracking-[0.3em] text-background/50 uppercase sm:text-xs"
					>
						{t.columns.status}
					</h3>
					<ul class="flex flex-col gap-4">
						<li class="flex items-start gap-3">
							<span
								class="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-background/20"
								aria-hidden="true"
							>
								<MapPin class="size-3.5" />
							</span>
							<span class="flex flex-col gap-0.5">
								<span class="text-sm font-medium">{t.basedInLabel}</span>
								<span class="text-background/55 text-xs">{t.basedIn}</span>
							</span>
						</li>
						<li class="flex items-start gap-3">
							<span
								class="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-background/20"
								aria-hidden="true"
							>
								<Clock class="size-3.5" />
							</span>
							<span class="flex flex-col gap-0.5">
								<span class="text-sm font-medium">{t.responseTime}</span>
								<span class="text-background/55 text-xs">{t.timezone}</span>
							</span>
						</li>
						<li class="flex items-center gap-2.5 pt-2">
							<span class="size-1.5 shrink-0 rounded-full bg-background" aria-hidden="true"></span>
							<span class="text-sm font-medium">{t.availability}</span>
						</li>
					</ul>
				</div>
			</div>
		</div>

		<Separator class="bg-background/15" />

		<div
			class="flex flex-col items-center justify-between gap-4 py-6 text-center sm:flex-row sm:text-left"
		>
			<p class="text-background/50 text-xs">
				© {year}
				{site.name}. {t.rights}
			</p>
			<p class="text-background/50 font-mono text-[10px] tracking-[0.25em] uppercase">
				{t.madeWith}
			</p>
		</div>
	</div>
</footer>
