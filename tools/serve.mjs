#!/usr/bin/env node
// Sert le site en local, pour le regarder avant de le pousser.
//
//   node tools/serve.mjs        http://localhost:4173
//   node tools/serve.mjs 8080   sur un autre port
//
// GitHub Pages sert des fichiers statiques ; ouvrir les pages en file://
// ne suffit pas, parce que les chemins absolus et les polices ne s'y
// comportent pas pareil. D'ou ce serveur, qui ne fait rien d'autre que
// rendre les fichiers du depot tels quels.
//
// Sans dependance, comme le reste du depot. Ce fichier ne part pas en
// production : il ne sert qu'au coup d'oeil local.

import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.argv[2]) || 4173;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.mjs':  'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml':  'application/xml; charset=utf-8',
  '.txt':  'text/plain; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.ico':  'image/x-icon',
  '.woff2': 'font/woff2',
};

http.createServer((req, res) => {
  const chemin = decodeURIComponent(req.url.split('?')[0]);
  let f = path.join(ROOT, chemin);

  // On refuse de sortir du depot, meme si l'URL contient des « .. ».
  if (!f.startsWith(ROOT)){ res.writeHead(403).end('403'); return; }

  try {
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
    if (!fs.existsSync(f)){ res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end('404 ' + chemin); return; }
    res.writeHead(200, { 'content-type': TYPES[path.extname(f).toLowerCase()] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  } catch (e) {
    res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' }).end(String(e));
  }
}).listen(PORT, () => console.log(`Le site est sur http://localhost:${PORT}`));
