#!/usr/bin/env python3
"""One-off migration: build the Sanity `siteSettings` and `homePage` documents
from the content that used to live in src/lib/content/{ru,de,en}.ts.

Input:  a JSON dump of the old dictionaries ({ru, de, en, site}) and a map of
        old image paths -> Sanity asset ids.
Output: sanity/seed/siteSettings.json and sanity/seed/homePage.json, ready to be
        created with the Sanity MCP `create_documents` tool (or `sanity documents
        create`).

Usage:  python3 sanity/migrate-content.py content.json assets.json
"""

import json
import os
import sys
import uuid

LANGS = ('ru', 'de', 'en')

content_path, assets_path = sys.argv[1], sys.argv[2]
data = json.load(open(content_path))
assets = json.load(open(assets_path))
ru, de, en = data['ru'], data['de'], data['en']
site = data['site']
by_lang = {'ru': ru, 'de': de, 'en': en}


def key():
    return uuid.uuid4().hex[:12]


def get(obj, path):
    for part in path.split('.'):
        obj = obj[int(part)] if isinstance(obj, list) else obj[part]
    return obj


def ls(path, **override):
    """localeString/localeText from the same path in each dictionary."""
    out = {lang: get(by_lang[lang], path) for lang in LANGS}
    out.update(override)
    return out


def lit(ru_text, de_text, en_text):
    return {'ru': ru_text, 'de': de_text, 'en': en_text}


def string_list(path):
    return {lang: list(get(by_lang[lang], path)) for lang in LANGS}


def items(path, title_key, desc_key):
    return {
        lang: [
            {'_key': key(), '_type': 'textItem', 'title': it[title_key], 'description': it[desc_key]}
            for it in get(by_lang[lang], path)
        ]
        for lang in LANGS
    }


def photo(src, alt=None):
    ref = assets[src]
    out = {'_type': 'photo', 'asset': {'_type': 'reference', '_ref': ref}}
    if alt:
        out['alt'] = alt
    return out


# ── Portfolio translations (the old portfolio.json was Russian-only) ─────────

STORY_I18N = {
    'Осень в Шварцвальде': ('Herbst im Schwarzwald', 'Autumn in the Black Forest'),
    'Прогулка по Базелю': ('Spaziergang durch Basel', 'A walk through Basel'),
    'Свадебная история': ('Eine Hochzeitsgeschichte', 'A wedding story'),
    'Семейная история': ('Eine Familiengeschichte', 'A family story'),
    'Золотой час в горах': ('Goldene Stunde in den Bergen', 'Golden hour in the mountains'),
    'Студийный портрет': ('Studioporträt', 'Studio portrait'),
    'Озеро Шлюхзее в лучах': ('Schluchsee im Abendlicht', 'Schluchsee in the evening light'),
    'Эмоции и свет': ('Emotionen und Licht', 'Emotion and light'),
    'Улочки и кофе': ('Gassen und Kaffee', 'Little streets and coffee'),
    'Теплые объятия': ('Warme Umarmungen', 'Warm hugs'),
    'Городская геометрия': ('Urbane Geometrie', 'Urban geometry'),
    'Вершины Шварцвальда': ('Gipfel des Schwarzwalds', 'Black Forest peaks'),
    # locations
    'Фрайбург': ('Freiburg', 'Freiburg'),
    'Базель': ('Basel', 'Basel'),
    'Озеро Титизее': ('Titisee', 'Lake Titisee'),
    'Баден-Баден': ('Baden-Baden', 'Baden-Baden'),
    'Шварцвальд': ('Schwarzwald', 'Black Forest'),
    'Шлюхзее': ('Schluchsee', 'Schluchsee'),
    # categories
    'Лавстори': ('Paarshooting', 'Couple'),
    'Город': ('Stadt', 'City'),
    'Свадьба': ('Hochzeit', 'Wedding'),
    'Семья': ('Familie', 'Family'),
    'Портрет': ('Porträt', 'Portrait'),
    'Природа': ('Natur', 'Nature'),
    # alt texts
    'Пара в осеннем парке': ('Paar in einem herbstlichen Park', 'A couple in an autumn park'),
    'Портрет на фоне старого города': ('Porträt vor der Altstadt', 'Portrait in the old town'),
    'Невеста у озера': ('Braut am See', 'A bride by the lake'),
    'Семейная съёмка в парке': ('Familienshooting im Park', 'Family photoshoot in the park'),
    'Пара на закате в горах': ('Paar bei Sonnenuntergang in den Bergen', 'A couple at sunset in the mountains'),
    'Студийный портрет девушки': ('Studioporträt einer jungen Frau', 'Studio portrait of a young woman'),
    'Пара на закате': ('Paar bei Sonnenuntergang', 'A couple at sunset'),
    'Портрет в студии': ('Porträt im Studio', 'Portrait in the studio'),
    'Киношная природа у озера': ('Filmreife Natur am See', 'Cinematic scenery by the lake'),
    'Эмоциональный портрет': ('Emotionales Porträt', 'Emotional portrait'),
    'Эстетика старого города': ('Altstadt-Ästhetik', 'Old town aesthetics'),
    'Теплые моменты в парке': ('Warme Momente im Park', 'Warm moments in the park'),
    'Улицы и террасы': ('Straßen und Terrassen', 'Streets and terraces'),
    'Закат над горными хребтами': ('Sonnenuntergang über den Bergkämmen', 'Sunset over the mountain ridges'),
}


def tr(text):
    if text in STORY_I18N:
        de_text, en_text = STORY_I18N[text]
        return lit(text, de_text, en_text)
    print(f'  ! no translation for: {text!r} (kept Russian in all languages)', file=sys.stderr)
    return lit(text, text, text)


stories = []
for it in ru['portfolio']['items']:
    alt = tr(it['alt'])
    images = it.get('images') or [it['src']]
    stories.append({
        '_key': key(),
        '_type': 'story',
        'title': it['caption'],
        'cover': photo(it['src'], alt),
        'images': [dict(photo(src, alt), _key=key()) for src in images],
        'caption': tr(it['caption']),
        'location': tr(it['location']),
        'category': tr(it['category']) if it.get('category') else None,
        'year': it['year'],
        'city': it.get('city'),
    })

filters = [
    ('freiburg', lit('Фрайбург', 'Freiburg', 'Freiburg')),
    ('basel', lit('Базель', 'Basel', 'Basel')),
    ('baden-baden', lit('Баден-Баден', 'Baden-Baden', 'Baden-Baden')),
    ('schwarzwald', lit('Шварцвальд', 'Schwarzwald', 'Black Forest')),
    ('titisee', lit('Озёра', 'Seen', 'Lakes')),
]

goto_slide = lit('Слайд {n}', 'Folie {n}', 'Slide {n}')
portfolio_texts = {
    'viewAll': ls('portfolio.viewAll'),
    'prev': ls('portfolio.prev'),
    'next': ls('portfolio.next'),
    'goToSlide': goto_slide,
    'shownOfTotal': lit('{count} из {total} историй', '{count} von {total} Geschichten', '{count} of {total} stories'),
    'photoCount': lit('{count} фото', '{count} Fotos', '{count} photos'),
    'allFilter': lit('Все съёмки', 'Alle Shootings', 'All shoots'),
    'dialogTitle': lit('Все истории', 'Alle Geschichten', 'All stories'),
    'shootCount': lit('{count} съёмок', '{count} Shootings', '{count} shoots'),
    'shootCountLong': lit(
        '{count} съёмок · Фотосессии и авторские серии',
        '{count} Shootings · Fotosessions und Autorenserien',
        '{count} shoots · Photo sessions and personal series',
    ),
    'empty': lit('В этой категории пока нет кадров', 'In dieser Kategorie gibt es noch keine Bilder', 'No photos in this category yet'),
    'showAll': lit('Показать все истории', 'Alle Geschichten zeigen', 'Show all stories'),
    'loading': lit(
        'Загрузка историй ({count} из {total})...',
        'Geschichten werden geladen ({count} von {total})…',
        'Loading stories ({count} of {total})…',
    ),
    'ctaText': lit(
        'Понравился стиль? Забронируйте удобную дату для вашей истории.',
        'Gefällt euch der Stil? Reserviert einen Termin für eure Geschichte.',
        'Like the style? Book a date for your own story.',
    ),
    'ctaButton': lit('Забронировать съёмку', 'Shooting buchen', 'Book a shoot'),
    'frameOf': lit('Кадр {current} из {total}', 'Bild {current} von {total}', 'Photo {current} of {total}'),
    'prevStory': lit('← Пред. съёмка', '← Vorheriges Shooting', '← Previous shoot'),
    'nextStory': lit('След. съёмка →', 'Nächstes Shooting →', 'Next shoot →'),
    'bookStory': lit('Забронировать сюжет', 'Dieses Shooting buchen', 'Book this story'),
    'closeViewer': lit('Закрыть просмотр', 'Ansicht schließen', 'Close viewer'),
    'viewerLabel': lit('Просмотр фотографии', 'Fotoansicht', 'Photo viewer'),
    'prevPhoto': lit('Предыдущий кадр', 'Vorheriges Bild', 'Previous photo'),
    'nextPhoto': lit('Следующий кадр', 'Nächstes Bild', 'Next photo'),
    'thumbnail': lit('Миниатюра', 'Vorschaubild', 'Thumbnail'),
}


def count_suffix(lang):
    # "12 / историй" -> "историй"
    return get(by_lang[lang], 'portfolio.metaCount').split('/', 1)[1].strip()


# ── Services ────────────────────────────────────────────────────────────────

packages = []
for i, p in enumerate(ru['services']['packages']):
    base = f'services.packages.{i}'
    packages.append({
        '_key': key(),
        '_type': 'package',
        'title': p['name'],
        'packageId': p['id'],
        'price': p['price']['amount'],
        'popular': bool(p.get('popular')),
        'name': ls(f'{base}.name'),
        'label': ls(f'{base}.label'),
        'tagline': ls(f'{base}.tagline'),
        'description': ls(f'{base}.description'),
        'features': string_list(f'{base}.features'),
        'deliveryDays': ls(f'{base}.deliveryDays'),
        'cta': ls(f'{base}.cta'),
    })

# ── Locations ───────────────────────────────────────────────────────────────

location_items = []
for i, loc in enumerate(ru['locations']['items']):
    base = f'locations.items.{i}'
    location_items.append({
        '_key': key(),
        '_type': 'location',
        'title': loc['title'],
        'kind': loc['type'],
        'icon': loc['icon'],
        'number': loc['number'],
        'image': photo(loc['image']['src'], ls(f'{base}.image.alt')),
        'name': ls(f'{base}.title'),
        'subtitle': ls(f'{base}.subtitle'),
        'description': ls(f'{base}.description'),
        'tags': string_list(f'{base}.tags'),
        'bestTime': ls(f'{base}.bestTime'),
        'shootCount': ru['locations']['shootCounts'][i],
    })

# ── Photobooks ──────────────────────────────────────────────────────────────

gallery = []
for i, g in enumerate(ru['photobooks']['gallery']):
    base = f'photobooks.gallery.{i}'
    gallery.append({
        '_key': key(),
        '_type': 'galleryItem',
        'title': g['caption'],
        'image': photo(g['src'], ls(f'{base}.alt')),
        'caption': ls(f'{base}.caption'),
        'size': g['size'],
    })

# ── Assemble ────────────────────────────────────────────────────────────────

email_subject = lit('Заявка с сайта ({package})', 'Anfrage über die Website ({package})', 'Website enquiry ({package})')

home = {
    '_id': 'homePage',
    '_type': 'homePage',
    'title': 'Главная страница',
    'hero': {
        'eyebrow': ls('hero.eyebrow'),
        'title': ls('hero.title'),
        'subtitle': ls('hero.subtitle'),
        'locations': ls('hero.locations'),
        'stat': ls('hero.stat'),
        'cta': ls('hero.cta'),
        'viewPortfolio': ls('hero.viewPortfolio'),
        'backgroundImage': photo(ru['hero']['background']['src'], ls('hero.background.alt')),
        'cardTitle': ls('hero.card.title'),
        'cardBody': ls('hero.card.body'),
        'cardImage': photo(ru['hero']['card']['src'], ls('hero.card.title')),
    },
    'about': {
        'heading': ls('about.heading'),
        'statement': ls('about.statement'),
        'caption': ls('about.caption'),
        'portrait': photo(ru['about']['portrait']['src'], ls('about.portrait.alt')),
        'stats': items('about.stats', 'value', 'label'),
    },
    'portfolio': {
        'heading': ls('portfolio.heading'),
        'intro': ls('portfolio.intro'),
        'coverage': ls('portfolio.coverage'),
        'metaYears': ls('portfolio.metaYears'),
        'metaCountLabel': {lang: count_suffix(lang) for lang in LANGS},
        'stories': stories,
        'filters': [
            {'_key': key(), '_type': 'filter', 'title': fid, 'label': label} for fid, label in filters
        ],
        'texts': portfolio_texts,
    },
    'services': {
        'heading': ls('services.heading'),
        'subheading': ls('services.subheading'),
        'coverage': ls('services.coverage'),
        'popularBadge': ls('services.popularBadge'),
        'priceUnit': ls('services.priceUnit'),
        'packages': packages,
    },
    'locations': {
        'heading': ls('locations.heading'),
        'intro': ls('locations.intro'),
        'coverage': ls('locations.coverage'),
        'viewLocation': ls('locations.viewLocation'),
        'items': location_items,
        'labels': {k: ls(f'locations.locationLabels.{k}') for k in ('bestTime', 'shoots', 'type', 'urban', 'nature')},
        'stats': items('locations.stats', 'label', 'value'),
    },
    'photobooks': {
        'heading': ls('photobooks.heading'),
        'intro': ls('photobooks.intro'),
        'coverage': ls('photobooks.coverage'),
        'featuresHeading': ls('photobooks.featuresHeading'),
        'features': items('photobooks.features', 'title', 'description'),
        'heroImage': photo(ru['photobooks']['hero']['src'], ls('photobooks.hero.alt')),
        'gallery': gallery,
        'cta': ls('photobooks.cta'),
    },
    'faq': {
        'heading': ls('faq.heading'),
        'intro': ls('faq.intro'),
        'coverage': ls('faq.coverage'),
        'items': items('faq.items', 'q', 'a'),
        'sidebarHeading': ls('faq.sidebar.heading'),
        'sidebarBody': ls('faq.sidebar.body'),
        'cta': ls('faq.cta'),
    },
    'contact': {
        'heading': ls('contact.heading'),
        'intro': ls('contact.intro'),
        'coverage': ls('contact.coverage'),
        'processHeading': ls('contact.processHeading'),
        'process': items('contact.process', 'title', 'description'),
        'channelsHeading': ls('contact.channelsHeading'),
        'formHeading': ls('contact.formHeading'),
        'formMeta': ls('contact.formMeta'),
        'form': {
            **{f'{f}Label': ls(f'contact.form.fields.{f}') for f in ('name', 'contact', 'city', 'package', 'message')},
            **{f'{f}Placeholder': ls(f'contact.form.placeholders.{f}') for f in ('name', 'contact', 'city', 'package', 'message')},
            'consent': ls('contact.form.consent'),
            'submit': ls('contact.form.submit'),
            'sending': ls('contact.form.sending'),
            'success': ls('contact.form.success'),
            'successHint': ls('contact.form.successHint'),
            'errorRequired': ls('contact.form.errors.required'),
            'errorConsent': ls('contact.form.errors.consent'),
            'errorTooLong': ls('contact.form.errors.tooLong'),
            'errorGeneric': ls('contact.form.errors.generic'),
            'rateLimitedTitle': ls('contact.rateLimitedTitle'),
            'rateLimitedDescription': ls('contact.rateLimitedDescription'),
        },
        'email': {
            'subject': email_subject,
            'noPackage': ls('email.noPackage'),
            **{f'label{k.capitalize()}': ls(f'email.labels.{k}') for k in ('name', 'contact', 'city', 'package', 'message', 'id')},
            'emptyValue': ls('email.emptyValue'),
        },
    },
    'footer': {
        'ctaHeading': ls('footer.ctaHeading'),
        'ctaButton': ls('footer.ctaButton'),
        'tagline': ls('footer.tagline'),
        'availability': ls('footer.availability'),
        'basedInLabel': ls('footer.basedInLabel'),
        'basedIn': ls('footer.basedIn'),
        'timezone': ls('footer.timezone'),
        'responseTime': ls('footer.responseTime'),
        'columnNavigation': ls('footer.columns.navigation'),
        'columnContacts': ls('footer.columns.contacts'),
        'columnStatus': ls('footer.columns.status'),
        'rights': ls('footer.rights'),
        'madeWith': ls('footer.madeWith'),
    },
    'nav': {k: ls(f'nav.{k}') for k in ru['nav']},
    'sectionLabels': {k: ls(f'sectionLabels.{k}') for k in ru['sectionLabels']},
    'ui': {
        'mainNav': ls('a11y.mainNav'),
        'openMenu': ls('a11y.openMenu'),
        'closeMenu': ls('a11y.closeMenu'),
        'footerHeading': ls('a11y.footerHeading'),
        'channelWhatsapp': ls('channels.whatsapp.label'),
        'channelInstagram': ls('channels.instagram.label'),
        'channelEmail': ls('channels.email.label'),
        'errorTitle': ls('error.title'),
        'errorDescription': ls('error.description'),
        'errorHomeButton': ls('error.homeButton'),
    },
}

settings = {
    '_id': 'siteSettings',
    '_type': 'siteSettings',
    'title': 'Настройки и контакты',
    'siteName': site['name'],
    'shortName': site['shortName'],
    'url': site['url'],
    'email': site['email'],
    'phone': site['phone'],
    'whatsapp': site['whatsapp'],
    'telegram': site['telegram'],
    'instagramHandle': site['instagram']['handle'],
    'instagramUrl': site['instagram']['url'],
    'seoDescription': lit(site['description'], site['description'], site['description']),
    'ogImage': {'_type': 'image', 'asset': {'_type': 'reference', '_ref': assets['/og.jpg']}},
}


def drop_none(obj):
    if isinstance(obj, dict):
        return {k: drop_none(v) for k, v in obj.items() if v is not None}
    if isinstance(obj, list):
        return [drop_none(v) for v in obj]
    return obj


out_dir = os.path.join(os.path.dirname(__file__), 'seed')
os.makedirs(out_dir, exist_ok=True)
for name, doc in (('homePage', home), ('siteSettings', settings)):
    path = os.path.join(out_dir, f'{name}.json')
    with open(path, 'w') as f:
        json.dump(drop_none(doc), f, ensure_ascii=False, indent=1)
    print(f'wrote {path} ({os.path.getsize(path)} bytes)')
