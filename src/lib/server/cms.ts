import { sanityConfig } from '$lib/sanity/config';

/** Raw (all-language) Sanity documents as stored in the Content Lake. */
export type RawCms = {
	home: Record<string, unknown>;
	settings: Record<string, unknown>;
};

const QUERY = `{
  "home": *[_id == "homePage"][0],
  "settings": *[_id == "siteSettings"][0]
}`;

// Edits in the Studio show up on the site within this many milliseconds.
const CACHE_TTL_MS = 30_000;

let cached: { data: RawCms; fetchedAt: number } | null = null;
let inflight: Promise<RawCms> | null = null;

async function fetchCms(fetchFn: typeof fetch): Promise<RawCms> {
	const { projectId, dataset, apiVersion } = sanityConfig;
	const url = `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(QUERY)}`;
	const res = await fetchFn(url, { headers: { accept: 'application/json' } });
	if (!res.ok) {
		throw new Error(`Sanity query failed: ${res.status} ${await res.text()}`);
	}
	const { result } = (await res.json()) as { result: Partial<RawCms> | null };
	if (!result?.home || !result?.settings) {
		throw new Error('Sanity returned no published "homePage" or "siteSettings" document');
	}
	return result as RawCms;
}

/**
 * Returns the site content from Sanity, cached in memory for a short time.
 * If Sanity is unreachable, the last successful response keeps being served.
 */
export async function getCms(fetchFn: typeof fetch = fetch): Promise<RawCms> {
	if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) return cached.data;

	inflight ??= fetchCms(fetchFn)
		.then((data) => {
			cached = { data, fetchedAt: Date.now() };
			return data;
		})
		.finally(() => {
			inflight = null;
		});

	try {
		return await inflight;
	} catch (err) {
		if (cached) {
			console.error('[cms] Sanity request failed, serving cached content', err);
			return cached.data;
		}
		throw err;
	}
}
