#!/usr/bin/env node

/**
 * Viktoria — Telegram Portfolio Bot Manager
 *
 * Upgraded Features:
 * - Whitelist security: only 1 ALLOWED_TELEGRAM_USER_ID can interact.
 * - Multi-Photo & Album Support (MediaGroup):
 *   Send 1 photo or an entire photoshoot album (2–10+ photos) at once with a single caption!
 * - Accepts uncompressed photos (Documents or Photos) up to 50MB (RAW, JPG, HEIC, PNG).
 * - Automatic metadata parsing: "Название | Локация/Город | Категория | Год"
 * - Converts each photo in the photoshoot to web-ready AVIF format via libsvtav1.
 * - Atomically saves story collections to src/lib/content/portfolio.json.
 * - Management commands: /list, /delete <id>, /status, /help.
 */

import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// 1. Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

try {
	if (fs.existsSync(path.join(rootDir, '.env'))) {
		process.loadEnvFile(path.join(rootDir, '.env'));
	}
} catch (e) {
	console.warn('[ENV] Note: .env not loaded via process.loadEnvFile:', e.message);
}

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ALLOWED_USER_ID = process.env.ALLOWED_TELEGRAM_USER_ID?.trim();
const PORTFOLIO_JSON_PATH = path.join(rootDir, 'src/lib/content/portfolio.json');
const PORTFOLIO_IMG_DIR = path.join(rootDir, 'static/images/portfolio');
const TEMP_DIR = path.join(rootDir, 'static/temp_bot');

if (!fs.existsSync(PORTFOLIO_IMG_DIR)) {
	fs.mkdirSync(PORTFOLIO_IMG_DIR, { recursive: true });
}
if (!fs.existsSync(TEMP_DIR)) {
	fs.mkdirSync(TEMP_DIR, { recursive: true });
}

if (!BOT_TOKEN) {
	console.error('❌ Error: TELEGRAM_BOT_TOKEN is not defined in .env');
	console.error('👉 Please create a .env file with your Telegram Bot Token and User ID.');
	process.exit(1);
}

console.log('✨ Viktoria Portfolio Telegram Bot initializing (Album & Multi-Photo support)...');
console.log(
	`🔒 Allowed User ID: ${ALLOWED_USER_ID || '(Not configured yet — will block all users)'}`
);

// Active upload sessions: userId -> session
const sessions = new Map();
// Media group buffers: mediaGroupId -> { files: [], caption: '', timer: null, userId, chatId }
const mediaGroupBuffers = new Map();

/** Helper to map city string to slug */
function getCitySlug(loc = '') {
	const l = loc.toLowerCase();
	if (l.includes('фрайбург') || l.includes('freiburg')) return 'freiburg';
	if (l.includes('базель') || l.includes('basel')) return 'basel';
	if (l.includes('баден') || l.includes('baden')) return 'baden-baden';
	if (l.includes('шварцвальд') || l.includes('black forest')) return 'schwarzwald';
	if (
		l.includes('тититезе') ||
		l.includes('шлюхзее') ||
		l.includes('озер') ||
		l.includes('titisee')
	)
		return 'titisee';
	return 'freiburg';
}

/** Helper to call Telegram Bot API */
async function callApi(method, body = {}) {
	const url = `https://api.telegram.org/bot${BOT_TOKEN}/${method}`;
	const res = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	});
	const json = await res.json();
	if (!json.ok) {
		throw new Error(`Telegram API Error [${method}]: ${json.description || JSON.stringify(json)}`);
	}
	return json.result;
}

/** Send text message helper */
async function sendMessage(chatId, text, options = {}) {
	return callApi('sendMessage', {
		chat_id: chatId,
		text,
		parse_mode: 'HTML',
		...options
	});
}

/** Download Telegram File to local path */
async function downloadTelegramFile(fileId, destPath) {
	const fileInfo = await callApi('getFile', { file_id: fileId });
	const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${fileInfo.file_path}`;
	const res = await fetch(fileUrl);
	if (!res.ok) throw new Error(`Failed to download file from Telegram: ${res.statusText}`);
	const arrayBuffer = await res.arrayBuffer();
	await fs.promises.writeFile(destPath, Buffer.from(arrayBuffer));
	return destPath;
}

/** Run shell command wrapped in Promise */
function execPromise(cmd, args) {
	return new Promise((resolve, reject) => {
		const proc = spawn(cmd, args, { stdio: 'pipe' });
		let stderr = '';
		proc.stderr.on('data', (d) => (stderr += d.toString()));
		proc.on('close', (code) => {
			if (code === 0) resolve();
			else reject(new Error(`${cmd} exited with code ${code}: ${stderr}`));
		});
	});
}

/** Convert raw photo (HEIC/JPG/PNG) to AVIF with max dimension 1600px */
async function processImageToAvif(inputPath, outputAvifPath) {
	const ext = path.extname(inputPath).toLowerCase();
	let workJpg = path.join(
		TEMP_DIR,
		`work_${Date.now()}_${Math.random().toString(36).slice(2, 6)}.jpg`
	);

	try {
		// 1. If HEIC or needs resize, use sips
		if (ext === '.heic') {
			await execPromise('sips', [
				'-s',
				'format',
				'jpeg',
				'-Z',
				'1600',
				inputPath,
				'--out',
				workJpg
			]);
		} else {
			await execPromise('sips', ['-Z', '1600', inputPath, '--out', workJpg]);
		}

		// 2. Encode to AVIF with SVT-AV1
		await execPromise('ffmpeg', [
			'-y',
			'-i',
			workJpg,
			'-c:v',
			'libsvtav1',
			'-crf',
			'26',
			'-preset',
			'6',
			'-pix_fmt',
			'yuv420p',
			'-svtav1-params',
			'tune=0',
			outputAvifPath
		]);
	} finally {
		if (fs.existsSync(workJpg)) {
			try {
				fs.unlinkSync(workJpg);
			} catch (err) {
				console.debug('Temp file cleanup warning:', err);
			}
		}
	}
}

/** Read portfolio JSON */
function getPortfolio() {
	if (!fs.existsSync(PORTFOLIO_JSON_PATH)) return [];
	try {
		return JSON.parse(fs.readFileSync(PORTFOLIO_JSON_PATH, 'utf-8'));
	} catch (e) {
		console.error('Error reading portfolio.json:', e);
		return [];
	}
}

/** Write portfolio JSON */
function savePortfolio(items) {
	fs.writeFileSync(PORTFOLIO_JSON_PATH, JSON.stringify(items, null, '\t') + '\n', 'utf-8');
}

/** Check if user is authorized */
function isAuthorized(from) {
	if (!ALLOWED_USER_ID) return false;
	return String(from.id) === String(ALLOWED_USER_ID);
}

/** Parse metadata string "Title | Location | Category | Year" or "Title | Location | Year" */
function parseMetadata(str = '') {
	const parts = str
		.split('|')
		.map((s) => s.trim())
		.filter(Boolean);
	const res = {
		title: 'Новая съёмка',
		location: 'Фрайбург',
		category: 'Серия',
		year: new Date().getFullYear().toString()
	};

	if (parts.length >= 4) {
		res.title = parts[0];
		res.location = parts[1];
		res.category = parts[2];
		res.year = parts[3];
	} else if (parts.length === 3) {
		res.title = parts[0];
		res.location = parts[1];
		res.year = parts[2];
	} else if (parts.length === 2) {
		res.title = parts[0];
		res.location = parts[1];
	} else if (parts.length === 1) {
		res.title = parts[0];
	}
	return res;
}

/** Prompt confirmation for a session (single or multi-photo album) */
async function promptSessionConfirmation(chatId, userId) {
	const session = sessions.get(userId);
	if (!session) return;

	const count = session.files.length;
	const totalMb = (
		session.files.reduce((acc, f) => acc + (f.bytes || 0), 0) /
		(1024 * 1024)
	).toFixed(1);

	await sendMessage(
		chatId,
		`📸 <b>Получено ${count === 1 ? '1 фото' : `серия из ${count} кадров`}</b> (${totalMb} MB)\n\n` +
			`📝 <b>Данные съёмки:</b>\n` +
			`• Название: <b>${session.title}</b>\n` +
			`• Локация: <b>${session.location}</b>\n` +
			`• Категория: <b>${session.category}</b>\n` +
			`• Год: <b>${session.year}</b>\n\n` +
			`<i>Чтобы изменить подпись, отправьте сообщение:</i>\n` +
			`<code>Название | Город | Категория | Год</code>\n` +
			`<i>(Пример: Прогулка на закате | Базель | Лавстори | 2024)</i>\n\n` +
			`Опубликовать ${count === 1 ? 'фотографию' : `съёмку (${count} кадров)`} в портфолио?`,
		{
			reply_markup: {
				inline_keyboard: [
					[
						{
							text:
								count === 1 ? '✅ Опубликовать на сайте' : `✅ Опубликовать серию (${count} фото)`,
							callback_data: 'publish_confirm'
						},
						{ text: '❌ Отмена', callback_data: 'publish_cancel' }
					]
				]
			}
		}
	);
}

/** Main message handler */
async function handleUpdate(update) {
	if (update.callback_query) {
		await handleCallback(update.callback_query);
		return;
	}

	const message = update.message;
	if (!message) return;

	const from = message.from;
	const chatId = message.chat.id;

	// Security check
	if (!isAuthorized(from)) {
		console.warn(
			`[SECURITY] Blocked request from User ID: ${from.id} (@${from.username || 'unknown'}, ${from.first_name})`
		);
		await sendMessage(
			chatId,
			`⛔ <b>Доступ ограничен</b>\n\nЭтот бот предназначен только для владельца сайта Viktoria.\nВаш Telegram ID: <code>${from.id}</code>`
		);
		return;
	}

	const text = message.text?.trim();

	// Commands
	if (text?.startsWith('/start')) {
		await sendMessage(
			chatId,
			`👋 <b>Привет, Виктория!</b>\n\nЯ ваш персональный бот для управления портфолио.\n\n` +
				`📸 <b>Как добавить съёмку или фото:</b>\n` +
				`1. Выберите в Telegram 1 или несколько фото сразу (альбомом или файлами 📎).\n` +
				`2. В подпись добавьте: <code>Название | Город | Категория | Год</code>\n` +
				`<i>(Пример: Свадьба у озера | Титизее | Свадьба | 2024)</i>\n` +
				`3. Нажмите кнопку подтверждения — бот сожмёт всё в быстрый AVIF и опубликует серию!\n\n` +
				`📋 <b>Команды:</b>\n` +
				`• /list — Все съёмки на сайте с кнопками удаления\n` +
				`• /delete [id] — Удалить съёмку по ID\n` +
				`• /help — Подробная инструкция`
		);
		return;
	}

	if (text?.startsWith('/help')) {
		await sendMessage(
			chatId,
			`💡 <b>Инструкция по загрузке съёмок:</b>\n\n` +
				`<b>Вариант А: Серия/Альбом (несколько фото с 1 съёмки)</b>\n` +
				`1. Выберите 2–10 фото в галерее Telegram.\n` +
				`2. Напишите одну общую подпись: <code>Название | Локация | Категория | Год</code>\n` +
				`3. Отправьте альбомом или как файлы (без сжатия).\n` +
				`4. Бот объединит их в одну красивую серию на сайте!\n\n` +
				`<b>Вариант Б: Одно одиночное фото</b>\n` +
				`Отправьте 1 фото с подписью или без — бот создаст отдельную карточку.\n\n` +
				`<i>Категории: Лавстори, Свадьба, Семья, Портрет, Город, Природа.</i>`
		);
		return;
	}

	if (text?.startsWith('/list')) {
		const items = getPortfolio();
		if (items.length === 0) {
			await sendMessage(chatId, '📭 В портфолио пока нет историй.');
			return;
		}

		let response = `📁 <b>Съёмки в портфолио (${items.length}):</b>\n\n`;
		items.forEach((item, index) => {
			const count = item.images && item.images.length > 0 ? item.images.length : 1;
			response +=
				`<b>${index + 1}. ${item.caption}</b> [${count} фото]\n` +
				`📍 ${item.location} · 🏷 ${item.category || 'Серия'} · 📅 ${item.year}\n` +
				`🆔 ID: <code>${item.id}</code>\n\n`;
		});

		const inlineKeyboard = items.map((item) => [
			{ text: `🗑 Удалить «${item.caption.slice(0, 24)}»`, callback_data: `del_${item.id}` }
		]);

		await sendMessage(chatId, response, {
			reply_markup: { inline_keyboard: inlineKeyboard }
		});
		return;
	}

	if (text?.startsWith('/delete')) {
		const parts = text.split(/\s+/);
		const id = parts[1];
		if (!id) {
			await sendMessage(
				chatId,
				'Укажите ID: <code>/delete story-1</code>\n(Список доступен по команде /list)'
			);
			return;
		}
		const deleted = deleteStory(id);
		if (deleted) {
			await sendMessage(chatId, `🗑 История <code>${id}</code> удалена с сайта.`);
		} else {
			await sendMessage(chatId, `❌ История с ID <code>${id}</code> не найдена.`);
		}
		return;
	}

	// Handling Document or Photo Upload (Single or Album/MediaGroup)
	const doc = message.document;
	const photo = message.photo;
	const mediaGroupId = message.media_group_id;

	if (doc || photo) {
		const fileId = doc ? doc.file_id : photo[photo.length - 1].file_id;
		const fileName = doc ? doc.file_name || `photo_${Date.now()}.jpg` : `photo_${Date.now()}.jpg`;
		const fileSize = doc ? doc.file_size || 0 : photo[photo.length - 1].file_size || 0;

		const fileEntry = { fileId, fileName, bytes: fileSize };
		const captionText = message.caption?.trim();

		// If this is part of a multi-photo MediaGroup album
		if (mediaGroupId) {
			let group = mediaGroupBuffers.get(mediaGroupId);
			if (!group) {
				group = {
					files: [],
					caption: '',
					timer: null,
					userId: from.id,
					chatId
				};
				mediaGroupBuffers.set(mediaGroupId, group);
			}

			group.files.push(fileEntry);
			if (captionText) {
				group.caption = captionText;
			}

			// Debounce: wait 900ms for all photos of the album to arrive
			if (group.timer) clearTimeout(group.timer);
			group.timer = setTimeout(async () => {
				mediaGroupBuffers.delete(mediaGroupId);
				const meta = parseMetadata(group.caption);

				sessions.set(from.id, {
					files: group.files,
					title: meta.title,
					location: meta.location,
					category: meta.category,
					year: meta.year
				});

				await promptSessionConfirmation(chatId, from.id);
			}, 900);

			return;
		}

		// Single photo upload
		const meta = parseMetadata(captionText);
		sessions.set(from.id, {
			files: [fileEntry],
			title: meta.title,
			location: meta.location,
			category: meta.category,
			year: meta.year
		});

		await promptSessionConfirmation(chatId, from.id);
		return;
	}

	// If user sends text while a session is pending, update metadata
	if (sessions.has(from.id) && text && !text.startsWith('/')) {
		const meta = parseMetadata(text);
		const session = sessions.get(from.id);
		session.title = meta.title;
		session.location = meta.location;
		session.category = meta.category;
		session.year = meta.year;

		await promptSessionConfirmation(chatId, from.id);
	}
}

/** Handle inline keyboard clicks */
async function handleCallback(callback) {
	const from = callback.from;
	const chatId = callback.message.chat.id;
	const messageId = callback.message.message_id;
	const data = callback.data;

	if (!isAuthorized(from)) {
		await callApi('answerCallbackQuery', {
			callback_query_id: callback.id,
			text: '⛔ Доступ запрещён',
			show_alert: true
		});
		return;
	}

	if (data === 'publish_cancel') {
		sessions.delete(from.id);
		await callApi('answerCallbackQuery', { callback_query_id: callback.id, text: 'Отменено' });
		await callApi('editMessageText', {
			chat_id: chatId,
			message_id: messageId,
			text: '❌ <b>Загрузка отменена.</b>',
			parse_mode: 'HTML'
		});
		return;
	}

	if (data.startsWith('del_')) {
		const storyId = data.replace('del_', '');
		const deleted = deleteStory(storyId);
		await callApi('answerCallbackQuery', {
			callback_query_id: callback.id,
			text: deleted ? 'Удалено' : 'Не найдено'
		});
		if (deleted) {
			await callApi('editMessageText', {
				chat_id: chatId,
				message_id: messageId,
				text: `🗑 История <code>${storyId}</code> успешно удалена с сайта.`,
				parse_mode: 'HTML'
			});
		}
		return;
	}

	if (data === 'publish_confirm') {
		const session = sessions.get(from.id);
		if (!session || !session.files || session.files.length === 0) {
			await callApi('answerCallbackQuery', {
				callback_query_id: callback.id,
				text: 'Сессия истекла, отправьте фото снова.',
				show_alert: true
			});
			return;
		}

		const count = session.files.length;
		await callApi('answerCallbackQuery', {
			callback_query_id: callback.id,
			text: `Обрабатываем ${count} фото...`
		});

		await callApi('editMessageText', {
			chat_id: chatId,
			message_id: messageId,
			text: `⏳ <b>Скачиваю и конвертирую ${count} фото в AVIF...</b>`,
			parse_mode: 'HTML'
		});

		try {
			const timestamp = Date.now();
			const generatedAvifPaths = [];
			const avifUrls = [];

			// Process all files in the story
			for (let i = 0; i < session.files.length; i++) {
				const file = session.files[i];
				const rawExt = path.extname(file.fileName) || '.jpg';
				const tempRawPath = path.join(TEMP_DIR, `raw_${timestamp}_${i}${rawExt}`);
				const targetFileName =
					count === 1 ? `story-${timestamp}.avif` : `story-${timestamp}-${i + 1}.avif`;
				const targetAvifPath = path.join(PORTFOLIO_IMG_DIR, targetFileName);

				// 1. Download
				await downloadTelegramFile(file.fileId, tempRawPath);

				// 2. Convert and resize to AVIF
				await processImageToAvif(tempRawPath, targetAvifPath);

				// Clean up raw temp
				if (fs.existsSync(tempRawPath)) {
					fs.unlinkSync(tempRawPath);
				}

				generatedAvifPaths.push(targetAvifPath);
				avifUrls.push(`/images/portfolio/${targetFileName}`);
			}

			// Calculate total AVIF size
			let totalAvifKb = 0;
			for (const p of generatedAvifPaths) {
				if (fs.existsSync(p)) {
					totalAvifKb += fs.statSync(p).size / 1024;
				}
			}

			// 3. Save to portfolio.json
			const citySlug = getCitySlug(session.location);
			const newStory = {
				id: `story-${timestamp}`,
				src: avifUrls[0],
				images: avifUrls,
				alt: session.title,
				caption: session.title,
				location: session.location,
				city: citySlug,
				category: session.category || 'Серия',
				year: session.year
			};

			const items = getPortfolio();
			items.unshift(newStory); // Add to the top of the portfolio
			savePortfolio(items);

			sessions.delete(from.id);

			await callApi('editMessageText', {
				chat_id: chatId,
				message_id: messageId,
				text:
					`🎉 <b>Съёмка успешно опубликована на сайте!</b>\n\n` +
					`🏷 <b>Название:</b> ${session.title}\n` +
					`📸 <b>Кадров в серии:</b> ${count} шт.\n` +
					`📍 <b>Локация:</b> ${session.location} (${citySlug})\n` +
					`🏷 <b>Категория:</b> ${session.category}\n` +
					`📅 <b>Год:</b> ${session.year}\n` +
					`⚡️ <b>Общий размер:</b> ${totalAvifKb.toFixed(1)} KB (AVIF)\n` +
					`🆔 <b>ID:</b> <code>${newStory.id}</code>\n\n` +
					`<i>Все ${count} кадров уже отображаются на сайте в интерактивной галерее!</i>`,
				parse_mode: 'HTML'
			});
		} catch (err) {
			console.error('Error during processing:', err);
			await callApi('editMessageText', {
				chat_id: chatId,
				message_id: messageId,
				text: `❌ <b>Ошибка при обработке:</b>\n<code>${err.message}</code>`,
				parse_mode: 'HTML'
			});
		}
	}
}

/** Delete story and its files */
function deleteStory(id) {
	const items = getPortfolio();
	const item = items.find((i) => i.id === id);
	if (!item) return false;

	const filtered = items.filter((i) => i.id !== id);
	savePortfolio(filtered);

	// Remove all associated images
	const filesToDelete = item.images && item.images.length > 0 ? item.images : [item.src];
	for (const imgUrl of filesToDelete) {
		if (imgUrl?.startsWith('/images/portfolio/')) {
			const filePath = path.join(rootDir, 'static', imgUrl);
			if (fs.existsSync(filePath)) {
				try {
					fs.unlinkSync(filePath);
				} catch (err) {
					console.debug('Image file deletion warning:', err);
				}
			}
		}
	}
	return true;
}

/** Telegram Long Polling Loop */
async function startPolling() {
	let offset = 0;
	console.log('🚀 Telegram Bot is running in long-polling mode (MediaGroup Album enabled)...');
	console.log('📱 Ready to receive multi-photo albums and single photo documents from Telegram!');

	while (true) {
		try {
			const updates = await callApi('getUpdates', {
				offset,
				timeout: 30,
				allowed_updates: ['message', 'callback_query']
			});

			for (const update of updates) {
				offset = update.update_id + 1;
				try {
					await handleUpdate(update);
				} catch (err) {
					console.error('Error handling update:', err);
				}
			}
		} catch (err) {
			console.error('Polling error (retrying in 3s):', err.message);
			await new Promise((r) => setTimeout(r, 3000));
		}
	}
}

startPolling();
