import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ request }) => {
	const acceptLanguage = request.headers.get('accept-language') || '';
	
	let lang = 'de'; // Default
	if (acceptLanguage.toLowerCase().includes('en')) {
		lang = 'en';
	} else if (acceptLanguage.toLowerCase().includes('ru')) {
		lang = 'ru';
	}
	
	throw redirect(301, `/${lang}`);
};
