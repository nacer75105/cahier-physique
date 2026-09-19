/* Calculs refaits des diagnostics de public/app/03-cours-ondes.js
   (chapitres « ondes » et « lumiere »). Voir outils/diags/LISEZMOI.md.
   Chaque calc part des données de l'énoncé et refait l'erreur décrite
   par le message, sans jamais recopier la valeur v du cours. */

// ---- lumiere : constantes des énoncés ----
const HC = 1.99e-25;      // J·m
const EV = 1.6e-19;       // J
const H = 6.63e-34, C = 3.00e8, EV3 = 1.60e-19; // atelier s6

// ---- lumiere:s6/atelier1 : chaîne λ → f → E → eV ----
const LAM_NM = 620;
const LAM = LAM_NM * 1e-9;
const F = C / LAM;
const E_J = H * F;

export default {
  /* ===================== ONDES ===================== */
  "ondes:on1": {
    rep: () => 340 / 850,
    diags: [
      { erreur: "f / v au lieu de v / f", calc: () => 850 / 340 },
      { erreur: "v × f", calc: () => 340 * 850 },
      { erreur: "période 1/f seulement", calc: () => 1 / 850 },
    ],
  },
  "ondes:on2": {
    rep: () => 340 * 5.0,
    diags: [
      { erreur: "v / Δt", calc: () => 340 / 5.0 },
      { erreur: "Δt / v", calc: () => 5.0 / 340 },
      { erreur: "v + Δt", calc: () => 340 + 5.0 },
    ],
  },
  "ondes:on3": {
    rep: () => 1 / 4.0e-3,
    diags: [
      { erreur: "inverse de la période gardée en ms", calc: () => 1 / 4.0 },
      { erreur: "période recopiée", calc: () => 4.0 },
      { erreur: "période en s, sans l'inverse", calc: () => 4.0e-3 },
    ],
  },
  "ondes:on5": {
    rep: () => 0.25 * 2.0,
    diags: [
      { erreur: "f / λ", calc: () => 2.0 / 0.25 },
      { erreur: "λ / f", calc: () => 0.25 / 2.0 },
      { erreur: "λ + f", calc: () => 0.25 + 2.0 },
    ],
  },
  "ondes:on6": {
    rep: () => 1500 * 0.40 / 2,
    diags: [
      { erreur: "oubli de l'aller-retour", calc: () => 1500 * 0.40 },
      { erreur: "v / Δt", calc: () => 1500 / 0.40 },
      { erreur: "divisé deux fois par 2", calc: () => 1500 * 0.40 / 2 / 2 },
    ],
  },
  "ondes:on9": {
    rep: () => 340 / 1.7,
    diags: [
      { erreur: "v × λ", calc: () => 340 * 1.7 },
      { erreur: "λ / v (la période)", calc: () => 1.7 / 340 },
      { erreur: "λ recopiée", calc: () => 1.7 },
    ],
  },
  "ondes:on10": {
    rep: () => 1.2 / 340 * 1000,
    diags: [
      { erreur: "d × v", calc: () => 1.2 * 340 },
      { erreur: "v / d", calc: () => 340 / 1.2 },
      { erreur: "résultat laissé en secondes", calc: () => 1.2 / 340 },
    ],
  },
  "ondes:on12": {
    // d/vS − d/vP = Δt
    rep: () => 20 / (1 / 3.5 - 1 / 6.0),
    diags: [
      { erreur: "vP × Δt", calc: () => 6.0 * 20 },
      { erreur: "vS × Δt", calc: () => 3.5 * 20 },
      { erreur: "(vP − vS) × Δt", calc: () => (6.0 - 3.5) * 20 },
    ],
  },
  "ondes:on13": {
    // figure : période 2,5 ms (0 → 2,5 ms), amplitude 1,2
    rep: () => 1 / 2.5e-3,
    diags: [
      { erreur: "période en ms lue au lieu de la fréquence", calc: () => 2.5 },
      { erreur: "inverse de la période gardée en ms", calc: () => 1 / 2.5 },
      { erreur: "période convertie en s, inverse non pris", calc: () => 2.5e-3 },
    ],
  },
  // atelier : falaise, la 440 Hz, écho 1,2 s, v = 340 m/s
  "ondes:s5/atelier1/etape1": {
    rep: () => 340 * 1.2,
    diags: [
      { erreur: "v / Δt", calc: () => 340 / 1.2 },
      { erreur: "distance de la falaise (moitié)", calc: () => 340 * 1.2 / 2 },
      { erreur: "v + Δt", calc: () => 340 + 1.2 },
    ],
  },
  "ondes:s5/atelier1/etape2": {
    rep: () => 340 * 1.2 / 2,
    diags: [
      { erreur: "trajet aller-retour", calc: () => 340 * 1.2 },
      { erreur: "doublé au lieu de diviser par 2", calc: () => 340 * 1.2 * 2 },
    ],
  },
  "ondes:s5/atelier1/etape3": {
    rep: () => 340 / 440,
    diags: [
      { erreur: "v × f", calc: () => 340 * 440 },
      { erreur: "f / v", calc: () => 440 / 340 },
      { erreur: "période 1/f", calc: () => 1 / 440 },
    ],
  },
  "ondes:s5/atelier1/etape4": {
    rep: () => 440 * 1.2,
    diags: [
      { erreur: "vibrations en une seconde", calc: () => 440 },
      { erreur: "440 / 1,2", calc: () => 440 / 1.2 },
      { erreur: "durée divisée par la fréquence (Δt / f)", calc: () => 1.2 / 440 },
    ],
  },

  /* ===================== LUMIERE ===================== */
  "lumiere:lu2": {
    rep: () => -2.0 / 8.0,
    diags: [
      { erreur: "signe oublié", calc: () => 2.0 / 8.0 },
      { erreur: "fraction inversée (sans signe)", calc: () => 8.0 / 2.0 },
      { erreur: "fraction inversée, signe correct", calc: () => -8.0 / 2.0 },
    ],
  },
  "lumiere:lu3": {
    rep: () => 1 / (1 / 10 + 1 / -30),
    diags: [
      { erreur: "inverses additionnés (signe de OA oublié)", calc: () => 1 / (1 / 10 + 1 / 30) },
      { erreur: "distances additionnées", calc: () => 30 + 10 },
      { erreur: "2f'", calc: () => 2 * 10 },
    ],
  },
  "lumiere:lu5": {
    rep: () => 4.8e-19 / 1.6e-19,
    diags: [
      { erreur: "multiplié par 1,6e-19 au lieu de diviser", calc: () => 4.8e-19 * 1.6e-19 },
      { erreur: "division inversée", calc: () => 1.6e-19 / 4.8e-19 },
    ],
  },
  "lumiere:lu6": {
    rep: () => -0.9 - -3.4,
    diags: [
      { erreur: "E1 − E2 (signe négatif)", calc: () => -3.4 - -0.9 },
      { erreur: "niveaux additionnés E2 + E1", calc: () => -0.9 + -3.4 },
      { erreur: "valeur du niveau de départ E2", calc: () => -0.9 },
    ],
  },
  "lumiere:lu7": {
    // γ = A'B'/AB = −12/4,0 = −3 ; OA' = γ × OA = −3 × (−15)
    rep: () => (-12 / 4.0) * -15,
    diags: [
      { erreur: "divisé par le grandissement", calc: () => 15 / (12 / 4.0) },
      { erreur: "distance objet recopiée", calc: () => 15 },
      { erreur: "multiplié par 12 au lieu de 3", calc: () => 15 * 12 },
    ],
  },
  "lumiere:lu10": {
    rep: () => 1 / (1 / 20 + 1 / 20),
    diags: [
      { erreur: "distances additionnées", calc: () => 20 + 20 },
      { erreur: "une distance recopiée", calc: () => 20 },
      { erreur: "1/f' sans prendre l'inverse", calc: () => 1 / 20 + 1 / 20 },
    ],
  },
  "lumiere:lu11": {
    // réponse exprimée en unités de 1e-19 J
    rep: () => HC / 600e-9 / 1e-19,
    diags: [
      { erreur: "λ gardée en nm (réponse en 1e-19 J)", calc: () => HC / 600 / 1e-19 },
      { erreur: "hc × λ (réponse en 1e-19 J)", calc: () => HC * 600e-9 / 1e-19 },
      { erreur: "λ recopiée", calc: () => 600 },
    ],
  },
  "lumiere:lu12": {
    rep: () => HC / (3.0 * EV) * 1e9,
    diags: [
      { erreur: "résultat laissé en mètres", calc: () => HC / (3.0 * EV) },
      { erreur: "eV non convertis en J (réponse en nm)", calc: () => HC / 3.0 * 1e9 },
      { erreur: "hc × E (réponse en nm)", calc: () => HC * (3.0 * EV) * 1e9 },
    ],
  },
  "lumiere:lu14": {
    rep: () => HC / 486e-9 / EV,
    diags: [
      { erreur: "résultat laissé en joules", calc: () => HC / 486e-9 },
      { erreur: "λ gardée en nm (réponse en eV)", calc: () => HC / 486 / EV },
      { erreur: "division finale inversée", calc: () => EV / (HC / 486e-9) },
    ],
  },
  // atelier : diode rouge 620 nm
  "lumiere:s6/atelier1/etape1": {
    rep: () => LAM,
    diags: [
      { erreur: "valeur en nm recopiée", calc: () => LAM_NM },
      { erreur: "620 remplacé par 6,2 sans compenser", calc: () => 6.2 * 1e-9 },
      { erreur: "conversion des micromètres", calc: () => LAM_NM * 1e-6 },
    ],
  },
  "lumiere:s6/atelier1/etape2": {
    rep: () => F,
    diags: [
      { erreur: "c × λ", calc: () => C * LAM },
      { erreur: "λ / c", calc: () => LAM / C },
      // 3,00 / 6,20 = 0,484, × 10^(8−7) au lieu de × 10^(8−(−7))
      { erreur: "exposants 8 − 7 au lieu de 8 − (−7)", calc: () => (3.00 / 6.20) * 10 ** (8 - 7) },
    ],
  },
  "lumiere:s6/atelier1/etape3": {
    rep: () => E_J,
    diags: [
      { erreur: "h × λ au lieu de h × f", calc: () => H * LAM },
      { erreur: "h / f", calc: () => H / F },
      { erreur: "multiplié en plus par 1,60e-19", calc: () => E_J * EV3 },
    ],
  },
  "lumiere:s6/atelier1/etape4": {
    rep: () => E_J / EV3,
    diags: [
      { erreur: "multiplié par 1,60e-19", calc: () => E_J * EV3 },
      { erreur: "division inversée 1,60 / 3,21", calc: () => EV3 / E_J },
      { erreur: "mantisse gardée sans division", calc: () => E_J / 1e-19 },
    ],
  },
};
