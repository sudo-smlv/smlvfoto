<script lang="ts">
	import { useI18n } from '$lib/i18n.svelte';

	const i18n = useI18n();
	const content = $derived(i18n.content);
	const site = $derived(i18n.site);
	const t = $derived(content.footer);

	const navItems = $derived([
		{ id: 'about', label: content.nav.about },
		{ id: 'portfolio', label: content.nav.portfolio },
		{ id: 'services', label: content.nav.services },
		{ id: 'locations', label: content.nav.locations },
		{ id: 'photobooks', label: content.nav.photobooks },
		{ id: 'faq', label: content.nav.faq },
		{ id: 'contact', label: content.nav.contact }
	]);

	const channels = $derived([
		{ href: site.instagram.url, label: content.channels.instagram.label, hint: `@${site.instagram.handle}`, external: true },
		{ href: `https://wa.me/${site.whatsapp}`, label: content.channels.whatsapp.label, hint: site.phone, external: true },
		{ href: `mailto:${site.email}`, label: content.channels.email.label, hint: site.email, external: false }
	]);

	function go(id: string) {
		document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	const year = new Date().getFullYear();
</script>

<footer class="bg-fir text-milk relative overflow-hidden" aria-labelledby="footer-heading">
	<h2 id="footer-heading" class="sr-only">{content.a11y.footerHeading}</h2>

	<!-- evening glow behind the closing line -->
	<div class="pointer-events-none absolute top-0 left-1/2 size-[48rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(circle,rgb(227_166_70/0.22),transparent_62%)]" aria-hidden="true"></div>

	<div class="relative mx-auto max-w-[1400px] px-5 pt-24 pb-10 sm:px-8 sm:pt-32">
		<div class="flex flex-col items-center gap-8 text-center">
			<svg class="text-honey" width="56" height="34" viewBox="0 0 56 34" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M10 30a18 18 0 0 1 36 0" fill="currentColor" stroke="none" /><path d="M2 32h52M28 2v6M8 10l4 4M48 10l-4 4" /></svg>
			<p class="font-hand text-honey-light text-3xl">{t.ctaHeading}</p>
			<p class="font-display max-w-4xl text-4xl leading-[1.08] italic sm:text-6xl lg:text-7xl">{t.tagline}</p>
			<button
				type="button"
				onclick={() => go('contact')}
				class="bg-honey text-bark min-h-14 rounded-full px-9 text-base font-semibold transition-transform hover:-translate-y-0.5"
			>
				{t.ctaButton}
			</button>
		</div>

		<div class="border-milk/15 mt-24 grid gap-12 border-t pt-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
			<div class="flex flex-col gap-4">
				<span class="font-display text-3xl">{site.shortName}</span>
				<p class="text-milk/70 max-w-xs text-sm leading-relaxed">{site.description}</p>
			</div>

			<nav aria-label={t.columns.navigation} class="flex flex-col gap-3">
				<h3 class="font-hand text-honey-light text-2xl">{t.columns.navigation}</h3>
				<ul class="flex flex-col gap-1">
					{#each navItems as item (item.id)}
						<li>
							<button type="button" onclick={() => go(item.id)} class="text-milk/80 hover:text-milk min-h-9 text-left">{item.label}</button>
						</li>
					{/each}
				</ul>
			</nav>

			<div class="flex flex-col gap-3">
				<h3 class="font-hand text-honey-light text-2xl">{t.columns.contacts}</h3>
				<ul class="flex flex-col gap-3">
					{#each channels as channel, i (i)}
						<li>
							<a
								href={channel.href}
								target={channel.external ? '_blank' : undefined}
								rel={channel.external ? 'noopener noreferrer' : undefined}
								class="group flex flex-col"
							>
								<span class="text-milk/60 text-xs font-semibold tracking-[0.14em] uppercase">{channel.label}</span>
								<span class="text-milk group-hover:text-honey-light">{channel.hint}</span>
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<div class="flex flex-col gap-3">
				<h3 class="font-hand text-honey-light text-2xl">{t.columns.status}</h3>
				<p class="flex items-center gap-2">
					<span class="bg-honey relative flex size-2.5 rounded-full" aria-hidden="true">
						<span class="bg-honey absolute inset-0 animate-ping rounded-full opacity-60"></span>
					</span>
					{t.availability}
				</p>
				<p class="text-milk/70 text-sm"><span class="text-milk/60 block text-xs font-semibold tracking-[0.14em] uppercase">{t.basedInLabel}</span>{t.basedIn}</p>
				<p class="text-milk/70 text-sm">{t.responseTime} · {t.timezone}</p>
			</div>
		</div>

		<div class="text-milk/75 relative mt-20 flex flex-col items-center justify-between gap-2 text-sm sm:flex-row">
			<span>© {year} {site.name}. {t.rights}</span>
			<span class="font-hand text-milk text-xl">{t.madeWith}</span>
		</div>
	</div>
</footer>
