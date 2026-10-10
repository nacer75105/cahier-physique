# Spectres infrarouges réels (ch7, section 8)

`public/app/02-spectres-ir.js` est **fabriqué** par `fabriquer.py` à partir des
fichiers de `jcamp/`, jamais édité à la main :

```sh
python outils/spectres-ir/fabriquer.py public/app/02-spectres-ir.js
```

## Source

Spectres de la **Coblentz Society**, distribués par le **NIST Chemistry
WebBook** (base de référence SRD 69, https://webbook.nist.gov/chemistry/),
téléchargés le 2026-10-10 au format JCAMP-DX
(`https://webbook.nist.gov/cgi/cbook.cgi?JCAMP=<CAS>&Index=<n>&Type=IR`).
Le numéro Coblentz de chacun est dans son en-tête (`##SOURCE REFERENCE`) et
s'affiche sous chaque figure.

| Fichier | Espèce | État | Coblentz n° |
|---|---|---|---|
| C64175-3 | éthanol | solution 10 % (CCl4 / CS2) | 10139 |
| C75070-2 | éthanal | solution 10 % (CCl4 / CS2) | 5645 |
| C78933-2 | butanone | solution 10 % (CCl4 / CS2) | 4788 |
| C64197-2 | acide éthanoïque | solution 10 % (CCl4 / CS2) | 4819 |
| C71363-2 | butan-1-ol | liquide pur | 6915 |
| C71363-3 | butan-1-ol | solution 0,5 % (CCl4 / CS2) | 10142 |
| C67630-3 | propan-2-ol | solution 10 % (CCl4 / CS2) | 10141 |
| C67641-3 | propanone | solution 10 % (CCl4 / CS2) | 6189 |
| C107926-1 | acide butanoïque | solution 10 % (CCl4 / CS2) | 4820 |
| C71238-3 | propan-1-ol | solution 10 % (CCl4 / CS2) | 10140 |
| C111717-0 | heptanal | solution 10 % (CCl4 / CS2) | 5731 |

**Toujours en phase condensée**, comme les spectres des manuels et des
sujets : en phase gazeuse, la bande O–H d'un alcool est fine (vers
3670 cm-1 pour l'éthanol gazeux, fichier NIST C64175-0) ; ce sont les liaisons
hydrogène du liquide qui l'élargissent. CCl4 est le solvant au-dessus de
~1330 cm-1, CS2 en dessous (chacun est transparent là où l'autre absorbe).

## Ce que fait `fabriquer.py`

Rééchantillonnage tous les 5 cm-1, de 3800 cm-1 (ou du début des mesures)
jusqu'à 600 cm-1 : moyenne des points mesurés à ±2,5 cm-1. Transmittance en
pour mille, bornée à 0-1000 (quelques points numérisés dépassaient 100 % de
quelques pour mille). Les bandes gardent leur place à 5 cm-1 près ; la
figure ne trace que ces points.

## Ce qui le vérifie

`outils/balayage-ir-domaines.mjs` : chaque point de la courbe affichée est la
mesure ; chaque repère tombe dans la plage de la table du cours (LibreTexts,
« Infrared Spectroscopy Absorption Table ») et au creux d'une vraie bande.
