/* Calculs refaits des diagnostics du ch19 « Mesure et incertitudes ».
   Formules : ressource éduscol « Mesure et incertitudes au lycée » (2021),
   voir .claude/referentiels/mesure-incertitudes/SOURCES.md. */
const VE = [12.40, 12.45, 12.50, 12.40, 12.40, 12.45, 12.25, 12.60, 12.55, 12.55, 12.50, 12.55];
const somme = t => t.reduce((a, x) => a + x, 0);
const moyenne = t => somme(t) / t.length;
const ecart = (t, d) => { const m = moyenne(t); return Math.sqrt(somme(t.map(x => (x - m) ** 2)) / (t.length - d)); };
const s = ecart(VE, 1);             // Sx, σn−1 : dénominateur N − 1

export default {
  // atelier : douze volumes à l'équivalence
  "incertitudes:s6/atelier1/etape1": {
    rep: () => moyenne(VE),
    diags: [
      { erreur: "somme non divisée", calc: () => somme(VE) },
      { erreur: "somme divisée par 11", calc: () => somme(VE) / 11 },
    ],
  },
  "incertitudes:s6/atelier1/etape2": {
    rep: () => s,
    diags: [
      { erreur: "σn (dénominateur N)", calc: () => ecart(VE, 0) },
      { erreur: "variance (racine oubliée)", calc: () => s ** 2 },
    ],
  },
  "incertitudes:s6/atelier1/etape3": {
    rep: () => s / Math.sqrt(12),
    diags: [
      { erreur: "u = s (une observation)", calc: () => s },
      { erreur: "divisé par N au lieu de √N", calc: () => s / 12 },
      { erreur: "multiplié par √N", calc: () => s * Math.sqrt(12) },
    ],
  },

  "incertitudes:mi2": {
    rep: () => (1.98 + 2.03 + 2.01 + 1.97 + 2.02) / 5,
    diags: [
      { erreur: "somme non divisée", calc: () => 1.98 + 2.03 + 2.01 + 1.97 + 2.02 },
      { erreur: "divisé par 4", calc: () => (1.98 + 2.03 + 2.01 + 1.97 + 2.02) / 4 },
    ],
  },
  "incertitudes:mi3": {
    rep: () => 0.6 / Math.sqrt(9),
    diags: [
      { erreur: "u = s", calc: () => 0.6 },
      { erreur: "divisé par N", calc: () => 0.6 / 9 },
      { erreur: "multiplié par √N", calc: () => 0.6 * Math.sqrt(9) },
    ],
  },
  "incertitudes:mi4": {
    rep: () => 0.5 / Math.sqrt(3),
    diags: [
      { erreur: "a sans √3", calc: () => 0.5 },
      { erreur: "étendue entière / √3", calc: () => (38.5 - 37.5) / Math.sqrt(3) },
      { erreur: "divisé par 3", calc: () => 0.5 / 3 },
    ],
  },
  "incertitudes:mi5": {
    rep: () => 0.030 / Math.sqrt(3),
    diags: [
      { erreur: "tolérance recopiée", calc: () => 0.030 },
      { erreur: "multiplié par √3", calc: () => 0.030 * Math.sqrt(3) },
      { erreur: "divisé par 3", calc: () => 0.030 / 3 },
    ],
  },
  "incertitudes:mi6": {
    rep: () => (0.005 * 10.00 + 8 * 0.01) / Math.sqrt(3),
    diags: [
      { erreur: "a sans √3", calc: () => 0.005 * 10.00 + 8 * 0.01 },
      { erreur: "digits oubliés", calc: () => (0.005 * 10.00) / Math.sqrt(3) },
      { erreur: "pourcentage oublié", calc: () => (8 * 0.01) / Math.sqrt(3) },
    ],
  },
};
