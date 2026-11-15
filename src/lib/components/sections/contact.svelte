<script lang="ts">
	import { useI18n } from '$lib/i18n.svelte';
	const i18n = useI18n();
	const content = $derived(i18n.content);
	const site = $derived(i18n.site);
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Field, FieldError, FieldGroup, FieldLabel } from '$lib/components/ui/field';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
	import { Alert, AlertDescription, AlertTitle } from '$lib/components/ui/alert';
	import {
		Empty,
		EmptyContent,
		EmptyDescription,
		EmptyHeader,
		EmptyMedia,
		EmptyTitle
	} from '$lib/components/ui/empty';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { Separator } from '$lib/components/ui/separator';
	import Instagram from '$lib/components/icons/instagram.svelte';
	import MessageCircle from '@lucide/svelte/icons/message-circle';
	import Mail from '@lucide/svelte/icons/mail';
	import Send from '@lucide/svelte/icons/send';
	import CheckCircle2 from '@lucide/svelte/icons/check-circle-2';
	import Loader from '@lucide/svelte/icons/loader';
	import AlertCircle from '@lucide/svelte/icons/alert-circle';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import { createContactForm, type FormResult } from '$lib/state/contact.svelte';

	type Props = { form: FormResult | null; data?: { prefill?: { package: string | null } } };
	let { form, data }: Props = $props();

	const t = $derived(content.contact);
	const f = $derived(t.form);

	const formState = createContactForm(i18n, () => form);

	$effect(() => {
		formState.formResult = form;
	});

	onMount(() => {
		return formState.init(data);
	});

	const channels = [
		{
			href: `https://wa.me/${site.whatsapp}`,
			label: content.channels.whatsapp.label,
			hint: site.phone,
			icon: MessageCircle,
			external: true
		},
		{
			href: site.instagram.url,
			label: content.channels.instagram.label,
			hint: `@${site.instagram.handle}`,
			icon: Instagram,
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
</script>

<section id="contact" class="bg-background py-20 sm:py-32" aria-labelledby="contact-title">
	<div class="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
		<header class="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
			<div class="max-w-2xl">
				<p
					class="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase sm:text-xs"
				>
					{content.sectionLabels.contact}
				</p>
				<h2
					id="contact-title"
					class="mt-4 font-serif text-4xl leading-[0.95] font-medium tracking-tight text-balance sm:text-5xl lg:text-6xl xl:text-7xl"
				>
					{t.heading}
				</h2>
				<p class="text-muted-foreground mt-6 text-base sm:text-lg">{t.intro}</p>
			</div>

			<div class="text-muted-foreground flex items-center gap-4 text-xs sm:text-sm">
				<span class="font-mono tracking-[0.2em] uppercase">{t.coverage}</span>
			</div>
		</header>

		<div class="mt-12 sm:mt-16 lg:mt-20 grid gap-8 lg:gap-px lg:grid-cols-12">
			<div
				class="border-border bg-card relative flex flex-col gap-6 rounded-none border p-5 sm:gap-8 sm:p-8 lg:col-span-7 lg:p-10 lg:sticky lg:top-16 lg:self-start"
				aria-live="polite"
			>
				<div class="flex items-center justify-between gap-4 border-b border-border pb-5">
					<h3 class="font-serif text-xl font-medium sm:text-2xl">{t.formHeading}</h3>
					<span
						class="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase sm:text-xs"
					>
						{t.formMeta}
					</span>
				</div>

				{#if formState.isRateLimited}
					<Alert variant="destructive">
						<AlertCircle data-icon="inline-start" />
						<AlertTitle>{t.rateLimitedTitle}</AlertTitle>
						<AlertDescription>
							{t.rateLimitedDescription}
						</AlertDescription>
					</Alert>
				{/if}

				{#if form?.ok}
					<Empty class="border-0">
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<CheckCircle2 class="text-primary size-12" aria-hidden="true" />
							</EmptyMedia>
							<EmptyTitle class="font-serif text-2xl">{f.success}</EmptyTitle>
							<EmptyDescription>{f.successHint}</EmptyDescription>
						</EmptyHeader>
						<EmptyContent class="flex flex-wrap justify-center gap-3">
							{#each channels as channel, i (i)}
								{@const Icon = channel.icon}
								<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
								<Button
									variant="outline"
									href={channel.href}
									target={channel.external ? '_blank' : undefined}
									rel={channel.external ? 'noopener noreferrer' : undefined}
								>
									<Icon data-icon="inline-start" />
									{channel.label}
								</Button>
							{/each}
						</EmptyContent>
					</Empty>
				{:else}
					<form
						method="POST"
						action="?/contact"
						novalidate
						use:enhance={formState.createSubmitEnhance()}
						class="flex flex-col gap-5"
					>
						<FieldGroup class="grid gap-5 sm:grid-cols-2">
							<Field data-invalid={!!formState.fieldErrors.name}>
								<FieldLabel for="name">{f.fields.name}</FieldLabel>
								<Input
									id="name"
									name="name"
									type="text"
									autocomplete="name"
									required
									maxlength={80}
									bind:value={formState.name}
									aria-invalid={!!formState.fieldErrors.name}
									placeholder={f.placeholders.name}
								/>
								{#if formState.fieldErrors.name}
									<FieldError errors={[{ message: formState.fieldErrors.name }]} />
								{/if}
							</Field>

							<Field data-invalid={!!formState.fieldErrors.contact}>
								<FieldLabel for="contact">{f.fields.contact}</FieldLabel>
								<Input
									id="contact"
									name="contact"
									type="text"
									required
									maxlength={120}
									bind:value={formState.contact}
									aria-invalid={!!formState.fieldErrors.contact}
									placeholder={f.placeholders.contact}
								/>
								{#if formState.fieldErrors.contact}
									<FieldError errors={[{ message: formState.fieldErrors.contact }]} />
								{/if}
							</Field>

							<Field>
								<FieldLabel for="city">{f.fields.city}</FieldLabel>
								<Input
									id="city"
									name="city"
									type="text"
									autocomplete="address-level2"
									maxlength={80}
									bind:value={formState.city}
									placeholder={f.placeholders.city}
								/>
							</Field>

							<Field>
								<FieldLabel for="package">{f.fields.package}</FieldLabel>
								<input type="hidden" name="package" value={formState.pkg} />
								<Select
									type="single"
									name="package-select"
									value={formState.pkg}
									onValueChange={(v) => (formState.pkg = (v ?? '') as any)}
								>
									<SelectTrigger id="package" aria-label={f.fields.package} class="w-full">
										{formState.selectedPackageLabel}
									</SelectTrigger>
									<SelectContent>
										{#each formState.packageOptions as opt, i (i)}
											<SelectItem value={opt.value} label={opt.label}>
												{opt.label}
											</SelectItem>
										{/each}
									</SelectContent>
								</Select>
							</Field>
						</FieldGroup>

						<Field data-invalid={!!formState.fieldErrors.message}>
							<FieldLabel for="message">{f.fields.message}</FieldLabel>
							<Textarea
								id="message"
								name="message"
								rows={4}
								maxlength={1000}
								bind:value={formState.message}
								aria-invalid={!!formState.fieldErrors.message}
								placeholder={f.placeholders.message}
							/>
							{#if formState.fieldErrors.message}
								<FieldError errors={[{ message: formState.fieldErrors.message }]} />
							{/if}
						</Field>

						<Field orientation="horizontal" data-invalid={!!formState.fieldErrors.consent}>
							<Checkbox
								id="consent"
								name="consent"
								bind:checked={formState.consent}
								aria-invalid={!!formState.fieldErrors.consent}
								required
							/>
							<FieldLabel for="consent" class="text-sm font-normal">
								{f.consent}
							</FieldLabel>
						</Field>
						{#if formState.fieldErrors.consent}
							<FieldError errors={[{ message: formState.fieldErrors.consent }]} />
						{/if}

						<input
							type="text"
							name="hp"
							tabindex="-1"
							autocomplete="off"
							class="hidden"
							aria-hidden="true"
							bind:value={formState.honeypot}
						/>

						{#if formState.submitting}
							<div class="flex flex-col gap-2" aria-hidden="true">
								<Skeleton class="h-4 w-2/3" />
								<Skeleton class="h-4 w-1/2" />
							</div>
						{/if}

						{#if form && !form.ok && form.formError && form.formError !== 'rate_limited'}
							<Alert variant="destructive">
								<AlertCircle data-icon="inline-start" />
								<AlertDescription>{f.errors.generic}</AlertDescription>
							</Alert>
						{/if}

						<Button
							type="submit"
							size="lg"
							disabled={formState.submitting || !formState.consent}
							class="bg-foreground text-background hover:bg-foreground/90 w-full"
						>
							{#if formState.submitting}
								<Loader data-icon="inline-start" class="animate-spin" />
								{f.sending}
							{:else}
								<Send data-icon="inline-start" />
								{f.submit}
								<ArrowUpRight data-icon="inline-end" class="ml-1" />
							{/if}
						</Button>
					</form>
				{/if}
			</div>

			<aside class="flex flex-col gap-10 p-6 sm:p-10 lg:col-span-5 lg:p-12">
				<div class="flex flex-col gap-6">
					<p
						class="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase sm:text-xs"
					>
						{t.processHeading}
					</p>

					<ol class="flex flex-col">
						{#each t.process as step, i (i)}
							<li class="flex items-start gap-4 sm:gap-5">
								<span
									class="bg-foreground text-background font-mono flex size-9 shrink-0 items-center justify-center rounded-none text-sm tabular-nums sm:size-10"
									aria-hidden="true"
								>
									0{i + 1}
								</span>
								<div class="flex flex-col gap-1.5 pt-1.5 sm:pt-2">
									<h4 class="font-serif text-base font-medium sm:text-lg">{step.title}</h4>
									<p class="text-muted-foreground text-sm leading-relaxed sm:text-base">
										{step.description}
									</p>
								</div>
							</li>
							{#if i < t.process.length - 1}
								<Separator class="bg-foreground/10 my-5 sm:my-6" />
							{/if}
						{/each}
					</ol>
				</div>

				<Separator class="bg-foreground/10" />

				<div class="flex flex-col gap-5">
					<h3
						class="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase sm:text-xs"
					>
						{t.channelsHeading}
					</h3>

					<ul class="flex flex-col gap-3">
						{#each channels as channel, i (i)}
							{@const Icon = channel.icon}
							<li>
								<a
									href={channel.href}
									target={channel.external ? '_blank' : undefined}
									rel={channel.external ? 'noopener noreferrer' : undefined}
									class="group flex cursor-pointer items-center gap-3 py-1"
								>
									<span
										class="text-muted-foreground group-hover:text-foreground flex size-9 shrink-0 items-center justify-center rounded-none border border-border transition-colors"
										aria-hidden="true"
									>
										<Icon class="size-4" />
									</span>
									<span class="flex flex-1 flex-col">
										<span class="text-foreground text-sm font-medium">{channel.label}</span>
										<span class="text-muted-foreground text-xs">{channel.hint}</span>
									</span>
									<ArrowUpRight
										class="text-muted-foreground/60 group-hover:text-foreground size-4 shrink-0 transition-colors"
										aria-hidden="true"
									/>
								</a>
							</li>
						{/each}
					</ul>
				</div>
			</aside>
		</div>
	</div>
</section>
