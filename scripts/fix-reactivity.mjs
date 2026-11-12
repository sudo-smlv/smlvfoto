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
		} else if (file.endsWith('.svelte')) {
			callback(filepath);
		}
	}
}

let modified = 0;

walkDir(srcDir, (filepath) => {
	let content = fs.readFileSync(filepath, 'utf8');
	let original = content;

	// Replace `const t = content.xxx;` with `const t = $derived(content.xxx);`
	content = content.replace(/const t = content\.([^;]+);/g, 'const t = $derived(content.$1);');
	// Replace `const f = t.form;` with `const f = $derived(t.form);`
	content = content.replace(/const f = t\.form;/g, 'const f = $derived(t.form);');
	// Replace `const items = t.items;`
	content = content.replace(/const items = t\.items;/g, 'const items = $derived(t.items);');
	
	// Fix site-header section definitions:
	content = content.replace(/const sections = \[([\s\S]*?)\];/g, 'const sections = $derived([$1]);');

	if (content !== original) {
		fs.writeFileSync(filepath, content, 'utf8');
		console.log('Modified:', filepath);
		modified++;
	}
});

console.log(`Fixed reactivity in ${modified} files.`);
