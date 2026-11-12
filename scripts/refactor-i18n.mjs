import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, '../src');

function walkDir(dir, callback) {
	const files = fs.readdirSync(dir);
	for (const file of files) {
		const filepath = path.join(dir, file);
		const stat = fs.statSync(filepath);
		if (stat.isDirectory()) {
			walkDir(filepath, callback);
		} else if (file.endsWith('.svelte') || file.endsWith('.ts')) {
			callback(filepath);
		}
	}
}

let modified = 0;

walkDir(srcDir, (filepath) => {
	let content = fs.readFileSync(filepath, 'utf8');
	
	// Skip files that don't import from '$lib/content'
	if (!content.includes("from '$lib/content'") && !content.includes('from "$lib/content"')) {
		return;
	}

	// Avoid changing index.ts or other core files if not needed, but we do need to change state/ and components/
	if (filepath.includes('/lib/content/')) return;
	
	// Svelte components
	if (filepath.endsWith('.svelte')) {
		content = content.replace(
			/import\s+{\s*content(,\s*type\s+\w+)?\s*}\s+from\s+['"]\$lib\/content['"];?/g,
			"import { useI18n$1 } from '$lib/i18n.svelte';\n\tconst i18n = useI18n();\n\tconst content = $derived(i18n.content);"
		);
		// Replace single imports where there's no types
		content = content.replace(
			/import\s+{\s*content\s*}\s+from\s+['"]\$lib\/content['"];?/g,
			"import { useI18n } from '$lib/i18n.svelte';\n\tconst i18n = useI18n();\n\tconst content = $derived(i18n.content);"
		);
	} else if (filepath.endsWith('.svelte.ts') || filepath.endsWith('.ts')) {
		// TS files
		content = content.replace(
			/import\s+{\s*content(,\s*type\s+\w+)?\s*}\s+from\s+['"]\$lib\/content['"];?/g,
			"import { useI18n$1 } from '$lib/i18n.svelte';\nimport { getContext } from 'svelte';\n// Warning: i18n should be called inside a component or context"
		);
	}

	fs.writeFileSync(filepath, content, 'utf8');
	console.log('Modified:', filepath);
	modified++;
});

console.log(`Refactored ${modified} files.`);
