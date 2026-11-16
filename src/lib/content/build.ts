import type { CmsImage } from './localize';

// ── Shape of the Sanity documents after `localize()` ─────────────────────────
// Field names match sanity/schema.js. Every field may be missing while the
// editor is still filling it in, so builders below fall back to safe values.

type Item = { title?: string; description?: string };

export type HomeDoc = {
	hero?: {
		eyebrow?: string;
		title?: string;
		subtitle?: string;
		locations?: string;
		stat?: string;
		cta?: string;
		viewPortfolio?: string;
		backgroundImage?: CmsImage;
		backgroundInColor?: boolean;
		cardTitle?: string;
		cardBody?: string;
		cardImage?: CmsImage;
	};
	about?: { heading?: string; statement?: string; caption?: string; portrait?: CmsImage; stats?: Item[] };
	portfolio?: {
		heading?: string;
		intro?: string;
		coverage?: string;
		metaYears?: string;
		metaCountLabel?: string;
		stories?: {
			_key: string;
			cover?: CmsImage;
			images?: CmsImage[];
			caption?: string;
			location?: string;
			category?: string;
			year?: string;
			city?: string;
		}[];
		filters?: { title?: string; label?: string }[];
		texts?: Partial<Record<PortfolioTextKey, string>>;
	};
	services?: {
		heading?: string;
		subheading?: string;
		coverage?: string;
		popularBadge?: string;
		priceUnit?: string;
		chfLabel?: string;
		seasons?: Partial<Record<Season, string>>;
		extras?: PriceList;
		travel?: PriceList;
		packages?: {
			packageId?: string;
			price?: number;
			priceChf?: number;
			popular?: boolean;
			name?: string;
			label?: string;
			tagline?: string;
			description?: string;
			features?: string[];
			deliveryDays?: string;
			cta?: string;
		}[];
	};
	locations?: {
		heading?: string;
		intro?: string;
		coverage?: string;
		viewLocation?: string;
		items?: {
			kind?: string;
			icon?: string;
			number?: string;
			image?: CmsImage;
			name?: string;
			subtitle?: string;
			description?: string;
			tags?: string[];
			bestTime?: string;
			shootCount?: string;
		}[];
		labels?: Partial<Record<'bestTime' | 'shoots' | 'type' | 'urban' | 'nature', string>>;
		stats?: Item[];
	};
	photobooks?: {
		heading?: string;
		intro?: string;
		coverage?: string;
		featuresHeading?: string;
		features?: Item[];
		heroImage?: CmsImage;
		gallery?: { image?: CmsImage; more?: CmsImage[]; caption?: string; size?: string }[];
		cta?: string;
	};
	faq?: {
		heading?: string;
		intro?: string;
		coverage?: string;
		items?: Item[];
		sidebarHeading?: string;
		sidebarBody?: string;
		cta?: string;
	};
	contact?: {
		heading?: string;
		intro?: string;
		coverage?: string;
		processHeading?: string;
		process?: Item[];
		channelsHeading?: string;
		formHeading?: string;
		formMeta?: string;
		form?: Partial<Record<FormTextKey, string>>;
		email?: Partial<Record<EmailTextKey, string>>;
	};
	footer?: Partial<Record<FooterTextKey, string>>;
	nav?: Partial<Record<NavKey, string>>;
	sectionLabels?: Partial<Record<Exclude<NavKey, 'home'>, string>>;
	ui?: Partial<Record<UiTextKey, string>>;
};

export type SettingsDoc = {
	siteName?: string;
	shortName?: string;
	url?: string;
	email?: string;
	phone?: string;
	whatsapp?: string;
	telegram?: string;
	instagramHandle?: string;
	instagramUrl?: string;
	seoDescription?: string;
	ogImage?: CmsImage;
};

type PortfolioTextKey =
	| 'viewAll'
	| 'prev'
	| 'next'
	| 'goToSlide'
	| 'shownOfTotal'
	| 'photoCount'
	| 'allFilter'
	| 'dialogTitle'
	| 'shootCount'
	| 'shootCountLong'
	| 'empty'
	| 'showAll'
	| 'loading'
	| 'ctaText'
	| 'ctaButton'
	| 'frameOf'
	| 'prevStory'
	| 'nextStory'
	| 'bookStory'
	| 'closeViewer'
	| 'viewerLabel'
	| 'prevPhoto'
	| 'nextPhoto'
	| 'thumbnail';
type FormTextKey =
	| `${'name' | 'contact' | 'city' | 'package' | 'message'}${'Label' | 'Placeholder'}`
	| 'consent'
	| 'submit'
	| 'sending'
	| 'success'
	| 'successHint'
	| 'errorRequired'
	| 'errorConsent'
	| 'errorTooLong'
	| 'errorGeneric'
	| 'rateLimitedTitle'
	| 'rateLimitedDescription';
type EmailTextKey =
	| 'subject'
	| 'noPackage'
	| `label${'Name' | 'Contact' | 'City' | 'Package' | 'Message' | 'Id'}`
	| 'emptyValue';
type FooterTextKey =
	| 'ctaHeading'
	| 'ctaButton'
	| 'tagline'
	| 'availability'
	| 'basedInLabel'
	| 'basedIn'
	| 'timezone'
	| 'responseTime'
	| 'columnNavigation'
	| 'columnContacts'
	| 'columnStatus'
	| 'rights'
	| 'madeWith';
type NavKey = 'home' | 'about' | 'portfolio' | 'services' | 'locations' | 'photobooks' | 'faq' | 'contact';
type UiTextKey =
	| 'mainNav'
	| 'openMenu'
	| 'closeMenu'
	| 'footerHeading'
	| 'channelWhatsapp'
	| 'channelInstagram'
	| 'channelEmail'
	| 'errorTitle'
	| 'errorDescription'
	| 'errorHomeButton';

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Replaces `{name}` placeholders, e.g. fill('Слайд {n}', { n: 2 }). */
const PLURAL_ORDER: Record<number, Intl.LDMLPluralRule[]> = {
	2: ['one', 'other'], // de, en: Shooting|Shootings
	3: ['one', 'few', 'many'] // ru: съёмка|съёмки|съёмок
};
const pluralRules = {
	2: new Intl.PluralRules('en'),
	3: new Intl.PluralRules('ru')
} as const;

/**
 * Fills `{name}` placeholders. A `{form|form}` or `{form|form|form}` block picks the word form
 * for the number placed just before it, e.g. "{count} {съёмка|съёмки|съёмок}" → "4 съёмки".
 */
export function fill(template: string, values: Record<string, string | number>): string {
	let lastNumber: number | undefined;
	return template.replace(/\{([^{}]+)\}/g, (match, body: string) => {
		if (body.includes('|')) {
			const forms = body.split('|');
			const order = PLURAL_ORDER[forms.length];
			if (!order || lastNumber === undefined) return forms[forms.length - 1];
			const rule = pluralRules[forms.length as 2 | 3].select(lastNumber);
			const idx = order.indexOf(rule);
			return forms[idx === -1 ? forms.length - 1 : idx];
		}
		if (!(body in values)) return match;
		const value = values[body];
		const n = Number(value);
		if (value !== '' && Number.isFinite(n)) lastNumber = n;
		return String(value);
	});
}

const s = (value: string | undefined) => value ?? '';
const EMPTY_IMAGE: CmsImage = { src: '', width: 1, height: 1, alt: '' };
const img = (value: CmsImage | undefined) => value ?? EMPTY_IMAGE;

function strings<K extends string>(source: Partial<Record<K, string>> | undefined, keys: readonly K[]) {
	return Object.fromEntries(keys.map((k) => [k, s(source?.[k])])) as Record<K, string>;
}

const NAV_KEYS = ['home', 'about', 'portfolio', 'services', 'locations', 'photobooks', 'faq', 'contact'] as const;
const SECTION_KEYS = ['about', 'portfolio', 'services', 'locations', 'photobooks', 'faq', 'contact'] as const;
const PORTFOLIO_TEXT_KEYS = [
	'viewAll',
	'prev',
	'next',
	'goToSlide',
	'shownOfTotal',
	'photoCount',
	'allFilter',
	'dialogTitle',
	'shootCount',
	'shootCountLong',
	'empty',
	'showAll',
	'loading',
	'ctaText',
	'ctaButton',
	'frameOf',
	'prevStory',
	'nextStory',
	'bookStory',
	'closeViewer',
	'viewerLabel',
	'prevPhoto',
	'nextPhoto',
	'thumbnail'
] as const satisfies readonly PortfolioTextKey[];

// ── Builders ────────────────────────────────────────────────────────────────

export type PortfolioStory = {
	id: string;
	src: string;
	images: string[];
	alt: string;
	caption: string;
	location: string;
	year: string;
	city?: string;
	category?: string;
};

export type PackageId = string;

type Season = 'winter' | 'spring' | 'summer' | 'autumn';

/** Current season in Freiburg (meteorological: winter = Dec–Feb, and so on). */
function currentSeason(now = new Date()): Season {
	const month = Number(new Intl.DateTimeFormat('en', { month: 'numeric', timeZone: 'Europe/Berlin' }).format(now));
	if (month === 12 || month <= 2) return 'winter';
	if (month <= 5) return 'spring';
	if (month <= 8) return 'summer';
	return 'autumn';
}

type PriceList = { heading?: string; items?: { title?: string; price?: string }[] };

const priceList = (list: PriceList | undefined) => ({
	heading: s(list?.heading),
	items: (list?.items ?? [])
		.filter((i) => i.title)
		.map((i) => ({ title: s(i.title), price: s(i.price) }))
});

/** Builds the dictionary the components read (`i18n.content`) for one language. */
export function buildContent(home: HomeDoc) {
	const { hero = {}, about = {}, portfolio = {}, services = {}, locations = {}, photobooks = {} } = home;
	const { faq = {}, contact = {}, footer = {}, ui = {} } = home;
	const form = contact.form ?? {};
	const email = contact.email ?? {};
	const texts = strings(portfolio.texts, PORTFOLIO_TEXT_KEYS);
	// "{season}" in package texts becomes the current season's word, e.g. "{season} мини" → "Осенняя мини".
	const seasonWord = s(services.seasons?.[currentSeason()]);
	const withSeason = (value: string | undefined) => fill(s(value), { season: seasonWord });

	const stories: PortfolioStory[] = (portfolio.stories ?? []).map((story) => {
		const cover = img(story.cover);
		const images = (story.images ?? []).map((i) => i.src).filter(Boolean);
		return {
			id: story._key,
			src: cover.src,
			images: images.length ? images : [cover.src],
			alt: cover.alt,
			caption: s(story.caption),
			location: s(story.location),
			year: s(story.year),
			city: story.city,
			category: story.category || undefined
		};
	});

	const locationItems = (locations.items ?? []).map((item) => ({
		icon: s(item.icon),
		number: s(item.number),
		type: (item.kind === 'NATURE' ? 'NATURE' : 'URBAN') as 'URBAN' | 'NATURE',
		title: s(item.name),
		subtitle: s(item.subtitle),
		description: s(item.description),
		tags: item.tags ?? [],
		bestTime: s(item.bestTime),
		image: img(item.image)
	}));

	const gallery = (photobooks.gallery ?? []).map((g) => {
		const image = img(g.image);
		return {
			src: image.src,
			alt: image.alt,
			width: image.width,
			height: image.height,
			caption: s(g.caption),
			size: g.size === 'featured' ? 'featured' : 'medium',
			// The card photo first, then any extra photos shown when the card is opened.
			photos: [image, ...(g.more ?? []).map(img)].filter((p) => p.src)
		};
	});

	return {
		nav: strings(home.nav, NAV_KEYS),
		sectionLabels: strings(home.sectionLabels, SECTION_KEYS),
		a11y: {
			mainNav: s(ui.mainNav),
			openMenu: s(ui.openMenu),
			closeMenu: s(ui.closeMenu),
			footerHeading: s(ui.footerHeading)
		},
		channels: {
			whatsapp: { label: s(ui.channelWhatsapp), hintKey: 'phone' },
			instagram: { label: s(ui.channelInstagram), hintKey: 'instagramHandle' },
			email: { label: s(ui.channelEmail), hintKey: 'email' }
		},
		hero: {
			eyebrow: s(hero.eyebrow),
			title: s(hero.title),
			subtitle: s(hero.subtitle),
			locations: s(hero.locations),
			cta: s(hero.cta),
			viewPortfolio: s(hero.viewPortfolio),
			background: img(hero.backgroundImage),
			backgroundInColor: Boolean(hero.backgroundInColor),
			stat: s(hero.stat),
			card: { title: s(hero.cardTitle), body: s(hero.cardBody), src: img(hero.cardImage).src }
		},
		about: {
			heading: s(about.heading),
			caption: s(about.caption),
			statement: s(about.statement),
			portrait: img(about.portrait),
			stats: (about.stats ?? []).map((i) => ({ value: s(i.title), label: s(i.description) }))
		},
		services: {
			heading: s(services.heading),
			subheading: s(services.subheading),
			coverage: s(services.coverage),
			popularBadge: s(services.popularBadge),
			priceUnit: s(services.priceUnit),
			chfLabel: s(services.chfLabel),
			extras: priceList(services.extras),
			travel: priceList(services.travel),
			packages: (services.packages ?? []).map((p) => ({
				id: s(p.packageId) as PackageId,
				name: withSeason(p.name),
				label: s(p.label),
				tagline: withSeason(p.tagline),
				description: withSeason(p.description),
				price: { amount: p.price ?? 0, currency: 'EUR' as const },
				priceChf: p.priceChf ?? null,
				features: (p.features ?? []).map(withSeason),
				deliveryDays: s(p.deliveryDays),
				popular: Boolean(p.popular),
				cta: withSeason(p.cta)
			}))
		},
		locations: {
			heading: s(locations.heading),
			intro: s(locations.intro),
			coverage: s(locations.coverage),
			items: locationItems,
			viewLocation: s(locations.viewLocation),
			locationLabels: strings(locations.labels, ['bestTime', 'shoots', 'type', 'urban', 'nature'] as const),
			stats: (locations.stats ?? []).map((i) => ({ label: s(i.title), value: s(i.description) })),
			shootCounts: (locations.items ?? []).map((i) => s(i.shootCount))
		},
		photobooks: {
			heading: s(photobooks.heading),
			intro: s(photobooks.intro),
			coverage: s(photobooks.coverage),
			featuresHeading: s(photobooks.featuresHeading),
			galleryLabels: gallery.map((_, i) => String(i + 1).padStart(2, '0')),
			features: (photobooks.features ?? []).map((f) => ({ title: s(f.title), description: s(f.description) })),
			hero: img(photobooks.heroImage),
			gallery,
			cta: s(photobooks.cta)
		},
		portfolio: {
			heading: s(portfolio.heading),
			intro: s(portfolio.intro),
			coverage: s(portfolio.coverage),
			metaCount: `${String(stories.length).padStart(2, '0')} / ${s(portfolio.metaCountLabel)}`,
			metaYears: s(portfolio.metaYears),
			items: stories,
			filters: (portfolio.filters ?? [])
				.filter((f) => f.title)
				.map((f) => ({ id: s(f.title), label: s(f.label) })),
			texts,
			viewAll: texts.viewAll,
			prev: texts.prev,
			next: texts.next,
			goToSlide: (n: number) => fill(texts.goToSlide, { n })
		},
		faq: {
			heading: s(faq.heading),
			intro: s(faq.intro),
			coverage: s(faq.coverage),
			sidebar: { heading: s(faq.sidebarHeading), body: s(faq.sidebarBody) },
			cta: s(faq.cta),
			items: (faq.items ?? []).map((i) => ({ q: s(i.title), a: s(i.description) }))
		},
		contact: {
			heading: s(contact.heading),
			intro: s(contact.intro),
			coverage: s(contact.coverage),
			formHeading: s(contact.formHeading),
			formMeta: s(contact.formMeta),
			processHeading: s(contact.processHeading),
			rateLimitedTitle: s(form.rateLimitedTitle),
			rateLimitedDescription: s(form.rateLimitedDescription),
			process: (contact.process ?? []).map((i) => ({ title: s(i.title), description: s(i.description) })),
			channelsHeading: s(contact.channelsHeading),
			form: {
				submit: s(form.submit),
				sending: s(form.sending),
				success: s(form.success),
				successHint: s(form.successHint),
				consent: s(form.consent),
				fields: {
					name: s(form.nameLabel),
					contact: s(form.contactLabel),
					city: s(form.cityLabel),
					package: s(form.packageLabel),
					message: s(form.messageLabel)
				},
				placeholders: {
					name: s(form.namePlaceholder),
					contact: s(form.contactPlaceholder),
					city: s(form.cityPlaceholder),
					package: s(form.packagePlaceholder),
					message: s(form.messagePlaceholder)
				},
				errors: {
					required: s(form.errorRequired),
					consent: s(form.errorConsent),
					tooLong: s(form.errorTooLong),
					generic: s(form.errorGeneric)
				}
			}
		},
		footer: {
			tagline: s(footer.tagline),
			availability: s(footer.availability),
			basedIn: s(footer.basedIn),
			basedInLabel: s(footer.basedInLabel),
			timezone: s(footer.timezone),
			responseTime: s(footer.responseTime),
			ctaHeading: s(footer.ctaHeading),
			ctaButton: s(footer.ctaButton),
			columns: {
				navigation: s(footer.columnNavigation),
				contacts: s(footer.columnContacts),
				status: s(footer.columnStatus)
			},
			rights: s(footer.rights),
			madeWith: s(footer.madeWith)
		},
		email: {
			subject: (pkg: string | null) => fill(s(email.subject), { package: pkg ?? s(email.noPackage) }),
			noPackage: s(email.noPackage),
			labels: {
				name: s(email.labelName),
				contact: s(email.labelContact),
				city: s(email.labelCity),
				package: s(email.labelPackage),
				message: s(email.labelMessage),
				id: s(email.labelId)
			},
			emptyValue: s(email.emptyValue)
		},
		error: {
			title: s(ui.errorTitle),
			description: s(ui.errorDescription),
			homeButton: s(ui.errorHomeButton)
		}
	};
}

export type Content = ReturnType<typeof buildContent>;

/** Site-wide settings (contacts, SEO) for one language. */
export function buildSite(settings: SettingsDoc) {
	const url = (settings.url ?? 'https://smlvfoto.com').replace(/\/$/, '');
	return {
		name: s(settings.siteName),
		shortName: s(settings.shortName),
		url,
		email: s(settings.email),
		phone: s(settings.phone),
		whatsapp: s(settings.whatsapp),
		telegram: s(settings.telegram),
		instagram: { handle: s(settings.instagramHandle), url: s(settings.instagramUrl) },
		ogImage: settings.ogImage?.src ?? '',
		description: s(settings.seoDescription)
	};
}

export type SiteConfig = ReturnType<typeof buildSite>;
