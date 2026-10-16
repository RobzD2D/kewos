# Site Kéwos – Employé Modèle

Site statique, sans dépendance ni build, prévu pour Netlify (`/casting` sert `casting.html`,
`404.html` est utilisée automatiquement).

Prévisualisation locale : `node _local-server.js`, puis <http://localhost:5173/>.

```
index.html            accueil (spectacle, acting, dates, vidéos, espace pro)
casting.html          formulaire pour les directeurs de casting
sousbock.html         page du QR code des sous-bocks (non liée, non indexée) + horoscope
mentions-legales.html
404.html              chemins absolus : s'affiche à n'importe quelle adresse
robots.txt, sitemap.xml, favicon.svg
css/style.css         styles du site ; css/sousbock.css pour la page sous-bock
js/main.js            comportements du site ; js/sousbock.js pour la page sous-bock
images/               photos optimisées (WebP) ; images/partage.jpg pour les réseaux sociaux
documents/            CV et book photos en PDF (liens dans Acting et sur la page casting)
Assets site/          photos brutes, hors dépôt (.gitignore)
```

## Mise en ligne : à faire une fois

0. **Déployer depuis GitHub, pas par glisser-déposer du dossier.** Sur Netlify : « Add new site »
   → « Import an existing project » → dépôt `RobzD2D/kewos`, sans commande de build, dossier de
   publication `/`. Seuls les fichiers commités partent en ligne : `Assets site/` (133 Mo de photos
   brutes) et `.mcp.json` (qui contient une clé d'API) restent sur l'ordinateur grâce au
   `.gitignore`. Un glisser-déposer du dossier les publierait. Ensuite, dans « Domain management »,
   ajouter `www.lekewos.fr` (et `lekewos.fr`) puis suivre les instructions DNS ; le HTTPS est
   automatique. Le fichier `_redirects` renvoie les anciennes adresses Systeme.io (`/spectacle`,
   `/contact`, `/book`, `/video`, `/arras2`) vers les bonnes sections.
1. **Activer le formulaire casting.** Il envoie vers `le.kewos@gmail.com` via
   [FormSubmit](https://formsubmit.co) (gratuit, sans compte). Une fois le site en ligne, le remplir
   une fois : FormSubmit écrit alors à `le.kewos@gmail.com` un e-mail « Activate Form » sur lequel
   il faut cliquer (vérifier les spams). Avant ce clic, le visiteur voit un message l'invitant à
   écrire directement à l'adresse. L'alerte nouvelles dates est désactivée pour le moment : son
   code est conservé en commentaire dans `index.html`, avec la marche à suivre pour la remettre.
2. **Domaine.** `canonical`, `og:image`, `sitemap.xml` et `robots.txt` supposent
   `https://www.lekewos.fr/`. À modifier si le site part sur une autre adresse.
3. **Durée du spectacle.** L'accueil indique 1 h 20, la page sous-bock 1 h 10 (reprise de
   l'ancienne page) : garder la bonne des deux.

## Tenir le site à jour

- **Dates** : dans `index.html`, section `#dates`. Une date passée disparaît d'elle-même le
  lendemain et le bandeau « Prochaine date » du hero suit la première date non complète ; il faut
  quand même retirer les anciennes lignes du HTML de temps en temps.
- **Vidéos** : `data-yt` = ce qui suit `v=` dans l'adresse YouTube.
- **Horoscopes** (page sous-bock) : blocs `data-horoscope` de `sousbock.html`. Jamais deux fois
  le même d'affilée sur un même téléphone.

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
  dans une `<dialog>` native. Tout élément portant `data-yt` ouvre le lecteur (bande démo comprise).
- **Formulaires** : `form[data-send]` est envoyé en JSON à FormSubmit sans quitter la page ; sans
  JavaScript, l'attribut `action` prend le relais. Champ piège `_honey` contre les robots.
- **Accessibilité** : lien d'évitement, focus visible, contrastes vérifiés, navigation au clavier
  sur le menu et les vidéos.
- Pas de framework, pas de cookie, pas de tracker. Ajouter GA4 ou Meta Pixel demandera un bandeau
  de consentement.

## Passage en Webflow

La structure est calquée sur les sites d'humoristes analysés (hero affiche + billetterie en liste
plate + alerte dates + espace pro). Si le projet part sur Webflow, les collections utiles sont :
`Dates` (date, ville, salle, URL billetterie, statut) et `Vidéos` (titre, ID YouTube).
