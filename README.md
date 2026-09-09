# Site Kéwos – Employé Modèle

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

Les dates, crédits, e-mail de contact et liens sociaux ont été repris du site officiel
[lekewos.fr](https://www.lekewos.fr/) le 2026-09-05. Ce qui reste à vérifier ou compléter :

| Où | Quoi |
|---|---|
| Section `#dates` | Les salles précises ne sont pas indiquées sur le site officiel – seul le département est affiché (ex. « Arras (62) »). À compléter si vous avez les noms de salle. |
| `data-yt="dQw4w9WgXcQ"` | Toujours un identifiant factice. L'identifiant YouTube de chaque vidéo (ce qui suit `v=` dans l'URL) |
| `hero-next-value` | Pointe actuellement sur la date la plus proche trouvée (Compiègne, 24/09/2026) – à tenir à jour manuellement au fil des annonces |
| `Durée` dans la fiche du spectacle (« 1 h 20 ») | Les sources trouvées se contredisent (environ 40 min vs environ 1 h selon les avis) – à confirmer |
| Section `#acting` | Crédits réels intégrés (Tapie, Le Livreur de Noël, Face à Face, César Wagner) ; un lien de bande démo et une photo plus définitive restent optionnels |
| `action="#"` du formulaire | L'endpoint Brevo, Mailchimp ou autre |
| `mentions-legales.html` | Créée avec le contenu réel (éditeur, RGPD), hébergeur mis à jour sur Netlify. Il manque encore les CGU et la Politique de confidentialité séparées si vous les voulez sur des pages dédiées. |
| Balise `canonical` et `og:image` | Domaine placeholder `kewos.fr` – le vrai domaine officiel est `lekewos.fr` |

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
