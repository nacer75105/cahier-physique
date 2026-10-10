# Molécules en 3D (ch7, figure `molecule-3d`)

Les fichiers servis à l'appli sont dans `public/app/molecules/` (un `.mol` par
molécule) ; ce dossier-ci garde ce qui sert à les **vérifier** :
`references.json`, les longueurs et angles mesurés que le balayage compare à
ce que la figure affiche.

## Règles

- **Format MOL V2000**, coordonnées en **ångströms** (1 Å = 100 pm), un fichier
  par molécule, nommé par la clé de `references.json` (`methane.mol`…).
- **Coordonnées sourcées, jamais de mémoire** : géométrie **expérimentale** du
  NIST CCCBDB (Computational Chemistry Comparison and Benchmark DataBase),
  page « Experimental geometry » de la molécule, ligne mesurée (pas une valeur
  calculée). L'URL exacte et la référence bibliographique de chaque valeur
  sont dans `references.json` et dans la ligne de commentaire du `.mol`.
- **Une conformation par molécule, celle d'énergie minimale**, documentée dans
  `references.json` (pour le butane, par exemple : anti, chaîne en zigzag).
- Le nom des atomes est l'élément suivi de son rang dans le fichier : `C1`,
  `H2`… C'est ainsi que `references.json` désigne les liaisons et les angles.

## Méthane

Fiche CCCBDB : https://cccbdb.nist.gov/expgeom2x.asp?casno=74828
(consultée le 2026-10-10). rCH = 1,087 Å (structure d'équilibre re, E. Hirota,
*J. Mol. Spectrosc.* 77, 213, 1979) ; HCH = 109,471° (Sverdlov, Kovner,
Krainov, 1974). Les coordonnées cartésiennes du fichier sont celles de la
fiche (±0,6276 Å) : elles redonnent rCH = 1,0870 Å et HCH = 109,47°.
