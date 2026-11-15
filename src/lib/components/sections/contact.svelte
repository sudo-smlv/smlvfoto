<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import { scale } from 'svelte/transition';
	import { useI18n } from '$lib/i18n.svelte';
	import { squareCrop } from '$lib/sanity/config';
	import { createContactForm, type FormResult } from '$lib/state/contact.svelte';

	type Props = { form: FormResult | null; data?: { prefill?: { package: string | null } } };
	let { form, data }: Props = $props();

	const i18n = useI18n();
	const content = $derived(i18n.content);
	const site = $derived(i18n.site);
	const t = $derived(content.contact);
	const f = $derived(t.form);

	const formState = createContactForm(i18n, () => form);

	$effect(() => {
		formState.formResult = form;
	});

	onMount(() => formState.init(data));

	const channels = $derived([
		{ href: `https://wa.me/${site.whatsapp}`, label: content.channels.whatsapp.label, hint: site.phone, external: true, tilt: '-rotate-2' },
		{ href: site.instagram.url, label: content.channels.instagram.label, hint: `@${site.instagram.handle}`, external: true, tilt: 'rotate-1' },
		{ href: `mailto:${site.email}`, label: content.channels.email.label, hint: site.email, external: false, tilt: '-rotate-1' }
	]);
</script>

{#snippet channelList(compact = false)}
	<ul class={compact ? 'grid gap-2.5 sm:grid-cols-3' : 'flex flex-wrap justify-center gap-3'}>
		{#each channels as channel, i (i)}
			<li>
				<a
					href={channel.href}
					target={channel.external ? '_blank' : undefined}
					rel={channel.external ? 'noopener noreferrer' : undefined}
					class={['bg-paper border-line hover:bg-honey hover:border-honey group flex min-h-13 items-center gap-2.5 rounded-full border py-1.5 pr-4 pl-1.5 transition-colors', !compact && channel.tilt]}
				>
					<span class="bg-fir text-milk flex size-10 shrink-0 items-center justify-center rounded-full" aria-hidden="true">
						{#if i === 0}
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.4A8.4 8.4 0 1 1 21 11.5z" /></svg>
						{:else if i === 1}
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>
						{:else}
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3 7l9 6 9-6" /></svg>
						{/if}
					</span>
					<span class="flex min-w-0 flex-col leading-tight">
						<span class="text-bark text-sm font-bold">{channel.label}</span>
						<span class="text-bark-soft group-hover:text-bark truncate text-xs">{channel.hint}</span>
					</span>
				</a>
			</li>
		{/each}
	</ul>
{/snippet}

<section id="contact" class="relative screen" aria-labelledby="contact-title">
	<div class="mx-auto grid w-full max-w-[1400px] items-start gap-10 px-5 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
		<div class="flex flex-col gap-6">
			<div class="flex flex-col gap-3">
				<p class="hand-note">{content.sectionLabels.contact}</p>
				<h2 id="contact-title" class="text-4xl leading-[1.05] lg:text-[clamp(2.25rem,5.4svh,3rem)]">{t.heading}</h2>
				<p class="text-bark-soft">{t.intro}</p>
				<p class="font-hand text-honey-ink text-2xl">{t.coverage}</p>
			</div>

			<div class="flex flex-col gap-3">
				<h3 class="font-hand text-bark text-2xl">{t.processHeading}</h3>
				<ol class="grid gap-x-6 gap-y-4 sm:grid-cols-2">
					{#each t.process as step, i (i)}
						<li class="flex gap-3">
							<span class="bg-honey text-bark font-display flex size-9 shrink-0 items-center justify-center rounded-full text-base italic">{i + 1}</span>
							<div class="flex flex-col">
								<span class="font-display text-lg leading-snug">{step.title}</span>
								<span class="text-bark-soft text-sm">{step.description}</span>
							</div>
						</li>
					{/each}
				</ol>
			</div>

			<div class="flex flex-col gap-3">
				<h3 class="font-hand text-bark text-2xl">{t.channelsHeading}</h3>
				{@render channelList(true)}
			</div>

		</div>

		<!-- the letter -->
		<div class="bg-paper border-line relative rounded-[2rem] border" aria-live="polite">
			<div class="ticket bg-blush absolute -top-6 right-6 w-24 rotate-[6deg] rounded-md p-2 [--hole:5px] sm:right-10" aria-hidden="true">
				<img src={squareCrop(content.about.portrait, 200)} alt="" class="aspect-square w-full rounded-sm object-cover" />
			</div>

			<div class="rounded-[2rem] px-6 pt-9 pb-8 sm:px-10 sm:pt-11 sm:pb-9">
				<div class="flex flex-col gap-1 pr-24">
					<h3 class="font-hand text-bark text-4xl leading-none sm:text-5xl">{t.formHeading}</h3>
					<span class="text-bark-soft text-sm font-semibold">{t.formMeta}</span>
				</div>

				{#if formState.isRateLimited}
					<div class="border-destructive/40 text-bark mt-8 rounded-2xl border bg-[#fbe7e1] p-5" role="alert">
						<p class="font-semibold">{t.rateLimitedTitle}</p>
						<p class="text-bark-soft mt-1 text-sm">{t.rateLimitedDescription}</p>
					</div>
				{/if}

				{#if form?.ok}
					<div class="flex flex-col items-center gap-5 py-16 text-center" in:scale={{ start: 0.9, duration: 300 }}>
						<svg class="text-honey" width="72" height="72" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.3-9.2C1.4 8.4 3.6 5 7 5c2 0 3.4 1.1 5 3 1.6-1.9 3-3 5-3 3.4 0 5.6 3.4 4.3 6.8C19.5 16.4 12 21 12 21z" /></svg>
						<p class="font-hand text-bark text-4xl leading-tight">{f.success}</p>
						<p class="text-bark-soft max-w-md">{f.successHint}</p>
						{@render channelList()}
					</div>
				{:else}
					<form
						method="POST"
						action="?/contact"
						novalidate
						use:enhance={formState.createSubmitEnhance()}
						class="mt-7 flex flex-col gap-5"
					>
						<div class="grid gap-5 sm:grid-cols-2 sm:gap-x-10">
							<div class="flex flex-col gap-1">
								<label for="name" class="text-bark-soft text-sm font-semibold">{f.fields.name}</label>
								<input id="name" name="name" type="text" autocomplete="name" required maxlength={80} bind:value={formState.name} aria-invalid={!!formState.fieldErrors.name} aria-describedby={formState.fieldErrors.name ? 'name-error' : undefined} placeholder={f.placeholders.name} class="ink-field" />
								{#if formState.fieldErrors.name}<p id="name-error" class="text-destructive text-sm">{formState.fieldErrors.name}</p>{/if}
							</div>

							<div class="flex flex-col gap-1">
								<label for="contact-handle" class="text-bark-soft text-sm font-semibold">{f.fields.contact}</label>
								<input id="contact-handle" name="contact" type="text" required maxlength={120} bind:value={formState.contact} aria-invalid={!!formState.fieldErrors.contact} aria-describedby={formState.fieldErrors.contact ? 'contact-error' : undefined} placeholder={f.placeholders.contact} class="ink-field" />
								{#if formState.fieldErrors.contact}<p id="contact-error" class="text-destructive text-sm">{formState.fieldErrors.contact}</p>{/if}
							</div>

							<div class="flex flex-col gap-1">
								<label for="city" class="text-bark-soft text-sm font-semibold">{f.fields.city}</label>
								<input id="city" name="city" type="text" autocomplete="address-level2" maxlength={80} bind:value={formState.city} placeholder={f.placeholders.city} class="ink-field" />
							</div>

							<div class="flex flex-col gap-1">
								<label for="package" class="text-bark-soft text-sm font-semibold">{f.fields.package}</label>
								<select id="package" name="package" bind:value={formState.pkg} aria-invalid={!!formState.fieldErrors.package} class="ink-field appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2214%22%20height=%2214%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%238f5710%22%20stroke-width=%222.4%22%20stroke-linecap=%22round%22%3E%3Cpath%20d=%22M6%209l6%206%206-6%22/%3E%3C/svg%3E')] bg-[length:14px] bg-[right_0.25rem_center] bg-no-repeat pr-7">
									<option value="">{f.placeholders.package}</option>
									{#each formState.packageOptions as opt, i (i)}
										<option value={opt.value}>{opt.label}</option>
									{/each}
								</select>
								{#if formState.fieldErrors.package}<p class="text-destructive text-sm">{formState.fieldErrors.package}</p>{/if}
							</div>
						</div>

						<div class="flex flex-col gap-1">
							<label for="message" class="text-bark-soft text-sm font-semibold">{f.fields.message}</label>
							<textarea id="message" name="message" rows={3} maxlength={1000} bind:value={formState.message} aria-invalid={!!formState.fieldErrors.message} placeholder={f.placeholders.message} class="ink-field letter-lines resize-y border-b-0 bg-local py-0 leading-[40px]"></textarea>
							{#if formState.fieldErrors.message}<p class="text-destructive text-sm">{formState.fieldErrors.message}</p>{/if}
						</div>

						<label for="consent" class="flex cursor-pointer items-start gap-3">
							<input id="consent" name="consent" type="checkbox" required bind:checked={formState.consent} aria-invalid={!!formState.fieldErrors.consent} class="accent-[var(--honey-ink)] mt-1 size-5 shrink-0" />
							<span class="text-bark-soft text-sm">{f.consent}</span>
						</label>
						{#if formState.fieldErrors.consent}<p class="text-destructive -mt-4 text-sm">{formState.fieldErrors.consent}</p>{/if}

						<input type="text" name="hp" tabindex="-1" autocomplete="off" class="hidden" aria-hidden="true" bind:value={formState.honeypot} />

						{#if form && !form.ok && form.formError && form.formError !== 'rate_limited'}
							<p class="text-destructive rounded-2xl bg-[#fbe7e1] p-4 text-sm" role="alert">{f.errors.generic}</p>
						{/if}

						<div class="flex flex-wrap items-center justify-between gap-4 pt-2">
							<span class="font-hand text-bark-soft text-2xl">— {site.shortName}</span>
							<button
								type="submit"
								disabled={formState.submitting || !formState.consent}
								class="bg-honey text-bark inline-flex min-h-14 items-center gap-3 rounded-full py-2 pr-2 pl-7 font-semibold transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
							>
								{formState.submitting ? f.sending : f.submit}
								<span class="bg-bark text-milk flex size-10 items-center justify-center rounded-full" aria-hidden="true">
									{#if formState.submitting}
										<span class="border-milk/30 border-t-milk size-4 animate-spin rounded-full border-2"></span>
									{:else}
										<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" /></svg>
									{/if}
								</span>
							</button>
						</div>
					</form>
				{/if}
			</div>
		</div>
	</div>
</section>
