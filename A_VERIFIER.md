# À vérifier

Notes de suivi entre deux chantiers : bugs identifiés mais reportés
volontairement à un moment où ils seront traités avec le reste du
contexte concerné, plutôt que corrigés isolément.

## Chapitre 10 (Énergie électrique) — points « à revoir » non bloquants

**Trouvés le** 2026-09-17 par l'agent `relecteur-physique`, lors de la
relecture ciblée du chantier de 16 reformulations pédagogiques de
`public/app/03-cours-energie.js` (id `"electrique"`) et de la figure
`MODELES["ohm"]` (`public/app/02-figures.js`). Les 5 points bloquants
de cette relecture ont été corrigés le jour même (pile ≠ courbe,
astérisques d'italique affichées en clair, contradiction 7,2/14,4
millions, plage de curseur R resserrée, sens conventionnel du
courant). Les points ci-dessous sont des améliorations de qualité,
reportées pour rester dans le même contexte qu'un futur chantier sur
ce chapitre plutôt que corrigées isolément.

- **Ordres de grandeur limites** : le robinet à $3$ L/s (`:17`, plutôt
  une lance à incendie qu'un robinet domestique — un robinet fait
  $0{,}1$ à $0{,}2$ L/s) ; la veilleuse de $15$ W (`:16`, plausible
  pour une ancienne veilleuse à incandescence, pas pour une veilleuse
  LED actuelle) ; la figure Ohm qui monte jusqu'à $115$ W dans « le
  petit cylindre à anneaux de couleur » qu'est censé être le dipôle
  étudié (une résistance de labo de ce type tient plutôt $0,25$ à
  $1$ W).
- **Charge $Q$ introduite mais jamais chiffrée** : aucun exemple ni
  exercice n'applique $Q = I × Δt$ numériquement. Absente aussi du
  glossaire `mots` (s1) et du récapitulatif final. Une note du type
  « un chargeur qui débite $2{,}0$ A pendant une heure a transporté
  $Q = 7200$ C » comblerait le manque.
- **$Q = I × Δt$ n'est valable qu'à intensité constante**, non précisé
  dans la `note` (même remarque, déjà connue, pour $E = P × Δt$).
- **s2 est devenue la section la plus dense du chapitre** (analogie
  hydraulique, $Q$, caractéristique $U=f(I)$, conducteur ohmique, loi
  d'Ohm, $P=UI$) et c'est la seule sans bloc `check` intermédiaire.
- **`:152` — « exactement l'écart »** entre ampoule filament et LED :
  $60/9 = 6{,}67$ contre un rendement annoncé de $35/5=7$ — cohérent,
  mais pas exact au sens strict. Écrire « à peu près ».
- **Notation des wattheures incohérente** dans tout le chapitre :
  `@u{Wh}` (×10) contre `@u{W·h}` (×22), `@u{kWh}` (×36) contre
  `@u{kW·h}` (×1) — préexistant, mais amplifié par ce chantier.
- **`:25` — `$2000 : 1000 = 2{,}0$`** : notation collège du deux-points
  pour une division, alors que le reste du fichier passe par `@f{a}{b}`.
  Rendu vérifié correct, simple entorse à la convention maison.
- **Titres de figure « U = f(I) »** (`:58` et l'exercice `el15`) pas
  entourés de `$…$` : `U`, `f` et `I` s'affichent en romain au lieu
  de l'italique utilisé partout ailleurs pour les grandeurs.
- **Figure Ohm — `assezDePoints = trail.length > 3`** compte les
  événements de curseur, pas les valeurs de $U$ distinctes : quatre
  allers-retours entre deux mêmes valeurs déclenchent le message
  « les points s'alignent » avec seulement deux points visibles.
- **Figure Ohm — plafond FIFO de 60 points** (`trail.shift()`) : après
  de nombreux allers-retours du curseur U, les premiers points sont
  évincés et le nuage restant peut ne couvrir qu'une bande étroite de
  $U$, alors que le texte continue de promettre « une droite par
  l'origine ».
- **Protocole de mesure (`:57`)** ne précise pas qu'on travaille en
  très basse tension (aucun risque réel avec les curseurs de la
  figure, plafonnés à 24 V = limite TBT, mais une incise le
  préciserait, en cohérence avec la mise en garde sur le 230 V
  ailleurs dans le chapitre, `:112`).

## Chapitre 10 — points relevés par la relecture de confirmation (2026-09-17)

Après correction des 5 bloquants ci-dessus, une relecture de
confirmation par `relecteur-physique` a donné un verdict **GO**
(aucune erreur nouvelle), mais a relevé quelques points mineurs
supplémentaires. Deux ont été corrigés dans la foulée (commentaire
d'en-tête périmé de `MODELES["ohm"]", et la formulation approximative
« $U$ ... se compte positivement dans le sens conventionnel » — une
tension ne se compte pas dans le sens du courant, corrigée en
« restent des grandeurs positives »). Les autres sont reportés :

- **Saturation du halo à P = 40 W** (`02-figures.js`, `MODELES["ohm"]`) :
  entre U = 18 V et U = 24 V à R = 5 Ω, la puissance affichée passe de
  $64,80$ à $115,20$ W sans que le halo ne bouge plus. Bien meilleur
  qu'avant (saturation à 8 W), mais le dernier tiers du curseur U à
  R minimal n'illustre plus « la puissance suit le carré de
  l'intensité ».
- **Puissance par défaut de la figure passée de $2,88$ à $14,4$ W**
  (U=12 V, R0=10 Ω, contre l'ancien R0=50 Ω) : accentue le point déjà
  noté plus haut sur le réalisme d'une résistance de labo — même la
  valeur *par défaut*, vue sans toucher aux curseurs, dépasse
  maintenant ce qu'encaisse un vrai composant de TP. À traiter avec
  ce même point plutôt qu'isolément.
- **Collision de libellés en coin extrême du graphique** (U=24 V,
  R=5 Ω) : le nombre rouge `4,800` et le libellé d'axe « I (A) » se
  chevauchent sur quelques pixels. État atteignable en poussant les
  deux curseurs à fond.
- **`el6` (`:332`) utilise R = 50 Ω**, désormais hors de la plage du
  curseur de la figure Ohm ([5 ; 20]) : l'exercice reste correct en
  lui-même, mais un élève ne peut plus vérifier ce cas particulier
  sur la figure (les valeurs citées dans le cours, 15 Ω et 20 Ω,
  restent elles atteignables).
- **Deux circuits différents à quelques lignes d'écart** : la figure
  statique (`:76-86`) montre générateur + résistance + lampe +
  interrupteur, la figure manipulable qui suit (`:89`) ne montre plus
  que générateur + résistance, sans qu'une phrase fasse le pont entre
  les deux schémas.
- **Apostrophes incohérentes** dans le texte de la figure Ohm
  (`02-figures.js`, la branche « forte intensité » vs l'autre branche
  du même ternaire) : typographiques (’) dans l'une, droites (') dans
  l'autre.
