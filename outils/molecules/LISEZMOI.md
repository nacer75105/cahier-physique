# Molécules en 3D (ch7, figure `molecule-3d`)

Les fichiers servis à l'appli sont dans `public/app/molecules/` (un `.mol` par
molécule). Ce dossier-ci garde ce qui sert à les **fabriquer** et à les
**vérifier** :

| Fichier | Rôle |
|---|---|
| `references.json` | métadonnées de chaque molécule (`source_type`, source, conformation) et longueurs, angles et dièdres de référence ; lu par la page de test et le futur balayage |
| `construire.py` | écrit les `.mol` construits (matrice Z) : `python outils/molecules/construire.py public/app/molecules` |
| `valider.py` | validation croisée contre B3LYP/6-31G* : `python outils/molecules/valider.py propan-1-ol` |
| `b3lyp/*.json` | géométries B3LYP/6-31G* du CCCBDB, relevées le 2026-10-10, pour la validation croisée (jamais affichées) |

## Règles

- **Format MOL V2000**, coordonnées en **ångströms** (1 Å = 100 pm), noms en
  minuscules sans accents (`acide-ethanoique.mol`).
- **Coordonnées sourcées, jamais de mémoire** : géométrie **expérimentale** du
  NIST CCCBDB (Computational Chemistry Comparison and Benchmark DataBase,
  Release 22), page « Experimental geometry » de la molécule.
- **Une conformation par molécule, celle d'énergie minimale**, documentée dans
  `references.json` (`meta.conformation`).
- Atomes nommés élément + rang dans le fichier (`C1`, `H2`…).

## Trois catégories (`meta.source_type`)

**`mesure_cartesienne`** : le CCCBDB donne les coordonnées, recopiées telles
quelles.
- méthane : https://cccbdb.nist.gov/expgeom2x.asp?casno=74828 (rCH 1,087 Å re,
  Hirota 1979 ; HCH 109,471°).
- éthanol : https://cccbdb.nist.gov/expgeom2x.asp?casno=64175 (Coussan et al.,
  *J. Phys. Chem. A* 102, 5789, 1998), conformère anti. Remarque : la liste des
  paramètres internes de la fiche attribue 1,088 et 1,098 Å à C1–H5 et C1–H6
  dans un ordre, son tableau cartésien dans l'autre ; on suit les coordonnées
  cartésiennes (C1–H5 = 1,098 Å, dans le plan).

**`mesure_parametres`** : le CCCBDB donne des longueurs et des angles mesurés,
les coordonnées sont construites par `construire.py` (matrice Z). Ce que la
mesure ne donne pas est un **complément**, écrit comme tel dans
`references.json` :
- éthanal (Hollenstein & Günthard 1971) : méthyle C3v (H–C–C déduit de
  H–C–H = 108,3°), un H du méthyle éclipse C=O.
- propanone (Kuchitsu 1998) : un H de chaque méthyle éclipse C=O (C2v).
- acide éthanoïque (Landolt-Börnstein II/7, 1976) : la fiche ne donne ni O–H
  ni C–O–H. **O–H = 97 pm** (valeur standard d'un COOH), recoupée par l'acide
  formique expérimental (97,2 pm, Herzberg 1966) ; **C–O–H = 106,3°**, celui de
  l'acide formique (même fiche). OH syn (O=C–O–H = 0°), un H du méthyle éclipse
  C=O, H–C–C du méthyle tétraédrique.
- butane (Kuchitsu 1998, diffraction d'électrons, distances **rg**) : anti,
  C–C–C–C = 180°, méthyles décalés. HCC = 111° (moyenne mesurée) pour les
  méthyles ; pour les CH2, H–C–H tétraédrique, car 111° partout donnerait
  H–C–H = 98°, impossible. Les distances rg (moyennes thermiques) sont un peu
  plus longues que les distances d'équilibre : C–H 111,7 pm.

Les conformations complétées ont été comparées à celles du B3LYP/6-31G* du
CCCBDB : mêmes dièdres (méthyles éclipsant C=O à 0°/120°/240°, contre
0°/121°/239° ; butane décalé à 60°/180°/300° des deux côtés).

**`transfert`** : aucune mesure de la molécule au CCCBDB ; paramètres mesurés
sur des molécules voisines.
- **propan-1-ol** : C–O 143,1, O–H 97,1, C–H et C–C lié à O 151,2 pm, C–C–O
  107,8° et C–O–H 105,4° de l'**éthanol** ; C–C 153,1 pm et C–C–C 113,8° du
  **butane** ; H–C–H et H–C–C tétraédriques. Conformère trans-trans (Cs).

## Validation croisée des transferts

Critère (décision du chantier, 2026-10-10) : **chaque liaison à moins de 2 pm**
et **chaque angle entre atomes lourds (C, O) à moins de 1,5°** de la géométrie
B3LYP/6-31G* du CCCBDB, **pour le même conformère**. Les angles qui font
intervenir un H sont consignés pour information, pas disqualifiants.
Étalonnage qui justifie ce critère : l'éthanol **mesuré** s'écarte lui-même de
son B3LYP de **3,4°** sur H–C–H et de **2,5°** sur C–O–H, mais de 0,02° sur
C–C–O : c'est l'écart normal entre mesure et calcul sur les hydrogènes.

| Molécule | Liaison, écart max | Angle entre lourds, écart max | Angle avec H, écart max (information) | Verdict |
|---|---|---|---|---|
| propan-1-ol | 1,76 pm (C–H) | 1,1° (C–C–C) | 2,9° (H–C–H), comme l'éthanol mesuré | accepté |
| propan-2-ol, conformère gauche | 1,82 pm | **3,3°** (O–C–C) | 3,7° | refusé → passé en `calcule` |

Le propan-2-ol échoue entre atomes lourds pour une raison de fond : dans son
conformère gauche, le seul que donne le CCCBDB, les deux angles C–C–O
diffèrent (111,1° et 106,2°), alors que le transfert leur donne à tous deux le
107,8° de l'éthanol anti. Aucun paramètre mesuré ne transfère cette asymétrie.

**`calcule`** : géométrie calculée (B3LYP/6-31G* du CCCBDB), pas mesurée,
étiquetée comme telle dans la figure.
- **propan-2-ol** : conformère gauche (C1), le minimum donné par le CCCBDB.
  **Calculé et non transféré parce que le transfert symétrique ne rend pas
  l'asymétrie C–C–O du conformère gauche** (111,1° et 106,2°, quand le
  transfert met 107,8° des deux côtés) ; le calcul, lui, la rend.
