import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { isLocale } from '$lib/content/localize';

export const load: LayoutServerLoad = ({ params }) => {
	if (!isLocale(params.lang)) {
		error(404, 'Language not supported');
	}
	return { lang: params.lang };
};
