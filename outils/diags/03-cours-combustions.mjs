/* Calculs refaits des diagnostics du ch18 « L'énergie des combustions ».
   Énergies de liaison (kJ/mol) : table LibreTexts « Average Bond Energies »,
   C=O dans CO2 = 799 (voir l'en-tête de public/app/03-cours-combustions.js). */
const CH = 413, CC = 347, CO = 358, OH = 467, OO = 495, CdO = 799;

export default {
  // atelier : lampe à alcool sous une canette (200 g d'eau, 18,0 → 38,0 °C, 1,25 g brûlés)
  "combustions:s6/atelier1/etape1": {
    rep: () => 200 * 4.18 * (38.0 - 18.0) / 1000,
    diags: [
      { erreur: "Q laissé en joules", calc: () => 200 * 4.18 * (38.0 - 18.0) },
      { erreur: "température finale au lieu de l'échauffement", calc: () => 200 * 4.18 * 38.0 / 1000 },
      { erreur: "échauffement oublié", calc: () => 200 * 4.18 / 1000 },
    ],
  },
  "combustions:s6/atelier1/etape2": {
    rep: () => 152.40 - 151.15,
    diags: [
      { erreur: "somme des deux pesées", calc: () => 152.40 + 151.15 },
    ],
  },
  "combustions:s6/atelier1/etape3": {
    rep: () => (200 * 4.18 * 20.0 / 1000) / 1.25,
    diags: [
      { erreur: "divisé par 1000 de trop", calc: () => (200 * 4.18 * 20.0 / 1000) / 1.25 / 1000 },
      { erreur: "Q gardé en joules", calc: () => (200 * 4.18 * 20.0) / 1.25 },
      { erreur: "multiplié par la masse au lieu de diviser", calc: () => (200 * 4.18 * 20.0 / 1000) * 1.25 },
    ],
  },

  // propane : C3H8 + 5 O2 -> 3 CO2 + 4 H2O
  "combustions:cb2": {
    rep: () => (3 * 2 + 8 / 2) / 2,
    diags: [
      { erreur: "atomes O au lieu de molécules O2", calc: () => 3 * 2 + 8 / 2 },
      { erreur: "nombre de CO2", calc: () => 3 },
      { erreur: "atomes O mal comptés (3 + 4)", calc: () => 3 + 4 },
    ],
  },
  // éthanol : C2H5OH + 3 O2 -> 2 CO2 + 3 H2O
  "combustions:cb3": {
    rep: () => (2 * 2 + 3 - 1) / 2,
    diags: [
      { erreur: "O de l'alcool oublié", calc: () => (2 * 2 + 3) / 2 },
      { erreur: "atomes O à droite", calc: () => 2 * 2 + 3 },
      { erreur: "atomes O à fournir, pas les molécules", calc: () => 2 * 2 + 3 - 1 },
    ],
  },
  // propane : rompues 8 C-H + 2 C-C + 5 O=O, formées 6 C=O + 8 O-H
  "combustions:cb6": {
    rep: () => (8 * CH + 2 * CC + 5 * OO) - (6 * CdO + 8 * OH),
    diags: [
      { erreur: "formées - rompues", calc: () => (6 * CdO + 8 * OH) - (8 * CH + 2 * CC + 5 * OO) },
      { erreur: "O=O oubliées", calc: () => (8 * CH + 2 * CC) - (6 * CdO + 8 * OH) },
      { erreur: "une seule O=O", calc: () => (8 * CH + 2 * CC + OO) - (6 * CdO + 8 * OH) },
      { erreur: "une seule C=O par CO2", calc: () => (8 * CH + 2 * CC + 5 * OO) - (3 * CdO + 8 * OH) },
    ],
  },
  // éthanol : rompues 5 C-H + C-C + C-O + O-H + 3 O=O, formées 4 C=O + 6 O-H
  "combustions:cb7": {
    rep: () => (5 * CH + CC + CO + OH + 3 * OO) - (4 * CdO + 6 * OH),
    diags: [
      { erreur: "formées - rompues", calc: () => (4 * CdO + 6 * OH) - (5 * CH + CC + CO + OH + 3 * OO) },
      { erreur: "liaison O-H de l'éthanol oubliée", calc: () => (5 * CH + CC + CO + 3 * OO) - (4 * CdO + 6 * OH) },
      { erreur: "O=O oubliées", calc: () => (5 * CH + CC + CO + OH) - (4 * CdO + 6 * OH) },
    ],
  },
  // pouvoir calorifique du méthane, Er = -824 kJ/mol, M = 16,0 g/mol
  "combustions:cb8": {
    rep: () => 824 / 16.0,
    diags: [
      { erreur: "multiplié par M", calc: () => 824 * 16.0 },
      { erreur: "divisé par 1000 de trop", calc: () => 824 / 16.0 / 1000 },
      { erreur: "multiplié par 1000 de trop", calc: () => 824 / 16.0 * 1000 },
    ],
  },
  // 10,0 g de propane, Er = -2057 kJ/mol, M = 44,0 g/mol
  "combustions:cb9": {
    rep: () => 10.0 / 44.0 * 2057,
    diags: [
      { erreur: "multiplié par la masse", calc: () => 10.0 * 2057 },
      { erreur: "énergie d'une mole", calc: () => 2057 },
      { erreur: "résultat en MJ", calc: () => 10.0 / 44.0 * 2057 / 1000 },
    ],
  },
  // lampe à alcool : 250 g d'eau, 16,0 -> 31,0 °C, 1,10 g d'éthanol
  "combustions:cb11": {
    rep: () => 250 * 4.18 * (31.0 - 16.0) / 1.10 / 1000,
    diags: [
      { erreur: "Q en kJ, pas divisé par la masse", calc: () => 250 * 4.18 * (31.0 - 16.0) / 1000 },
      { erreur: "divisé par 1000 de trop", calc: () => 250 * 4.18 * (31.0 - 16.0) / 1.10 / 1e6 },
      { erreur: "température finale au lieu de l'échauffement", calc: () => 250 * 4.18 * 31.0 / 1.10 / 1000 },
    ],
  },
};
