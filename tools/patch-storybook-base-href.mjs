/**
 * Inject <base href="..."> into Storybook's index.html for GitHub Project Pages
 * (e.g. https://owner.github.io/repo/).
 *
 * Usage:
 *   node tools/patch-storybook-base-href.mjs <storybook-out-dir> <repository-name>
 *
 * Example:
 *   node tools/patch-storybook-base-href.mjs dist/storybook/ng-core my-repo
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const outDir = process.argv[2];
const repo = process.argv[3];

if (!outDir || !repo) {
  console.error('Usage: node tools/patch-storybook-base-href.mjs <out-dir> <repo-name>');
  process.exit(1);
}

const base = `/${repo.replace(/^\/+|\/+$/g, '')}/`;
const indexPath = join(outDir, 'index.html');
let html = readFileSync(indexPath, 'utf8');

if (html.includes('<base href=')) {
  html = html.replace(/<base href="[^"]*"\s*\/?>/, `<base href="${base}">`);
} else {
  html = html.replace('<head>', `<head>\n    <base href="${base}">`);
}

writeFileSync(indexPath, html, 'utf8');
console.log(`Patched ${indexPath} with base href="${base}"`);
