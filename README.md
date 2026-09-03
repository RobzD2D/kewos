# Site Kewos — Employé Modèle

Site statique, sans dépendance ni build. On ouvre `index.html` dans un navigateur et ça tourne.

## Installation

Copier le contenu de ce dossier dans `D:\Robin PRO\Kewos\Assets site\`, en gardant la structure :

```
Assets site/
├── index.html
├── mentions-legales.html
├── hero-section.jpg      ← l'image de la hero, à poser ici
├── affiche.jpg           ← optionnel
├── portrait.jpg          ← optionnel
├── css/style.css
└── js/main.js
```

Les images sont cherchées à côté de `index.html`, puis dans `images/`. Le script teste
automatiquement `.jpg`, `.jpeg`, `.png`, `.webp` et `.avif` : pas besoin de renommer le fichier
ni de toucher au HTML. Si une image manque, un motif rayé prend sa place au lieu d'une icône cassée.

Format conseillé pour `hero-section` : 2400 × 1600 px minimum, sujet cadré dans le tiers haut de
l'image (le texte occupe le bas). Compresser en WebP autour de 300 Ko.

## À remplacer avant mise en ligne

| Où | Quoi |
|---|---|
| Section `#dates` | Les 8 lignes sont des données de démo. Un bloc de commentaire au-dessus explique le format. |
| `href="#"` des boutons Réserver | Les vraies URL de billetterie |
| `data-yt="dQw4w9WgXcQ"` | L'identifiant YouTube de chaque vidéo (ce qui suit `v=` dans l'URL) |
| `hero-next-value` | La prochaine date, à tenir à jour manuellement |
| Section `#acting` | Texte de démo : les vrais crédits (films, séries), une photo définitive et un lien de bande démo si disponible. |
| `booking@ / presse@ / contact@ / casting@` | Les vraies adresses |
| Liens TikTok, YouTube, Facebook | Dans le pied de page |
| `action="#"` du formulaire | L'endpoint Brevo, Mailchimp ou autre |
| `mentions-legales.html` | Éditeur, hébergeur, SIRET, crédits photo |
| Balise `canonical` et `og:image` | Le vrai domaine |

## Statuts de date disponibles

```html
<a class="btn btn-line" href="URL">Réserver</a>
<span class="stamp">Complet</span>
<span class="stamp stamp-last">Dernières places</span>
```

Les tampons s'abattent avec un léger rebond quand la ligne entre dans l'écran.

## Notes techniques

- **Écran de choix** : au premier affichage de la page d'accueil, un écran plein cadre façon
  « versus » demande de choisir entre Stand-up (`images/stand-up.jpg`) et Acting
  (`images/acting.jpg`). Le choix fait défiler jusqu'à la section correspondante (`#accueil`
  ou `#acting`) ; « Passer » ou <kbd>Échap</kbd> mène au stand-up par défaut. Le reste de la page
  est rendu inerte (`inert`) tant que l'écran est affiché, pour le clavier et les lecteurs d'écran.
  Il réapparaît à chaque chargement complet de la page (pas de mémorisation en local).
- **Verre liquide** : `backdrop-filter: blur() saturate()`, arête haute éclairée en `inset box-shadow`,
  et un reflet spéculaire qui suit le curseur (variables CSS `--mx` / `--my` pilotées en JS).
  La pastille du menu glisse d'un lien à l'autre avec une courbe à léger dépassement.
  Sur les navigateurs sans `backdrop-filter`, un fond opaque prend le relais automatiquement.
- **Animations au scroll** : `IntersectionObserver`, déclenchement unique, cascade sur les listes
  via `data-stagger`. Tout est désactivé si le visiteur a coché « réduire les animations ».
- **Vidéos** : aucune requête vers YouTube tant qu'on ne clique pas. Lecture en `youtube-nocookie`
  dans une `<dialog>` native. Rien à déclarer côté bandeau cookies.
- **Accessibilité** : lien d'évitement, focus visible, contrastes vérifiés, navigation au clavier
  sur le menu et les vidéos.
- Pas de framework, pas de cookie, pas de tracker. Ajouter GA4 ou Meta Pixel demandera un bandeau
  de consentement.

## Passage en Webflow

La structure est calquée sur les sites d'humoristes analysés (hero affiche + billetterie en liste
plate + alerte dates + espace pro). Si le projet part sur Webflow, les collections utiles sont :
`Dates` (date, ville, salle, URL billetterie, statut) et `Vidéos` (titre, ID YouTube).
