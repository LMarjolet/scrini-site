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
| `index.html` | Vitrine : ce que fait l'application, lien Play, crédits TMDB, contact |
| `confidentialite.html` | Politique de confidentialité (RGPD) |
| `suppression-compte.html` | Procédure de suppression de compte |
| `suivre-ses-series.html` | Page d'usage : cocher les épisodes, lire sa progression |
| `agenda-sorties.html` | Page d'usage : l'agenda des diffusions et les alertes |
| `suivre-ses-animes.html` | Page d'usage : le filtre animé et ses limites |
| `style.css` | Feuille unique, clair et sombre |
| `scrini_icon.png` | Icône de l'application, copie de `design/scrini_icon_512.png` |
| `google-play-badge.png` | Badge officiel Google, à ne pas redessiner ni recolorer |
| `robots.txt` | Autorise l'indexation et déclare le plan du site |
| `sitemap.xml` | Toutes les pages, à compléter dès qu'une s'ajoute |
| `CNAME` | Le domaine, pour GitHub Pages |

Aucun script, aucune dépendance externe : ces pages doivent rester consultables
même derrière un réseau restrictif, et lisibles par un relecteur qui n'exécute
pas de JavaScript.

## Ce qui doit suivre l'application

Quatre choses vivent ici en copie et se désynchronisent en silence :

- **L'icône** — quand l'identité change, recopier `design/scrini_icon_512.png`
  depuis le dépôt de l'application.
- **La palette** de `style.css`, reprise de `lib/core/theme/app_theme.dart`.
- **Les données collectées**, décrites dans la politique de confidentialité.
  Toute nouvelle donnée enregistrée côté serveur doit y figurer **avant** la
  publication de la version qui l'écrit — c'est un engagement, pas une
  documentation.
- **Les pages d'usage** (`suivre-ses-series`, `agenda-sorties`,
  `suivre-ses-animes`), qui décrivent des fonctions précises pour être trouvées
  par une recherche. Une fonction retirée ou modifiée doit y être corrigée : une
  page qui promet ce que l'application ne fait plus se paie en désinstallations,
  et en signalements sur le Play Store.

Ces pages ne comparent pas Scrini à une application nommée. La publicité
comparative est licite, mais suppose des caractéristiques objectivement
vérifiables et aucun dénigrement — deux conditions qu'on ne tient pas sur une
page écrite de mémoire. Elles décrivent donc un usage, jamais un concurrent.
