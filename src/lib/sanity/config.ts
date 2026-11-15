// Public Sanity identifiers (not secrets). The dataset is public, so the site
// reads published content without a token.
export const sanityConfig = {
	projectId: '6uyeptt9',
	dataset: 'production',
	apiVersion: '2025-02-19',
	studioUrl: 'https://smlvfoto.sanity.studio'
} as const;

const CDN_MAX_WIDTH = 2400;

/**
 * Builds a Sanity CDN URL from an image asset reference such as
 * `image-<hash>-1600x1066-avif`, capped to a sensible width and served in the
 * best format the browser accepts.
 */
export function imageFromRef(ref: string): { src: string; width: number; height: number } {
	const match = /^image-([a-f0-9]+)-(\d+)x(\d+)-(\w+)$/.exec(ref);
	if (!match) throw new Error(`Unexpected Sanity image reference: ${ref}`);
	const [, id, w, h, format] = match;
	const width = Number(w);
	const height = Number(h);
	const base = `https://cdn.sanity.io/images/${sanityConfig.projectId}/${sanityConfig.dataset}/${id}-${w}x${h}.${format}`;
	const params = new URLSearchParams({ auto: 'format', fit: 'max' });
	if (width > CDN_MAX_WIDTH) params.set('w', String(CDN_MAX_WIDTH));
	return { src: `${base}?${params}`, width, height };
}
