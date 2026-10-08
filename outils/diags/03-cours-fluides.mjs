/* Calculs refaits des diagnostics de public/app/03-cours-fluides.js
   (chapitre « fluides »). Voir outils/diags/LISEZMOI.md.
   Chaque calc part des données de l'énoncé et refait l'erreur décrite
   par le message, sans jamais recopier la valeur v du cours. */

// ---- constantes du cahier ----
const PATM = 1.013e5;     // Pa
const G = 9.81;           // N/kg
const RHO_EAU = 1.00e3;   // kg/m³
const RHO_MER = 1.03e3;   // kg/m³
const RHO_AIR = 1.2;      // kg/m³

// ---- atelier s6 : ballon de 6,0 L à 20 m en mer, masque de 100 cm² ----
const H_AT = 20, V0_AT = 6.0, S_AT = 100e-4;
const DP_AT = RHO_MER * G * H_AT;
const P_AT = PATM + DP_AT;

// ---- fl9 : hublot de 20 cm de diamètre à 300 m ----
const DP9 = RHO_MER * G * 300;

export default {
  "fluides:s6/atelier1/etape1": {
    rep: () => DP_AT,
    diags: [
      { erreur: "eau douce au lieu d'eau de mer", calc: () => RHO_EAU * G * H_AT },
      { erreur: "ρ × g sans la hauteur", calc: () => RHO_MER * G },
      { erreur: "pression totale au lieu de l'écart", calc: () => PATM + DP_AT },
    ],
  },
  "fluides:s6/atelier1/etape2": {
    rep: () => P_AT,
    diags: [
      { erreur: "P_atm oubliée", calc: () => DP_AT },
      { erreur: "eau douce", calc: () => PATM + RHO_EAU * G * H_AT },
      { erreur: "écart soustrait", calc: () => PATM - DP_AT },
    ],
  },
  "fluides:s6/atelier1/etape3": {
    rep: () => V0_AT * PATM / P_AT,
    diags: [
      { erreur: "proportion inversée V1 × P2/P1", calc: () => V0_AT * P_AT / PATM },
      { erreur: "écart de pression au lieu de la pression totale", calc: () => V0_AT * PATM / DP_AT },
      { erreur: "volume divisé par la profondeur", calc: () => V0_AT / H_AT },
    ],
  },
  "fluides:s6/atelier1/etape5": {
    rep: () => P_AT * S_AT,
    diags: [
      { erreur: "aire laissée en cm²", calc: () => P_AT * 100 },
      { erreur: "écart de pression au lieu de la pression totale", calc: () => DP_AT * S_AT },
      { erreur: "100 cm² convertis en 10⁻³ m²", calc: () => P_AT * 1e-3 },
    ],
  },

  "fluides:fl1": {
    rep: () => 1013 * 100 * 1.5,
    diags: [
      { erreur: "pression gardée en hPa", calc: () => 1013 * 1.5 },
      { erreur: "P / S", calc: () => 1013 * 100 / 1.5 },
      { erreur: "S / P", calc: () => 1.5 / (1013 * 100) },
    ],
  },
  "fluides:fl4": {
    rep: () => 60 * 1013 / 1520,
    diags: [
      { erreur: "unités mélangées (hPa et bar)", calc: () => 60 * 1013 / 1.52 },
      { erreur: "proportion inversée et unités mélangées", calc: () => 60 * 1.52 / 1013 },
      { erreur: "proportion inversée V1 × P2/P1", calc: () => 60 * 1520 / 1013 },
    ],
  },
  "fluides:fl5": {
    rep: () => PATM + RHO_EAU * G * 4.0,
    diags: [
      { erreur: "écart seul, P_atm oubliée", calc: () => RHO_EAU * G * 4.0 },
      { erreur: "profondeur en cm", calc: () => PATM + RHO_EAU * G * 400 },
      { erreur: "ρgh soustrait", calc: () => PATM - RHO_EAU * G * 4.0 },
    ],
  },
  "fluides:fl7": {
    rep: () => RHO_MER * G * (12 - 3) / 100,
    diags: [
      { erreur: "résultat laissé en Pa", calc: () => RHO_MER * G * (12 - 3) },
      { erreur: "profondeurs additionnées", calc: () => RHO_MER * G * (12 + 3) / 100 },
      { erreur: "eau douce", calc: () => RHO_EAU * G * (12 - 3) / 100 },
    ],
  },
  "fluides:fl9": {
    rep: () => DP9 * Math.PI * 0.10 ** 2,
    diags: [
      { erreur: "force de l'eau seule, air intérieur oublié", calc: () => (PATM + DP9) * Math.PI * 0.10 ** 2 },
      { erreur: "diamètre pris comme rayon", calc: () => DP9 * Math.PI * 0.20 ** 2 },
      { erreur: "aire laissée en cm²", calc: () => DP9 * Math.PI * 10 ** 2 },
    ],
  },
  "fluides:fl11": {
    rep: () => RHO_AIR * G * 300 / 100,
    diags: [
      { erreur: "résultat laissé en Pa", calc: () => RHO_AIR * G * 300 },
      { erreur: "masse volumique de l'eau", calc: () => RHO_EAU * G * 300 / 100 },
      { erreur: "g oublié", calc: () => RHO_AIR * 300 / 100 },
    ],
  },
  "fluides:fl12": {
    rep: () => 800 * 1.5 / 1013,
    diags: [
      { erreur: "proportion inversée", calc: () => 1.5 * 1013 / 800 },
      { erreur: "volume inchangé", calc: () => 1.5 },
      { erreur: "écart de pression au lieu des pressions", calc: () => 1.5 * (1013 - 800) / 1013 },
    ],
  },
};
