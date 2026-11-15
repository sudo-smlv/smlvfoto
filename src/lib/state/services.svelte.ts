import type { PackageId } from '$lib/i18n.svelte';

export class ServicesState {
	private i18n!: any;
	
	constructor(i18n: any) {
		this.i18n = i18n;
	}

	get packages() {
		return this.i18n.content.services.packages;
	}
	
	// The package marked "popular" in Sanity is shown large; without one, the first package is.
	popular = $derived(this.packages.find((p: any) => p.popular) ?? this.packages[0]);
	others = $derived(this.packages.filter((p: any) => p !== this.popular));

	formatter = $derived(new Intl.NumberFormat(this.i18n.locale, { maximumFractionDigits: 0 }));

	selectPackage = (id: PackageId) => {
		const url = new URL(window.location.href);
		url.searchParams.set('package', id);
		history.replaceState(null, '', url);
		window.dispatchEvent(new CustomEvent('contact:select-package', { detail: { id } }));
		document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
	};
}

export function createServicesState(i18n: any) {
	return new ServicesState(i18n);
}
