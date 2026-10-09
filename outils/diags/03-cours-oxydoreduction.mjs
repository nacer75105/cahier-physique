/* Calculs refaits des diagnostics de public/app/03-cours-oxydoreduction.js
   (chapitre « oxydoreduction »). Voir outils/diags/LISEZMOI.md.
   Les nombres d'électrons, de H⁺ et de H₂O sont recomptés à partir des
   formules (atomes et charges), jamais recopiés. */
const M_FE = 55.8, M_CU = 63.5;

// charges et atomes des espèces utilisées
const Q = { "MnO4-": -1, "Mn2+": 2, "Cr2O72-": -2, "Cr3+": 3, "H+": 1 };

export default {
  // atelier : demi-équation MnO4-/Mn2+, puis titrage
  "oxydoreduction:s6/atelier1/etape1": {
    rep: () => 4,                                  // 4 atomes O dans MnO4-
    diags: [
      { erreur: "nombre de H+ (2 × 4)", calc: () => 2 * 4 },
      { erreur: "nombre d'électrons", calc: () => (Q["MnO4-"] + 8 * Q["H+"]) - Q["Mn2+"] },
    ],
  },
  "oxydoreduction:s6/atelier1/etape2": {
    rep: () => 5 / 1,
    diags: [
      { erreur: "aucune multiplication", calc: () => 1 },
      { erreur: "coefficient de H+", calc: () => 8 },
    ],
  },
  "oxydoreduction:s6/atelier1/etape4": {
    rep: () => 5 * 0.0200 * 14.0 / 20.0,
    diags: [
      { erreur: "coefficient 5 oublié", calc: () => 0.0200 * 14.0 / 20.0 },
      { erreur: "divisé par 5", calc: () => 0.0200 * 14.0 / 20.0 / 5 },
      { erreur: "volumes inversés", calc: () => 5 * 0.0200 * 20.0 / 14.0 },
    ],
  },
  "oxydoreduction:ox4": {
    rep: () => (Q["Cr2O72-"] + 14 * Q["H+"]) - 2 * Q["Cr3+"],
    diags: [
      { erreur: "électrons par atome de chrome", calc: () => ((Q["Cr2O72-"] + 14 * Q["H+"]) - 2 * Q["Cr3+"]) / 2 },
      { erreur: "un seul Cr3+ à droite", calc: () => (Q["Cr2O72-"] + 14 * Q["H+"]) - Q["Cr3+"] },
      { erreur: "nombre de H+", calc: () => 14 },
      { erreur: "nombre de H2O", calc: () => 7 },
    ],
  },
  "oxydoreduction:ox5": {
    rep: () => 2 * 4,
    diags: [
      { erreur: "nombre de H2O", calc: () => 4 },
      { erreur: "nombre d'électrons", calc: () => (Q["MnO4-"] + 8 * Q["H+"]) - Q["Mn2+"] },
    ],
  },
  "oxydoreduction:ox7": {
    rep: () => 5 / 1,
    diags: [
      { erreur: "aucune multiplication", calc: () => 1 },
      { erreur: "coefficient de H+", calc: () => 8 },
    ],
  },
  "oxydoreduction:ox8": {
    rep: () => 10,                                 // ppcm(5, 2)
    diags: [
      { erreur: "somme 5 + 2", calc: () => 5 + 2 },
      { erreur: "électrons de l'oxalate seul", calc: () => 2 },
    ],
  },
  "oxydoreduction:ox9": {
    rep: () => 0.56 / M_FE * M_CU,
    diags: [
      { erreur: "masse de fer recopiée", calc: () => 0.56 },
      { erreur: "masses molaires inversées", calc: () => 0.56 / M_CU * M_FE },
    ],
  },
  "oxydoreduction:ox10": {
    rep: () => 5 * 0.020 * 12.0 / 10.0,
    diags: [
      { erreur: "coefficient 5 oublié", calc: () => 0.020 * 12.0 / 10.0 },
      { erreur: "divisé par 5", calc: () => 0.020 * 12.0 / 10.0 / 5 },
      { erreur: "volumes inversés", calc: () => 5 * 0.020 * 10.0 / 12.0 },
    ],
  },
};
