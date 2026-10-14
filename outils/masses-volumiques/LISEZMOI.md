# Masses volumiques : sources

Les masses volumiques citées dans le cahier (ch1, ch6, générateurs) ne
s'écrivent pas de mémoire : chacune est relue dans un fichier source versionné
dans `donnees/` par `verifier.py`, qui vérifie aussi que le cours affiche bien
la valeur annoncée.

```sh
python outils/masses-volumiques/verifier.py   # code 1 au moindre écart
```

Fichiers PubChem : `pug_view` JSON, rubrique « Density »
(`https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/<CID>/JSON?heading=Density`),
récupérés le 2026-10-14. Les extraits HSDB, ICSC, NIOSH et USCG y sont cités
avec leur référence.

## Liquides (ch1, générateur `tr-mole-liquide`)

| Liquide | Cahier | Source | Extrait |
|---|---|---|---|
| éthanol | 0,789 g/mL vers 20 °C | PubChem 702 (`../solubilites/donnees/`) | « 0.7893 g/cu cm at 20 °C » |
| cyclohexane | 0,779 g/mL | PubChem 8078 | « 0.779 at 68 °F », « 0.7781 at 20 °C/4 °C » |
| dichlorométhane | 1,33 g/mL vers 20 °C | PubChem 6344 (`../solubilites/donnees/`) | « 1.3266 @ 20°C », « 1.3255 20 °C/4 °C » |
| glycérol | 1,26 g/mL | PubChem 753 | « 1.2613 g/cu cm at 20 °C » |
| ammoniaque à 28 % | 0,90 g/mL | PubChem 14923 | « About 0.90 @ 25 °C/25 °C » |
| eau sucrée à 50 g/L | ≈ 1,02 g/mL | NBS Circular 457 (1946), table 1, p. 3 | à 20 °C, 4,9 °Brix : 1,01746 g/mL et 4,986 g de sucre pour 100 mL |

## Métaux (ch6, générateur `cr-masse-volumique`)

| Métal | Cahier | Source | Extrait |
|---|---|---|---|
| aluminium | 2,70 g/cm³ ; 2700 kg/m³ | PubChem 5359268 | « 2.70 », « 2.7 g/cm³ » |
| cuivre | 8960 kg/m³ | PubChem 23978 | « 8.96 @25 °C » (NIOSH donne 8.94) |
| nickel | 8910 kg/m³ | PubChem 935 | « 8.908 (NTP, 1992) » |
| argent | 10 500 kg/m³ | PubChem 23954 | « 10.5 @25 °C », « 10.49 @ 15 °C » |
| or | 19 300 kg/m³ | PubChem 23985 | « 19.3 @25 °C » |

## Dettes (consignées dans `A_VERIFIER.md`)

- **Acide chlorhydrique à 37 %, 1,18 g/mL (ch1)** : aucune source de
  référence ouverte trouvée. PubChem 313 (`donnees/pubchem_313_Density.json`)
  ne donne que le gaz et une solution à 10 %. La valeur concorde avec les
  fiches produit des fournisseurs (Merck / Sigma-Aldrich, 1,18 g/mL à
  20 °C), et le relecteur l'a recoupée (37 % × 1180 g/L / 36,5 g/mol ≈
  12 mol/L, concentration usuelle de l'acide concentré). À sourcer.
- **Ammoniaque** : la source dit « about 0.90 » à 25 °C, le cours dit « vers
  20 °C ». L'écart entre les deux températures est bien inférieur au dernier
  chiffre affiché.
- **Cyclohexane, 0,779 g/mL** : les deux extraits PubChem diffèrent au
  troisième chiffre, 0,779 à 68 °F (USCG) et 0,7781 à 20 °C/4 °C (HSDB, soit
  0,778). Le cahier garde 0,779 (USCG, la même température) ; l'écart, 0,1 %,
  ne change aucun résultat arrondi des exercices. À trancher avec une
  troisième source.
- **Fer, 7874 kg/m³ (ch6, cr10)** : PubChem 23925 ne donne que « 7.87 g/cu
  cm ». 7874 est la valeur usuelle des tables (CRC Handbook), non versionnée
  ici. Gardée telle quelle : l'arrondir à 7870 perdrait un chiffre juste.
