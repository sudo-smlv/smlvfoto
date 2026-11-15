import { imageFromRef } from '$lib/sanity/config';

export const LOCALES = ['de', 'en', 'ru'] as const;
export type ContentLocale = (typeof LOCALES)[number];

export function isLocale(value: unknown): value is ContentLocale {
	return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

/**
 * A resolved image: CDN URL, original dimensions, alt text in one language and, when the editor
 * set one in the Studio, the focal point (0–1 from the top-left corner).
 */
export type CmsImage = {
	src: string;
	width: number;
	height: number;
	alt: string;
	focus?: { x: number; y: number };
};

function isLocalized(value: object): value is Record<ContentLocale, unknown> {
	const keys = Object.keys(value).filter((k) => k !== '_type');
	return keys.length > 0 && keys.every((k) => isLocale(k));
}

function isEmpty(value: unknown) {
	return value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);
}

/**
 * Collapses Sanity's `{ru, de, en}` objects to one language (falling back to
 * another language when a translation is left empty) and turns image fields
 * into `{src, width, height, alt}`. Everything else is passed through.
 */
export function localize(value: unknown, lang: ContentLocale): unknown {
	if (Array.isArray(value)) return value.map((item) => localize(item, lang));
	if (!value || typeof value !== 'object') return value;

	if (isLocalized(value)) {
		const order = [lang, ...LOCALES.filter((l) => l !== lang)];
		const picked = order.map((l) => value[l]).find((v) => !isEmpty(v));
		return localize(picked ?? '', lang);
	}

	const record = value as Record<string, unknown>;
	const asset = record.asset as { _ref?: string } | undefined;
	if (asset?._ref) {
		const alt = localize(record.alt, lang);
		const hotspot = record.hotspot as { x?: number; y?: number } | undefined;
		const image: CmsImage = { ...imageFromRef(asset._ref), alt: typeof alt === 'string' ? alt : '' };
		if (typeof hotspot?.x === 'number' && typeof hotspot?.y === 'number') {
			image.focus = { x: hotspot.x, y: hotspot.y };
		}
		return image;
	}

	return Object.fromEntries(
		Object.entries(record)
			.filter(([key]) => !key.startsWith('_') || key === '_key')
			.map(([key, v]) => [key, localize(v, lang)])
	);
}
