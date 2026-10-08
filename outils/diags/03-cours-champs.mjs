/* Calculs refaits des diagnostics de public/app/03-cours-champs.js
   (chapitre « champs »). Voir outils/diags/LISEZMOI.md.
   Chaque calc part des données de l'énoncé et refait l'erreur décrite
   par le message, sans jamais recopier la valeur v du cours. */

// ---- constantes du cahier ----
const K = 9.0e9, G = 6.67e-11, E_CH = 1.6e-19;
const MT = 6.0e24, RT = 6.4e6, MP = 1.67e-27, ME = 9.11e-31, GT = 9.81;

// ---- atelier s6 : l'atome d'hydrogène ----
const D = 5.3e-11;
const E_P = K * E_CH / D ** 2;          // champ du proton à l'électron
const F_E = E_CH * E_P;                 // force électrostatique
const G_P = G * MP / D ** 2;            // champ de gravitation du proton
const F_G = ME * G_P;                   // force de gravitation

// ---- cp7 : géostationnaire ----
const D7 = RT + 3.6e7;
// ---- cp8 : la Lune ----
const ML = 7.3e22, RL = 1.74e6;

export default {
  "champs:s6/atelier1/etape1": {
    rep: () => E_P,
    diags: [
      { erreur: "divisé par d au lieu de d²", calc: () => K * E_CH / D },
      { erreur: "k × e sans diviser", calc: () => K * E_CH },
      { erreur: "force k e²/d² au lieu du champ", calc: () => K * E_CH * E_CH / D ** 2 },
    ],
  },
  "champs:s6/atelier1/etape2": {
    rep: () => F_E,
    diags: [
      { erreur: "champ recopié", calc: () => E_P },
      { erreur: "champ divisé par la charge", calc: () => E_P / E_CH },
    ],
  },
  "champs:s6/atelier1/etape4": {
    rep: () => G_P,
    diags: [
      { erreur: "divisé par d au lieu de d²", calc: () => G * MP / D },
      { erreur: "masse de l'électron comme source", calc: () => G * ME / D ** 2 },
    ],
  },
  "champs:s6/atelier1/etape5": {
    rep: () => F_G,
    diags: [
      { erreur: "multiplié par la masse du proton", calc: () => MP * G_P },
      { erreur: "champ recopié", calc: () => G_P },
    ],
  },
  "champs:s6/atelier1/etape6": {
    rep: () => F_E / F_G,
    diags: [
      { erreur: "rapport inversé", calc: () => F_G / F_E },
    ],
  },

  "champs:cp1": {
    rep: () => 0.30 / 2.0e-6,
    diags: [
      { erreur: "F × q", calc: () => 0.30 * 2.0e-6 },
      { erreur: "q / F", calc: () => 2.0e-6 / 0.30 },
      { erreur: "µC non converti", calc: () => 0.30 / 2.0 },
    ],
  },
  "champs:cp3": {
    rep: () => K * 4.0e-9 / 0.030 ** 2,
    diags: [
      { erreur: "divisé par d", calc: () => K * 4.0e-9 / 0.030 },
      { erreur: "d en cm", calc: () => K * 4.0e-9 / 3.0 ** 2 },
      { erreur: "nC pris pour µC", calc: () => K * 4.0e-6 / 0.030 ** 2 },
    ],
  },
  "champs:cp5": {
    rep: () => E_CH * 2.0e4,
    diags: [
      { erreur: "E / e", calc: () => 2.0e4 / E_CH },
      { erreur: "e / E", calc: () => E_CH / 2.0e4 },
      { erreur: "champ recopié", calc: () => 2.0e4 },
    ],
  },
  "champs:cp7": {
    rep: () => G * MT / D7 ** 2,
    diags: [
      { erreur: "valeur au sol, d = R_T", calc: () => G * MT / RT ** 2 },
      { erreur: "d = h", calc: () => G * MT / 3.6e7 ** 2 },
      { erreur: "divisé par d", calc: () => G * MT / D7 },
    ],
  },
  "champs:cp8": {
    rep: () => G * ML / RL ** 2,
    diags: [
      { erreur: "divisé par R_L", calc: () => G * ML / RL },
      { erreur: "g terrestre", calc: () => GT },
      { erreur: "G oublié", calc: () => ML / RL ** 2 },
    ],
  },
  "champs:cp11": {
    rep: () => (E_CH * 2.0e4) / (ME * GT),
    diags: [
      { erreur: "masse du proton", calc: () => (E_CH * 2.0e4) / (MP * GT) },
      { erreur: "g oublié", calc: () => (E_CH * 2.0e4) / ME },
      { erreur: "rapport inversé", calc: () => (ME * GT) / (E_CH * 2.0e4) },
    ],
  },
  "champs:cp12": {
    rep: () => 3.6e4 / 3 ** 2,
    diags: [
      { erreur: "divisé par 3", calc: () => 3.6e4 / 3 },
      { erreur: "multiplié par 9", calc: () => 3.6e4 * 9 },
      { erreur: "divisé par 27", calc: () => 3.6e4 / 27 },
    ],
  },
};
