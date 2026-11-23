# scrini-site

Pages publiques de l'application **Scrini**, servies par GitHub Pages sur
[scrini.fr](https://scrini.fr) : la vitrine, la politique de confidentialité et
la procédure de suppression de compte. Les deux dernières sont exigées par
Google Play pour toute application permettant la création d'un compte.

Ce dépôt ne contient que ces pages. Le code de l'application est ailleurs, dans
un dépôt privé — c'est la raison d'être de celui-ci, GitHub Pages n'étant pas
disponible sur un dépôt privé.

| Fichier | Rôle |
|---|---|
| `index.html` | Vitrine : accroche, badges des magasins, points forts, captures, crédits TMDB |
| `confidentialite.html` | Politique de confidentialité (RGPD) |
| `suppression-compte.html` | Procédure de suppression de compte |
| `mentions-legales.html` | Mentions légales (LCEN) : éditeur, hébergeurs, crédits |
| `questions-frequentes.html` | FAQ : réponses courtes, et balisage `FAQPage` |
| `suivre-ses-series.html` | Page d'usage : cocher les épisodes, lire sa progression |
| `agenda-sorties.html` | Page d'usage : l'agenda des diffusions et les alertes |
| `suivre-ses-animes.html` | Page d'usage : le filtre animé et ses limites |
| `en/`, `de/`, `es/`, `it/`, `pt/`, `ja/`, `ko/` | Les mêmes huit pages, traduites — voir « Les langues » |
| `templates/` | La structure des huit pages, écrite une seule fois — voir « Générer les pages » |
| `i18n/*.json` | Les textes d'une langue, plus ce qui la décrit : badges, `og:locale`, nom |
| `tools/build.mjs` | Écrit les 64 pages et `sitemap.xml` à partir des deux dossiers ci-dessus |
| `tools/serve.mjs` | Sert le site en local, pour le regarder avant de pousser |
| `.claude/launch.json` | Lance ce serveur depuis l'onglet Code de Claude |
| `style.css` | Feuille unique, sombre et clair, jetons repris du système de design de l'application |
| `assets/icons.svg` | Les icônes, un `<symbol>` chacune, référencées par `<use>` |
| `assets/fonts/*.woff2` | Roboto auto-hébergé, latin et latin-ext — aucun appel à Google Fonts |
| `assets/scrini-logo-64.png` | Le logo de l'en-tête, 6,6 Ko, rendu en 64 px pour un affichage en 32 |
| `assets/ecran-*.jpg` | Captures de l'application, 1080×2400 |
| `assets/scrini_background*.jpg` | Le fond de l'application, en sombre et en clair |
| `assets/badge-*.svg`, `assets/badge-*.png` | Badges officiels Google Play et App Store, un par langue, à ne pas redessiner ni recolorer |
| `assets/tmdb_logo.svg` | Logo TMDB, pour le crédit obligatoire du pied de page |
| `scrini_icon.png` | Icône 512 px, copie de `design/scrini_icon_512.png` : la source |
| `scrini_icon_224.png` | La même en 224 px, sans alpha — la favicon déclarée par `rel="icon"` |
| `og-scrini.png` | Carte de partage 1200×630, pour les aperçus sur les réseaux |
| `favicon.ico` | 16/32/48 px, pour les clients qui le demandent à la racine |
| `robots.txt` | Autorise l'indexation et déclare le plan du site |
| `sitemap.xml` | Toutes les pages de toutes les langues — **généré**, ne pas éditer à la main |
| `CNAME` | Le domaine, pour GitHub Pages |

**Les huit pages, leurs sept traductions et `sitemap.xml` sont générés** — 65
fichiers qui ne s'éditent pas à la main. Ils se corrigent dans `templates/` et
`i18n/`, puis se réécrivent par `node tools/build.mjs` ; voir « Générer les
pages ».

## Ce qui tourne dans la page, et ce qui n'y tourne pas

Ces pages doivent rester lisibles par un relecteur qui n'exécute pas de
JavaScript, et consultables derrière un réseau qui bloque les CDN. Trois
exceptions, mesurées — dans les trois cas, l'absence du script ou du fichier
dégrade la page sans la casser :

- **L'inverseur de thème** de l'en-tête, quelques lignes présentes dans chacun
  des huit gabarits. Sans lui, le bouton n'apparaît pas et la page
  suit simplement le réglage du système (`prefers-color-scheme`). Avec lui, le
  choix est mémorisé en `localStorage` sous `scrini-theme` et posé en
  `data-theme` sur `<html>` avant le premier rendu, pour ne pas voir la page
  changer de couleur au chargement.
- **Le clic-glissé du carrousel** de captures, sur l'accueil seulement. Le
  carrousel lui-même est du CSS (`scroll-snap`) et se fait glisser au doigt
  sans une ligne de script ; mais une bande qui ne défile qu'à l'horizontale
  n'offre aucune prise à la souris — la molette verticale fait défiler la
  page, pas la bande. Le script ne s'active que pour un pointeur de type
  souris et que si la bande déborde ; sans lui, restent la molette horizontale
  et `Maj`+molette.
- **Roboto**, parce que c'est la police de l'application. Elle est
  **auto-hébergée** dans `assets/fonts/` : quatre fichiers `woff2` pris chez
  Google Fonts (licence Apache 2.0), sous-ensembles latin et latin-ext
  seulement. Elle arrivait auparavant par un `@import` vers
  `fonts.googleapis.com` dans `style.css` — soit trois allers-retours en série
  avant le premier caractère, et l'adresse IP de chaque visiteur envoyée à
  Google. Si un fichier manque, la pile de repli (Helvetica, Arial) prend le
  relais et rien ne casse. C'est pour cette raison que les icônes ne sont
  *pas* une police d'icônes : une police d'icônes absente affiche « movie » en
  toutes lettres. Elles sont des SVG (`assets/icons.svg`, tirés de Material
  Symbols Rounded), qui ne dépendent de rien.

Le site ne fait **aucune requête vers un domaine tiers**. Aucune dépendance
npm non plus : le seul script du dépôt, `tools/build.mjs`, s'exécute avant le
commit, jamais chez le visiteur. Ce qui est servi est ce qui est dans le
dépôt.

## Ce qui doit suivre l'application

Plusieurs choses vivent ici en copie et se désynchronisent en silence :

- **L'icône** — quand l'identité change, recopier `design/scrini_icon_512.png`
  depuis le dépôt de l'application, puis **régénérer les trois images dérivées**
  qui en descendent : `scrini_icon_224.png`, `favicon.ico` et `og-scrini.png`
  (recette plus bas). Les oublier laisse le site à l'ancienne identité alors que
  la source a changé.
- **Les jetons de couleur** de `style.css`, repris de
  `lib/core/theme/app_theme.dart`. Ils y sont écrits deux fois pour le thème
  clair (choix explicite, et choix du système) : modifier les deux blocs.
- **Le fond** (`assets/scrini_background*.jpg`), copie en JPEG des PNG de
  l'application. Si le fond change dans l'application, le reconvertir : les
  PNG font 1,1 et 1,3 Mo, les JPEG 40 Ko, pour un rendu identique.
- **Les captures** (`assets/ecran-*.jpg`). Une capture qui montre un écran
  disparu, ou une ancienne identité, se remarque plus qu'un texte périmé.
- **Les données collectées**, décrites dans la politique de confidentialité.
  Toute nouvelle donnée enregistrée côté serveur doit y figurer **avant** la
  publication de la version qui l'écrit — c'est un engagement, pas une
  documentation.
- **Les badges des magasins**, présents sur quatre pages (accueil et trois
  pages d'usage) de chaque langue. Google Play : `com.scrini.app`. App Store : Apple ID
  `6809466532`. La charte des deux magasins interdit de rediriger un badge vers
  une fiche indisponible : si l'une des deux se ferme, son badge part avec, et
  avec lui `operatingSystem` du bloc JSON-LD de l'accueil et **les deux copies**
  de la réponse « Sur quels appareils » de la FAQ, qui nomment les deux
  plateformes et la version web.
- **Le lien vers la version web** (`https://app.scrini.fr`), dans l'en-tête des
  huit pages — et nulle part ailleurs qu'en toutes lettres dans la FAQ. Il n'a
  pas sa place à côté des badges des magasins : ceux-là font installer une
  application, lui ouvre une page, et les aligner laisse croire à un troisième
  magasin. L'application est servie ailleurs — ce dépôt ne l'héberge pas et n'a
  rien à faire de son domaine. Deux conséquences : c'est un lien ordinaire, et
  il **n'entre pas dans `sitemap.xml`**, l'application étant volontairement
  servie en `X-Robots-Tag: noindex` — elle peint dans un canvas et n'offre
  aucun texte à indexer. Si le sous-domaine change, il se reprend dans les
  sources, pas dans le HTML : onze mentions dans `templates/`, et deux par
  langue dans `i18n/` — les rappels en toutes lettres de la FAQ et de son bloc
  `FAQPage`, qui ne peut pas porter de lien. Vingt-sept en tout, puis une
  régénération. Un `grep -r app.scrini.fr templates i18n` les trouve toutes.
- **La FAQ** (`questions-frequentes.html`), qui **recopie en abrégé** ce que dit
  la politique de confidentialité : données conservées, notifications locales,
  export, suppression. Ses réponses figurent deux fois dans la page, en HTML et
  dans le bloc `FAQPage`. Douze des vingt-six chaînes de la FAQ étant
  identiques des deux côtés, elles partagent leur clé et ne s'écrivent plus
  qu'une fois ; les réponses qui portent un lien gardent deux formes, l'une
  balisée, l'autre en texte brut, et **restent à corriger ensemble**. La
  politique de confidentialité, elle, est un texte séparé : une FAQ qui la
  contredit est pire que pas de FAQ — c'est la politique qui engage, et l'écart
  se retourne contre elle.
- **Les pages d'usage** (`suivre-ses-series`, `agenda-sorties`,
  `suivre-ses-animes`), qui décrivent des fonctions précises pour être trouvées
  par une recherche. Une fonction retirée ou modifiée doit y être corrigée : une
  page qui promet ce que l'application ne fait plus se paie en désinstallations,
  et en signalements sur les magasins.
- **L'en-tête, le pied de page et le script de thème** vivent dans les huit
  gabarits de `templates/`, un par page. Un changement commun aux huit s'y
  fait donc huit fois — mais plus soixante-quatre.

Le site tutoie, comme l'application. Les pages ne comparent pas Scrini à une
application nommée. La publicité comparative est licite, mais suppose des
caractéristiques objectivement vérifiables et aucun dénigrement — deux
conditions qu'on ne tient pas sur une page écrite de mémoire. Elles décrivent
donc un usage, jamais un concurrent.

## Les langues

Le site parle les langues de l'application : le français à la racine, et un
dossier par autre langue — `en/`, `de/`, `es/`, `it/`, `pt/`, `ja/`, `ko/`.
Chaque dossier porte **les huit mêmes fichiers, sous les mêmes noms** : on ne
traduit pas les noms de fichiers, ce qui permet de passer d'une langue à
l'autre en changeant seulement le dossier.

L'application a aussi des variantes régionales (`fr_CA`, `en_GB`, `es_MX`,
`pt_PT`). Le site n'en a pas : elles ne diffèrent que de quelques mots, et
quatre jeux de pages presque identiques se désynchroniseraient pour rien. Une
variante lit la page de sa langue. `pt/` est donc en portugais du Brésil,
`es/` en espagnol d'Espagne, `en/` en anglais américain — les variantes
principales de l'application.

**Le français fait référence.** Un texte se corrige d'abord dans
`i18n/fr.json`, puis dans les sept autres fichiers, dans le même commit. La
politique de confidentialité traduite le dit en tête et renvoie à la version
française : c'est celle qui engage. En revanche, un changement de l'en-tête ou
du pied de page ne se fait **qu'une fois**, dans le gabarit — voir « Générer
les pages ».

Les traductions reprennent **le vocabulaire de l'application** dans chaque
langue — noms d'onglets, statuts, libellés cités entre guillemets — tel que
l'écrivent les fichiers `lib/l10n/arb/app_*.arb` de son dépôt, et son
registre : tutoiement en allemand, en espagnol et en italien, *você* en
portugais, forme polie en japonais, 해요체 en coréen. Un libellé renommé dans
l'application se renomme ici aussi, dans chaque langue.

Ce qui est propre à chaque page est **calculé** par `tools/build.mjs`, à une
exception près, signalée plus bas : les URL des deux magasins, déclarées
langue par langue parce qu'elles ne se déduisent pas du code de langue.

- **Les liens `hreflang`** de l'en-tête HTML (les huit langues, plus
  `x-default` vers l'anglais, langue de repli de l'application) et les
  `og:locale:alternate`. Chaque page les porte tous, y compris vers elle-même.
- **Le menu des langues** de l'en-tête, un `<details>` qui s'ouvre sans script,
  chaque langue écrite dans sa langue. Le script de l'en-tête ne fait que le
  refermer d'un clic à côté ou d'Échap.
- **Les chemins relatifs** (`../`), les URL canoniques et les `og:url`, qui ne
  dépendent que du dossier de la langue.
- **Les badges des magasins**, dans la langue de la page : la charte des deux
  magasins demande la version localisée quand elle existe. Ceux d'Apple sont
  les SVG de son outil (`toolbox.marketingtools.apple.com`) ; ceux de Google,
  les PNG de `play.google.com/intl/en_us/badges/`, rognés de leur marge
  transparente et de rien d'autre. Le lien Google Play porte `&hl=` ; le lien
  App Store n'a pas de pays, Apple renvoyant chacun vers sa boutique. Les deux
  URL, le fichier, ses dimensions et son texte alternatif sont déclarés dans
  `i18n/<langue>.json`, puisqu'ils changent d'une langue à l'autre — y compris
  le `&hl=`, qui ne se déduit pas du code de langue (`pt/` demande `hl=pt-BR`).
  L'esperluette s'y écrit `&amp;` : nue, c'est une erreur de conformité dans
  un attribut, que les navigateurs rattrapent sans le dire.

Restent en français, faute de mieux, **les captures** et **la carte de
partage** `og-scrini.png`, communes à toutes les langues. Des captures par
langue sortiraient de l'application elle-même, réglée dans chaque langue.

Le japonais et le coréen ne sont pas couverts par Roboto : `style.css` leur
nomme une pile de polices du système (`:lang(ja)`, `:lang(ko)`).

## Générer les pages

Les 64 fichiers HTML et `sitemap.xml` **ne s'éditent pas à la main** : ils sont
écrits par un script, à partir de deux sources.

| Source | Ce qu'elle porte |
|---|---|
| `templates/<page>.html` | La structure de la page, une seule fois pour les huit langues |
| `i18n/<langue>.json` | Les textes de cette langue, et ce qui la décrit (badges, `og:locale`, nom) |

```sh
node tools/build.mjs          # écrit les 64 pages et sitemap.xml
node tools/build.mjs --check  # n'écrit rien, sort en erreur si un fichier a dérivé
node tools/serve.mjs          # http://localhost:4173, pour regarder le résultat
```

Ouvrir une page en `file://` ne remplace pas ce serveur : les chemins et les
polices ne s'y comportent pas comme sur GitHub Pages.

Aucune dépendance : Node seul suffit, il n'y a pas de `package.json`. Le HTML
produit reste commité, pour que GitHub Pages continue de servir des fichiers
simples et que les diffs restent lisibles en revue. **Régénérer fait donc
partie du commit**, au même titre que la modification elle-même ; `--check` est
là pour le vérifier avant de pousser.

Un gabarit est du HTML ordinaire, avec quatre sortes de marques :

| Marque | Effet |
|---|---|
| `{{une-cle}}` | Le texte de cette clé, pris dans `i18n/<langue>.json` |
| `{{?une-cle}}` | Pareil, mais la ligne entière disparaît si la clé vaut `null` — c'est ainsi que l'avertissement « ceci est une traduction » n'apparaît pas en français |
| `{{@prefix}}`, `{{@dir}}`, `{{@lang}}`, `{{@htmlLang}}`, `{{@locale}}`, `{{@inLanguage}}` | Ce qui se déduit de la langue, ou de la liste des langues |
| `{{#hreflangLinks}}`, `{{#ogLocales}}`, `{{#langMenu}}`, `{{#storeBadges}}` | Un bloc entier, reconstruit ligne à ligne |

Les clés sont nommées d'après le texte français qu'elles portaient à
l'extraction. Une même suite de huit traductions n'a qu'une clé : les libellés
repris d'une page à l'autre, comme ceux du pied de page, sont donc partagés —
les corriger une fois les corrige partout.

Le script refuse de produire une page dont une clé manque, plutôt que d'écrire
un trou : une traduction oubliée arrête la génération au lieu d'être publiée.

**Ajouter une langue** : un fichier `i18n/<code>.json` complet, le code ajouté
à `MENU` et à `SITEMAP_ORDER` dans `tools/build.mjs`, les deux badges du
magasin dans `assets/`. **Ajouter une page** : un gabarit dans `templates/`,
son nom dans `PAGES`, et son entrée dans `SITEMAP_PAGES` avec sa priorité.

Dans les deux cas, oublier la seconde liste **arrête la génération** : les
paires `MENU`/`SITEMAP_ORDER` et `PAGES`/`SITEMAP_PAGES` doivent porter les
mêmes éléments, sans quoi le plan du site annoncerait des URL inexistantes ou
en tairait. Le reste suit tout seul — liens `hreflang`, menu de langue,
`og:locale` et `inLanguage` du bloc JSON-LD se dérivent de `MENU`.

La date annoncée aux moteurs (`LASTMOD`) se change à la main. La recalculer à
chaque génération ferait mentir `sitemap.xml` sur des pages qui n'ont pas bougé.

## Refaire les images dérivées

`tools/build.mjs` écrit du HTML, pas des images : celles-ci se refont à la
main, avec n'importe quel éditeur, à partir de `scrini_icon.png`.

- **`assets/scrini-logo-64.png`** — le logo de l'en-tête, affiché en 32 px donc
  rendu en 64 pour les écrans à deux fois la densité. 6,6 Ko. L'en-tête
  chargeait auparavant `scrini_icon_224.png`, soit 74 Ko pour un logo de
  32 px, et le fichier partait deux fois : comme favicon et comme logo.
- **`scrini_icon_224.png`** — l'icône réduite à 224 px, et **sans canal alpha** :
  la source est entièrement opaque, son alpha ne transportait que du poids.
  C'est ce qui fait passer le fichier de 324 Ko à 74 Ko. Un encodeur PNG
  sérieux (`pngquant`, `oxipng`) descendrait encore vers 25 Ko si l'occasion se
  présente.
- **`favicon.ico`** — trois images PNG (16, 32 et 48 px) empaquetées dans un
  conteneur ICO. Google n'en a pas besoin, la balise `rel="icon"` lui suffit ;
  c'est pour les clients qui demandent `/favicon.ico` à la racine sans lire le
  HTML, et qui recevaient un 404. Note au passage qu'à 16 px l'icône est à la
  limite du lisible : les rayures du clap et le fond de pellicule s'y réduisent
  à du bruit. Une variante simplifiée pour les petites tailles serait un vrai
  gain, et se fabriquerait dans le dépôt de l'application, pas ici.
- **`og-scrini.png`** — 1200×630, le format qu'attendent les aperçus de lien.
  Fond `#0b172f`, icône à 260 px avec 60 px d'arrondi, marge de 96 px à gauche,
  texte à partir de 428 px : « Scrini » en 76 px gras `#e6eef9`, un filet accent
  `#ff6b6e` de 96×5 px, puis deux lignes de 34 px en `#9db0cc`. Les couleurs
  sont celles du mode sombre de `style.css`.
- **Les icônes** (`assets/icons.svg`) — chaque symbole est le SVG que Google
  sert pour Material Symbols Rounded, à
  `https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsrounded/<nom>/<default|fill1>/24px.svg`,
  collé tel quel dans un `<symbol id="i-…" viewBox="0 -960 960 960">`.

L'icône 512 reste dans le dépôt : c'est la source des deux autres, et le bloc
JSON-LD de l'accueil la désigne comme icône de l'application.
