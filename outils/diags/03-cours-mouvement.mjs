/* Calculs refaits des diagnostics de public/app/03-cours-mouvement.js
   (voir outils/diags/LISEZMOI.md). Chaque calc part des données de
   l'énoncé et refait l'erreur décrite par le message — jamais la valeur v. */

/* ------------------------------------------------------------ vitesse */
// vi3
const d3 = 0.20, tau3 = 0.050;
// vi10 : 3,0 cm sur la photo, échelle ×10, τ = 25 ms
const photo10 = 0.030, ech10 = 10, tau10 = 0.025, d10 = photo10 * ech10;
// vi12
const t12 = 100 / 5.0 + 100 / 10.0;
// atelier vitesse:s6 : τ = 40 ms, 4,0 cm sur la photo, échelle ×20
const tauMs = 40, photoCm = 4.0, ech = 20;
const tauA = tauMs / 1000, dA = photoCm * ech / 100, vA = dA / (2 * tauA);

/* ------------------------------------------------------------- forces */
// fo6
const k = 9.0e9, qA = 2.0e-6, qB = 3.0e-6, d6 = 0.30;
// fo8
const m8 = 2.0, v1_8 = 1.0, v2_8 = 5.0, dt8 = 2.0, dv8 = v2_8 - v1_8;
// fo12
const G = 6.67e-11, mS = 800, mT = 6.0e24, r12 = 7.0e6;
// fo15 (figure) : traction 80 N, frottement 30 N, P = R = 300 N
const T15 = 80, f15 = 30, P15 = 300, R15 = 300;
// fo19
const h19 = 1.25, vx19 = 4.0, g19 = 10, t19 = Math.sqrt(2 * h19 / g19);
// atelier forces:s7
const mL = 20, gL = 9.81, F7 = 60, f7 = 20;

export default {
  /* ================================================== vitesse */
  "vitesse:vi1": {
    rep: () => 108 / 3.6,
    diags: [
      { erreur: "multiplie par 3,6", calc: () => 108 * 3.6 },
      { erreur: "divise par 60", calc: () => 108 / 60 },
      { erreur: "divise par 10", calc: () => 108 / 10 },
    ],
  },
  "vitesse:vi3": {
    rep: () => d3 / (2 * tau3),
    diags: [
      { erreur: "divise par τ au lieu de 2τ", calc: () => d3 / tau3 },
      { erreur: "fraction inversée 2τ/d", calc: () => (2 * tau3) / d3 },
      { erreur: "τ gardé en ms", calc: () => d3 / (2 * 50) },
    ],
  },
  "vitesse:vi5": {
    rep: () => (450 / 30) * 3.6,
    diags: [
      { erreur: "reste en m/s", calc: () => 450 / 30 },
      { erreur: "divise par 3,6", calc: () => (450 / 30) / 3.6 },
      { erreur: "Δt/d", calc: () => 30 / 450 },
    ],
  },
  "vitesse:vi7": {
    rep: () => (10.0 - 4.0) / 2.0,
    diags: [
      { erreur: "variation totale", calc: () => 10.0 - 4.0 },
      { erreur: "moyenne des vitesses", calc: () => (10.0 + 4.0) / 2 },
      { erreur: "Δt/Δv", calc: () => 2.0 / (10.0 - 4.0) },
    ],
  },
  "vitesse:vi9": {
    rep: () => 324 / 3.6,
    diags: [
      { erreur: "recopie 324", calc: () => 324 },
      { erreur: "multiplie par 3,6", calc: () => 324 * 3.6 },
      { erreur: "divise par 60", calc: () => 324 / 60 },
    ],
  },
  "vitesse:vi10": {
    rep: () => d10 / (2 * tau10),
    diags: [
      { erreur: "échelle oubliée", calc: () => photo10 / (2 * tau10) },
      { erreur: "divise par τ", calc: () => d10 / tau10 },
      { erreur: "divise par 4τ", calc: () => d10 / (4 * tau10) },
    ],
  },
  "vitesse:vi12": {
    rep: () => 200 / t12,
    diags: [
      { erreur: "moyenne des vitesses", calc: () => (5.0 + 10.0) / 2 },
      { erreur: "somme des vitesses", calc: () => 5.0 + 10.0 },
      { erreur: "vitesse de la 1re portion", calc: () => 5.0 },
    ],
  },
  "vitesse:vi13": {
    rep: () => 20 / 4.0,
    diags: [
      { erreur: "distance lue", calc: () => 20 },
      { erreur: "distance × durée", calc: () => 20 * 4.0 },
      { erreur: "fraction inversée", calc: () => 4.0 / 20 },
    ],
  },
  "vitesse:vi14": {
    rep: () => 90 - 70,
    diags: [
      { erreur: "addition des vitesses", calc: () => 90 + 70 },
      { erreur: "vitesse du 1er / sol", calc: () => 90 },
      { erreur: "vitesse du 2nd / sol", calc: () => 70 },
    ],
  },
  "vitesse:s6/atelier1/etape1": {
    rep: () => tauMs / 1000,
    diags: [
      { erreur: "reste en ms", calc: () => tauMs },
      { erreur: "divise par 100 (un zéro manque)", calc: () => tauMs / 100 },
      { erreur: "divise par 10 (ordre de grandeur)", calc: () => tauMs / 10 },
    ],
  },
  "vitesse:s6/atelier1/etape2": {
    rep: () => dA,
    diags: [
      { erreur: "reste en cm", calc: () => photoCm * ech },
      { erreur: "mesure sur la photo", calc: () => photoCm },
      { erreur: "photo convertie en m sans échelle", calc: () => photoCm / 100 },
    ],
  },
  "vitesse:s6/atelier1/etape3": {
    rep: () => 2 * tauA,
    diags: [
      { erreur: "un seul intervalle", calc: () => tauA },
      { erreur: "trois intervalles", calc: () => 3 * tauA },
    ],
  },
  "vitesse:s6/atelier1/etape4": {
    rep: () => vA,
    diags: [
      { erreur: "divise par τ", calc: () => dA / tauA },
      { erreur: "division inversée", calc: () => (2 * tauA) / dA },
      { erreur: "divise par 4τ", calc: () => dA / (4 * tauA) },
    ],
  },
  "vitesse:s6/atelier1/etape5": {
    rep: () => vA * 3.6,
    diags: [
      { erreur: "divise par 3,6", calc: () => vA / 3.6 },
      { erreur: "reste en m/s", calc: () => vA },
    ],
  },

  /* ================================================== forces */
  "forces:fo1": {
    rep: () => 4.0 * 9.81,
    diags: [
      { erreur: "recopie la masse", calc: () => 4.0 },
      { erreur: "m/g", calc: () => 4.0 / 9.81 },
      { erreur: "g/m", calc: () => 9.81 / 4.0 },
    ],
  },
  "forces:fo4": {
    rep: () => 12 * 1.6,
    diags: [
      { erreur: "g terrestre", calc: () => 12 * 9.81 },
      { erreur: "recopie la masse", calc: () => 12 },
      { erreur: "m/g_L", calc: () => 12 / 1.6 },
    ],
  },
  "forces:fo6": {
    rep: () => k * qA * qB / d6 ** 2,
    diags: [
      { erreur: "distance pas au carré", calc: () => k * qA * qB / d6 },
      { erreur: "multiplie par d²", calc: () => k * qA * qB * d6 ** 2 },
      { erreur: "facteur 10 dans les puissances (6e-11 au lieu de 6e-12)", calc: () => k * (qA * qB * 10) / d6 ** 2 },
    ],
  },
  "forces:fo8": {
    rep: () => m8 * dv8 / dt8,
    diags: [
      { erreur: "oublie la masse", calc: () => dv8 / dt8 },
      { erreur: "m × Δv sans diviser par Δt", calc: () => m8 * dv8 },
      { erreur: "vitesse finale au lieu de Δv", calc: () => m8 * v2_8 / dt8 },
    ],
  },
  "forces:fo10": {
    rep: () => 350 * 3.7,
    diags: [
      { erreur: "g terrestre", calc: () => 350 * 9.81 },
      { erreur: "recopie la masse", calc: () => 350 },
      { erreur: "m/g", calc: () => 350 / 3.7 },
    ],
  },
  "forces:fo11": {
    rep: () => 0.60 / 4,
    diags: [
      { erreur: "divise par 2", calc: () => 0.60 / 2 },
      { erreur: "multiplie par 2", calc: () => 0.60 * 2 },
      { erreur: "multiplie par 4", calc: () => 0.60 * 4 },
    ],
  },
  "forces:fo12": {
    rep: () => G * mS * mT / r12 ** 2,
    diags: [
      { erreur: "distance pas au carré", calc: () => G * mS * mT / r12 },
      { erreur: "poids au sol", calc: () => mS * 9.81 },
      { erreur: "recopie la masse", calc: () => mS },
    ],
  },
  "forces:fo14": {
    rep: () => 2.4e6,
    diags: [
      { note: "l'élève répond « nulle » : aucune opération à refaire" },
      { erreur: "divise par 2", calc: () => 2.4e6 / 2 },
      { erreur: "double", calc: () => 2.4e6 * 2 },
    ],
  },
  "forces:fo15": {
    rep: () => T15 - f15,
    diags: [
      { erreur: "ne garde que les verticales, qui se compensent", calc: () => R15 - P15 },
      { erreur: "80 + 30", calc: () => T15 + f15 },
      { erreur: "somme des quatre valeurs", calc: () => T15 + f15 + P15 + R15 },
      { erreur: "P + R", calc: () => P15 + R15 },
    ],
  },
  "forces:fo16": {
    rep: () => Math.sqrt(2 * 20 / 9.81),
    diags: [
      { erreur: "oublie la racine", calc: () => 2 * 20 / 9.81 },
      { erreur: "oublie le facteur 2", calc: () => Math.sqrt(20 / 9.81) },
      { erreur: "recopie la hauteur", calc: () => 20 },
    ],
  },
  "forces:fo17": {
    rep: () => 9.81 * 3.0,
    diags: [
      { erreur: "g/t", calc: () => 9.81 / 3.0 },
      { erreur: "hauteur ½gt²", calc: () => 0.5 * 9.81 * 3.0 ** 2 },
      { erreur: "vitesse à 1 s", calc: () => 9.81 * 1 },
    ],
  },
  "forces:fo19": {
    rep: () => vx19 * t19,
    diags: [
      { erreur: "donne la durée", calc: () => t19 },
      { erreur: "hauteur × vitesse", calc: () => h19 * vx19 },
      { erreur: "recopie la hauteur", calc: () => h19 },
      { erreur: "t = 2 s", calc: () => vx19 * 2 },
    ],
  },
  "forces:s7/atelier1/etape1": {
    rep: () => mL * gL,
    diags: [
      { erreur: "recopie la masse", calc: () => mL },
      { erreur: "m/g", calc: () => mL / gL },
      { erreur: "g = 10", calc: () => mL * 10 },
    ],
  },
  "forces:s7/atelier1/etape2": {
    rep: () => mL * gL,
    diags: [
      { note: "l'élève pense que le sol n'exerce aucune force : rien à calculer" },
      { erreur: "double le poids", calc: () => 2 * mL * gL },
      { erreur: "prend la traction", calc: () => F7 },
    ],
  },
  "forces:s7/atelier1/etape3": {
    rep: () => F7 - f7,
    diags: [
      { erreur: "additionne", calc: () => F7 + f7 },
      { note: "l'élève suppose que les forces se compensent : rien à calculer" },
      { erreur: "multiplie", calc: () => F7 * f7 },
    ],
  },
};
