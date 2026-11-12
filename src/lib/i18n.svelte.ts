import { getContext, setContext } from 'svelte';
import { en } from './content/en';
import { de } from './content/de';
import { ru } from './content/ru';
import type { PortfolioStory, PackageId } from './content/en'; // types are identical

export type ContentLocale = 'en' | 'de' | 'ru';
export type { PortfolioStory, PackageId };

const dictionaries: Record<ContentLocale, typeof de> = { en: en as unknown as typeof de, de, ru: ru as unknown as typeof de };

const I18N_KEY = Symbol('i18n');

class I18nState {
	locale = $state<ContentLocale>('de');

	get content() {
		return dictionaries[this.locale] || dictionaries['de'];
	}
}

export function initI18n(initial: ContentLocale) {
	const state = new I18nState();
	state.locale = initial;
	setContext(I18N_KEY, state);
	return state;
}

export function useI18n() {
	return getContext<I18nState>(I18N_KEY);
}
