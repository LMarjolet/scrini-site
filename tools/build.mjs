#!/usr/bin/env node
// Genere les pages HTML des huit langues a partir de templates/ et i18n/.
//
// Une page du site existe en huit exemplaires strictement paralleles. Plutot
// que de les tenir a la main, on garde ici la structure une seule fois
// (templates/) et les textes une fois par langue (i18n/). Tout ce qui se
// deduit de la langue — chemins relatifs, URL canoniques, liens hreflang,
// menu de langue, badges des magasins — est calcule, jamais recopie.
//
//   node tools/build.mjs          ecrit les 64 pages et sitemap.xml
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
               'questions-frequentes', 'confidentialite', 'suppression-compte',
               'mentions-legales'];

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
    // Les langues du site, pour le JSON-LD de l'accueil. Derivee de MENU :
    // ajouter une langue l'y fait entrer sans qu'on y pense. L'ordre d'un
    // tableau schema.org ne porte aucun sens.
    inLanguage: MENU.map(x => `"${x}"`).join(', '),
  };
  const subst = line => line.replace(/\{\{(@?[\w-]+)\}\}/g, (m, k) => {
    if (k[0] === '@'){
      if (!(k.slice(1) in vars)) throw new Error(`${page}/${l} : variable inconnue ${m}`);
      return vars[k.slice(1)];
    }
    if (!(k in s)) throw new Error(`${page}/${l} : texte manquant ${m}`);
    return s[k];
  });

  const out = [];
  // Un gabarit enregistre en CRLF laisserait un \r colle a la fin de chaque
  // ligne : une marque de bloc ne serait alors plus reconnue et sortirait en
  // clair dans la page. On le retire avant toute chose.
  for (const line of tpl.split('\n').map(x => x.replace(/\r$/, ''))){
    const block = line.match(/^\s*\{\{#(\w+)\}\}\s*$/);
    if (block){
      if (!(block[1] in blk)) throw new Error(`${page}/${l} : bloc inconnu {{#${block[1]}}}`);
      out.push(...blk[block[1]]); continue;
    }
    const opt = line.match(/^\s*\{\{\?([\w-]+)\}\}\s*$/);
    if (opt){
      // La cle doit exister. Seul un null explicite vaut renoncement : sans
      // cette exigence, une faute de frappe ferait disparaitre la ligne en
      // silence — et c'est par la qu'arrive l'avertissement de traduction.
      if (!(opt[1] in s)) throw new Error(`${page}/${l} : texte manquant {{?${opt[1]}}}`);
      if (s[opt[1]] !== null) out.push(subst(s[opt[1]]));
      continue;
    }
    out.push(subst(line));
  }
  const html = out.join('\n');

  // Aucune marque ne doit survivre a la substitution : une marque indentee,
  // ou mal orthographiee, sortirait sinon telle quelle dans la page publiee.
  const reste = html.match(/\{\{[@#?]?[\w-]+\}\}/);
  if (reste) throw new Error(`${page}/${l} : marque non remplacee ${reste[0]}`);

  // Les blocs JSON-LD portent des textes traduits. Un guillemet droit dans
  // une traduction les rendrait inanalysables sans rien changer au rendu
  // visible : le defaut passerait donc inapercu jusqu'aux outils des moteurs.
  for (const m of html.matchAll(/<script type="application\/ld\+json">\n([\s\S]*?)\n<\/script>/g)){
    try { JSON.parse(m[1]); }
    catch (e) { throw new Error(`${page}/${l} : bloc JSON-LD invalide — ${e.message}`); }
  }
  return html;
}

// Le plan du site : les huit pages dans les huit langues. L'application web
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
  ['mentions-legales',     '0.1'],
];
// Date annoncee aux moteurs. Elle se change a la main : la recalculer a chaque
// generation ferait mentir le fichier sur des pages qui n'ont pas bouge.
const LASTMOD = '2026-11-23';

// Les deux listes ci-dessus ne font qu'ordonner : elles doivent porter
// exactement les memes langues et les memes pages que le site. Sans ce
// controle, ajouter une langue a MENU seul la publierait sans l'annoncer, et
// l'oublier dans MENU ferait annoncer huit URL inexistantes.
const memeEnsemble = (a, b) =>
  a.length === b.length && [...a].sort().join() === [...b].sort().join();
if (!memeEnsemble(SITEMAP_ORDER, MENU))
  throw new Error('SITEMAP_ORDER et MENU ne portent pas les memes langues');
if (!memeEnsemble(SITEMAP_PAGES.map(([p]) => p), PAGES))
  throw new Error('SITEMAP_PAGES et PAGES ne portent pas les memes pages');

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

// Tout est rendu avant qu'une seule ligne ne soit ecrite : une erreur laisse
// l'arbre intact, plutot qu'a moitie regenere.
const fichiers = [];
for (const page of PAGES)
  for (const l of MENU)
    fichiers.push([path.join(ROOT, dirOf(l), page + '.html'), render(page, l)]);
fichiers.push([path.join(ROOT, 'sitemap.xml'), sitemap()]);

let bad = 0;
for (const [file, texte] of fichiers){
  if (check){
    const cur = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
    if (cur !== texte){ bad++; console.error('differe :', path.relative(ROOT, file)); }
  } else {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, texte);
  }
}

const n = fichiers.length;
if (check){
  console.log(bad ? `${bad} fichier(s) sur ${n} ne correspondent pas aux gabarits.`
                  : `${n} fichiers conformes aux gabarits.`);
  process.exit(bad ? 1 : 0);
}
console.log(`${n} fichiers ecrits (${n - 1} pages et sitemap.xml).`);
