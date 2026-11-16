// Sanity schema for smlvfoto.
// The Studio at https://smlvfoto.sanity.studio is MCP-managed: this file is the
// source of truth and is deployed with the Sanity MCP `deploy_schema` tool
// (or pasted as-is). Keep it declarative: object literals only, no imports.

// ── Shared localized types ────────────────────────────────────────────────

{
  name: 'localeString',
  title: 'Текст (RU / DE / EN)',
  type: 'object',
  options: { columns: 3 },
  fields: [
    { name: 'ru', title: 'Русский', type: 'string' },
    { name: 'de', title: 'Deutsch', type: 'string' },
    { name: 'en', title: 'English', type: 'string' },
  ],
}

{
  name: 'localeText',
  title: 'Длинный текст (RU / DE / EN)',
  type: 'object',
  fields: [
    { name: 'ru', title: 'Русский', type: 'text', rows: 3 },
    { name: 'de', title: 'Deutsch', type: 'text', rows: 3 },
    { name: 'en', title: 'English', type: 'text', rows: 3 },
  ],
}

{
  name: 'localeStringList',
  title: 'Список (RU / DE / EN)',
  type: 'object',
  fields: [
    { name: 'ru', title: 'Русский', type: 'array', of: [{ type: 'string' }] },
    { name: 'de', title: 'Deutsch', type: 'array', of: [{ type: 'string' }] },
    { name: 'en', title: 'English', type: 'array', of: [{ type: 'string' }] },
  ],
}

{
  name: 'textItem',
  title: 'Пункт',
  type: 'object',
  fields: [
    { name: 'title', title: 'Заголовок', type: 'string' },
    { name: 'description', title: 'Текст', type: 'text', rows: 3 },
  ],
}

{
  name: 'localizedItems',
  title: 'Пункты (RU / DE / EN)',
  type: 'object',
  fields: [
    { name: 'ru', title: 'Русский', type: 'array', of: [{ type: 'textItem' }] },
    { name: 'de', title: 'Deutsch', type: 'array', of: [{ type: 'textItem' }] },
    { name: 'en', title: 'English', type: 'array', of: [{ type: 'textItem' }] },
  ],
}

{
  name: 'photo',
  title: 'Фото',
  type: 'image',
  options: { hotspot: true },
  fields: [
    {
      name: 'alt',
      title: 'Описание фото для поисковиков и незрячих (alt)',
      type: 'localeString',
    },
  ],
}

// ── Site settings ─────────────────────────────────────────────────────────

{
  name: 'siteSettings',
  title: 'Настройки и контакты',
  type: 'document',
  fields: [
    { name: 'title', title: 'Название в редакторе', type: 'string', initialValue: 'Настройки и контакты', readOnly: true },
    { name: 'siteName', title: 'Название сайта (заголовок вкладки, SEO)', type: 'string' },
    { name: 'shortName', title: 'Короткое имя (логотип)', type: 'string' },
    { name: 'url', title: 'Адрес сайта', type: 'url' },
    { name: 'email', title: 'Email', type: 'string' },
    { name: 'phone', title: 'Телефон (как показывать)', type: 'string' },
    { name: 'whatsapp', title: 'WhatsApp (только цифры, с кодом страны)', type: 'string' },
    { name: 'telegram', title: 'Telegram (ник без @)', type: 'string' },
    { name: 'instagramHandle', title: 'Instagram (ник без @)', type: 'string' },
    { name: 'instagramUrl', title: 'Ссылка на Instagram', type: 'url' },
    { name: 'seoDescription', title: 'Описание сайта для Google и соцсетей', type: 'localeText' },
    { name: 'ogImage', title: 'Картинка для превью ссылки в соцсетях', type: 'image' },
  ],
}

// ── Home page ─────────────────────────────────────────────────────────────

{
  name: 'homePage',
  title: 'Главная страница',
  type: 'document',
  groups: [
    { name: 'hero', title: '1. Первый экран', default: true },
    { name: 'about', title: '2. Обо мне' },
    { name: 'portfolio', title: '3. Портфолио' },
    { name: 'services', title: '4. Услуги и цены' },
    { name: 'locations', title: '5. Локации' },
    { name: 'photobooks', title: '6. Фотокниги' },
    { name: 'faq', title: '7. Вопросы' },
    { name: 'contact', title: '8. Контакты и форма' },
    { name: 'footer', title: '9. Подвал' },
    { name: 'ui', title: 'Меню и служебные тексты' },
  ],
  fields: [
    { name: 'title', title: 'Название в редакторе', type: 'string', initialValue: 'Главная страница', readOnly: true },

    // 1. Hero
    {
      name: 'hero',
      title: 'Первый экран',
      type: 'object',
      group: 'hero',
      fields: [
        { name: 'eyebrow', title: 'Надпись над заголовком', type: 'localeString' },
        { name: 'title', title: 'Главный заголовок', type: 'localeString' },
        { name: 'subtitle', title: 'Подзаголовок', type: 'localeText' },
        { name: 'locations', title: 'Строка с городами', type: 'localeString' },
        { name: 'stat', title: 'Строка с цифрами', type: 'localeString' },
        { name: 'cta', title: 'Кнопка «Забронировать»', type: 'localeString' },
        { name: 'viewPortfolio', title: 'Кнопка «Смотреть портфолио»', type: 'localeString' },
        { name: 'backgroundImage', title: 'Фоновое фото', type: 'photo' },
        { name: 'backgroundInColor', title: 'Показывать фоновое фото в цвете (выключено — чёрно-белое)', type: 'boolean' },
        { name: 'cardTitle', title: 'Карточка: заголовок', type: 'localeString' },
        { name: 'cardBody', title: 'Карточка: текст', type: 'localeString' },
        { name: 'cardImage', title: 'Карточка: фото', type: 'photo' },
      ],
    },

    // 2. About
    {
      name: 'about',
      title: 'Обо мне',
      type: 'object',
      group: 'about',
      fields: [
        { name: 'heading', title: 'Заголовок', type: 'localeString' },
        { name: 'statement', title: 'Текст', type: 'localeText' },
        { name: 'caption', title: 'Подпись под фото', type: 'localeString' },
        { name: 'portrait', title: 'Портрет', type: 'photo' },
        {
          name: 'stats',
          title: 'Цифры (заголовок — число, текст — подпись)',
          type: 'localizedItems',
        },
      ],
    },

    // 3. Portfolio
    {
      name: 'portfolio',
      title: 'Портфолио',
      type: 'object',
      group: 'portfolio',
      fields: [
        { name: 'heading', title: 'Заголовок', type: 'localeString' },
        { name: 'intro', title: 'Вступление', type: 'localeText' },
        { name: 'coverage', title: 'Строка справа от заголовка', type: 'localeString' },
        { name: 'metaYears', title: 'Годы', type: 'localeString' },
        { name: 'metaCountLabel', title: 'Слово после числа историй («историй»)', type: 'localeString' },
        {
          name: 'stories',
          title: 'Истории (порядок на сайте — как здесь, перетаскивайте)',
          type: 'array',
          of: [
            {
              name: 'story',
              title: 'История',
              type: 'object',
              fields: [
                { name: 'title', title: 'Название в списке редактора', type: 'string' },
                { name: 'cover', title: 'Обложка', type: 'photo' },
                { name: 'images', title: 'Фото внутри истории', type: 'array', of: [{ type: 'photo' }], options: { layout: 'grid' } },
                { name: 'caption', title: 'Название на сайте', type: 'localeString' },
                { name: 'location', title: 'Место', type: 'localeString' },
                { name: 'category', title: 'Категория', type: 'localeString' },
                { name: 'year', title: 'Год', type: 'string' },
                { name: 'city', title: 'Фильтр (код фильтра из списка ниже, например freiburg)', type: 'string' },
              ],
            },
          ],
        },
        {
          name: 'filters',
          title: 'Фильтры в окне «Все истории»',
          type: 'array',
          of: [
            {
              name: 'filter',
              title: 'Фильтр',
              type: 'object',
              fields: [
                { name: 'title', title: 'Код фильтра (латиницей, например freiburg)', type: 'string' },
                { name: 'label', title: 'Название на кнопке', type: 'localeString' },
              ],
            },
          ],
        },
        {
          name: 'texts',
          title: 'Тексты кнопок и окна «Все истории»',
          description: 'В фигурных скобках — подстановки, их не переводите: {n}, {count}, {total}, {current}. Формы слова через черту выбираются по числу перед ними: {съёмка|съёмки|съёмок} (1 / 2–4 / 5+), {shoot|shoots} (1 / много).',
          type: 'object',
          options: { collapsible: true, collapsed: true },
          fields: [
            { name: 'viewAll', title: 'Кнопка «Все истории»', type: 'localeString' },
            { name: 'prev', title: 'Кнопка «Предыдущий»', type: 'localeString' },
            { name: 'next', title: 'Кнопка «Следующий»', type: 'localeString' },
            { name: 'goToSlide', title: 'Переход к слайду («Слайд {n}»)', type: 'localeString' },
            { name: 'shownOfTotal', title: '«{count} из {total} историй»', type: 'localeString' },
            { name: 'photoCount', title: '«{count} фото»', type: 'localeString' },
            { name: 'allFilter', title: 'Фильтр «Все съёмки»', type: 'localeString' },
            { name: 'dialogTitle', title: 'Заголовок окна', type: 'localeString' },
            { name: 'shootCount', title: '«{count} съёмок»', type: 'localeString' },
            { name: 'shootCountLong', title: '«{count} съёмок · Фотосессии и авторские серии»', type: 'localeString' },
            { name: 'empty', title: 'Нет историй в категории', type: 'localeString' },
            { name: 'showAll', title: 'Кнопка «Показать все истории»', type: 'localeString' },
            { name: 'loading', title: 'Загрузка («Загрузка историй ({count} из {total})...»)', type: 'localeString' },
            { name: 'ctaText', title: 'Призыв внизу окна', type: 'localeString' },
            { name: 'ctaButton', title: 'Кнопка «Забронировать съёмку»', type: 'localeString' },
            { name: 'frameOf', title: '«Кадр {current} из {total}»', type: 'localeString' },
            { name: 'prevStory', title: '«← Пред. съёмка»', type: 'localeString' },
            { name: 'nextStory', title: '«След. съёмка →»', type: 'localeString' },
            { name: 'bookStory', title: 'Кнопка «Забронировать сюжет»', type: 'localeString' },
            { name: 'closeViewer', title: '«Закрыть просмотр» (для экранного диктора)', type: 'localeString' },
            { name: 'viewerLabel', title: '«Просмотр фотографии» (для экранного диктора)', type: 'localeString' },
            { name: 'prevPhoto', title: '«Предыдущий кадр» (для экранного диктора)', type: 'localeString' },
            { name: 'nextPhoto', title: '«Следующий кадр» (для экранного диктора)', type: 'localeString' },
            { name: 'thumbnail', title: '«Миниатюра» (alt)', type: 'localeString' },
          ],
        },
      ],
    },

    // 4. Services
    {
      name: 'services',
      title: 'Услуги и цены',
      type: 'object',
      group: 'services',
      fields: [
        { name: 'heading', title: 'Заголовок', type: 'localeString' },
        { name: 'subheading', title: 'Подзаголовок', type: 'localeText' },
        { name: 'coverage', title: 'Строка справа от заголовка', type: 'localeString' },
        { name: 'popularBadge', title: 'Плашка популярного пакета', type: 'localeString' },
        { name: 'priceUnit', title: 'Подпись под ценой', type: 'localeString' },
        { name: 'chfLabel', title: 'Подпись к цене в франках (например «Швейцария»)', type: 'localeString' },
        {
          name: 'seasons',
          title: 'Времена года для {season}',
          description: 'В названиях и текстах пакетов {season} заменяется словом текущего сезона (Зима — декабрь–февраль, Весна — март–май, Лето — июнь–август, Осень — сентябрь–ноябрь). Например «{season} мини» → «Осенняя мини».',
          type: 'object',
          options: { collapsible: true, collapsed: true },
          fields: [
            { name: 'winter', title: 'Зима', type: 'localeString' },
            { name: 'spring', title: 'Весна', type: 'localeString' },
            { name: 'summer', title: 'Лето', type: 'localeString' },
            { name: 'autumn', title: 'Осень', type: 'localeString' },
          ],
        },
        {
          name: 'extras',
          title: 'Дополнительно к пакету',
          type: 'object',
          fields: [
            { name: 'heading', title: 'Заголовок (кнопка-переключатель)', type: 'localeString' },
            {
              name: 'items',
              title: 'Строки',
              type: 'array',
              of: [
                {
                  name: 'priceLine',
                  title: 'Строка',
                  type: 'object',
                  fields: [
                    { name: 'title', title: 'Что', type: 'localeString' },
                    { name: 'price', title: 'Цена (текстом, например +40 €)', type: 'localeString' },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'travel',
          title: 'Выезд',
          type: 'object',
          fields: [
            { name: 'heading', title: 'Заголовок (кнопка-переключатель)', type: 'localeString' },
            {
              name: 'items',
              title: 'Строки',
              type: 'array',
              of: [
                {
                  name: 'priceLine',
                  title: 'Строка',
                  type: 'object',
                  fields: [
                    { name: 'title', title: 'Что', type: 'localeString' },
                    { name: 'price', title: 'Цена (текстом, например +40 €)', type: 'localeString' },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'packages',
          title: 'Пакеты (порядок как здесь)',
          type: 'array',
          of: [
            {
              name: 'package',
              title: 'Пакет',
              type: 'object',
              fields: [
                { name: 'title', title: 'Название в списке редактора', type: 'string' },
                { name: 'packageId', title: 'Код пакета (латиницей, не меняйте без необходимости)', type: 'string' },
                { name: 'price', title: 'Цена, €', type: 'number' },
                { name: 'priceChf', title: 'Цена для Швейцарии, CHF (пусто — не показывать)', type: 'number' },
                { name: 'popular', title: 'Выделить как самый популярный', type: 'boolean' },
                { name: 'name', title: 'Название', type: 'localeString' },
                { name: 'label', title: 'Метка (МИНИ, ХИТ…)', type: 'localeString' },
                { name: 'tagline', title: 'Короткое описание', type: 'localeString' },
                { name: 'description', title: 'Описание', type: 'localeText' },
                { name: 'features', title: 'Что входит', type: 'localeStringList' },
                { name: 'deliveryDays', title: 'Срок готовности', type: 'localeString' },
                { name: 'cta', title: 'Текст кнопки', type: 'localeString' },
              ],
            },
          ],
        },
      ],
    },

    // 5. Locations
    {
      name: 'locations',
      title: 'Локации',
      type: 'object',
      group: 'locations',
      fields: [
        { name: 'heading', title: 'Заголовок', type: 'localeString' },
        { name: 'intro', title: 'Вступление', type: 'localeText' },
        { name: 'coverage', title: 'Строка справа от заголовка', type: 'localeString' },
        { name: 'viewLocation', title: 'Ссылка «Съёмки в этой локации»', type: 'localeString' },
        {
          name: 'items',
          title: 'Локации',
          type: 'array',
          of: [
            {
              name: 'location',
              title: 'Локация',
              type: 'object',
              fields: [
                { name: 'title', title: 'Название в списке редактора', type: 'string' },
                { name: 'kind', title: 'Тип', type: 'string', options: { list: [{ title: 'Город', value: 'URBAN' }, { title: 'Природа', value: 'NATURE' }] } },
                { name: 'icon', title: 'Иконка (эмодзи)', type: 'string' },
                { name: 'number', title: 'Номер (01, 02…)', type: 'string' },
                { name: 'image', title: 'Фото', type: 'photo' },
                { name: 'name', title: 'Название', type: 'localeString' },
                { name: 'subtitle', title: 'Города и места', type: 'localeString' },
                { name: 'description', title: 'Описание', type: 'localeText' },
                { name: 'tags', title: 'Теги', type: 'localeStringList' },
                { name: 'bestTime', title: 'Лучшее время', type: 'localeString' },
                { name: 'shootCount', title: 'Количество съёмок (например 40+)', type: 'string' },
              ],
            },
          ],
        },
        {
          name: 'labels',
          title: 'Подписи в карточках',
          type: 'object',
          options: { collapsible: true, collapsed: true },
          fields: [
            { name: 'bestTime', title: '«Лучшее время»', type: 'localeString' },
            { name: 'shoots', title: '«Съёмок»', type: 'localeString' },
            { name: 'type', title: '«Тип»', type: 'localeString' },
            { name: 'urban', title: '«Город»', type: 'localeString' },
            { name: 'nature', title: '«Природа»', type: 'localeString' },
          ],
        },
        { name: 'stats', title: 'Строка фактов внизу (заголовок — подпись, текст — значение)', type: 'localizedItems' },
      ],
    },

    // 6. Photobooks
    {
      name: 'photobooks',
      title: 'Фотокниги',
      type: 'object',
      group: 'photobooks',
      fields: [
        { name: 'heading', title: 'Заголовок', type: 'localeString' },
        { name: 'intro', title: 'Вступление', type: 'localeText' },
        { name: 'coverage', title: 'Строка справа от заголовка', type: 'localeString' },
        { name: 'featuresHeading', title: 'Заголовок списка преимуществ', type: 'localeString' },
        { name: 'features', title: 'Преимущества', type: 'localizedItems' },
        { name: 'heroImage', title: 'Главное фото', type: 'photo' },
        {
          name: 'gallery',
          title: 'Галерея',
          type: 'array',
          of: [
            {
              name: 'galleryItem',
              title: 'Фото галереи',
              type: 'object',
              fields: [
                { name: 'title', title: 'Название в списке редактора', type: 'string' },
                { name: 'image', title: 'Фото', type: 'photo' },
                { name: 'more', title: 'Ещё фото (видны при открытии карточки)', type: 'array', of: [{ type: 'photo' }], options: { layout: 'grid' } },
                { name: 'caption', title: 'Подпись', type: 'localeString' },
                { name: 'size', title: 'Размер', type: 'string', options: { list: [{ title: 'Большое', value: 'featured' }, { title: 'Среднее', value: 'medium' }] } },
              ],
            },
          ],
        },
        { name: 'cta', title: 'Кнопка', type: 'localeString' },
      ],
    },

    // 7. FAQ
    {
      name: 'faq',
      title: 'Частые вопросы',
      type: 'object',
      group: 'faq',
      fields: [
        { name: 'heading', title: 'Заголовок', type: 'localeString' },
        { name: 'intro', title: 'Вступление', type: 'localeString' },
        { name: 'coverage', title: 'Строка справа от заголовка', type: 'localeString' },
        { name: 'items', title: 'Вопросы (заголовок — вопрос, текст — ответ)', type: 'localizedItems' },
        { name: 'sidebarHeading', title: 'Боковая карточка: заголовок', type: 'localeString' },
        { name: 'sidebarBody', title: 'Боковая карточка: текст', type: 'localeText' },
        { name: 'cta', title: 'Кнопка', type: 'localeString' },
      ],
    },

    // 8. Contact
    {
      name: 'contact',
      title: 'Контакты и форма',
      type: 'object',
      group: 'contact',
      fields: [
        { name: 'heading', title: 'Заголовок', type: 'localeString' },
        { name: 'intro', title: 'Вступление', type: 'localeText' },
        { name: 'coverage', title: 'Строка справа от заголовка', type: 'localeString' },
        { name: 'processHeading', title: 'Заголовок «Что произойдёт дальше»', type: 'localeString' },
        { name: 'process', title: 'Шаги', type: 'localizedItems' },
        { name: 'channelsHeading', title: '«Или напишите напрямую»', type: 'localeString' },
        { name: 'formHeading', title: 'Заголовок формы', type: 'localeString' },
        { name: 'formMeta', title: 'Подпись формы', type: 'localeString' },
        {
          name: 'form',
          title: 'Тексты формы',
          type: 'object',
          options: { collapsible: true, collapsed: true },
          fields: [
            { name: 'nameLabel', title: 'Поле «Имя»', type: 'localeString' },
            { name: 'namePlaceholder', title: 'Подсказка в поле «Имя»', type: 'localeString' },
            { name: 'contactLabel', title: 'Поле «Контакт»', type: 'localeString' },
            { name: 'contactPlaceholder', title: 'Подсказка в поле «Контакт»', type: 'localeString' },
            { name: 'cityLabel', title: 'Поле «Город»', type: 'localeString' },
            { name: 'cityPlaceholder', title: 'Подсказка в поле «Город»', type: 'localeString' },
            { name: 'packageLabel', title: 'Поле «Пакет»', type: 'localeString' },
            { name: 'packagePlaceholder', title: 'Подсказка в поле «Пакет»', type: 'localeString' },
            { name: 'messageLabel', title: 'Поле «Сообщение»', type: 'localeString' },
            { name: 'messagePlaceholder', title: 'Подсказка в поле «Сообщение»', type: 'localeString' },
            { name: 'consent', title: 'Текст согласия', type: 'localeText' },
            { name: 'submit', title: 'Кнопка «Отправить»', type: 'localeString' },
            { name: 'sending', title: '«Отправляем…»', type: 'localeString' },
            { name: 'success', title: 'Сообщение об успехе', type: 'localeString' },
            { name: 'successHint', title: 'Подсказка после отправки', type: 'localeString' },
            { name: 'errorRequired', title: 'Ошибка: обязательное поле', type: 'localeString' },
            { name: 'errorConsent', title: 'Ошибка: нет согласия', type: 'localeString' },
            { name: 'errorTooLong', title: 'Ошибка: слишком длинно', type: 'localeString' },
            { name: 'errorGeneric', title: 'Ошибка: не удалось отправить', type: 'localeString' },
            { name: 'rateLimitedTitle', title: 'Слишком много попыток: заголовок', type: 'localeString' },
            { name: 'rateLimitedDescription', title: 'Слишком много попыток: текст', type: 'localeString' },
          ],
        },
        {
          name: 'email',
          title: 'Письмо с заявкой (приходит вам)',
          description: '{package} — подставится выбранный пакет.',
          type: 'object',
          options: { collapsible: true, collapsed: true },
          fields: [
            { name: 'subject', title: 'Тема письма', type: 'localeString' },
            { name: 'noPackage', title: '«без пакета»', type: 'localeString' },
            { name: 'labelName', title: '«Имя»', type: 'localeString' },
            { name: 'labelContact', title: '«Контакт»', type: 'localeString' },
            { name: 'labelCity', title: '«Город»', type: 'localeString' },
            { name: 'labelPackage', title: '«Пакет»', type: 'localeString' },
            { name: 'labelMessage', title: '«Сообщение»', type: 'localeString' },
            { name: 'labelId', title: '«ID»', type: 'localeString' },
            { name: 'emptyValue', title: 'Пустое значение', type: 'localeString' },
          ],
        },
      ],
    },

    // 9. Footer
    {
      name: 'footer',
      title: 'Подвал',
      type: 'object',
      group: 'footer',
      fields: [
        { name: 'ctaHeading', title: 'Призыв: заголовок', type: 'localeString' },
        { name: 'ctaButton', title: 'Призыв: кнопка', type: 'localeString' },
        { name: 'tagline', title: 'Слоган', type: 'localeString' },
        { name: 'availability', title: 'Статус записи', type: 'localeString' },
        { name: 'basedInLabel', title: '«Базируется в»', type: 'localeString' },
        { name: 'basedIn', title: 'Где базируетесь', type: 'localeString' },
        { name: 'timezone', title: 'Часовой пояс', type: 'localeString' },
        { name: 'responseTime', title: 'Время ответа', type: 'localeString' },
        { name: 'columnNavigation', title: 'Колонка «Навигация»', type: 'localeString' },
        { name: 'columnContacts', title: 'Колонка «Контакты»', type: 'localeString' },
        { name: 'columnStatus', title: 'Колонка «Статус»', type: 'localeString' },
        { name: 'rights', title: '«Все права защищены»', type: 'localeString' },
        { name: 'madeWith', title: '«Сделано с любовью…»', type: 'localeString' },
      ],
    },

    // Navigation & UI
    {
      name: 'nav',
      title: 'Пункты меню',
      type: 'object',
      group: 'ui',
      fields: [
        { name: 'home', title: 'Главная', type: 'localeString' },
        { name: 'about', title: 'Обо мне', type: 'localeString' },
        { name: 'portfolio', title: 'Работы', type: 'localeString' },
        { name: 'services', title: 'Услуги', type: 'localeString' },
        { name: 'locations', title: 'Локации', type: 'localeString' },
        { name: 'photobooks', title: 'Фотокниги', type: 'localeString' },
        { name: 'faq', title: 'Вопросы', type: 'localeString' },
        { name: 'contact', title: 'Контакты', type: 'localeString' },
      ],
    },
    {
      name: 'sectionLabels',
      title: 'Подписи разделов («01 — Обо мне»…)',
      type: 'object',
      group: 'ui',
      fields: [
        { name: 'about', title: 'Обо мне', type: 'localeString' },
        { name: 'portfolio', title: 'Портфолио', type: 'localeString' },
        { name: 'services', title: 'Услуги', type: 'localeString' },
        { name: 'locations', title: 'Локации', type: 'localeString' },
        { name: 'photobooks', title: 'Фотокниги', type: 'localeString' },
        { name: 'faq', title: 'Вопросы', type: 'localeString' },
        { name: 'contact', title: 'Контакты', type: 'localeString' },
      ],
    },
    {
      name: 'ui',
      title: 'Служебные тексты',
      type: 'object',
      group: 'ui',
      fields: [
        { name: 'mainNav', title: '«Главная навигация» (для экранного диктора)', type: 'localeString' },
        { name: 'openMenu', title: '«Открыть меню»', type: 'localeString' },
        { name: 'closeMenu', title: '«Закрыть меню»', type: 'localeString' },
        { name: 'footerHeading', title: '«Подвал сайта» (для экранного диктора)', type: 'localeString' },
        { name: 'channelWhatsapp', title: 'Название канала WhatsApp', type: 'localeString' },
        { name: 'channelInstagram', title: 'Название канала Instagram', type: 'localeString' },
        { name: 'channelEmail', title: 'Название канала Email', type: 'localeString' },
        { name: 'errorTitle', title: 'Страница ошибки: заголовок', type: 'localeString' },
        { name: 'errorDescription', title: 'Страница ошибки: текст', type: 'localeString' },
        { name: 'errorHomeButton', title: 'Страница ошибки: кнопка', type: 'localeString' },
      ],
    },
  ],
}
