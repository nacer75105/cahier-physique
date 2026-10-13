# Spectres d'absorption UV-visible réels (ch2, section 2)

`public/app/02-spectres-uv.js` est **fabriqué** par `fabriquer.py` à partir des
fichiers de `donnees/`, jamais édité à la main :

```sh
python outils/spectres-uv/fabriquer.py public/app/02-spectres-uv.js
```

## Sources (téléchargées le 2026-10-13)

| Fichier | Espèce | Solvant | Mesure | Maximum (visible) |
|---|---|---|---|---|
| `mb-water.txt` (extrait de `mb-water.html`) | bleu de méthylène | eau | S. Prahl, OMLC, spectrophotomètre HP, solution 10 µM, cuve de quartz de 1 cm — https://omlc.org/spectra/mb/mb-water.html | 664 nm |
| `009-abs.txt` (page `009-page.html`) | rhodamine B | éthanol | R.-C. A. Fuh, Cary 3, base PhotochemCAD 2.1a — https://omlc.org/spectra/PhotochemCAD/html/009.html | 542 nm |
| `078-abs.txt` (page `078-page.html`) | proflavine | eau, pH 7 | R.-C. A. Fuh (1995), Cary 3, base PhotochemCAD 2.1a, ε calé sur 38 900 L·mol⁻¹·cm⁻¹ à 444,8 nm (Albert, 1965) — https://omlc.org/spectra/PhotochemCAD/html/078.html | 444 nm |
| `030-abs.txt` (page `030-page.html`) | vert de malachite | eau | idem, PhotochemCAD — **non utilisé**, voir plus bas | 617 nm |

PhotochemCAD : H. Du, R.-C. A. Fuh, J. Li, L. A. Corkan, J. S. Lindsey,
*Photochem. Photobiol.* 68, 141-142 (1998) ; J. M. Dixon, M. Taniguchi,
J. S. Lindsey, *Photochem. Photobiol.* 81, 212-213 (2005). Fichiers texte
diffusés par S. Prahl (Oregon Medical Laser Center), 2017.

## Espèces écartées, et pourquoi

- **Riboflavine** (éthanol, PhotochemCAD 004) : au-delà de 500 nm, la courbe
  reste plate autour de 55 % du maximum au lieu de retomber à zéro — une ligne
  de base défectueuse ; la solution jaune paraîtrait absorber tout le visible.
- **Cristal violet** (eau, PhotochemCAD 048) : la note de calibration cite
  112 000 L·mol⁻¹·cm⁻¹ « à 509,5 nm », alors que le maximum mesuré est vers
  590 nm ; provenance incohérente.
- **Vert de malachite** (eau, PhotochemCAD 030) : deux bandes (617 nm et une
  plus faible vers 425 nm) ; la couleur perçue ne sort pas proprement du
  modèle à trois composantes du ch17. Fichier gardé pour mémoire.

## Ce que fait `fabriquer.py`

Tous les 2 nm de 380 à 700 nm (les mesures de la rhodamine B s'arrêtent à
700 nm) : moyenne des points mesurés à ±1 nm, ou interpolation linéaire entre
les deux mesures voisines quand il y en a moins de deux (bleu de méthylène,
mesuré tous les 2 nm). Absorbance rapportée à sa valeur au maximum du
visible, en pour mille. La figure la multiplie par l'absorbance maximale
choisie au curseur : la forme du spectre ne dépend pas de la concentration,
seule sa hauteur en dépend (loi de Beer-Lambert).

## Ce qui le vérifie

`outils/balayage-spectre.mjs` : chaque point de la courbe affichée est la
donnée multipliée par l'absorbance maximale ; le repère λmax est au maximum
des données ; les trois transmissions (bleu, vert, rouge) et la couleur de la
pastille sont recalculées.
