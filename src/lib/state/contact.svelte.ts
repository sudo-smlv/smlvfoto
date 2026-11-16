import type { PackageId } from '$lib/i18n.svelte';

export type FormResult = {
	ok: boolean;
	formError?: string;
	errors?: Record<string, string>;
};

export class ContactState {
	private i18n!: any;
	name = $state('');
	contact = $state('');
	city = $state('');
	pkg = $state<PackageId | ''>('');
	message = $state('');
	consent = $state(false);
	honeypot = $state('');
	submitting = $state(false);
	
	private formGetter?: () => FormResult | null;
	formResult = $state<FormResult | null>(null);

	constructor(i18n: any, formGetter?: () => FormResult | null) {
		this.i18n = i18n;
		this.formGetter = formGetter;
		if (this.formGetter) {
			this.formResult = this.formGetter();
		}
	}

	packageOptions = $derived([
		...this.i18n.content.services.packages.map((p: any) => ({
			value: p.id,
			label: `${p.name} — €${p.price.amount}`
		})),
		...this.i18n.content.contact.orderOptions
	]);

	selectedPackageLabel = $derived(
		this.packageOptions.find((o: any) => o.value === this.pkg)?.label ?? this.i18n.content.contact.form.placeholders.package
	);

	fieldErrors = $derived.by(() => {
		if (!this.formResult || this.formResult.ok) return {} as Record<string, string>;
		return (this.formResult.errors ?? {}) as Record<string, string>;
	});

	isRateLimited = $derived(this.formResult?.formError === 'rate_limited');

	init(data?: { prefill?: { package: string | null } }) {
		if (typeof window !== 'undefined') {
			const validPackages = [
				...this.i18n.content.services.packages.map((p: any) => p.id),
				...this.i18n.content.contact.orderOptions.map((o: any) => o.value)
			];
			
			const fromQuery = new URLSearchParams(window.location.search).get('package');
			const fromPrefill = data?.prefill?.package;
			
			const fromUrl = fromPrefill ?? fromQuery;
			if (fromUrl && (validPackages as readonly string[]).includes(fromUrl)) {
				this.pkg = fromUrl as PackageId;
			}

			const onSelect = (e: Event) => {
				const detail = (e as CustomEvent<{ id: PackageId }>).detail;
				if (detail?.id) this.pkg = detail.id;
			};
			window.addEventListener('contact:select-package', onSelect);
			return () => window.removeEventListener('contact:select-package', onSelect);
		}
	}

	createSubmitEnhance() {
		return () => {
			this.submitting = true;
			return async ({ update, result }: { update: () => Promise<void>, result: any }) => {
				await update();
				if (result.type === 'success' || result.type === 'failure') {
					if (result.data) {
						this.formResult = result.data as FormResult;
					}
				}
				this.submitting = false;
			};
		};
	}
}

export function createContactForm(i18n: any, formGetter?: () => FormResult | null) {
	return new ContactState(i18n, formGetter);
}
