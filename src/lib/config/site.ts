export const site = {
	name: 'Viktoria — Family Photographer in Baden-Württemberg & Switzerland',
	shortName: 'Viktoria',
	locale: 'en' as const,
	url: 'https://smlvfoto.com',
	email: 'hi@smlvfoto.com',
	phone: '+49 173 519 48 06',
	whatsapp: '491735194806',
	telegram: 'viktoria_photo',
	instagram: {
		handle: 'victoriasmvlph',
		url: 'https://instagram.com/victoriasmvlph'
	},
	ogImage: '/og.jpg',
	description:
		'Professional family photoshoot in Freiburg, Stuttgart, Karlsruhe, Basel, and Zurich. Relaxed family photography, authentic family photos, and premium photobooks. Book a session now!'
} as const;

export type SiteConfig = typeof site;
