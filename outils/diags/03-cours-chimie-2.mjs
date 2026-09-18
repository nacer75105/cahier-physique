/* Calculs refaits des diagnostics de public/app/03-cours-chimie-2.js
   (chapitres lewis, cohesion, organique). Voir LISEZMOI.md. */

/* ---------- données communes ---------- */
const VAL = { H: 1, C: 4, N: 5, O: 6 };   // électrons de valence
const Z_O = 8;                             // électrons de l'oxygène (cœur compris)
const OCTET = 8;

export default {
  /* ================= ch4 lewis ================= */
  "lewis:le1": {           // H2O : doublets non liants sur O (2 liaisons O–H)
    rep: () => (VAL.O - 2) / 2,
    diags: [
      { note: "aucun calcul : l'élève croit qu'il n'y a pas de doublet non liant" },
      { erreur: "électrons non liants au lieu de doublets", calc: () => VAL.O - 2 },
      { note: "message qui réfute la réponse 1, sans erreur de calcul décrite" },
    ],
  },
  "lewis:le5": {           // C : nombre de liaisons
    rep: () => OCTET - VAL.C,
    diags: [
      { note: "message qui réfute la réponse 2, sans erreur de calcul décrite" },
      { erreur: "donne le nombre d'électrons visé (octet)", calc: () => OCTET },
      { erreur: "raisonne avec l'azote (5 e- de valence)", calc: () => OCTET - VAL.N },
    ],
  },
  "lewis:le7": {           // CO2 : doublets non liants des deux O (double liaison chacun)
    rep: () => 2 * (VAL.O - 2) / 2,
    diags: [
      { erreur: "un seul oxygène compté", calc: () => (VAL.O - 2) / 2 },
      { erreur: "électrons non liants au lieu de doublets", calc: () => 2 * (VAL.O - 2) },
      { erreur: "électrons de valence d'un oxygène", calc: () => VAL.O },
    ],
  },
  "lewis:le9": {           // NH3 : doublets en tout
    rep: () => (VAL.N + 3 * VAL.H) / 2,
    diags: [
      { erreur: "électrons au lieu de doublets", calc: () => VAL.N + 3 * VAL.H },
      { erreur: "nombre de liaisons N–H seul", calc: () => 3 },
      { erreur: "électrons de valence de N seul", calc: () => VAL.N },
    ],
  },
  "lewis:le10": {          // figure : eau, 2 traits, 2 paires rouges
    rep: () => 2,
    diags: [
      { erreur: "total liants + non liants", calc: () => 2 + 2 },
      { note: "erreur de lecture du schéma (3 paires vues), rien à calculer" },
      { note: "paires rouges ignorées, rien à calculer" },
    ],
  },
  "lewis:le12": {          // CO2 : doublets en tout
    rep: () => (VAL.C + 2 * VAL.O) / 2,
    diags: [
      { erreur: "électrons au lieu de doublets", calc: () => VAL.C + 2 * VAL.O },
      { erreur: "un seul oxygène (électrons)", calc: () => VAL.C + VAL.O },
      { erreur: "doublets liants seuls (deux doubles liaisons)", calc: () => 2 * 2 },
      { erreur: "liaisons comptées simples", calc: () => 2 * 1 },
    ],
  },
  "lewis:le13": {          // figure : méthanal, 2 C–H + C=O (4 traits), 2 paires sur O
    rep: () => 2,
    diags: [
      { note: "paires de points ignorées, rien à calculer" },
      { erreur: "doublets liants seuls (2 de la double liaison + 1 par C–H)", calc: () => 1 + 1 + 2 },
      { erreur: "liants + non liants", calc: () => (1 + 1 + 2) + 2 },
      { note: "erreur de lecture du schéma (une seule paire vue), rien à calculer" },
    ],
  },

  // atelier : eau H2O
  "lewis:s6/atelier1/etape1": {
    rep: () => VAL.O + 2 * VAL.H,
    diags: [
      { erreur: "un seul hydrogène", calc: () => VAL.O + VAL.H },
      { erreur: "oxygène seul", calc: () => VAL.O },
      { erreur: "tous les électrons de O, cœur compris", calc: () => Z_O + 2 * VAL.H },
    ],
  },
  "lewis:s6/atelier1/etape2": {
    rep: () => (VAL.O + 2 * VAL.H) / 2,
    diags: [
      { erreur: "électrons au lieu de doublets", calc: () => VAL.O + 2 * VAL.H },
      { erreur: "multiplie par 2 au lieu de diviser", calc: () => (VAL.O + 2 * VAL.H) * 2 },
      { erreur: "seules les liaisons comptées", calc: () => 2 },
    ],
  },
  "lewis:s6/atelier1/etape3": {
    rep: () => (VAL.O + 2 * VAL.H) / 2 - 2,
    diags: [
      { erreur: "nombre total de doublets", calc: () => (VAL.O + 2 * VAL.H) / 2 },
      { note: "aucun doublet non liant supposé, rien à calculer" },
      { note: "le message ne décrit pas d'erreur de calcul menant à 1" },
    ],
  },

  /* ================= ch5 cohesion ================= */
  "cohesion:co9": {        // V = 500 mL, C = 0,10 mol/L, M = 180 g/mol
    rep: () => 0.10 * 0.500 * 180,
    diags: [
      { erreur: "calcul pour un litre", calc: () => 0.10 * 1 * 180 },
      { erreur: "s'arrête à la quantité de matière", calc: () => 0.10 * 0.500 },
      { erreur: "masse d'une mole", calc: () => 180 },
      { erreur: "volume en millilitres", calc: () => 0.10 * 500 * 180 },
    ],
  },
  "cohesion:co12": {       // Cm = 18 g/L, M = 180 g/mol
    rep: () => 18 / 180,
    diags: [
      { erreur: "multiplie par M", calc: () => 18 * 180 },
      { erreur: "division inversée", calc: () => 180 / 18 },
      { erreur: "recopie la concentration en masse", calc: () => 18 },
      { erreur: "facteur dix", calc: () => 18 / 180 / 10 },
    ],
  },

  // atelier : V = 250 mL, C = 0,20 mol/L, M = 58,5 g/mol
  "cohesion:s5/atelier1/etape1": {
    rep: () => 0.20 * 0.250,
    diags: [
      { erreur: "volume en mL", calc: () => 0.20 * 250 },
      { erreur: "division inversée (V/C)", calc: () => 0.250 / 0.20 },
      { erreur: "divise le volume par la concentration", calc: () => 0.250 / 0.20 },
    ],
  },
  "cohesion:s5/atelier1/etape2": {
    rep: () => 0.20 * 0.250 * 58.5,
    diags: [
      { erreur: "M / n", calc: () => 58.5 / (0.20 * 0.250) },
      { erreur: "division inversée n / M", calc: () => (0.20 * 0.250) / 58.5 },
      { erreur: "masse d'une mole", calc: () => 58.5 },
    ],
  },
  "cohesion:s5/atelier1/etape3": {
    rep: () => (0.20 * 0.250 * 58.5) / 0.250,
    diags: [
      { erreur: "masse dans 250 mL", calc: () => 0.20 * 0.250 * 58.5 },
      { erreur: "multiplie par 0,250", calc: () => 0.20 * 0.250 * 58.5 * 0.250 },
      { erreur: "recopie la masse molaire", calc: () => 58.5 },
    ],
  },

  /* ================= ch7 organique ================= */
  "organique:or4": {       // nmax = 0,050, nexp = 0,035
    rep: () => 0.035 / 0.050 * 100,
    diags: [
      { erreur: "fraction, pas pourcentage", calc: () => 0.035 / 0.050 },
      { erreur: "fraction inversée", calc: () => 0.050 / 0.035 * 100 },
      { erreur: "soustraction", calc: () => (0.050 - 0.035) * 100 },
    ],
  },
  "organique:or6": {       // acide propanoïque : nmax = 0,050, m = 2,6 g, M = 74
    rep: () => (2.6 / 74) / 0.050 * 100,
    diags: [
      { erreur: "masse / quantité maximale", calc: () => 2.6 / 0.050 },
      { erreur: "fraction, pas pourcentage", calc: () => (2.6 / 74) / 0.050 },
      { erreur: "fraction inversée", calc: () => 0.050 / (2.6 / 74) * 100 },
      { erreur: "n obtenu × 100, sans diviser par nmax", calc: () => (2.6 / 74) * 100 },
    ],
  },
  "organique:or9": {       // C3H8
    rep: () => 3 * 12 + 8 * 1.0,
    diags: [
      { erreur: "12 + 8 sans multiplier C par 3", calc: () => 12 + 8 },
      { erreur: "une masse de chaque", calc: () => 12 + 1.0 },
      { erreur: "oublie les hydrogènes", calc: () => 3 * 12 },
      { erreur: "différence au lieu de somme", calc: () => 12 - 1.0 },
    ],
  },
  "organique:or10": {      // figure : dépôt y=1,6 ; front y=7,6 ; tache B y=5,5
    rep: () => (5.5 - 1.6) / (7.6 - 1.6),
    diags: [
      { erreur: "fraction inversée", calc: () => (7.6 - 1.6) / (5.5 - 1.6) },
      { erreur: "distance de la tache", calc: () => 5.5 - 1.6 },
      { erreur: "produit des distances", calc: () => (5.5 - 1.6) * (7.6 - 1.6) },
      { erreur: "différence des distances", calc: () => (7.6 - 1.6) - (5.5 - 1.6) },
    ],
  },
  "organique:or12": {      // n = 0,060 mol, m = 3,6 g, M = 88
    rep: () => (3.6 / 88) / 0.060 * 100,
    diags: [
      { erreur: "masse / quantité de matière", calc: () => 3.6 / 0.060 },
      { erreur: "fraction inversée", calc: () => 0.060 / (3.6 / 88) * 100 },
      { erreur: "fraction, pas pourcentage", calc: () => (3.6 / 88) / 0.060 },
      { erreur: "n obtenu × 100, sans diviser par nmax", calc: () => (3.6 / 88) * 100 },
    ],
  },

  // atelier : 5,00 g d'acide salicylique (138), 4,50 g d'aspirine (180)
  "organique:s6/atelier1/etape1": {
    rep: () => 5.00 / 138,
    diags: [
      { erreur: "m × M", calc: () => 5.00 * 138 },
      { erreur: "M / m", calc: () => 138 / 5.00 },
      { erreur: "divise par M de l'aspirine", calc: () => 5.00 / 180 },
    ],
  },
  "organique:s6/atelier1/etape2": {
    rep: () => 5.00 / 138,
    diags: [
      { erreur: "quantité réellement obtenue", calc: () => 4.50 / 180 },
      { erreur: "doublé", calc: () => 2 * 5.00 / 138 },
      { erreur: "divisé par deux", calc: () => 5.00 / 138 / 2 },
    ],
  },
  "organique:s6/atelier1/etape3": {
    rep: () => (5.00 / 138) * 180,
    diags: [
      { erreur: "multiplie par M du réactif (138)", calc: () => (5.00 / 138) * 138 },
      { erreur: "divise par M", calc: () => (5.00 / 138) / 180 },
    ],
  },
  "organique:s6/atelier1/etape4": {
    rep: () => 4.50 / ((5.00 / 138) * 180) * 100,
    diags: [
      { erreur: "fraction inversée", calc: () => ((5.00 / 138) * 180) / 4.50 * 100 },
      { erreur: "compare à la masse de départ", calc: () => 4.50 / 5.00 * 100 },
      { erreur: "fraction, pas pourcentage", calc: () => 4.50 / ((5.00 / 138) * 180) },
    ],
  },
};
