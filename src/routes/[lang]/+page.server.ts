import { z } from 'zod';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { getCms } from '$lib/server/cms';
import { isLocale, localize } from '$lib/content/localize';
import {
	buildContent,
	buildSite,
	type Content,
	type HomeDoc,
	type SettingsDoc,
	type SiteConfig
} from '$lib/content/build';

async function getContent(lang?: string): Promise<{ content: Content; site: SiteConfig }> {
	const locale = isLocale(lang) ? lang : 'de';
	const cms = await getCms();
	return {
		content: buildContent(localize(cms.home, locale) as HomeDoc),
		site: buildSite(localize(cms.settings, locale) as SettingsDoc)
	};
}

function contactSchema(packageIds: string[]) {
	return z.object({
		name: z.string().trim().min(1, 'required').max(80, 'tooLong'),
		contact: z.string().trim().min(3, 'required').max(120, 'tooLong'),
		city: z.string().trim().max(80, 'tooLong').optional(),
		package: z
			.string()
			.optional()
			.transform((v) => (v ? v : undefined))
			.refine((v) => v === undefined || packageIds.includes(v), 'generic'),
		message: z.string().trim().max(1000, 'tooLong').optional(),
		consent: z.string().optional(),
		hp: z.string().optional()
	});
}

const ERROR_KEYS = new Set(['required', 'tooLong']);

function localizeError(key: string | undefined, content: Content): string | undefined {
	if (!key) return undefined;
	const dict = content.contact.form.errors;
	if (ERROR_KEYS.has(key) && key in dict) return dict[key as 'required' | 'tooLong'];
	return dict.generic;
}

export const load: PageServerLoad = async ({ url }) => {
	return {
		prefill: {
			package: url.searchParams.get('package')
		}
	};
};

export const actions: Actions = {
	contact: async ({ request, getClientAddress, params }) => {
		const ip = getClientAddress();
		if (isRateLimited(ip)) {
			return fail(429, { ok: false, formError: 'rate_limited' });
		}

		const formData = await request.formData();
		const data = Object.fromEntries(formData);
		const { content, site } = await getContent(params.lang);
		const parsed = contactSchema(content.services.packages.map((p) => p.id)).safeParse(data);

		if (data.hp && data.hp.toString().length > 0) {
			return fail(400, { ok: false, formError: 'spam' });
		}

		if (!parsed.success) {
			const errors: Record<string, string> = {};
			for (const issue of parsed.error.issues) {
				const key = issue.path[0]?.toString();
				if (!key) continue;
				errors[key] = localizeError(issue.message, content) ?? content.contact.form.errors.generic;
			}
			if (!('consent' in errors) && data.consent !== 'on') {
				errors.consent = content.contact.form.errors.consent;
			}
			return fail(400, { ok: false, errors });
		}

		if (data.consent !== 'on') {
			return fail(400, {
				ok: false,
				errors: { consent: content.contact.form.errors.consent }
			});
		}

		const id = crypto.randomUUID();
		const e = content.email;
		const subject = e.subject(parsed.data.package ?? null);
		const body = [
			`${e.labels.name}: ${parsed.data.name}`,
			`${e.labels.contact}: ${parsed.data.contact}`,
			`${e.labels.city}: ${parsed.data.city ?? e.emptyValue}`,
			`${e.labels.package}: ${parsed.data.package ?? e.emptyValue}`,
			`${e.labels.message}: ${parsed.data.message ?? e.emptyValue}`,
			`${e.labels.id}: ${id}`
		].join('\n');

		const telegramMessage = `
<b>Новая заявка на съёмку!</b> 📸

<b>Имя:</b> ${parsed.data.name}
<b>Контакт:</b> ${parsed.data.contact}
<b>Город:</b> ${parsed.data.city || '—'}
<b>Пакет:</b> ${parsed.data.package || '—'}

<b>Сообщение:</b>
${parsed.data.message || '—'}
`.trim();

		await Promise.allSettled([
			deliverLead({ subject, body, replyTo: parsed.data.contact, name: parsed.data.name, site }),
			sendTelegramMessage(telegramMessage)
		]);

		return { ok: true, id };
	}
};

async function deliverLead(args: {
	subject: string;
	body: string;
	replyTo: string;
	name: string;
	site: SiteConfig;
}): Promise<void> {
	const { site } = args;
	const smtp = env.SMTP_URL;
	if (!smtp) {
		console.info('[contact] SMTP not configured — logging lead', args);
		return;
	}
	try {
		// Lazy-loaded so the type-checker doesn't require nodemailer to be installed.
		// Install with `npm i nodemailer` and set SMTP_URL to enable real delivery.
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const dynamicImport: (s: string) => Promise<any> = new Function(
			's',
			'return import(s)'
		) as never;
		const mod = await dynamicImport('nodemailer').catch(() => null);
		if (!mod) {
			console.warn('[contact] nodemailer is not installed; lead not sent');
			return;
		}
		const transport = mod.default.createTransport(smtp);
		await transport.sendMail({
			from: `"${site.name}" <no-reply@${new URL(site.url).host}>`,
			to: site.email,
			replyTo: args.replyTo,
			subject: args.subject,
			text: args.body
		});
	} catch (err) {
		console.error('[contact] Failed to send lead email', err);
	}
}

async function sendTelegramMessage(message: string): Promise<void> {
	const botToken = env.TELEGRAM_BOT_TOKEN;
	// Support both TELEGRAM_CHAT_ID and ALLOWED_TELEGRAM_USER_ID
	const chatId = env.TELEGRAM_CHAT_ID || env.ALLOWED_TELEGRAM_USER_ID;

	if (!botToken || !chatId) {
		console.info('[contact] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID/ALLOWED_TELEGRAM_USER_ID not configured — skipping Telegram notification');
		return;
	}

	try {
		const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				chat_id: chatId,
				text: message,
				parse_mode: 'HTML'
			})
		});

		if (!res.ok) {
			const errorText = await res.text();
			console.error('[contact] Telegram API error:', errorText);
		}
	} catch (err) {
		console.error('[contact] Failed to send Telegram message:', err);
	}
}

const RATE_LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
	const now = Date.now();
	const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
	list.push(now);
	hits.set(ip, list);
	return list.length > RATE_LIMIT;
}
