# Solubilités du ch5 (section s9, valeurs de la caféine en s4, exercices co25 à co27)

Toute solubilité affichée au ch5 vient des fichiers de `donnees/`, téléchargés
le 2026-10-14. `valeurs.py` recalcule chaque valeur et la recoupe avec une deuxième
source (code 1 si un recoupement sort de sa tolérance) :

```sh
python -I -X utf8 outils/solubilites/valeurs.py
node outils/balayage-solubilite.mjs     # chaque nombre affiché = l'arrondi de la valeur recalculée
```

Unité affichée : **g pour 100 g de solvant**, celle des tables de mesures (le
solvant est pesé). Passer en g/L exigerait la masse volumique de chaque mélange.

## Chlorure de potassium dans l'eau + éthanol, 25 °C (s9, co25, co26)

| Fichier | Source |
|---|---|
| `pinho-2005.xml` | **valeurs affichées** — S. P. Pinho, E. A. Macedo, *J. Chem. Eng. Data* 50 (2005) 29-32, doi:10.1021/je049922y. Jeu ThermoML du NIST : https://trc.nist.gov/ThermoML/10.1021/je049922y.xml |
| `galleguillos-2003.xml` | recoupement — H. R. Galleguillos *et al.*, *J. Chem. Eng. Data* 48 (2003) 405-410, doi:10.1021/je020173z |
| `farelo-2004.xml` | recoupement — F. Farelo *et al.*, *J. Chem. Eng. Data* 49 (2004) 1782-1788, doi:10.1021/je049782s |
| `pubchem_4873_Solubility.json` | recoupement — HSDB via PubChem : 35,5 g/100 g d'eau à 25 °C |

Pinho donne la fraction massique de KCl dans la solution saturée, en fonction
de la fraction massique d'eau dans le solvant sans sel : g/100 g = 100 w/(1 − w).

Recoupements (valeur affichée → autre source) :
- eau pure : 36,0 → Galleguillos 36,4, HSDB 35,5 ;
- 10 % d'éthanol : 27,2 → Farelo 27,1. **Attention** : le fichier ThermoML de
  Farelo étiquette la composition « fraction molaire » ; l'article porte « jusqu'à
  20 % en masse », et lue en masse elle retombe sur Pinho à 0,4 % près (lue en
  fraction molaire, l'écart serait de 45 %). Elle est donc lue en masse ;
- 30 % : 14,3 → Galleguillos 14,4 ;
- 50, 70, 90 % : Galleguillos est plus bas de 16, 18 et 37 % (6,6 → 5,5 ;
  1,9 → 1,6 ; 0,16 → 0,10). Galleguillos donne la fraction d'éthanol **dans la
  solution saturée** ; elle est ramenée au solvant seul (w_éthanol / (1 − w_KCl))
  avant comparaison. Ce que le cours affirme tient avec les deux séries : baisse
  continue, et « plus de deux cents fois moins » à 90 % (225 et 360 fois).
- **Éthanol pur non affiché** : Pinho donne 0,034 g/100 g, HSDB « 1 g dans
  environ 250 mL d'alcool », quinze fois plus (alcool à 95 % probablement). Le
  tableau s'arrête à 90 %, où les sources concordent sur l'ordre de grandeur.

## Caféine, 25 °C (s4, co27)

| Fichier | Source |
|---|---|
| `shalmashi-2010-tableau1.png`, `-page.html`, `.csv` | **valeurs affichées** — A. Shalmashi, F. Golmohammad, *Latin American Applied Research* 40 (2010) 283-285, tableau 1 (fraction molaire à 298 K). Page SciELO : http://www.scielo.org.ar/scielo.php?script=sci_arttext&pid=S0327-07932010000300012 ; le tableau est une image, transcrite à la main dans le `.csv` (ligne 298 K seulement) |
| `zhong-2017.xml` | recoupement — Zhong *et al.*, *J. Chem. Eng. Data* 62 (2017) 2570-2577, doi:10.1021/acs.jced.7b00065 (eau, éthanol, acétone) |
| `pubchem_2519_Solubility.json` | recoupement — HSDB / Merck Index via PubChem : 21,6 g/L d'eau ; « 1 g dissolves in 46 mL water, 66 mL alcohol, 50 mL acetone, 5.5 mL chloroform » |
| `chemcollective-partition.html` | recoupement (source pédagogique) — ChemCollective, Université de Colombie-Britannique : 2,18 g/100 mL d'eau, 18,2 g/100 mL de dichlorométhane à 25 °C |

Conversion : g/100 g = 100 x M_caféine / ((1 − x) M_solvant).

Recoupements : eau 2,27 → Merck 2,18, HSDB 2,17, Zhong 1,74 ; chloroforme
11,7 → Merck 12,3 ; dichlorométhane 8,8 → ChemCollective 13,7 (seule deuxième
source trouvée ; le cours dit « près de quatre fois plus, une autre source
trouve même huit fois ») ; éthanol 0,72 → Zhong 0,56, Merck 1,9 ; acétone 1,5 →
Zhong 1,2, Merck 2,5. Les valeurs se dispersent, l'**ordre** jamais : le
dichlorométhane et le chloroforme dissolvent plusieurs fois plus de caféine que
l'eau, l'éthanol moins (trois sources), et l'acétone est miscible. C'est tout ce
que le cours et les exercices utilisent.

**Écarté** : l'acétate d'éthyle (dissout moins de caféine que l'eau d'après
deux sources) — l'industrie l'emploie pour décaféiner (extraction solide-liquide
sur les grains), un exercice qui le déclarerait inutile enseignerait un contresens.
**Écarté** : le diiode dans le cyclohexane — aucune source primaire trouvée ; les
sources secondaires divergent (2,7 g pour 100 g, 28 g/L).

## Solvants : densité, miscibilité, dangers (PubChem)

`pubchem_<cid>_{Density,Solubility,GHS}.json` : dichlorométhane (6344 : d = 1,33,
1,3 g/100 mL d'eau, H351), chloroforme (6212 : d = 1,48, H351, H361d, H372),
acétone (180 : d = 0,79, miscible), éthanol (702 : d = 0,79, miscible).
`valeurs.py` vérifie que chaque densité et chaque miscibilité affichée s'y trouve.
