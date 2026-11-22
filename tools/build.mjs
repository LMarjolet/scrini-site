#!/usr/bin/env node
// Genere les pages HTML des huit langues a partir de templates/ et i18n/.
//
// Une page du site existe en huit exemplaires strictement paralleles. Plutot
// que de les tenir a la main, on garde ici la structure une seule fois
// (templates/) et les textes une fois par langue (i18n/). Tout ce qui se
// deduit de la langue — chemins relatifs, URL canoniques, liens hreflang,
// menu de langue, badges des magasins — est calcule, jamais recopie.
//
//   node tools/build.mjs          ecrit les 56 pages et sitemap.xml
//   node tools/build.mjs --check  n'ecrit rien, signale ce qui differe
//
// --check sert de garde-fou : il echoue si les fichiers commites ne sont plus
// ceux que produisent les gabarits.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// L'ordre du menu de langue et des liens hreflang. Le francais vit a la
// racine du site, les sept autres dans un sous-dossier a leur code.
const MENU = ['de', 'en', 'es', 'fr', 'it', 'pt', 'ja', 'ko'];
const XDEFAULT = 'en';
const SITE = 'https://scrini.fr/';

const PAGES = ['index', 'agenda-sorties', 'suivre-ses-series', 'suivre-ses-animes',
               'questions-frequentes', 'confidentialite', 'suppression-compte'];

const dirOf = l => l === 'fr' ? '' : l + '/';
const preOf = l => l === 'fr' ? '' : '../';

const loc = Object.fromEntries(MENU.map(l =>
  [l, JSON.parse(fs.readFileSync(path.join(ROOT, 'i18n', l + '.json'), 'utf8'))]));

// Le lien d'une entree du menu, vu depuis la langue courante.
function menuHref(from, to, page){
  const base = preOf(from) + dirOf(to);
  if (page !== 'index') return base + page + '.html';
  return base === '' ? './' : base;
}

function blocks(l, page){
  const pre = preOf(l);
  return {
    hreflangLinks: [
      ...MENU.map(t => `<link rel="alternate" hreflang="${t}" href="${SITE}${dirOf(t)}${page === 'index' ? '' : page + '.html'}">`),
      `<link rel="alternate" hreflang="x-default" href="${SITE}${dirOf(XDEFAULT)}${page === 'index' ? '' : page + '.html'}">`,
    ],
    ogLocales: [
      `<meta property="og:locale" content="${loc[l].ogLocale}">`,
      ...MENU.filter(t => t !== l).map(t => `<meta property="og:locale:alternate" content="${loc[t].ogLocale}">`),
    ],
    langMenu: MENU.map(t => {
      const attrs = t === l ? `lang="${t}" aria-current="page"` : `hreflang="${t}" lang="${t}"`;
      return `<li><a href="${menuHref(l, t, page)}" ${attrs}>${loc[t].name}</a></li>`;
    }),
    storeBadges: ['play', 'apple'].map(s => {
      const b = loc[l][s];
      return `<a class="badge" href="${b.href}"><img src="${pre}${b.src}" alt="${b.alt}" width="${b.width}" height="${b.height}"></a>`;
    }),
  };
}

function render(page, l){
  const tpl = fs.readFileSync(path.join(ROOT, 'templates', page + '.html'), 'utf8');
  const s = loc[l].strings;
  const blk = blocks(l, page);
  const vars = {
    prefix: preOf(l), dir: dirOf(l), lang: l,
    htmlLang: loc[l].htmlLang, locale: loc[l].ogLocale,
    hl: l === 'fr' ? '' : '&amp;hl=' + l,
  };
  const out = [];
  for (const line of tpl.split('\n')){
    const block = line.match(/^\{\{#(\w+)\}\}$/);
    if (block){ out.push(...blk[block[1]]); continue; }
    const opt = line.match(/^\{\{\?([\w-]+)\}\}$/);
    if (opt){ if (s[opt[1]] != null) out.push(s[opt[1]]); continue; }
    out.push(line.replace(/\{\{(@?[\w-]+)\}\}/g, (m, k) => {
      if (k[0] === '@'){
        if (!(k.slice(1) in vars)) throw new Error(`${page}/${l} : variable inconnue ${m}`);
        return vars[k.slice(1)];
      }
      if (!(k in s)) throw new Error(`${page}/${l} : texte manquant ${m}`);
      return s[k];
    }));
  }
  return out.join('\n');
}

// Le plan du site : les sept pages dans les huit langues. L'application web
// n'y figure pas, elle est servie en noindex. L'ordre des langues et les
// priorites sont des choix editoriaux, pas une consequence de la structure :
// ils s'ecrivent ici, une fois.
const SITEMAP_ORDER = ['fr', 'en', 'de', 'es', 'it', 'pt', 'ja', 'ko'];
const SITEMAP_PAGES = [
  ['index',                '1.0'],
  ['suivre-ses-series',    '0.8'],
  ['agenda-sorties',       '0.8'],
  ['suivre-ses-animes',    '0.8'],
  ['questions-frequentes', '0.8'],
  ['confidentialite',      '0.3'],
  ['suppression-compte',   '0.3'],
];
// Date annoncee aux moteurs. Elle se change a la main : la recalculer a chaque
// generation ferait mentir le fichier sur des pages qui n'ont pas bouge.
const LASTMOD = '2026-11-20';

function sitemap(){
  const out = ['<?xml version="1.0" encoding="UTF-8"?>',
               '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];
  for (const l of SITEMAP_ORDER){
    for (const [page, priority] of SITEMAP_PAGES){
      out.push('  <url>',
        `    <loc>${SITE}${dirOf(l)}${page === 'index' ? '' : page + '.html'}</loc>`,
        `    <lastmod>${LASTMOD}</lastmod>`,
        `    <priority>${priority}</priority>`,
        '  </url>');
    }
  }
  out.push('</urlset>', '');
  return out.join('\n');
}

const check = process.argv.includes('--check');
let bad = 0, n = 0;
for (const page of PAGES){
  for (const l of MENU){
    const file = path.join(ROOT, dirOf(l), page + '.html');
    const html = render(page, l);
    n++;
    if (check){
      const cur = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
      if (cur !== html){ bad++; console.error('differe :', path.relative(ROOT, file)); }
    } else {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, html);
    }
  }
}
const mapFile = path.join(ROOT, 'sitemap.xml');
const mapText = sitemap();
n++;
if (check){
  if (fs.readFileSync(mapFile, 'utf8') !== mapText){ bad++; console.error('differe : sitemap.xml'); }
} else {
  fs.writeFileSync(mapFile, mapText);
}

if (check){
  console.log(bad ? `${bad} fichier(s) sur ${n} ne correspondent pas aux gabarits.` : `${n} fichiers conformes aux gabarits.`);
  process.exit(bad ? 1 : 0);
}
console.log(`${n} fichiers ecrits (56 pages et sitemap.xml).`);
