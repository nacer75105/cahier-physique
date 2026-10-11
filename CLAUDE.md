# Cahier de Physique-Chimie — Première générale

Application de cours de physique-chimie (programme de Première),
avec figures manipulables, exercices corrigés et suivi de
progression stocké côté élève (`localStorage`, doublé côté serveur
si l'appli tourne avec la couche IA). Contenu dans
`public/app/03-cours-*.js` (un fichier par groupe de chapitres),
moteur de figures dans `public/app/02-figures.js`, état et rendu
dans `public/app/01-noyau.js` et `public/app/04-vue.js`.

`docs/` est une copie générée de `public/` (voir `build-pages.js`,
`npm run pages`) pour la version hors ligne sur GitHub Pages :
ne jamais éditer `docs/` à la main, toujours régénérer.

## Règle impérative : id de section, jamais de position

**Chaque section de cours porte un `id` stable et arbitraire**
(`id:"s1"`, `"s2"`, ...), assigné une fois pour toutes dans l'ordre
où la section a été créée. Exemple :

```js
{id:"s3", titre:"Compter les entités : la mole", blocs:[ ... ]}
```

**Pourquoi.** Le suivi de progression (`S.chap[id].lu` dans
`public/app/01-noyau.js`, coché via le bouton « Marquer comme
comprise » dans `sectionNode()`, `public/app/04-vue.js`) identifie
une section par son `id`, jamais par sa position dans le tableau
`sections:[...]`. Avant le 2026-09-16, il n'existait aucun `id` : la
progression se basait sur l'**index de position**. Insérer une
section n'importe où décalait silencieusement la progression déjà
cochée de toutes les sections suivantes — un bug de fond, découvert
après coup sur les chapitres Titrage (ch. 3) et Cristaux (ch. 6), qui
ont dû être réinitialisés faute de pouvoir reconstruire ce qui avait
réellement été lu avant l'insertion.

**Ce qu'il faut faire pour toute nouvelle section, dans n'importe quel
chapitre :**
- Lui donner un `id` **jamais utilisé auparavant dans ce chapitre**,
  qu'elle soit insérée en dernier, au milieu, ou en tout début. Le
  numéro suivant le plus haut déjà attribué dans le chapitre convient
  (`grep 'id:"s' <fichier>` pour vérifier avant de choisir).
- **Ne jamais renuméroter** les sections existantes pour « garder
  l'ordre propre ». Le numéro n'a pas à correspondre à la position :
  c'est justement ce qui le rend stable.
- **Ne jamais réutiliser** l'id d'une section supprimée.
- L'id est **indépendant du titre** : reformuler un titre ne doit
  jamais entraîner de changer son id.

Ce principe est déjà appliqué aux exercices (`id:"ti1"`, `"ti2"`...
dans `exos:[...]`) depuis l'origine — c'est pour ça qu'ils n'ont
jamais eu ce problème. Les sections l'ont maintenant aussi.

Avant de committer un chapitre modifié, vérifier qu'aucune section
n'a été oubliée :
```sh
node -e 'const fs=require("fs"),d=process.argv[1]||"public/app";let ko=0;for(const f of fs.readdirSync(d).filter(x=>/^03-cours-.*\.js$/.test(x))){const s=fs.readFileSync(d+"/"+f,"utf8"),c=[...s.matchAll(/id:"([a-z-]+)", n:(\d+)/g)];c.forEach((m,k)=>{const p=s.slice(m.index,k+1<c.length?c[k+1].index:s.length),ids=[...p.matchAll(/\{id:"(s\d+)"/g)].map(x=>x[1]),nb=(p.match(/blocs:\[/g)||[]).length,dbl=ids.filter((x,j)=>ids.indexOf(x)!==j);if(dbl.length||nb!==ids.length)ko=1;console.log("ch"+m[2]+" "+m[1]+" : "+nb+" sections, "+ids.length+" id"+(dbl.length?" — DOUBLON "+dbl.join(", "):"")+(nb!==ids.length?" — SECTION SANS ID":""))})}process.exit(ko)'
```

Elle vérifie **chapitre par chapitre** (un fichier `03-cours-*.js` en
contient souvent plusieurs, chacun avec ses `s1`, `s2`… : les mêmes id
dans deux chapitres ne sont pas un doublon), signale toute section sans
`id` et tout doublon au sein d'un chapitre, et sort en code `1` dans ces
deux cas. L'ancienne version (`grep … | sort | uniq -d` sur le fichier
entier) criait au doublon dès qu'un fichier portait deux chapitres —
une vérification qui se trompe finit ignorée.

## Autres rappels

- Après un chantier de contenu, lancer l'agent `relecteur-physique`
  sur le(s) chapitre(s) modifié(s) avant tout commit. Il est défini
  dans `.claude/agents/` et n'est chargé que si Claude Code est lancé
  **depuis ce dossier** (`cahier-physique/`) : une session ouverte
  dans le dossier parent ne le voit pas.
- Le périmètre du programme se lit dans le texte officiel versionné,
  `.claude/referentiels/physique-1re-spe/` (BO spécial n° 1 du
  22 janvier 2019, voir `SOURCES.md`), jamais de mémoire ; les
  rappels de Seconde se vérifient de même contre
  `.claude/referentiels/physique-seconde/`. Ce qui est
  présent mais hors programme porte `hp` ou `hpPartiel` (voir
  `tagHP()` dans `public/app/04-vue.js`).
- Régénérer `docs/` (`npm run pages`) avant de committer si
  `public/` a changé.
- `A_VERIFIER.md` (racine) consigne les bugs identifiés mais reportés
  volontairement à un chantier ultérieur — le consulter et le
  compléter plutôt que de corriger un bug isolément hors contexte.

## Diagnostics numériques : deux scripts d'audit, à lancer tous les deux

```sh
node outils/verifier-diags.mjs         # questions écrites dans 03-cours-*.js
node outils/verifier-generateurs.mjs   # générateurs de 06-generateurs.js
```

Ils ne se recouvrent pas. `verifier-diags` refait chaque calcul erroné
des questions **écrites en dur** ; `verifier-generateurs` rejoue 3 000
tirages par générateur, parce qu'un générateur calcule ses distracteurs
au hasard et qu'un défaut peut n'apparaître qu'une fois sur mille —
`verifier-diags` ne voit rien de ce code. Tous deux acceptent un ou
plusieurs identifiants en argument pour se limiter (`… titrage`,
`… fo-poids`) et sortent en code `1` si un défaut est trouvé.

**Les lancer après toute modification d'un générateur ou du moteur de
diagnostics** — `fabriquer()` dans `06-generateurs.js`, `fenetreDiag()`
dans `01-noyau.js`, `diagnostic()` dans `04-vue.js`.

`fenetreDiag()` (`01-noyau.js`, exposée par `window.APP`) est la
**définition unique** de « à quelle distance d'un distracteur faut-il
tomber pour recevoir son message ». `04-vue.js` et `06-generateurs.js`
l'appellent ; les deux scripts d'audit l'**extraient** du fichier et
s'arrêtent si l'extraction échoue. Ne jamais en recopier une version
locale : elle a vécu en trois copies, elles ont divergé, et le filtre
de `fabriquer()` écartait alors des diagnostics justes.

Même règle pour `diagnostic()` (`04-vue.js`) : les deux scripts
l'**extraient** du fichier (arrêt en code `2` si l'extraction échoue),
ils n'en recopient jamais les seuils ni les messages. Si l'extraction
casse, corriger l'extraction — pas recopier la règle.

Ce que les audits contrôlent, par défaut compté dans le code de sortie :
- **MORT / MASQUÉ / FAUX / FENÊTRE** : les fenêtres des distracteurs
  de `exo.diag`, à leur valeur exacte.
- **GÉNÉRIQUE** (les deux scripts) : les messages « mauvais signe »,
  « double », « moitié » de `diagnostic()`. −r, 2r et r/2 arrondis ou
  tronqués de 1 à 4 chiffres, qui auraient été acceptés au signe ou au
  facteur 2 près, doivent recevoir leur message ; r × 10ⁿ (n de −3 à 3)
  ne doit jamais le recevoir.
- **ARRONDI** (`verifier-generateurs`) : chaque distracteur conservé,
  arrondi ou tronqué à **2 ou 3** chiffres — ce que l'élève tape
  vraiment —, doit garder son propre message, et la bonne réponse
  arrondie ne doit capter aucun distracteur. À **1 chiffre**, c'est
  affiché pour information seulement (`--tout`), jamais compté : deux
  erreurs à moins d'un facteur 2 s'y confondent forcément.
- **LECTURE** (les deux scripts) : la bonne réponse et chaque
  diagnostic, tapés comme l'élève les tape (décimal, arrondis à 1-4
  chiffres, `1,41×10^5`, `1,41x10^5`, `1,41.10^5`, `1,5.10-2`, `1,41e5`…),
  doivent être lus à leur valeur par `parseNum()` — **extraite** de
  `01-noyau.js` par `outils/lecture-saisies.mjs`, jamais recopiée.

- **AFFICHAGE** (`verifier-generateurs`) : sur chaque tirage, ce que le
  corrigé affiche de la réponse (nombres à moins de 2 % de `rep`, hors
  données de l'énoncé) doit contenir au moins une valeur **acceptée** par la
  tolérance, et chaque valeur affichée doit être la réponse exacte ou son
  **arrondi correct** (demi vers le haut) au nombre de chiffres affichés ;
  deux affichages au même nombre de chiffres ne divergent jamais
  (`outils/affichage-corriges.mjs`). Ajouté le 2026-10-09 : au ch16, des
  corrigés affichaient des valeurs incohérentes, invisibles des audits. Il
  ne vérifie pas les étapes intermédiaires d'un corrigé : la dernière ligne
  se calcule toujours d'un seul coup depuis les données.

- **QCM** (`verifier-generateurs`) : les générateurs de QCM (`type:"qcm"`)
  sont rejoués comme les autres. Sur chaque tirage : 4 choix distincts,
  diagnostic vide sur la bonne réponse et non vide ailleurs, **bonne réponse
  recalculée par une règle indépendante** qui relit l'énoncé, et chaque message
  vrai pour le choix qu'il commente ; sur l'ensemble, chaque position reçoit la
  bonne réponse au moins 15 % du temps (`outils/qcm-generateurs.mjs`). **Un
  nouveau générateur de QCM doit apporter sa règle dans ce fichier** : sans
  elle, il est compté NON COUVERT. Ajouté le 2026-10-09 : les QCM du ch17
  n'étaient vérifiés que par un script hors dépôt.

## Balayage des figures : règle des calculs affichés (permanente)

**Chaque nombre affiché par une figure doit se recalculer à partir des autres
nombres affichés.** Une ligne de lecture « 9,4 − 2 × 0,43 = 8,55 » (résultat
tiré du courant exact, opérandes arrondies) montre à l'élève un calcul qui ne
tombe pas juste : c'est l'analogue, pour les figures, de la règle des corrigés
(dernière ligne calculée depuis ce qui est affiché). `outils/calculs-affiches.mjs`
(`calculsFaux(texte)`) refait chaque calcul écrit avec les nombres tels
qu'affichés ; **tout balayage de figure, existant ou à venir, doit l'appliquer
à la lecture, à la note et aux libellés**, et vérifier les sommes affichées
(une barre partagée en U + rI doit redonner E affiché). Ajouté le 2026-10-10
(chantier source réelle) : le balayage vérifiait longueurs et positions, jamais
l'arithmétique affichée, et 19 états sur 33 étaient faux. Branché sur
`balayage-source-reelle`, `balayage-combustions` et `balayage-couleurs`.

`outils/balayage-source-reelle.mjs` : la figure `source-reelle` du ch10
(3 sources × 11 résistances branchées) et la figure fixe de la caractéristique.

`outils/balayage-lewis.mjs` : la figure `lewis-pas-a-pas` du ch4 (16 entités ×
6 étapes). Comptage des électrons recalculé, schémas finaux comparés à une
table écrite dans le balayage, présence des 15 entités du programme, et **sens
des messages** (jamais H comme atome central, pas d'atome central entre deux
atomes, « chaque voisin » pour CO₂, accords, octet ou duet, Na⁺ et H⁺) : la
première version vérifiait les nombres, pas les phrases, et quatre messages
faux étaient passés à travers.

`outils/balayage-dissolution.mjs` : les figures `solvatation` (2 ions × 2
orientations) et `savon` (5 étapes) du ch5. Recalcule depuis le dessin l'atome
qui fait face à l'ion (O pour un cation, un seul H aligné pour un anion),
l'angle H–O–H, la place des δ, le milieu où tombent têtes et queues (eau, air,
graisse), les carbones de la queue contre la formule affichée ; et le sens des
messages (atome nommé = atome dessiné, « ne tient pas » quand les molécules
sont retournées, des **ions** stéarate et non des molécules, « micelle »
présenté comme nom usuel).

`outils/balayage-geometrie.mjs` : la figure 3D `molecule-3d` du ch7 (huit
molécules, Chrome lancé avec un rendu WebGL logiciel). Coordonnées chargées =
fichier `.mol`, chaque valeur de `outils/molecules/references.json` retrouvée
dans les coordonnées, `source_type` et note d'origine, angles cités, rotation,
vrais clics, refus des faux angles et du double clic, étiquettes. Les
géométries ne s'écrivent jamais de mémoire : `outils/molecules/construire.py`
les fabrique depuis les paramètres CCCBDB, `valider.py` recoupe un transfert
contre B3LYP (critère : liaisons < 2 pm, angles entre atomes lourds < 1,5°).

`outils/balayage-ir-domaines.mjs` : les spectres infrarouges du ch7 (`spectre-ir`,
`spectre-oh` et les spectres des exercices) et l'échelle `domaines-em` du ch13.
Chaque point de courbe doit être la mesure, chaque repère tomber dans la plage
de la table du cours et au creux d'une vraie bande ; λ et f affichés sont
recalculés depuis les sources. Les spectres ne se dessinent jamais à la main :
ils sont fabriqués par `outils/spectres-ir/fabriquer.py` à partir des fichiers
JCAMP du NIST versionnés (voir son LISEZMOI).

## Balayage des figures (couleurs, combustions)

`outils/balayage-combustions.mjs` fait de même pour le ch18 : les 30 états de
la figure `combustion` (coefficients et atomes recalculés) et les 4 états de
`bilan-liaisons`, dont les hauteurs **affichées** des barres doivent être
proportionnelles aux énergies recalculées, à 1 px près. À lancer après toute
modification de ces figures ou du ch18.

### Couleurs

```sh
node outils/balayage-couleurs.mjs        # Chrome requis (variable CHROME sinon)
```

Il sert lui-même `public/`, ouvre Chrome headless, parcourt tous les états des
figures `additive`, `objet` et `filtres` et le cercle à six cases du ch17, et
compare le **pixel réellement affiché** au centre de chaque zone à une couleur
recalculée indépendamment. Il contrôle aussi la mise en page et la cohérence
dessin / lecture / note. Code de sortie 1 au moindre défaut. **À lancer après
toute modification des figures de couleurs** (fin de `02-figures.js`) ou du
ch17. `--racine=<copie>` le fait tourner sur une copie (pour vérifier qu'il
mord), `--captures=<dossier>` garde quelques captures.

Jusqu'au 2026-10-08, `parseNum()` lisait comme une puissance de dix tout
nombre contenant « 10 » (« 3100 » → 3, « 100 » → 1, « 105 » → 10⁵) et
refusait des bonnes réponses ; les audits ne le voyaient pas, ils ne
passaient que des nombres, jamais du texte. Une puissance de dix exige
désormais un signe explicite (×, x, *, ·, ^, ou un exposant négatif écrit
après un point). Lancer les deux audits après toute modification de
`parseNum()`.

Avant le 2026-09-23, les audits ne testaient que les valeurs exactes de
`exo.diag` : ils étaient aveugles aux messages génériques et aux
arrondis, et deux défauts ont dormi faute d'être mesurés (voir
`A_VERIFIER.md`, « Moteur — défauts de `diagnostic()` »).

**Ordre imposé quand on ajoute un contrôle d'audit** : corriger d'abord
les générateurs ou questions qu'il signalerait, **puis** activer son
comptage dans le code de sortie — sinon l'audit échoue dès son ajout et
masque toute autre régression. Et vérifier qu'il mord : sur une copie,
réintroduire l'ancien défaut doit le faire sortir en code `1`.
