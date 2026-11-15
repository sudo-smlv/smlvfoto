import { getContext, setContext } from 'svelte';
import { buildContent, buildSite, type HomeDoc, type SettingsDoc } from './content/build';
import type { ContentLocale } from './content/localize';

export type { ContentLocale } from './content/localize';
export type { Content, PackageId, PortfolioStory, SiteConfig } from './content/build';

/** Localized CMS data passed from the root layout's server load. */
export type CmsPageData = { lang: ContentLocale; home: HomeDoc; settings: SettingsDoc };

const I18N_KEY = Symbol('i18n');

class I18nState {
	#source: () => CmsPageData;

	constructor(source: () => CmsPageData) {
		this.#source = source;
	}

	locale = $derived.by(() => this.#source().lang);
	content = $derived.by(() => buildContent(this.#source().home));
	site = $derived.by(() => buildSite(this.#source().settings));
}

/** Call once in the root layout with a getter for the layout data. */
export function initI18n(source: () => CmsPageData) {
	const state = new I18nState(source);
	setContext(I18N_KEY, state);
	return state;
}

export function useI18n() {
	return getContext<I18nState>(I18N_KEY);
}
