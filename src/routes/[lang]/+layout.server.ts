import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import type { ContentLocale } from '$lib/i18n.svelte';

export const load: LayoutServerLoad = ({ params }) => {
	const lang = params.lang as ContentLocale;
	
	if (!['en', 'de', 'ru'].includes(lang)) {
		error(404, 'Language not supported');
	}
	
	return {
		lang
	};
};
