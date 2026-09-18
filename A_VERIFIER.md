# À vérifier

Notes de suivi entre deux chantiers : bugs identifiés mais reportés
volontairement à un moment où ils seront traités avec le reste du
contexte concerné, plutôt que corrigés isolément.

## Diagnostics numériques faux, à corriger avec leur chapitre

**Trouvés le** 2026-09-18 par `outils/verifier-diags.mjs`, qui refait
chaque diagnostic `{v, m}` à partir de l'erreur décrite par son
message. Un diagnostic FAUX ne s'affiche jamais à l'élève qui fait
l'erreur décrite (elle reçoit le message générique, ou celui d'un autre
diagnostic). Décision de l'utilisatrice : chacun est corrigé **avec
son chapitre**, jamais en lot hors contexte. Ceux du ch9 sont traités
dans le chantier du ch9. Avant de committer un chapitre :
`node outils/verifier-diags.mjs <id-chapitre>` ne doit plus rien afficher.

Pour chaque cas : corriger la valeur `v`, **ou** reformuler le message
si la valeur correspond à une erreur plus plausible que celle décrite
(le relecteur tranche), puis mettre à jour le calcul refait dans
`outils/diags/`.

- **ch1 transformation** — `tr7` diag[3] : 96 = 2,4 × M(MgO), mais le
  message parle de M(Mg).
- **ch2 mesures** — `me3` diag[1] : 0,19 ne sort d'aucun calcul (le
  message donne 1,5, déjà diag[2]) ; `me6` diag[2] : 5,6 attendu, 6,5
  écrit ; `me14` diag[1] et diag[2] **inversés** (0,05 ↔ 0,1) ; `me15`
  diag[2] : 0,0125 correspond à l'oubli du facteur 4 mmol/L, pas à la
  pente inversée décrite.
- **ch3 titrage** *(chapitre déjà fait)* — `ti1` diag[1] et
  `s6/atelier1/etape1` diag[1] : leur message décrit la même erreur que
  diag[2] ; `ti3` diag[2] : 0,167 = volumes inversés **et** 2 oublié,
  le message ne dit que le premier.
- **ch5 cohesion** — `co9` diag[3] : volume en mL donne 9000, pas 3600 ;
  `s5/atelier1/etape1` diag[2] : 0,8 = C/V, le message dit V/C (1,25,
  déjà diag[1]).
- **ch6 cristaux** *(chapitre déjà fait)* — `cr10` diag[0] et
  `s6/atelier1/etape4` diag[0] : « gardé les grammes » donne des g/m³
  (×1000), la valeur écrite est en g/cm³ (7,84 ; 8,97).
- **ch7 organique** — `or6` diag[0] : 5,3/0,080 = 66, pas 6,6.
- **ch10 electrique** *(chapitre déjà fait)* — `s6/atelier1/etape2`
  diag[0] : 4,0 × 20 = 80, pas 20.
- **ch11 mecanique** — `mc1` diag[0] : sans le carré, 12 kJ (12000 est
  en J) ; `mc2` diag[1] : 1,7 = 5/3 (g oublié), pas une division ;
  `mc5` diag[2] : √(2h) = 3,16, le 7 écrit est √(gh) ;
  `s7/atelier1/etape2` diag[0] : sans le carré, 90 (180 = m × v).
- ~~ch4 lewis~~, ~~ch9 forces~~ et ~~ch13 lumiere~~ : corrigés dans leur chantier (2026-09-18).

**Moteur, point voisin non traité** : les diagnostics génériques de
`diagnostic()` (`04-vue.js`, « mauvais signe », « double », « moitié »)
comparent avec une marge absolue de $0{,}001$ : inopérants pour une
réponse de l'ordre de $10^{-9}$, et trop larges pour une réponse de
l'ordre de $10^{-4}$. Même correction que `fenetreDiag()` (marge
relative), à faire dans un futur chantier moteur.

## Chapitre 9 (Forces) — points mineurs reportés

Relevés le 2026-09-18 par `relecteur-physique` (relecture de
confirmation du chantier ch9), non bloquants :

- **Figure bilan** (`02-figures.js`, `MODELES["bilan"]`) : les libellés
  « F » et « f » tombent à l'intérieur de la caisse ; à $5$ N, une
  flèche (ou $ΣF = ±5$ N) fait 4 px pour une pointe de 9 px, rendu
  dégénéré. Pistes : libellés sous le sol, longueur minimale ou
  suppression de la flèche sous un seuil.
- **Générateur `fo-poids`** (`06-generateurs.js`) : pour certains
  tirages (Vénus, ou Terre avec $m = 12$), les valeurs des diagnostics
  $m/g$ et $g/m$ sont proches (ex. $0{,}899$ et $1{,}113$) et leurs
  fenêtres se chevauchent : l'élève qui a calculé $g/m$ reçoit le
  message de $m/g$. Aucune bonne réponse déclarée fausse (15 000
  tirages simulés). Piste : écarter un diagnostic dont la fenêtre
  touche celle d'un autre, dans le filtre de `fabriquer()`.

## Programme de Première non couvert par le cahier

Relevé le 2026-09-18 par `relecteur-physique` (relecture du ch9),
vérifié par recherche dans tout `public/app/` : les **champs**
(champ électrostatique, champ de gravitation, lien avec le champ de
pesanteur, lignes de champ) et la **statique des fluides** (pression,
loi de Mariotte, loi fondamentale de la statique des fluides) sont
absents. Chantier futur : nouvelles sections ou nouveau chapitre, à
décider avec l'utilisatrice.

Relevé aussi le 2026-09-18 (relecture du ch13, recherche « soustractive »,
« trichromie » vide) : la partie **couleurs** du programme (couleur des
objets, couleurs complémentaires, synthèses additive et soustractive,
vision des couleurs et trichromie, absorption/diffusion/transmission) et
l'**échelle des domaines électromagnétiques** ne sont traitées nulle part.
Le ch13 parle de lentilles, de photons et de spectres, pas de couleur
des objets.

**Statut (décision de l'utilisatrice, 2026-09-18) : contenu manquant,
pas de la dette cosmétique.** C'est au programme de Première : à
ajouter dans un **chantier dédié** (nouvelles sections du ch13 ou
nouveau chapitre), avec le circuit habituel — rédaction, relecture
`relecteur-physique` puis `prof-pedagogue`, figures, exercices et
diagnostics vérifiés par `outils/verifier-diags.mjs`. Ne pas le
« glisser » au détour d'un autre chantier.

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
