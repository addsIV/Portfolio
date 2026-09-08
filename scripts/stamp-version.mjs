#!/usr/bin/env node
// Stamps a build version into index.html so browsers and the GitHub Pages CDN
// fetch fresh assets after every deploy (query-string cache busting) and so the
// version is visible on the page. Run before committing:  npm run stamp
import { readFileSync, writeFileSync } from 'node:fs';

const now = new Date();
const pad = (n) => String(n).padStart(2, '0');
const stamp = `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())}.${pad(now.getHours())}${pad(now.getMinutes())}`;
const version = stamp;

const file = new URL('../index.html', import.meta.url);
let html = readFileSync(file, 'utf8');
const before = html;

// Local assets: styles.css, script.js, scroll-fx.js, glass-surface.js ...
html = html.replace(/((?:href|src)="(?!https?:\/\/)[^"?]+\.(?:css|js))(?:\?v=[^"]*)?"/g, `$1?v=${stamp}"`);
html = html.replace(/(<meta name="app-version" content=")[^"]*(")/, `$1${version}$2`);
html = html.replace(/(<span class="build-version"[^>]*>)[^<]*(<\/span>)/, `$1${version}$2`);

if (html === before) {
  if (before.includes(`content="${version}"`)) { console.log(`already stamped ${version}`); process.exit(0); }
  console.error('stamp-version: nothing changed — placeholders missing?'); process.exit(1);
}
writeFileSync(file, html);
console.log(`stamped ${version}`);
