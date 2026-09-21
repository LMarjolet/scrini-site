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
| `questions-frequentes.html` | FAQ : réponses courtes, et balisage `FAQPage` |
| `suivre-ses-series.html` | Page d'usage : cocher les épisodes, lire sa progression |
| `agenda-sorties.html` | Page d'usage : l'agenda des diffusions et les alertes |
| `suivre-ses-animes.html` | Page d'usage : le filtre animé et ses limites |
| `style.css` | Feuille unique, sombre et clair, jetons repris du système de design de l'application |
| `assets/icons.svg` | Les icônes, un `<symbol>` chacune, référencées par `<use>` |
| `assets/ecran-*.jpg` | Captures de l'application, 1080×2400 |
| `assets/scrini_background*.jpg` | Le fond de l'application, en sombre et en clair |
| `assets/badge-*.svg` | Badges officiels Google Play et App Store, à ne pas redessiner ni recolorer |
| `assets/tmdb_logo.svg` | Logo TMDB, pour le crédit obligatoire du pied de page |
| `scrini_icon.png` | Icône 512 px, copie de `design/scrini_icon_512.png` : la source |
| `scrini_icon_224.png` | La même en 224 px, sans alpha — c'est elle que les pages chargent |
| `og-scrini.png` | Carte de partage 1200×630, pour les aperçus sur les réseaux |
| `favicon.ico` | 16/32/48 px, pour les clients qui le demandent à la racine |
| `robots.txt` | Autorise l'indexation et déclare le plan du site |
| `sitemap.xml` | Toutes les pages, à compléter dès qu'une s'ajoute |
| `CNAME` | Le domaine, pour GitHub Pages |

## Ce qui tourne dans la page, et ce qui n'y tourne pas

Ces pages doivent rester lisibles par un relecteur qui n'exécute pas de
JavaScript, et consultables derrière un réseau qui bloque les CDN. Deux
exceptions, mesurées :

- **Un script de quelques lignes**, pour l'inverseur de thème de l'en-tête. Sans
  lui, le bouton n'apparaît pas et la page suit simplement le réglage du
  système (`prefers-color-scheme`). Avec lui, le choix est mémorisé en
  `localStorage` sous `scrini-theme` et posé en `data-theme` sur `<html>` avant
  le premier rendu, pour ne pas voir la page changer de couleur au chargement.
- **Roboto, depuis Google Fonts**, parce que c'est la police de l'application.
  Si elle ne vient pas, la pile de repli (Helvetica, Arial) prend le relais et
  rien ne casse. C'est pour cette raison que les icônes ne sont *pas* une
  police d'icônes : une police d'icônes absente affiche « movie » en toutes
  lettres. Elles sont des SVG (`assets/icons.svg`, tirés de Material Symbols
  Rounded), qui ne dépendent de rien.

Pas de script de build, pas de dépendance npm : ce qui est servi est ce qui
est dans le dépôt.

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
- **Les badges des magasins**. Le lien Google Play est en place ; **le lien
  App Store est à renseigner** dans les quatre pages qui portent les badges
  (accueil et trois pages d'usage) dès que la fiche existe — il pointe sur `#`
  en attendant. La charte des deux magasins interdit de rediriger un badge vers
  une fiche indisponible : ne pas déployer avant.
- **La FAQ** (`questions-frequentes.html`), qui **recopie en abrégé** ce que dit
  la politique de confidentialité : données conservées, notifications locales,
  export, suppression. Ses réponses existent deux fois, en HTML et dans le bloc
  `FAQPage` de la même page — donc **trois copies à corriger ensemble**. Une FAQ
  qui contredit la politique est pire que pas de FAQ : c'est la politique qui
  engage, et l'écart se retourne contre elle.
- **Les pages d'usage** (`suivre-ses-series`, `agenda-sorties`,
  `suivre-ses-animes`), qui décrivent des fonctions précises pour être trouvées
  par une recherche. Une fonction retirée ou modifiée doit y être corrigée : une
  page qui promet ce que l'application ne fait plus se paie en désinstallations,
  et en signalements sur les magasins.
- **L'en-tête, le pied de page et le script de thème** sont recopiés dans
  chaque page, sans système de gabarit. Un changement s'y fait sept fois.

Le site tutoie, comme l'application. Les pages ne comparent pas Scrini à une
application nommée. La publicité comparative est licite, mais suppose des
caractéristiques objectivement vérifiables et aucun dénigrement — deux
conditions qu'on ne tient pas sur une page écrite de mémoire. Elles décrivent
donc un usage, jamais un concurrent.

## Refaire les images dérivées

Il n'y a pas de script dans ce dépôt, et il ne doit pas y en avoir. Les images
se refont donc à la main, avec n'importe quel éditeur, à partir de
`scrini_icon.png`.

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
