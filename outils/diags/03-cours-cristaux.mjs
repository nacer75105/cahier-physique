/* Calculs refaits des diagnostics de public/app/03-cours-cristaux.js
   (voir outils/diags/LISEZMOI.md). */
const NA = 6.02e23;
const sphere = (4 / 3) * Math.PI;           // volume d'une sphère de rayon 1
const Ccs = sphere / 2 ** 3;                // compacité cubique simple, a = 2r
const Ccfc = 4 * sphere / (2 * Math.SQRT2) ** 3; // compacité CFC, a = 2r√2

// cr6 : aluminium CFC
const Al = { N: 4, M: 27.0, a: 4.05e-8 };  // g/mol, cm
const rhoAl = N => N * Al.M / (NA * Al.a ** 3); // g/cm³

// cr10 : fer cubique centré
const Fe = { N: 2, M: 55.8, a: 287e-12 };  // g/mol, m
const rhoFe = N => N * (Fe.M / 1000) / (NA * Fe.a ** 3); // kg/m³

// cr11 et atelier s6 : cuivre CFC
const aCu = 361;                           // pm
const Cu = { N: 4, M: 63.5, a: 361e-12 };  // g/mol, m
const Vcu = Cu.a ** 3;                     // m³
const mCu = N => N * (Cu.M / 1000) / NA;   // kg

export default {
  "cristaux:cr2": {
    rep: () => 8 * (1 / 8),
    diags: [
      { erreur: "compte les 8 atomes dessinés", calc: () => 8 },
      { erreur: "population CFC", calc: () => 8 * (1 / 8) + 6 * (1 / 2) },
      { erreur: "part d'un seul sommet", calc: () => 1 / 8 },
    ],
  },
  "cristaux:cr3": {
    rep: () => 8 * (1 / 8) + 6 * (1 / 2),
    diags: [
      { erreur: "atomes dessinés 8 + 6", calc: () => 8 + 6 },
      { erreur: "sommets seuls", calc: () => 8 * (1 / 8) },
      { erreur: "faces seules", calc: () => 6 * (1 / 2) },
      { erreur: "faces comptées en entier + sommets pour 1", calc: () => 6 + 8 * (1 / 8) },
    ],
  },
  "cristaux:cr4": {
    rep: () => Ccs,
    diags: [
      { erreur: "compacité CFC", calc: () => Ccfc },
      { note: "compacité 1 = « aucun vide » : idée fausse, aucun calcul à refaire" },
      { erreur: "part de vide 1 − C", calc: () => 1 - Ccs },
    ],
  },
  "cristaux:cr5": {
    rep: () => Ccfc,
    diags: [
      { erreur: "compacité cubique simple", calc: () => Ccs },
      { erreur: "population oubliée (N = 1)", calc: () => sphere / (2 * Math.SQRT2) ** 3 },
      { erreur: "part de vide 1 − C", calc: () => 1 - Ccfc },
      // message vague (« vérifie l'élévation au cube de a ») : interprétation retenue,
      // le facteur 2 de a = 2r√2 n'est pas élevé au cube : a³ = 2 × (√2)³ r³
      { erreur: "a³ = 2·(√2)³ r³ (facteur 2 non cubé)", calc: () => 4 * sphere / (2 * Math.SQRT2 ** 3) },
    ],
  },
  "cristaux:cr6": {
    rep: () => rhoAl(Al.N),
    diags: [
      { erreur: "population oubliée (N = 1)", calc: () => rhoAl(1) },
      { erreur: "population comptée deux fois", calc: () => Al.N * rhoAl(Al.N) },
      { erreur: "résultat en kg/m³", calc: () => rhoAl(Al.N) * 1e-3 / 1e-6 },
    ],
  },
  "cristaux:cr9": {
    rep: () => 8 * (1 / 8) + 1,
    diags: [
      { erreur: "atomes dessinés 8 + 1", calc: () => 8 + 1 },
      { erreur: "sommets seuls", calc: () => 8 * (1 / 8) },
      { erreur: "nombre de sommets", calc: () => 8 },
      { erreur: "population CFC", calc: () => 8 * (1 / 8) + 6 * (1 / 2) },
    ],
  },
  "cristaux:cr10": {
    rep: () => rhoFe(Fe.N),
    diags: [
      { erreur: "masse gardée en grammes", calc: () => Fe.N * Fe.M / (NA * Fe.a ** 3) },
      { erreur: "un seul atome par maille", calc: () => rhoFe(1) },
      { erreur: "quatre atomes par maille", calc: () => rhoFe(4) },
      { erreur: "division inversée V/m", calc: () => 1 / rhoFe(Fe.N) },
    ],
  },
  "cristaux:cr11": {
    rep: () => aCu * Math.SQRT2 / 4,
    diags: [
      { erreur: "arête divisée par 4", calc: () => aCu / 4 },
      { erreur: "arête divisée par 2", calc: () => aCu / 2 },
      { erreur: "moitié de la diagonale", calc: () => aCu * Math.SQRT2 / 2 },
      { erreur: "diagonale entière", calc: () => aCu * Math.SQRT2 },
    ],
  },
  "cristaux:cr13": {
    rep: () => 8 * (1 / 8) + 1,
    diags: [
      { erreur: "atomes dessinés 8 + 1", calc: () => 8 + 1 },
      { erreur: "sommets seuls", calc: () => 8 * (1 / 8) },
      { erreur: "1/8 + 1", calc: () => 1 / 8 + 1 },
    ],
  },
  "cristaux:s6/atelier1/etape1": {
    rep: () => 8 * (1 / 8) + 6 * (1 / 2),
    diags: [
      { erreur: "atomes dessinés 8 + 6", calc: () => 8 + 6 },
      { erreur: "nombre de sommets", calc: () => 8 },
      { erreur: "sommets seuls", calc: () => 8 * (1 / 8) },
      { erreur: "nombre de faces", calc: () => 6 },
    ],
  },
  "cristaux:s6/atelier1/etape2": {
    rep: () => Vcu,
    diags: [
      { erreur: "arête convertie, non cubée", calc: () => Cu.a },
      { erreur: "3,61 cubé mais pas 10^-10", calc: () => 3.61 ** 3 * 1e-10 },
      { erreur: "arête × 3", calc: () => 3 * Cu.a },
    ],
  },
  "cristaux:s6/atelier1/etape3": {
    rep: () => mCu(Cu.N),
    diags: [
      { erreur: "résultat en grammes", calc: () => Cu.N * Cu.M / NA },
      { erreur: "un seul atome", calc: () => mCu(1) },
      { erreur: "M × 4 sans N_A (g)", calc: () => Cu.M * 4 },
      { erreur: "M × 4 / 1000 sans N_A (kg)", calc: () => Cu.M * 4 / 1000 },
    ],
  },
  "cristaux:s6/atelier1/etape4": {
    rep: () => mCu(Cu.N) / Vcu,
    diags: [
      { erreur: "masse gardée en grammes", calc: () => (Cu.N * Cu.M / NA) / Vcu },
      { erreur: "division inversée V/m", calc: () => Vcu / mCu(Cu.N) },
      { erreur: "un seul atome", calc: () => mCu(1) / Vcu },
    ],
  },
};
