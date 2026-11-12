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
	id: 'individual' | 'moment' | 'atmosphere' | 'legacy';
	name: string;
	label: string;
	tagline: string;
	description: string;
	price: { amount: number; currency: 'EUR' };
	features: readonly string[];
	deliveryDays: string;
	popular?: boolean;
	cta: string;
};

export const de = {
	nav: {
		home: 'Startseite',
		about: 'Über mich',
		portfolio: 'Portfolio',
		services: 'Preise',
		locations: 'Locations',
		photobooks: 'Fotobücher',
		faq: 'FAQ',
		contact: 'Kontakt'
	},
	sectionLabels: {
		about: '01 — Über mich',
		portfolio: '02 — Familienfotos',
		services: '03 — Preise',
		locations: '04 — Locations',
		photobooks: '05 — Fotobücher',
		faq: '06 — FAQ',
		contact: '07 — Kontakt'
	},
	a11y: {
		mainNav: 'Hauptnavigation',
		openMenu: 'Menü öffnen',
		closeMenu: 'Menü schließen',
		footerHeading: 'Fußzeile'
	},
	channels: {
		whatsapp: { label: 'WhatsApp', hintKey: 'phone' },
		instagram: { label: 'Instagram', hintKey: 'instagramHandle' },
		email: { label: 'Email', hintKey: 'email' }
	} as const,
	hero: {
		eyebrow: 'Viktoria · Familienfotograf',
		title: 'Authentische Familienfotografie & ungestellte Momente',
		subtitle:
			'Ich halte die Wärme und Liebe eurer Familie fest. Ein entspanntes Fotoshooting für die Familie, emotionale Videos und handgefertigte Fotobücher.',
		locations: '📍 Baden-Württemberg (Freiburg, Stuttgart, Schwarzwald) • Schweiz (Basel, Zürich)',
		cta: 'Termin anfragen',
		viewPortfolio: 'Portfolio ansehen',
		background: {
			src: '/images/hero/background.avif',
			alt: 'Porträt einer Familie in der Natur mit weichem Licht'
		},
		stat: '120+ Familienfotoshootings · 6 Jahre Erfahrung',
		card: {
			title: 'Termine verfügbar',
			body: 'Fotos · Reels · Fotobücher',
			src: '/images/hero/card.avif'
		}
	},
	about: {
		heading: 'Hallo! Ich bin eure Familienfotografin 🤍',
		caption: 'Viktoria · Freiburg · 2024',
		statement:
			'Familienfotografie bedeutet für mich, die Zeit für einen Moment anzuhalten. Die echten Emotionen einzufangen, wenn die Kinder noch klein sind und ihr euch mit Liebe anseht.',
		portrait: {
			src: '/images/about/portrait.avif',
			alt: 'Porträt der Familienfotografin Viktoria',
			width: 1280,
			height: 1600
		},
		stats: [
			{ value: '6', label: 'Jahre Erfahrung' },
			{ value: '120+', label: 'Shootings' },
			{ value: '3', label: 'Länder' },
			{ value: '∞', label: 'Geschichten' }
		]
	},
	services: {
		heading: 'Familienfotoshooting Preise & Pakete',
		subheading:
			'Transparente Familienfotoshooting-Kosten ohne versteckte Gebühren. Jedes Paket beinhaltet Beratung für Familienfoto-Ideen, Location-Scouting und eine passwortgeschützte Online-Galerie.',
		coverage: 'Baden-Württemberg · Schweiz (Zürich, Basel)',

		popularBadge: 'Beliebteste Wahl',
		priceUnit: 'Festpreis',
		packages: [
			{
				id: 'individual',
				name: 'Individual',
				label: 'MINI',
				tagline: 'Street-Foto & Porträt',
				description:
					'Ein kurzes individuelles Fotoshooting. Perfekt für die Auffrischung des Portfolios oder für Social Media.',
				price: { amount: 100, currency: 'EUR' },
				features: [
					'30 Minuten Shooting',
					'10 Bilder in aufwendiger Magazin-Retusche',
					'Alle gelungenen Bilder farbkorrigiert (30+ Stück)',
					'Express-Bearbeitung — bis zu 7 Tage'
				],
				deliveryDays: 'bis zu 7 Tage',
				cta: '„Individual“ wählen'
			},
			{
				id: 'moment',
				name: 'Moment',
				label: 'START',
				tagline: 'Kurzer Spaziergang',
				description:
					'Ideal für ein kurzes Fotoshooting mit der Familie, ein Geschwister-Fotoshooting oder ein entspanntes Paar-Fotoshooting in der Altstadt.',
				price: { amount: 220, currency: 'EUR' },
				features: [
					'1 Stunde Shooting an der gewählten Location',
					'25 Bilder in aufwendiger Magazin-Retusche',
					'Alle gelungenen Bilder farbkorrigiert (80+ Stück)',
					'Persönliche Online-Galerie für 6 Monate',
					'Stilberatung & 1 Location zur Auswahl',
					'Express-Bearbeitung — bis zu 7 Tage'
				],
				deliveryDays: 'bis zu 7 Tage',
				cta: '„Moment“ wählen'
			},
			{
				id: 'atmosphere',
				name: 'Atmosphäre',
				label: 'HIT',
				tagline: 'Die komplette Familiengeschichte',
				description:
					'Ein professionelles Familienfotoshooting mit viel Zeit für Spiele mit den Kindern und echte Emotionen. Inklusive Outfit-Beratung und Locationwechsel.',
				price: { amount: 380, currency: 'EUR' },
				features: [
					'Bis zu 2 Stunden Shooting (Stadt + Natur / 2 Outfits)',
					'50+ Bilder in aufwendiger Magazin-Retusche',
					'Alle gelungenen Bilder farbkorrigiert (150+ Stück)',
					'Ein stimmungsvolles Video (Reels / Stories)',
					'Vollständige Online-Galerie für 1 Jahr',
					'Hilfe bei der Outfitwahl & Nutzung des perfekten Sonnenuntergangslichts',
					'Bearbeitung — bis zu 7 Tage'
				],
				deliveryDays: 'bis zu 7 Tage',
				popular: true,
				cta: '„Atmosphäre“ wählen'
			},
			{
				id: 'legacy',
				name: 'Legacy',
				label: 'PREMIUM',
				tagline: 'Familienfotoshooting + Premium Fotobuch',
				description:
					'Das All-Inclusive-Paket für eure Familienerinnerungen. Ein ausgiebiges Shooting und ein handgefertigtes Fotobuch als Erbstück für Generationen.',
				price: { amount: 690, currency: 'EUR' },
				features: [
					'Bis zu 3,5 Stunden Shooting (Stadt + Natur / 3–4 Outfits)',
					'80+ Bilder in aufwendiger Magazin-Retusche',
					'Alle gelungenen Bilder farbkorrigiert (250+ Stück)',
					'Premium Fotobuch 20×20 cm in Stoff/Leder mit individueller Prägung',
					'Kostenloser Versand des Fotobuchs in ganz Europa',
					'Serie von stimmungsvollen Videos (Reels / Stories)',
					'Erste 5 Bilder innerhalb von 24 Stunden (für Social Media)',
					'Dauerhaftes Cloud-Backup eurer Bilder'
				],
				deliveryDays: 'bis zu 10 Tage',
				cta: '„Legacy“ wählen'
			}
		] as readonly Package[]
	},
	locations: {
		heading: 'Wo findet unser Familienfotoshooting statt?',
		intro:
			'Ich kenne die schönsten Orte und helfe euch dabei, die perfekte Location für eure Stimmung zu finden:',
		coverage: 'Baden-Württemberg · Basel · Zürich',
		items: [
			{
				icon: '☕️',
				number: '01',
				type: 'URBAN',
				title: 'Urbane Ästhetik',
				subtitle: 'Freiburg, Stuttgart, Karlsruhe, Mannheim, Baden-Baden, Heidelberg, Basel, Zürich',
				description: 'Stilvolle Familienspaziergänge durch europäische Gassen, Kaffee auf Terrassen und wunderschöne Stadtarchitektur.',
				tags: ['Architektur', 'Cafés', 'Straßen'],
				bestTime: 'Ganzjährig',
				image: {
					src: '/images/locations/urban.avif',
					alt: 'Gemütliche Straße in der Altstadt',
					width: 1600,
					height: 1200
				}
			},
			{
				icon: '🌲',
				number: '02',
				type: 'NATURE',
				title: 'Natur & Ruhe',
				subtitle: 'Schwarzwald, Bodensee (Konstanz), Titisee, Schluchsee',
				description:
					'Ideal für aktive Kinder. Toben auf Wiesen, tiefe Nadelwälder und weiches Abendlicht fernab vom Stadttrubel.',
				tags: ['Seen', 'Wälder', 'Sonnenuntergänge'],
				bestTime: 'Frühling — Herbst',
				image: {
					src: '/images/locations/nature.avif',
					alt: 'See umgeben von Nadelwald',
					width: 1600,
					height: 1067
				}
			}
		] as const,
		viewLocation: 'Shootings an dieser Location',
		locationLabels: {
			bestTime: 'Beste Zeit',
			shoots: 'Shootings',
			type: 'Typ',
			urban: 'Stadt',
			nature: 'Natur'
		},
		stats: [
			{ label: 'Stadt', value: 'Freiburg · Stuttgart · Karlsruhe' },
			{ label: 'Schweiz', value: 'Basel · Zürich' },
			{ label: 'Saison', value: 'Ganzjährig · 12 Mon.' },
			{ label: 'Typ', value: 'Stadt · Natur' }
		] as const,
		shootCounts: ['40+', '20+'] as const
	},
	photobooks: {
		heading: 'Familienschätze zum Anfassen',
		intro:
			'Familienfotos sollten nicht nur auf dem Handy bleiben. Ein Fotobuch ist ein Familienerbe, das eure Kinder in Jahrzehnten noch durchblättern werden.',
		coverage: 'Familienerbstück · Lieferung europaweit',
		featuresHeading: 'Was es so besonders macht',
		galleryLabels: ['01', '02', '03', '04'] as const,
		features: [
			{
				title: 'Qualität',
				description:
					'Stabile Seiten mit flacher Bindung (Layflat), die sich um 180° öffnen lassen. Matt- oder Glanzpapier, das über Jahre hinweg nicht vergilbt.'
			},
			{
				title: 'Exklusivität',
				description:
					'Einbände aus hochwertigem Stoff, Kunstleder oder Soft Touch. Individuelle Prägung — euer Name, ein Datum oder was auch immer ihr wünscht.'
			},
			{
				title: 'Sorgfalt',
				description:
					'Ich kümmere mich komplett um Design und Layout. Wir besprechen jedes Detail, bis das Buch perfekt ist. Kostenloser Versand innerhalb Europas.'
			}
		] as const,
		hero: {
			src: '/images/photobooks/cover.avif',
			alt: 'Aufgeschlagenes Premium-Fotobuch'
		},
		gallery: [
			{
				src: '/images/photobooks/cover.avif',
				alt: 'Aufgeschlagenes Fotobuch mit Porträtbildern',
				caption: 'Premium Layout',
				size: 'featured'
			},
			{
				src: '/images/photobooks/hero.avif',
				alt: 'Fotobuch mit edlem Stoffeinband',
				caption: 'Stoffeinband',
				size: 'medium'
			},
			{
				src: '/images/photobooks/detail-1.avif',
				alt: 'Fotobuch: Prägung und Bindedetails',
				caption: 'Prägung & Details',
				size: 'medium'
			},
			{
				src: '/images/photobooks/detail-2.avif',
				alt: 'Geöffnetes Fotobuch mit Panoramadruck',
				caption: 'Panoramadruck',
				size: 'medium'
			}
		] as const,
		cta: 'Fotobuch bestellen'
	},
	portfolio: {
		heading: 'Familiengeschichten',
		intro: 'Einige Geschichten meiner letzten Shootings. Scrollt durch, um meinen Stil zu sehen.',
		coverage: 'Geschichten · 2023 — 2024',
		metaCount: `${portfolioItems.length.toString().padStart(2, '0')} / Geschichten`,
		metaYears: '2023 — 2024',
		items: portfolioItems as PortfolioStory[],
		viewAll: 'Alle Geschichten',
		prev: 'Vorherige',
		next: 'Nächste',
		goToSlide: (n: number) => `Folie ${n}`
	},
	faq: {
		heading: 'Häufig gestellte Fragen (FAQ)',
		intro: 'Wenn ihr keine Antwort findet — schreibt mir einfach, wir besprechen die Details.',
		coverage: '06 Antworten · Ich antworte innerhalb eines Tages',
		sidebar: {
			heading: 'Keine Antwort gefunden?',
			body: 'Schreibt eure Frage in das Formular unten — ich antworte persönlich. Oder blättert durch die Fragen links, wahrscheinlich steht die Antwort bereits dort.'
		},
		cta: 'Frage stellen',
		items: [
			{
				q: 'Wie bereiten wir uns auf das Fotoshooting vor?',
				a: 'Nach der Buchung sende ich euch einen Guide: Wie wählt man Outfits aus, was sollte man mitbringen, welche Location passt zu eurer Idee. Eine Woche vor dem Shooting schreiben wir uns, um die Details abzustimmen.'
			},
			{
				q: 'Bietest du auch einen Gutschein für ein Familienfotoshooting an?',
				a: 'Ja! Ein Gutschein für ein Familienfotoshooting ist das perfekte Geschenk, ideal auch für ein Familien-Weihnachtsshooting oder zum Muttertag. Schreibt mir einfach.'
			},
			{
				q: 'Wie lange dauert die Bearbeitung?',
				a: '„Moment“ und „Atmosphäre“ werden innerhalb von 7 Tagen geliefert. Beim „Legacy“-Paket erhaltet ihr die ersten 5 Bilder in 24 Stunden, die komplette Galerie nach 10 Tagen und das Layout/Druck des Buches dauert etwa 2 Wochen.'
			},
			{
				q: 'Was passiert, wenn das Wetter schlecht ist?',
				a: 'Für Outdoor-Shootings habe ich überdachte Ersatz-Locations (Cafés, Galerien, Hotels). Wenn wir das Shooting wegen des Wetters verschieben müssen — tun wir das kostenlos.'
			},
			{
				q: 'Wie erfolgt der Versand des Fotobuchs?',
				a: 'Per Kurier in ganz Europa, kostenlos beim Paket „Legacy“. Lieferzeit 5–10 Werktage. Die Trackingnummer sende ich am Versandtag.'
			},
			{
				q: 'Arbeitest du auch außerhalb Europas?',
				a: 'Ja, nach individueller Absprache. Flug und Unterkunft werden separat besprochen und sind in den Paketpreisen nicht enthalten.'
			}
		] as const
	},
	contact: {
		heading: 'Lass uns zusammen etwas Schönes erschaffen!',
		intro:
			'Hinterlasst eine Anfrage für euer Familienfotoshooting unten im Formular oder schreibt mir direkt im Messenger. Erzählt mir ein wenig über eure Ideen und wo ihr seid. Ich melde mich noch heute bei euch!',
		coverage: 'Antwort innerhalb von 24 Std. · CET / UTC+1',
		formHeading: 'Shooting anfragen',
		formMeta: 'Formular · 1 Min',
		processHeading: 'Was als nächstes passiert',
		rateLimitedTitle: 'Zu viele Versuche',
		rateLimitedDescription: 'Bitte wartet ein paar Minuten oder schreibt mir direkt per Messenger.',
		process: [
			{
				title: 'Anfrage stellen',
				description: 'Füllt das kurze Formular aus — es dauert weniger als eine Minute.'
			},
			{
				title: 'Persönliche Antwort',
				description: 'Ich schreibe euch im Laufe des Tages im Messenger eurer Wahl und stelle ein paar klärende Fragen.'
			},
			{
				title: 'Planung & Vorbereitung',
				description: 'Wir besprechen Ideen, Outfits und Locations. Ich sende euch meinen Guide mit Empfehlungen.'
			},
			{
				title: 'Datum reservieren',
				description: 'Wir fixieren das Datum und das Format eures Fotoshootings. Alles ist unter Kontrolle.'
			}
		] as const,
		channelsHeading: 'Oder schreibt mir direkt',
		form: {
			submit: 'Senden',
			sending: 'Wird gesendet…',
			success: 'Danke! Ich melde mich im Laufe des Tages 🤍',
			successHint: 'Wenn ihr mir sofort schreiben möchtet — wählt unten euren bevorzugten Messenger.',
			consent:
				'Ich stimme der Verarbeitung meiner personenbezogenen Daten gemäß der Datenschutzerklärung zu.',
			fields: {
				name: 'Name',
				contact: 'Telefon, Email oder Messenger',
				city: 'Stadt',
				package: 'Paket',
				message: 'Erzählt mir von eurer Idee'
			},
			placeholders: {
				name: 'Wie darf ich euch nennen?',
				contact: '+49… oder @username',
				city: 'Freiburg, Basel…',
				package: 'Paket wählen',
				message: 'Freiwillig, aber es hilft mir bei der Vorbereitung'
			},
			errors: {
				required: 'Dieses Feld ist erforderlich',
				consent: 'Zustimmung erforderlich, damit ich euch kontaktieren kann',
				tooLong: 'Wert ist zu lang',
				generic: 'Fehler beim Senden. Bitte versucht es noch einmal oder schreibt mir direkt.'
			}
		}
	},
	footer: {
		tagline: 'Ich halte die Wärme eurer Familie in Fotos und Büchern fest',
		availability: 'Termine verfügbar',
		basedIn: 'Baden-Württemberg (Freiburg, Stuttgart, Schwarzwald) · Schweiz (Basel, Zürich)',
		basedInLabel: 'Zuhause in',
		timezone: 'CET / UTC+1',
		responseTime: 'Ich antworte innerhalb von 24 Stunden',
		ctaHeading: 'Bereit, anzufangen?',
		ctaButton: 'Termin anfragen',
		columns: {
			navigation: 'Navigation',
			contacts: 'Kontakt',
			status: 'Status'
		},
		rights: 'Alle Rechte vorbehalten.',
		madeWith: 'Mit Liebe gemacht in Freiburg'
	},
	email: {
		subject: (pkg: string | null) => `Anfrage von der Website (${pkg ?? 'kein Paket'})`,
		noPackage: 'kein Paket',
		labels: {
			name: 'Name',
			contact: 'Kontakt',
			city: 'Stadt',
			package: 'Paket',
			message: 'Nachricht',
			id: 'ID'
		},
		emptyValue: '—'
	},
	error: {
		title: 'Ein Fehler ist aufgetreten',
		description: 'Entschuldigung, die von Ihnen gesuchte Seite konnte nicht gefunden werden oder es ist ein Fehler aufgetreten.',
		homeButton: 'Zur Startseite'
	}
} as const;

export type PackageId = (typeof de.services.packages)[number]['id'];
