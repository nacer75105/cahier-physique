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

- **ch3 titrage** *(chapitre déjà fait)* — `ti1` diag[1] et
  `s6/atelier1/etape1` diag[1] : leur message décrit la même erreur que
  diag[2] ; `ti3` diag[2] : 0,167 = volumes inversés **et** 2 oublié,
  le message ne dit que le premier.
- **ch6 cristaux** *(chapitre déjà fait)* — `cr10` diag[0] et
  `s6/atelier1/etape4` diag[0] : « gardé les grammes » donne des g/m³
  (×1000), la valeur écrite est en g/cm³ (7,84 ; 8,97).
- **ch10 electrique** *(chapitre déjà fait)* — `s6/atelier1/etape2`
  diag[0] : 4,0 × 20 = 80, pas 20.
- ~~ch2 mesures~~ (2026-09-19, avec me10 diag[1] trouvé en plus par le relecteur), ~~ch1 transformation~~, ~~ch4 lewis~~, ~~ch5 cohesion~~, ~~ch7 organique~~, ~~ch9 forces~~, ~~ch11 mecanique~~ et ~~ch13 lumiere~~ : corrigés dans leur chantier (2026-09-18).

**Moteur, point voisin non traité** : les diagnostics génériques de
`diagnostic()` (`04-vue.js`, « mauvais signe », « double », « moitié »)
comparent avec une marge absolue de $0{,}001$ : inopérants pour une
réponse de l'ordre de $10^{-9}$, et trop larges pour une réponse de
l'ordre de $10^{-4}$. Même correction que `fenetreDiag()` (marge
relative), à faire dans un futur chantier moteur.

## Défauts transversaux, à régler avec chaque chapitre

Relevés le 2026-09-18 pendant le chantier du ch7. Décision de
l'utilisatrice : c'est le même défaut partout (comme en maths), à
régler **au fil des chapitres**, dans le chantier de chacun, jamais en
lot hors contexte.

**1. La bonne réponse est toujours en A.** Dans tous les `03-cours-*.js`,
les QCM (`exos`, blocs `check`, étapes à choix des ateliers) ont
`bonne:0`, et l'affichage ne mélange pas les choix (`04-vue.js` affiche
`"ABCD".charAt(i)` dans l'ordre du fichier) : l'élève peut apprendre
« c'est toujours A ». Au 2026-09-18 : ch7 corrigé (2 en A, 3 en B, 2 en C,
3 en D) et ch11 corrigé (3 en A, 2 en B, 3 en C, 2 en D), et ch5 corrigé (3 en A, 4 en B, 4 en C, 3 en D), et ch1 corrigé (1 en A, 3 en B, 3 en C, 2 en D), et ch8 corrigé (1 en A, 2 en B, 2 en C, 2 en D), et ch12 corrigé (1 en A, 1 en B, 1 en C, 1 en D), et ch2 corrigé (1 en A, 2 en B, 2 en C, 2 en D) ; restent **tous les autres chapitres**, y compris ceux déjà
faits (ch3, ch4, ch6, ch9, ch10, ch13). Correction dans chaque chantier :
faire tourner `bonne` sur 0-3 de façon équilibrée, en permutant
**ensemble** `choix` et `diag` (ou `expl` pour un `check`), la chaîne
vide de `diag` suivant la bonne réponse. Vérification :
`grep -o 'bonne:[0-9]' <fichier> | sort | uniq -c`.

**2. Réponse texte trop courte qui accepte une mauvaise réponse.** Le
moteur accepte toute saisie qui **contient** une réponse attendue
(`04-vue.js`, `n.indexOf(A.norm(r))>=0`), sans ignorer les tirets. Une
réponse attendue incomplète comme « propanol » acceptait donc
« 2-propanol » ou « isopropanol », c'est-à-dire l'autre molécule. Au
2026-09-18 : ch11 et ch1 vérifiés (aucune question texte) ; ch12 vérifié le 2026-09-19 (aucune question texte) ; ch2 corrigé le 2026-09-19 (me5 : énoncé précisé « par étalonnage, à l'aide d'une mesure physique », « conductivité » et « conductimètre » acceptés, diagnostics pour spectro, chromatographie/CCM, colorimétrie, titrage, pesée, pH — « pas la conductimétrie » reste accepté, limite moteur ci-dessous) ; ch8 corrigé (vi8 : « soleil » avant « sol », diagnostics pour héliocentrique, géocentrique, rails, gare, quai ; « siège », « voiture », « rame », « TGV » acceptés) ; ch5 corrigé (co3 accepte « supérieur », « au-dessus » ; diagnostics pour « en dessous », « inférieur », et « dissolution » en co7) ; corrigé dans le ch7 (or2 : seul « butan-1-ol » est accepté,
« butanol » renvoie « il manque la position », les diagnostics les plus
précis sont testés en premier). Dans chaque chantier : relire les
`reps` de chaque question `txt` et se demander si une mauvaise réponse
peut **contenir** l'une d'elles.

**Limite du moteur, relevée au ch5 (co3)** : une saisie comme « pas en
haut » ou « en haut ou en bas » **contient** « en haut » et est donc
acceptée. Aucune liste de réponses ne peut l'empêcher : c'est la règle
d'inclusion de `04-vue.js` qu'il faudrait revoir (par exemple refuser une
saisie qui contient à la fois une réponse attendue et un diagnostic, ou
comparer mot à mot). Chantier moteur, à ne pas faire au détour d'un
chapitre.

**Moteur, filtre de `fabriquer()`** (`06-generateurs.js`), relevé le
2026-09-19 au chantier du ch12 : le dédoublonnage des distracteurs
compare deux diagnostics avec `e.tol`, la tolérance **absolue** de la
réponse. Quand la réponse est grande devant les distracteurs, il en
écarte de parfaitement distincts (au ch12, `on-frequence` perdait le
diagnostic « période convertie en secondes » à tous les tirages ; avec
v = 5000 m/s et f = 100 Hz, `on-lambda` donnait à l'élève qui tape la
période le message d'une autre erreur). Corrigé **localement** au ch12
(tables de tirages vérifiées, tolérance resserrée), pas dans le moteur.
Correction moteur à faire dans un chantier dédié : fenêtre relative
pour le dédoublonnage (ex. `Math.abs(d.v-u) <= Math.min(e.tol,
0.05*Math.max(Math.abs(d.v),Math.abs(u)))`), puis rejouer tous les
tirages de tous les générateurs pour vérifier qu'aucun diagnostic
conservé n'en masque un autre dans `fenetreDiag()`. En attendant,
rejouer les tirages des générateurs de chaque chapitre dans son chantier.

## Chapitre 7 (Organique) — point mineur reporté

Relevé le 2026-09-18 par `relecteur-physique` (2ᵉ relecture de
confirmation, verdict GO) : dans les générateurs, certaines **fenêtres de
diagnostic se touchent** sur une bande très étroite, sans qu'aucune
valeur de diagnostic exacte ne soit captée par une autre. Exemples :
`or-masse-molaire` méthane (13 et 12 se partagent [12,35 ; 12,6]),
butane (14 et 13 sur [13,30 ; 13,35]) ; `or-rendement`, 8 tirages sur
150 (M = 88 ou 100, n = 0,020), recouvrement inférieur à 0,03. Aucune
réponse plausible n'y tombe. Même piste que pour `fo-poids` (ch9) :
écarter un diagnostic dont la fenêtre touche celle d'un autre, dans le
filtre de `fabriquer()` — chantier moteur.

## Chapitre 4 (Lewis) — point reporté

Relevé le 2026-09-18 par `prof-pedagogue` : **le6 et le11 posent la
même question** (le tétrachlorométhane $CCl_4$ est-il polaire ?). Piste :
remplacer le11 par le trichlorométhane $CHCl_3$, tétraédrique mais
**polaire** (trois liaisons C–Cl et une C–H : les effets ne se
compensent plus) — seul cas du chapitre où la forme est régulière mais
la molécule quand même polaire. Touche au fond : à faire relire par
`relecteur-physique`, et garder l'id `le11` ou en prendre un nouveau
(`le15`) selon qu'on modifie ou remplace l'exercice.

## Chapitre 9 (Forces) — points mineurs reportés

**À harmoniser avec le ch8** (relevé le 2026-09-19 par `relecteur-physique`,
chantier du ch8) : le ch8 dit désormais « entre deux instants proches, la
somme des forces a **pratiquement** la direction de Δv ; exactement si elle
garde la même direction (chute libre) ». Le ch9 y est compatible (section s3 :
« relation approchée » ; section s4 : « exacte » en chute libre), sauf des
passages encore écrits comme exacts : l'idée de s3 (« il change dans la
direction et le sens de cette somme »), la méthode de s3 (« conclure que Δv a
la même direction »), l'encadré de s3 « même direction et même sens », et
quelques corrigés d'exercices (à repérer par recherche de « même direction »
et « direction de la somme »). À reprendre dans le chantier du ch9, pas au détour d'un
autre.

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

**Chapitre 4 (Lewis) — relevé le 2026-09-18 par `relecteur-physique`.**
Contenu du programme absent du chapitre : la **lacune électronique**
(cas de $H^+$), les **schémas de Lewis des ions** exigés par le
programme ($H_3O^+$, $NH_4^+$, $OH^-$, $Cl^-$, $Na^+$, $O^{2-}$…), et les
schémas de $N_2$, $O_2$, $H_2$ (la **triple liaison** de $N_2$ n'est
jamais montrée ; ces molécules n'apparaissent que dans un générateur).

**Statut (décision de l'utilisatrice, 2026-09-18) : contenu manquant,
chantier dédié.** À rédiger plus tard avec le circuit complet —
rédaction, relecture `relecteur-physique` (justesse) puis
`prof-pedagogue` (clarté), exercices et diagnostics vérifiés par
`outils/verifier-diags.mjs` —, jamais au détour d'un autre chantier.
Piste : une nouvelle section du ch4 (id `s8`, jamais utilisé).


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

Relevé le 2026-09-18 par `relecteur-physique` (relecture du ch7) : la
**spectroscopie infrarouge** (identifier une liaison ou un groupe
caractéristique à partir d'un spectre IR, bandes O–H, C=O…), au
programme de Première spécialité (« structure des entités
organiques »), n'est traitée nulle part, ni dans le ch7 ni ailleurs.

**Statut (décision de l'utilisatrice, 2026-09-18) : contenu manquant,
chantier dédié**, comme les couleurs, les champs et les ions de Lewis.
Circuit habituel (rédaction, `relecteur-physique` puis
`prof-pedagogue`, figures, exercices, `outils/verifier-diags.mjs`).
Piste : une nouvelle section du ch7 (id `s8`, jamais utilisé).

Relevé le 2026-09-18 par `relecteur-physique` (relecture du ch5), vérifié
par recherche dans tout `public/app/` : l'**équation de dissolution** d'un
solide ionique ($NaCl(s) → Na^+(aq) + Cl^-(aq)$, avec la stœchiométrie) et
le calcul de la **concentration des ions** en solution ; les notions
**hydrophile / lipophile / amphiphile** et l'action du **savon** (seulement
effleurée dans la correction de co11) ; l'**électrisation**. Programme cité
de mémoire par le relecteur.

**Statut (décision de l'utilisatrice, 2026-09-18) : contenu manquant,
chantier dédié**, comme l'infrarouge, les couleurs, les champs et les ions
de Lewis. Circuit habituel. Piste : nouvelles sections du ch5 (ids `s7`,
`s8`… jamais utilisés).

Relevé le 2026-09-19 par `relecteur-physique` (relecture du ch1), programme
cité de mémoire : la transformation **non totale** (avancement final $x_f$
comparé à l'avancement maximal $x_{max}$ — le ch1 suppose désormais
explicitement la transformation totale, sans traiter l'autre cas) ; la
quantité de matière d'un **liquide** à partir de sa masse volumique
($m = ρ V$) ; l'**oxydo-réduction** (couples oxydant/réducteur,
demi-équations, équation d'oxydo-réduction), absente de toute l'appli.

**Statut (décision de l'utilisatrice, 2026-09-19) : contenu manquant,
chantier dédié**, comme les précédents. Piste : nouvelles sections du ch1
(ids `s8`… jamais utilisés) ou nouveau chapitre pour l'oxydo-réduction.

Relevé le 2026-09-19 par `relecteur-physique` (relecture du ch8), programme
cité de mémoire : la **capacité numérique** (script Python qui représente les
vecteurs variation de vitesse à partir de positions successives) et la
**construction de Δv sur une vraie chronophotographie à l'échelle** (par
exemple 1 cm pour 1 m/s) — le ch8 ne construit Δv qu'à partir de vecteurs
donnés, et aucun exercice ne demande cette construction à l'échelle.

**Statut (décision de l'utilisatrice, 2026-09-19) : contenu manquant,
chantier dédié.** Piste : nouvelle section du ch8 (id `s8`, jamais utilisé).

Relevé le 2026-09-19 (chantier du ch2), **vérifié dans le texte officiel du
programme de Première** (annexe « Programme de physique-chimie de première
générale », education.gouv.fr, partie « Constitution et transformations de
la matière », 1.A) : deux capacités exigibles ne sont pas couvertes par le
ch2 — « **Expliquer ou prévoir la couleur d'une espèce en solution à partir
de son spectre UV-visible** » (le **spectre d'absorption** A(λ) n'apparaît
nulle part : ni figure, ni exercice) et « **Tester les limites d'utilisation
du protocole** » (le ch2 dit que la courbe s'incurve, sans le faire
constater). **Statut : contenu manquant, chantier dédié** (piste : nouvelle
section du ch2, id `s8`, jamais utilisé).

**Mesure et incertitudes — partie quantitative, chantier dédié** (décision
de l'utilisatrice, 2026-09-19). Le ch2 a reçu les images concrètes de la
précision (balance au gramme, règle au millimètre, verre doseur contre
seringue, touche « tare ») et un encadré qualitatif « Ce que veut dire
“précis” », sans formule. Reste, d'après le texte officiel du programme de
Première (partie « Mesure et incertitudes ») : variabilité de la mesure
(histogramme, moyenne, écart-type d'une série) ; **incertitude-type**,
définie qualitativement, évaluée par une approche statistique (type A) et
par une autre approche (type B, par exemple une mesure unique avec un
instrument dont les caractéristiques sont données) ; **écriture du
résultat** avec un nombre adapté de chiffres significatifs ; comparaison
**qualitative** à une valeur de référence. Le programme précise que le
critère quantitatif de comparaison et les incertitudes composées sont en
Terminale : à ne pas mettre. Partie transversale, sans chapitre imposé ;
le ch2 (verrerie jaugée, droite d'étalonnage) en est le lieu naturel.

## Chapitre 2 (Mesures) — conductimétrie : décision en attente

Relevé le 2026-09-19 par `relecteur-physique` (de mémoire), puis
**vérifié dans les textes officiels** : le programme de Première
(education.gouv.fr, « Programme de physique-chimie de première
générale ») ne contient **nulle part** les mots conductimétrie,
conductance ou conductivité ; sa partie 1.A cite « Absorbance, spectre
d'absorption, couleur d'une espèce en solution, loi de Beer-Lambert ».
Le programme de **Terminale** (« Programme de physique-chimie de
terminale générale ») porte « Conductance, conductivité ; loi de
Kohlrausch » et « Mesurer une conductance et tracer une courbe
d'étalonnage pour déterminer une concentration ». Le dosage par
étalonnage conductimétrique est donc au programme de Terminale.
Concernés dans le ch2 : la section s4 entière, la conductimétrie en s1
(liste, mot « Conductivité ») et en s7 (tableau), la description du
chapitre, les exercices me5, me6, me13. **Gardés pour l'instant** : la
décision de retirer une section entière revient à l'utilisatrice.

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
