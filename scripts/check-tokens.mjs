// Fails the build if colours or font names leak outside the token files.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('../src/', import.meta.url).pathname;
const allowColour = new Set(['styles/tokens.css']);
const allowFont = new Set(['styles/tokens.css', 'styles/fonts.css']);
const colour = /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(|\boklch\(/;
const fontDecl = /font-family\s*:\s*(?!\s*var\()[^;}]+/i;

const files = [];
(function walk(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    statSync(p).isDirectory() ? walk(p) : /\.(css|astro|ts|js)$/.test(f) && files.push(p);
  }
})(root);

let bad = 0;
for (const file of files) {
  const rel = relative(root, file);
  readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    const code = line.replace(/\/\*.*?\*\//g, '').replace(/^\s*\/\/.*$/, '');
    if (!allowColour.has(rel) && colour.test(code) && !/&#\d/.test(code)) { console.error(`colour literal  ${rel}:${i + 1}  ${line.trim()}`); bad++; }
    if (!allowFont.has(rel) && fontDecl.test(code)) { console.error(`font literal    ${rel}:${i + 1}  ${line.trim()}`); bad++; }
  });
}
if (bad) { console.error(`\n${bad} token violation(s). Use roles from src/styles/tokens.css.`); process.exit(1); }
console.log('tokens ok: no raw colours or font names outside the token files');
