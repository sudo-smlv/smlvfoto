/**
 * Keeps the focus point of an `object-fit: cover` image (the Sanity hotspot) in the middle
 * of its box, whatever the box proportions are. Plain `object-position: x% y%` only lines the
 * point up with the same spot of the box, so faces near the top of a tall photo get cut off
 * in a wide box; this works out the position that centres the point instead.
 */
export function focusCrop(img: HTMLImageElement, focus: { x: number; y: number } | undefined) {
	let current = focus;

	const update = () => {
		const f = current ?? { x: 0.5, y: 0.5 };
		const boxW = img.clientWidth;
		const boxH = img.clientHeight;
		const natW = img.naturalWidth || Number(img.getAttribute('width')) || 0;
		const natH = img.naturalHeight || Number(img.getAttribute('height')) || 0;
		if (!boxW || !boxH || !natW || !natH) return;

		// Fraction of the image that is visible along each axis after `cover` scaling.
		const scale = Math.max(boxW / natW, boxH / natH);
		const visibleX = boxW / (natW * scale);
		const visibleY = boxH / (natH * scale);
		const position = (point: number, visible: number) =>
			visible >= 1 ? 0.5 : Math.min(1, Math.max(0, (point - visible / 2) / (1 - visible)));

		img.style.objectPosition = `${(position(f.x, visibleX) * 100).toFixed(2)}% ${(position(f.y, visibleY) * 100).toFixed(2)}%`;
	};

	const observer = new ResizeObserver(update);
	observer.observe(img);
	img.addEventListener('load', update);
	update();

	return {
		update(next: { x: number; y: number } | undefined) {
			current = next;
			update();
		},
		destroy() {
			observer.disconnect();
			img.removeEventListener('load', update);
		}
	};
}
