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
 * A small square crop around the image's focal point (for avatars and stamps).
 * `share` is the crop side as a fraction of the image's shorter side.
 */
export function squareCrop(
	image: { src: string; width: number; height: number; focus?: { x: number; y: number } },
	size: number,
	share = 0.3
): string {
	if (!image.src.startsWith('https://cdn.sanity.io/')) return image.src;
	const focus = image.focus ?? { x: 0.5, y: 0.35 };
	const side = Math.round(Math.min(image.width, image.height) * share);
	const clamp = (v: number, max: number) => Math.max(0, Math.min(Math.round(v), max));
	const x = clamp(focus.x * image.width - side / 2, image.width - side);
	const y = clamp(focus.y * image.height - side / 2, image.height - side);
	const params = new URLSearchParams({
		rect: `${x},${y},${side},${side}`,
		w: String(size),
		h: String(size),
		fit: 'crop',
		auto: 'format'
	});
	return `${image.src.split('?')[0]}?${params}`;
}

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
