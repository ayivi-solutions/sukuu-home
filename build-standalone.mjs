import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname);
const [html, css, js] = await Promise.all([
  readFile(resolve(root, 'index.html'), 'utf8'),
  readFile(resolve(root, 'assets/css/styles.css'), 'utf8'),
  readFile(resolve(root, 'assets/js/app.js'), 'utf8')
]);

let standalone = html
  .replace('<link rel="stylesheet" href="assets/css/styles.css">', `<style>\n${css}\n</style>`)
  .replace('<script src="assets/js/app.js" defer></script>', `<script>\n${js}\n</script>`);

const embeddedReferences = [
  ...standalone.matchAll(/(?:src|href)="(\/?(?:assets\/[^"]+|favicon\.ico|site\.webmanifest))"/g)
];
const assetPaths = [...new Set(embeddedReferences.map(match => match[1].replace(/^\//, '')))];
for (const assetPath of assetPaths) {
  const bytes = await readFile(resolve(root, assetPath));
  const extension = assetPath.split('.').pop().toLowerCase();
  const mime = { webp: 'image/webp', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', svg: 'image/svg+xml', ico: 'image/x-icon', webmanifest: 'application/manifest+json' }[extension];
  if (!mime) continue;
  const dataUrl = `data:${mime};base64,${bytes.toString('base64')}`;
  standalone = standalone
    .replaceAll(`src="${assetPath}"`, `src="${dataUrl}"`)
    .replaceAll(`href="${assetPath}"`, `href="${dataUrl}"`)
    .replaceAll(`href="/${assetPath}"`, `href="${dataUrl}"`);
}

await writeFile(resolve(root, 'index-standalone.html'), standalone);
console.log(`Created index-standalone.html with ${assetPaths.length} embedded local assets`);
