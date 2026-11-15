import portfolioItems from './portfolio.json';

export type PortfolioStory = {
	id: string;
	src: string;
	images?: string[];
	alt: string;
	caption: string;
	location: string;
	year: string;
	city?: string;
	category?: string;
};

type Package = {
	id: 'mini' | 'moment' | 'atmosphere' | 'legacy';
	name: string;
	label: string;
	tagline: string;
	description: string;
	price: { amount: number; currency: 'EUR' };
	priceCH?: number;
	features: readonly string[];
	deliveryDays: string;
	popular?: boolean;
	cta: string;
};

export const en = {
	nav: {
		home: 'Home',
		about: 'About',
		portfolio: 'Portfolio',
		services: 'Pricing',
		locations: 'Locations',
		photobooks: 'Photobooks',
		faq: 'FAQ',
		contact: 'Contact'
	},
	sectionLabels: {
		about: '01 — About me',
		portfolio: '02 — Family Photos',
		services: '03 — Pricing',
		locations: '04 — Locations',
		photobooks: '05 — Photobooks',
		faq: '06 — FAQ',
		contact: '07 — Contact'
	},
	a11y: {
		mainNav: 'Main navigation',
		openMenu: 'Open menu',
		closeMenu: 'Close menu',
		footerHeading: 'Footer'
	},
	channels: {
		whatsapp: { label: 'WhatsApp', hintKey: 'phone' },
		instagram: { label: 'Instagram', hintKey: 'instagramHandle' },
		email: { label: 'Email', hintKey: 'email' }
	} as const,
	hero: {
		eyebrow: 'Viktoria · Family Photographer',
		title: 'Authentic Family Photography & Candid Moments',
		subtitle:
			'I capture the warmth and love of your family. Relaxed family photoshoots, emotional videos, and handcrafted photobooks.',
		locations: '📍 Baden-Württemberg (Freiburg, Stuttgart, Black Forest) • Switzerland (Basel, Zurich)',
		cta: 'Book a Session',
		viewPortfolio: 'View Portfolio',
		background: {
			src: '/images/hero/background.avif',
			alt: 'Portrait of a family in nature with soft light'
		},
		stat: '120+ family photoshoots · 6 years of experience',
		card: {
			title: 'Booking Open',
			body: 'Photos · Reels · Photobooks',
			src: '/images/hero/card.avif'
		}
	},
	about: {
		heading: 'Hi! I am your family photographer 🤍',
		caption: 'Viktoria · Freiburg · 2024',
		statement:
			'For me, family photography is about making time stand still. Capturing the real emotions while the kids are still small and the way you look at each other with love.',
		portrait: {
			src: '/images/about/portrait.avif',
			alt: 'Portrait of family photographer Viktoria',
			width: 1280,
			height: 1600
		},
		stats: [
			{ value: '6', label: 'years experience' },
			{ value: '120+', label: 'shootings' },
			{ value: '3', label: 'countries' },
			{ value: '∞', label: 'stories' }
		]
	},
	services: {
		heading: 'Family Photoshoot Prices & Packages',
		subheading:
			'Transparent family photoshoot costs with no hidden fees. Every package includes advice for family photo ideas, location scouting, and a private online gallery.',
		coverage: 'Baden-Württemberg · Switzerland (Zurich, Basel)',

		popularBadge: 'Most Popular Choice',
		priceUnit: 'fixed price',
		swissLabel: 'Switzerland',
		addons: {
			heading: 'Add-ons for any package',
			items: [
				{ name: 'Atmospheric video (Reel) with "Moment" or "Christmas Mini"', price: '+€130' },
				{ name: 'Premium 20×20 cm photobook, ordered separately', price: 'from €220' },
				{ name: 'Gift voucher for any package', price: 'at package price' }
			] as const
		},
		travel: {
			heading: 'Travel',
			items: [
				{ name: 'Freiburg & 30 km around', price: 'included' },
				{ name: 'Karlsruhe, Baden-Baden, Konstanz', price: '+€40' },
				{ name: 'Stuttgart, Heidelberg, Mannheim', price: '+€60' },
				{ name: 'Basel & Zurich', price: 'included in the CHF price' }
			] as const
		},
		packages: [
			{
				id: 'mini',
				name: 'Christmas Mini',
				label: 'SEASONAL',
				tagline: 'A Short Christmas Shoot',
				description:
					'A short family Christmas photoshoot at a fixed location in Freiburg. Perfect for Christmas cards and as a gift for the grandparents.',
				price: { amount: 159, currency: 'EUR' },
				features: [
					'30 minutes shooting at a fixed location in Freiburg',
					'10 edited photos with magazine retouching',
					'Personal online gallery for 3 months',
					'Dates in November & December, also available as a voucher',
					'Express delivery — up to 5 days'
				],
				deliveryDays: 'up to 5 days',
				cta: 'Choose "Christmas Mini"'
			},
			{
				id: 'moment',
				name: 'Moment',
				label: 'START',
				tagline: 'A Short Walk',
				description:
					'Perfect for a short family photoshoot, a sibling photoshoot, or a relaxed couples photoshoot in the old town.',
				price: { amount: 290, currency: 'EUR' },
				priceCH: 390,
				features: [
					'1 hour shooting at a chosen location',
					'80+ edited photos, 25 of them with magazine retouching',
					'Personal online gallery for 6 months',
					'Style consultation & 1 location to choose from',
					'Express delivery — up to 7 days'
				],
				deliveryDays: 'up to 7 days',
				cta: 'Choose "Moment"'
			},
			{
				id: 'atmosphere',
				name: 'Atmosphere',
				label: 'BESTSELLER',
				tagline: 'The Complete Family Story',
				description:
					'A professional family photoshoot with plenty of time for playing with the kids and capturing real emotions. Includes outfit advice and a location change.',
				price: { amount: 450, currency: 'EUR' },
				priceCH: 590,
				features: [
					'Up to 1.5 hours shooting (2 outfits, location change possible)',
					'120+ edited photos, 40 of them with magazine retouching',
					'An atmospheric video (Reels / Stories)',
					'Full online gallery for 1 year',
					'Help with outfit choices & shooting in perfect sunset light',
					'Delivery — up to 7 days'
				],
				deliveryDays: 'up to 7 days',
				popular: true,
				cta: 'Choose "Atmosphere"'
			},
			{
				id: 'legacy',
				name: 'Legacy',
				label: 'PREMIUM',
				tagline: 'Family Photoshoot + Premium Photobook',
				description:
					'The all-inclusive package for your family memories. An extensive shooting and a handcrafted photobook as a family heirloom for generations.',
				price: { amount: 850, currency: 'EUR' },
				priceCH: 990,
				features: [
					'Up to 2 hours shooting (City + Nature / 2–3 outfits)',
					'160+ edited photos, 60 of them with magazine retouching',
					'Premium 20×20 cm photobook in fabric/leather with custom embossing',
					'Free delivery of the photobook across Europe',
					'Series of atmospheric videos (Reels / Stories)',
					'First 5 photos within 24 hours (for social media)',
					'Permanent cloud backup of your photos'
				],
				deliveryDays: 'up to 10 days',
				cta: 'Choose "Legacy"'
			}
		] as readonly Package[]
	},
	locations: {
		heading: 'Where will our family photoshoot take place?',
		intro:
			'I know the most beautiful spots and will help you find the perfect location for your vibe:',
		coverage: 'Baden-Württemberg · Basel · Zurich',
		items: [
			{
				icon: '☕️',
				number: '01',
				type: 'URBAN',
				title: 'Urban Aesthetics',
				subtitle: 'Freiburg, Stuttgart, Karlsruhe, Mannheim, Baden-Baden, Heidelberg, Basel, Zurich',
				description: 'Stylish family walks through European streets, coffee on terraces, and beautiful city architecture.',
				tags: ['Architecture', 'Cafes', 'Streets'],
				bestTime: 'Year-round',
				image: {
					src: '/images/locations/urban.avif',
					alt: 'Cozy street in the old town',
					width: 1600,
					height: 1200
				}
			},
			{
				icon: '🌲',
				number: '02',
				type: 'NATURE',
				title: 'Nature & Tranquility',
				subtitle: 'Black Forest, Lake Constance (Konstanz), Titisee, Schluchsee',
				description:
					'Ideal for active kids. Running in the fields, deep pine forests, and soft evening light away from the city hustle.',
				tags: ['Lakes', 'Forests', 'Sunsets'],
				bestTime: 'Spring — Autumn',
				image: {
					src: '/images/locations/nature.avif',
					alt: 'Lake surrounded by pine forest',
					width: 1600,
					height: 1067
				}
			}
		] as const,
		viewLocation: 'Shootings at this location',
		locationLabels: {
			bestTime: 'Best time',
			shoots: 'Shootings',
			type: 'Type',
			urban: 'Urban',
			nature: 'Nature'
		},
		stats: [
			{ label: 'City', value: 'Freiburg · Stuttgart · Karlsruhe' },
			{ label: 'Switzerland', value: 'Basel · Zurich' },
			{ label: 'Season', value: 'Year-round · 12 mo.' },
			{ label: 'Type', value: 'Urban · Nature' }
		] as const,
		shootCounts: ['40+', '20+'] as const
	},
	photobooks: {
		heading: 'Family Treasures to Touch',
		intro:
			'Family photos shouldn’t just live on your phone. A photobook is a family heirloom that your children will flip through decades from now.',
		coverage: 'Family Heirloom · Delivery across Europe',
		featuresHeading: 'What makes it special',
		galleryLabels: ['01', '02', '03', '04'] as const,
		features: [
			{
				title: 'Quality',
				description:
					'Sturdy layflat pages that open 180°. Matte or glossy paper that won’t yellow over the years.'
			},
			{
				title: 'Exclusivity',
				description:
					'Covers made of premium fabric, eco-leather, or Soft Touch. Custom embossing — your name, a date, or whatever you wish.'
			},
			{
				title: 'Care',
				description:
					'I take care of the entire design and layout. We discuss every detail until the book is perfect. Free shipping across Europe.'
			}
		] as const,
		hero: {
			src: '/images/photobooks/cover.avif',
			alt: 'Open premium photobook'
		},
		gallery: [
			{
				src: '/images/photobooks/cover.avif',
				alt: 'Open photobook with portrait photos',
				caption: 'Premium Layout',
				size: 'featured'
			},
			{
				src: '/images/photobooks/hero.avif',
				alt: 'Photobook with elegant fabric cover',
				caption: 'Fabric Cover',
				size: 'medium'
			},
			{
				src: '/images/photobooks/detail-1.avif',
				alt: 'Photobook: Embossing and binding details',
				caption: 'Embossing & Details',
				size: 'medium'
			},
			{
				src: '/images/photobooks/detail-2.avif',
				alt: 'Open photobook with panoramic print',
				caption: 'Panoramic Print',
				size: 'medium'
			}
		] as const,
		cta: 'Order a Photobook'
	},
	portfolio: {
		heading: 'Family Stories',
		intro: 'A few stories from my recent shoots. Scroll through to see my style.',
		coverage: 'Stories · 2023 — 2024',
		metaCount: `${portfolioItems.length.toString().padStart(2, '0')} / stories`,
		metaYears: '2023 — 2024',
		items: portfolioItems as PortfolioStory[],
		viewAll: 'All Stories',
		prev: 'Previous',
		next: 'Next',
		goToSlide: (n: number) => `Slide ${n}`
	},
	faq: {
		heading: 'Frequently Asked Questions (FAQ)',
		intro: 'If you can’t find an answer — just message me, we can discuss the details.',
		coverage: '07 answers · I reply within a day',
		sidebar: {
			heading: 'Didn’t find an answer?',
			body: 'Write your question in the form below — I will answer personally. Or browse the questions on the left, the answer is likely already there.'
		},
		cta: 'Ask a Question',
		items: [
			{
				q: 'How do we prepare for the photoshoot?',
				a: 'After booking, I send you a guide: how to choose outfits, what to bring, which location fits your idea. A week before the shooting, we text to finalize the details.'
			},
			{
				q: 'Do you also offer a gift voucher for a family photoshoot?',
				a: 'Yes! Vouchers are available for every package — from the "Christmas Mini" (€159) to "Legacy" (€850). The perfect gift, also ideal for a Christmas family photoshoot or for Mother’s Day. Just send me a message.'
			},
			{
				q: 'How long does the editing take?',
				a: 'The "Christmas Mini" is delivered within 5 days, "Moment" and "Atmosphere" within 7 days. For the "Legacy" package, you receive the first 5 photos in 24 hours, the full gallery in 10 days, and the photobook layout/printing takes about 2 weeks.'
			},
			{
				q: 'What happens if the weather is bad?',
				a: 'For outdoor shoots, I have indoor backup locations (cafes, galleries, hotels). If we have to reschedule the shoot due to weather — we do it free of charge.'
			},
			{
				q: 'Are there travel costs?',
				a: 'Travel is included in Freiburg and within 30 km. For Karlsruhe, Baden-Baden and Konstanz I charge a flat €40, for Stuttgart, Heidelberg and Mannheim €60. For Basel and Zurich the CHF prices apply — travel is already included there.'
			},
			{
				q: 'How is the photobook shipped?',
				a: 'Via courier across Europe, free of charge with the "Legacy" package. Delivery time is 5–10 business days. I will send the tracking number on the day of dispatch.'
			},
			{
				q: 'Do you work outside of Europe?',
				a: 'Yes, by individual arrangement. Flights and accommodation are discussed separately and are not included in the package prices.'
			}
		] as const
	},
	contact: {
		heading: 'Let’s create something beautiful together!',
		intro:
			'Leave a request for your family photoshoot in the form below or message me directly. Tell me a bit about your ideas and where you are located. I’ll get back to you today!',
		coverage: 'Reply within 24 hrs · CET / UTC+1',
		formHeading: 'Request a Session',
		formMeta: 'Form · 1 Min',
		processHeading: 'What happens next',
		rateLimitedTitle: 'Too many attempts',
		rateLimitedDescription: 'Please wait a few minutes or message me directly via messenger.',
		process: [
			{
				title: 'Submit a Request',
				description: 'Fill out the short form — it takes less than a minute.'
			},
			{
				title: 'Personal Reply',
				description: 'I will message you later today on your preferred messenger and ask a few clarifying questions.'
			},
			{
				title: 'Planning & Prep',
				description: 'We discuss ideas, outfits, and locations. I will send you my guide with recommendations.'
			},
			{
				title: 'Reserve the Date',
				description: 'We lock in the date and the format of your photoshoot. Everything is under control.'
			}
		] as const,
		channelsHeading: 'Or message me directly',
		form: {
			submit: 'Send',
			sending: 'Sending…',
			success: 'Thank you! I will get back to you today 🤍',
			successHint: 'If you want to message me right now — choose your preferred messenger below.',
			consent:
				'I agree to the processing of my personal data in accordance with the Privacy Policy.',
			fields: {
				name: 'Name',
				contact: 'Phone, Email, or Messenger',
				city: 'City',
				package: 'Package',
				message: 'Tell me about your idea'
			},
			placeholders: {
				name: 'How should I call you?',
				contact: '+49… or @username',
				city: 'Freiburg, Basel…',
				package: 'Choose a package',
				message: 'Optional, but it helps me prepare'
			},
			errors: {
				required: 'This field is required',
				consent: 'Consent is required so I can contact you',
				tooLong: 'Value is too long',
				generic: 'Failed to send. Please try again or message me directly.'
			}
		}
	},
	footer: {
		tagline: 'I capture the warmth of your family in photos and books',
		availability: 'Booking Open',
		basedIn: 'Baden-Württemberg (Freiburg, Stuttgart, Black Forest) · Switzerland (Basel, Zurich)',
		basedInLabel: 'Based in',
		timezone: 'CET / UTC+1',
		responseTime: 'I reply within 24 hours',
		ctaHeading: 'Ready to start?',
		ctaButton: 'Book a Session',
		columns: {
			navigation: 'Navigation',
			contacts: 'Contact',
			status: 'Status'
		},
		rights: 'All rights reserved.',
		madeWith: 'Made with love in Freiburg'
	},
	email: {
		subject: (pkg: string | null) => `Request from website (${pkg ?? 'no package'})`,
		noPackage: 'no package',
		labels: {
			name: 'Name',
			contact: 'Contact',
			city: 'City',
			package: 'Package',
			message: 'Message',
			id: 'ID'
		},
		emptyValue: '—'
	},
	error: {
		title: 'Something went wrong',
		description: 'Sorry, the page you are looking for could not be found or an error occurred.',
		homeButton: 'Back to Home'
	}
} as const;

export type PackageId = (typeof en.services.packages)[number]['id'];
