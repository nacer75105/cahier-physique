# Mesure et incertitudes au lycée — source des formules (téléchargé le 2026-10-13)

`mesure-incertitudes-eduscol-2021.txt` est extrait (`pdftotext -enc UTF-8 -layout`, texte intégral,
41 pages) de la ressource d'accompagnement éduscol **« Mesure et incertitudes au lycée »**
(Ministère de l'Éducation nationale, mai 2021 ; groupe IREM « Mesure et incertitudes » de
l'Université de Paris), qui accompagne les programmes de 2de, 1re et Terminale de 2019 et s'appuie
sur le GUM (JCGM 100:2008) et le VIM (JCGM 200:2012) :
https://eduscol.education.fr/document/7067/download
(PDF téléchargé directement, sans blocage ; SHA-256
`81e293e79475587c76d1a7f0ef8925ad2f9f252e7c27fafe1c86f14af7f985d1`, non versionné : 2 Mo).

**Ce que le programme dit, ce que cette ressource ajoute.** Le BO (dossier voisin
`physique-1re-spe/`, l. 135-165) fixe les capacités exigibles mais ne donne **aucune formule**.
Les formules du cahier viennent de cette ressource, jamais de mémoire.

## Les formules sont des images : lues sur le PDF

L'extraction texte perd les équations (ce sont des images dans le PDF). Elles ont été lues sur le
rendu des pages, le 2026-10-13 :

| Élément (page) | Formule | Niveau |
|---|---|---|
| 8 (p. 10) | moyenne $\bar x = \frac{\sum x_i}{N}$ ; écart-type expérimental $s_x = \sqrt{\frac{\sum (x_i-\bar x)^2}{N-1}}$ (tableur `ECARTYPE`, calculatrice « Sx » ou « σn−1 ») | 2de, 1re, Tle |
| 16 (p. 19) | incertitude-type d'**une** observation : $u(x) = s_x$ | 2de, 1re, Tle |
| 17 (p. 19-20) | incertitude-type de la **moyenne** de N observations : $u(\bar x) = \frac{s_x}{\sqrt N}$ (exemple focale : 7 observations, $s_x = 0{,}1618$ cm, $u = 0{,}061$ cm) | type A |
| 18 (p. 22) | type B : construire l'intervalle $[m-a ; m+a]$ (notice, « précision », « tolérance », ou jugement explicité) | 1re (nouveau) |
| 19 (p. 23) | $u(x) = \frac{a}{\sqrt 3}$, $a$ demi-étendue, $m$ valeur centrale (pèse-personne $[69 ; 73]$ kg : $u = 1{,}15$ kg) | 1re (nouveau) |
| p. 26-27 | multimètre : $a$ = « précision » de la notice ; pipette jaugée 25 mL ± 0,030 mL : $u = 0{,}017$ mL (normes ISO 648:2008, ISO 384:2015) | 1re |
| 21-22 (p. 28-32) | incertitudes-types **composées** | **Terminale — hors programme 1re** |
| 23 (p. 33) | un résultat = valeur mesurée, $u(X)$ même unité et même puissance de 10, méthode ; écriture $X \pm u(X)$ seulement en précisant que ce qui suit ± est l'incertitude-type | 1re |
| 25 (p. 34-35) | $u$ écrite avec **deux** chiffres significatifs (parfois un) ; le dernier chiffre de la valeur mesurée à la même position que le dernier chiffre de $u$ ; arrondi au plus proche, un 5 final arrondi par excès | 1re |
| 26 (p. 36) | valeur de référence : mesurée par une méthode jugée supérieure, ou d'incertitude négligeable devant la nôtre | 1re |
| 27-28 (p. 36-37) | z-score $z = \frac{\lvert x - x_{ref}\rvert}{u(x)}$, compatible si $z < 2$ | **Terminale — hors programme 1re** (la 1re compare **qualitativement**) |
| 29 (p. 37-38) | causes d'une incompatibilité : incertitude sous-estimée ou oubliée, expérience mal réalisée, **modélisation incomplète** ; une incompatibilité n'est pas un échec | 1re (qualitatif) |
| 30 (p. 38-39) | valeur aberrante : l'exclure **en le documentant** | 1re |

## Mises en garde de la ressource, à respecter dans le cahier

- **« Précision »** est banni du VIM (élément 13, p. 17) ; une grande incertitude ne veut pas dire
  une mauvaise mesure.
- **L'erreur** (aléatoire / systématique) n'est plus mentionnée dans les programmes (élément 14) :
  le cahier n'en fait pas une notion du cours.
- **L'écart relatif** $\frac{\lvert x - x_{ref}\rvert}{x_{ref}}$ ne doit pas être confondu avec
  l'incertitude relative ; il « était souvent utilisé à tort pour valider des résultats » et « n'est
  désormais plus au programme » (élément 22, p. 31).
