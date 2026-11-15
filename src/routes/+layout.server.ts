import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getCms } from '$lib/server/cms';
import { isLocale, localize } from '$lib/content/localize';
import type { CmsPageData } from '$lib/i18n.svelte';
import type { HomeDoc, SettingsDoc } from '$lib/content/build';

export const load: LayoutServerLoad = async ({ params }): Promise<CmsPageData> => {
	const lang = isLocale(params.lang) ? params.lang : 'de';

	let cms;
	try {
		cms = await getCms();
	} catch (err) {
		console.error('[cms] Could not load content from Sanity', err);
		error(503, 'Content is temporarily unavailable');
	}

	return {
		lang,
		home: localize(cms.home, lang) as HomeDoc,
		settings: localize(cms.settings, lang) as SettingsDoc
	};
};
