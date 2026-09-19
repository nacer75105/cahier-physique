/* Calculs refaits des diagnostics de public/app/03-cours-chimie-1.js
   (chapitres transformation, mesures, titrage). Voir LISEZMOI.md.
   Chaque calc part des données de l'énoncé et refait l'erreur décrite
   par le message — jamais une recopie de v. */

export default {
  /* =========================== ch. 1 — transformation =========================== */

  // 9,0 g d'eau, M = 18,0 g/mol
  "transformation:tr1": {       // 11 g de CO2, M = 44,0 g/mol
    rep: () => 11 / 44.0,
    diags: [
      { erreur: "multiplie m par M", calc: () => 11 * 44.0 },
      { erreur: "M / m", calc: () => 44.0 / 11 },
      { erreur: "recopie la masse", calc: () => 11 },
    ],
  },


  // 250 mL à 0,20 mol/L
  "transformation:tr3": {       // 500 mL à 0,30 mol/L
    rep: () => 0.30 * (500 / 1000),
    diags: [
      { erreur: "volume gardé en mL", calc: () => 0.30 * 500 },
      { erreur: "divise V par C (en mL)", calc: () => 500 / 0.30 },
      { erreur: "divise C par V (en mL)", calc: () => 0.30 / 500 },
    ],
  },


  // Fe 0,30 mol, S 0,20 mol, Fe + S -> FeS
  "transformation:tr4": {
    rep: () => Math.min(0.30 / 1, 0.20 / 1),
    diags: [
      { erreur: "prend la quantité de fer", calc: () => 0.30 },
      { erreur: "somme des quantités", calc: () => 0.30 + 0.20 },
      { erreur: "différence 0,30 - 0,20", calc: () => 0.30 - 0.20 },
    ],
  },

  "transformation:tr5": {
    rep: () => 0.30 - 1 * Math.min(0.30, 0.20),
    diags: [
      { erreur: "fer pris comme limitant (entièrement consommé)", calc: () => 0.30 - 1 * 0.30 },
      { erreur: "donne x_max (consommé) au lieu du reste", calc: () => Math.min(0.30, 0.20) },
      { erreur: "quantité initiale de fer", calc: () => 0.30 },
    ],
  },

  // 2 Mg + O2 -> 2 MgO ; 2,4 g de Mg ; M(Mg)=24,0 ; M(MgO)=40,0
  "transformation:tr7": {
    rep: () => { const n = 2.4 / 24.0, x = n / 2; return 2 * x * 40.0; },
    diags: [
      { erreur: "recopie la masse de Mg", calc: () => 2.4 },
      { erreur: "donne x_max", calc: () => (2.4 / 24.0) / 2 },
      { erreur: "s'arrête à n(Mg)", calc: () => 2.4 / 24.0 },
      { erreur: "1 mol Mg donne 2 mol MgO", calc: () => 2 * (2.4 / 24.0) * 40.0 },
      { erreur: "m(Mg) × M(MgO), sans passer par les moles", calc: () => 2.4 * 40.0 },
      { erreur: "m × M(Mg) au lieu de m / M(Mg)", calc: () => 2.4 * 24.0 },
    ],
  },


  // CaCO3 + 2 HCl -> CaCl2 + H2O + CO2 ; 0,15 mol ; Vm = 24,0
  "transformation:tr8": {
    rep: () => 0.15 * 24.0,
    diags: [
      { erreur: "donne n au lieu de V", calc: () => 0.15 },
      { erreur: "divise par Vm", calc: () => 0.15 / 24.0 },
      { erreur: "double (coefficient de HCl)", calc: () => 2 * 0.15 * 24.0 },
      { erreur: "divise par 2", calc: () => 0.15 * 24.0 / 2 },
    ],
  },

  // 36 g d'eau, M = 18
  "transformation:tr9": {
    rep: () => 36 / 18,
    diags: [
      { erreur: "m × M", calc: () => 36 * 18 },
      { erreur: "M / m", calc: () => 18 / 36 },
      { erreur: "recopie M", calc: () => 18 },
    ],
  },

  // 2 H2 + O2 -> 2 H2O ; H2 0,30 ; O2 0,10
  "transformation:tr10": {
    rep: () => Math.min(0.30 / 2, 0.10 / 1),
    diags: [
      { erreur: "avancement permis par H2 seul", calc: () => 0.30 / 2 },
      { erreur: "quantité initiale de H2", calc: () => 0.30 },
      { erreur: "somme des quantités", calc: () => 0.30 + 0.10 },
      { erreur: "O2 divisé par 2", calc: () => Math.min(0.30 / 2, 0.10 / 2) },
    ],
  },

  // graphique : A (0 ; 0,30)->(0,15 ; 0), B (0 ; 0,10)->(0,10 ; 0)
  "transformation:tr11": {
    rep: () => Math.min(0.15, 0.10),
    diags: [
      { erreur: "zéro du réactif A", calc: () => 0.15 },
      { erreur: "quantité initiale lue en ordonnée", calc: () => 0.30 },
      { note: "mauvaise lecture de graduation (0,05 au lieu de 0,10) : rien à recalculer" },
    ],
  },

  // 2 H2 + O2 -> 2 H2O ; 4,0 g de H2 ; M(H2)=2,0 ; M(H2O)=18
  "transformation:tr12": {
    rep: () => { const n = 4.0 / 2.0; return (n / 2) * 2 * 18; },
    diags: [
      { erreur: "recopie la masse de H2", calc: () => 4.0 },
      { erreur: "s'arrête à n(H2)", calc: () => 4.0 / 2.0 },
      { erreur: "une seule mole d'eau", calc: () => 1 * 18 },
      { erreur: "double une fois de trop", calc: () => 2 * (4.0 / 2.0) * 18 },
    ],
  },

  // 2 Al + 3 Cl2 -> 2 AlCl3 ; 8,1 g Al (27,0) ; 0,60 mol Cl2 ; M(AlCl3)=133,5
  "transformation:tr15": {
    rep: () => { const nAl = 8.1 / 27.0, x = Math.min(nAl / 2, 0.60 / 3); return 2 * x * 133.5; },
    diags: [
      { erreur: "dichlore pris comme limitant", calc: () => 2 * (0.60 / 3) * 133.5 },
      { erreur: "n(Al) pris directement comme x_max", calc: () => 2 * (8.1 / 27.0) * 133.5 },
      { erreur: "recopie la masse d'aluminium", calc: () => 8.1 },
    ],
  },

  // graphique : A (0 ; 0,36)->(0,18 ; 0), B (0 ; 0,60)->(0,30 ; 0), produit (0 ; 0)->(0,30 ; 0,60)
  "transformation:tr16": {
    rep: () => { const x = Math.min(0.18, 0.30); return (0.60 / 0.30) * x; },
    diags: [
      { erreur: "produit lu en x = 0,30", calc: () => (0.60 / 0.30) * 0.30 },
      { erreur: "donne x_max", calc: () => Math.min(0.18, 0.30) },
      { erreur: "zéro du réactif B", calc: () => 0.30 },
    ],
  },

  // atelier : 0,40 mol Al, 0,45 mol Cl2, 2 Al + 3 Cl2 -> 2 AlCl3
  "transformation:s6/atelier1/etape1": {
    rep: () => 0.40 / 2,
    diags: [
      { erreur: "quantité d'aluminium", calc: () => 0.40 },
      { erreur: "multiplie par 2", calc: () => 0.40 * 2 },
      { erreur: "divise par 3", calc: () => 0.40 / 3 },
    ],
  },
  "transformation:s6/atelier1/etape2": {
    rep: () => 0.45 / 3,
    diags: [
      { erreur: "quantité de dichlore", calc: () => 0.45 },
      { erreur: "multiplie par 3", calc: () => 0.45 * 3 },
      { erreur: "divise par 2", calc: () => 0.45 / 2 },
    ],
  },
  "transformation:s6/atelier1/etape3": {
    rep: () => Math.min(0.40 / 2, 0.45 / 3),
    diags: [
      { erreur: "garde la valeur de l'aluminium (la plus grande)", calc: () => Math.max(0.40 / 2, 0.45 / 3) },
      { erreur: "somme des deux valeurs", calc: () => 0.40 / 2 + 0.45 / 3 },
    ],
  },
  "transformation:s6/atelier1/etape4": {
    rep: () => 0.40 - 2 * Math.min(0.40 / 2, 0.45 / 3),
    diags: [
      { erreur: "aluminium pris comme limitant", calc: () => 0.40 - 2 * (0.40 / 2) },
      { erreur: "retire x une seule fois", calc: () => 0.40 - 0.15 },
      { erreur: "différence des quantités initiales", calc: () => 0.45 - 0.40 },
    ],
  },
  "transformation:s6/atelier1/etape5": {
    rep: () => 2 * Math.min(0.40 / 2, 0.45 / 3),
    diags: [
      { erreur: "prend l'avancement", calc: () => Math.min(0.40 / 2, 0.45 / 3) },
      { erreur: "multiplie par 3", calc: () => 3 * Math.min(0.40 / 2, 0.45 / 3) },
      { erreur: "quantité initiale d'aluminium", calc: () => 0.40 },
    ],
  },

  /* ============================== ch. 2 — mesures ============================== */

  // C = 2,0 mmol/L, A = 0,36
  "mesures:me2": {
    rep: () => 0.36 / 2.0,
    diags: [
      { erreur: "C / A", calc: () => 2.0 / 0.36 },
      { erreur: "A × C", calc: () => 0.36 * 2.0 },
    ],
  },

  // réf. A = 0,36 pour C = 2,0 ; inconnue A = 0,54
  "mesures:me3": {
    rep: () => 2.0 * (0.54 / 0.36),
    diags: [
      { erreur: "rapport inversé", calc: () => 2.0 * (0.36 / 0.54) },
      { erreur: "ajoute la différence des absorbances à C", calc: () => 2.0 + (0.54 - 0.36) },
      { erreur: "rapport des absorbances seul", calc: () => 0.54 / 0.36 },
    ],
  },

  // réf. σ = 1,2 pour C = 5,0 ; inconnue σ = 1,8
  "mesures:me6": {
    rep: () => 5.0 * (1.8 / 1.2),
    diags: [
      { erreur: "rapport inversé", calc: () => 5.0 * (1.2 / 1.8) },
      { erreur: "rapport des conductivités seul", calc: () => 1.8 / 1.2 },
      { erreur: "ajoute la différence des conductivités à C", calc: () => 5.0 + (1.8 - 1.2) },
    ],
  },

  // 250 mL à 0,040 depuis 0,20
  "mesures:me9": {
    rep: () => 0.040 * 250 / 0.20,
    diags: [
      { erreur: "rapport des concentrations inversé", calc: () => 0.20 * 250 / 0.040 },
      { erreur: "volume d'eau ajouté", calc: () => 250 - 0.040 * 250 / 0.20 },
      { erreur: "facteur 10 perdu", calc: () => 0.040 * 250 / 0.20 / 10 },
    ],
  },

  // dilution 20 fois, Cf = 2,5e-3
  "mesures:me10": {
    rep: () => 2.5e-3 * 20,
    diags: [
      { erreur: "divise par 20", calc: () => 2.5e-3 / 20 },
      { erreur: "puissance de dix mal écrite (50 × 10^-3 → 5,0 × 10^-3)", calc: () => (2.5 * 20 / 10) * 1e-3 },
      { erreur: "recopie le facteur de dilution", calc: () => 20 },
    ],
  },

  // A = 1,50 avant dilution ; A = 0,38 après dilution par 5 ; gamme A = 0,19 pour 1,0 mmol/L
  "mesures:me7": {
    rep: () => (0.38 / (0.19 / 1.0)) * 5,
    diags: [
      { erreur: "concentration de la solution diluée", calc: () => 0.38 / (0.19 / 1.0) },
      { erreur: "divise par 5", calc: () => (0.38 / (0.19 / 1.0)) / 5 },
      { erreur: "recopie le facteur de dilution", calc: () => 5 },
      { erreur: "lecture directe hors gamme", calc: () => 1.50 / (0.19 / 1.0) },
    ],
  },

  // 100 mL à 0,050 depuis 0,20
  "mesures:me11": {
    rep: () => 0.050 * 100 / 0.20,
    diags: [
      { erreur: "rapport inversé", calc: () => 0.20 * 100 / 0.050 },
      { erreur: "facteur de dilution seul", calc: () => 0.20 / 0.050 },
      { erreur: "divise par 2", calc: () => 100 / 2 },
    ],
  },

  // droite (0 ; 0)->(8 ; 0,8), A = 0,50
  "mesures:me12": {
    rep: () => 0.50 / (0.8 / 8),
    diags: [
      { erreur: "recopie l'absorbance", calc: () => 0.50 },
      { erreur: "donne la pente", calc: () => 0.8 / 8 },
      { erreur: "lit la concentration à A = 0,40", calc: () => 0.40 / (0.8 / 8) },
      { erreur: "facteur dix", calc: () => 10 * 0.50 / (0.8 / 8) },
    ],
  },

  // réf. 3,0 mmol/L -> 0,15 S/m ; inconnue 0,25 S/m
  "mesures:me13": {
    rep: () => 3.0 * 0.25 / 0.15,
    diags: [
      { erreur: "donne la pente", calc: () => 0.15 / 3.0 },
      { erreur: "rapport inversé", calc: () => 3.0 * 0.15 / 0.25 },
      { erreur: "concentration de référence", calc: () => 3.0 },
    ],
  },

  // 0,50 mol/L dilué 10 puis 5
  "mesures:me14": {
    rep: () => 0.50 / 10 / 5,
    diags: [
      { erreur: "additionne les facteurs", calc: () => 0.50 / (10 + 5) },
      { erreur: "seule la première dilution (au dixième)", calc: () => 0.50 / 10 },
      { erreur: "seule la seconde dilution (au cinquième)", calc: () => 0.50 / 5 },
      { erreur: "multiplie au lieu de diviser", calc: () => 0.50 * 10 * 5 },
    ],
  },

  // 2,0 mL -> 50,0 mL ; A = 0,28 ; étalon A = 0,56 pour 4,0 mmol/L ; réponse en mol/L
  "mesures:me15": {
    rep: () => { const k = 0.56 / 4.0, Cd = 0.28 / k; return Cd * (50.0 / 2.0) / 1000; },
    diags: [
      { erreur: "concentration diluée (sans facteur de dilution)", calc: () => (0.28 / (0.56 / 4.0)) / 1000 },
      { erreur: "divise par le facteur de dilution", calc: () => (0.28 / (0.56 / 4.0)) / (50.0 / 2.0) / 1000 },
      { erreur: "rapport des absorbances × F, oubli de C_ref", calc: () => (0.28 / 0.56) * (50.0 / 2.0) / 1000 },
    ],
  },

  // atelier : C0 = 2,0e-4 ; 5,0 mL -> 50,0 mL ; A = 0,60
  "mesures:s6/atelier1/etape1": {
    rep: () => 50.0 / 5.0,
    diags: [
      { erreur: "division inversée", calc: () => 5.0 / 50.0 },
      { erreur: "différence des volumes", calc: () => 50.0 - 5.0 },
      { erreur: "produit des volumes", calc: () => 50.0 * 5.0 },
    ],
  },
  "mesures:s6/atelier1/etape2": {
    rep: () => 2.0e-4 / (50.0 / 5.0),
    diags: [
      { erreur: "divise par 0,1", calc: () => 2.0e-4 / (5.0 / 50.0) },
      { erreur: "concentration de la mère", calc: () => 2.0e-4 },
      { erreur: "facteur dix de trop", calc: () => 2.0e-4 / (50.0 / 5.0) / 10 },
    ],
  },
  "mesures:s6/atelier1/etape3": {
    rep: () => 0.60 / (2.0e-4 / 10),
    diags: [
      { erreur: "A × C", calc: () => 0.60 * (2.0e-4 / 10) },
      { erreur: "C / A", calc: () => (2.0e-4 / 10) / 0.60 },
      { erreur: "facteur dix", calc: () => 0.60 / (2.0e-4 / 10) / 10 },
    ],
  },
  "mesures:s6/atelier1/etape4": {
    rep: () => 0.45 / (0.60 / (2.0e-4 / 10)),
    diags: [
      { erreur: "A × k", calc: () => 0.45 * (0.60 / (2.0e-4 / 10)) },
      { erreur: "concentration de l'étalon", calc: () => 2.0e-4 / 10 },
      { erreur: "k / A", calc: () => (0.60 / (2.0e-4 / 10)) / 0.45 },
    ],
  },

  /* ============================== ch. 3 — titrage ============================== */

  // VA = 20,0 ; CB = 0,10 ; VB = 15,0 ; mole à mole
  "titrage:ti1": {
    rep: () => 0.10 * 15.0 / 20.0,
    diags: [
      { erreur: "volumes inversés CB·VA/VB", calc: () => 0.10 * 20.0 / 15.0 },
      { erreur: "oublie de diviser par VA (1re hypothèse du message)", calc: () => 0.10 * 15.0 },
      { erreur: "0,10 × 15,0 = 1,5 sans la division par 20,0", calc: () => 0.10 * 15.0 },
    ],
  },

  // I2 + 2 S2O3 ; VA = 10,0 ; CB = 0,20 ; VB = 12,0
  "titrage:ti3": {
    rep: () => 0.20 * 12.0 / (2 * 10.0),
    diags: [
      { erreur: "oublie le coefficient 2", calc: () => 0.20 * 12.0 / 10.0 },
      { erreur: "divise par 4", calc: () => 0.20 * 12.0 / (4 * 10.0) },
      { erreur: "volumes inversés (formule avec le 2 conservée)", calc: () => 0.20 * 10.0 / (2 * 12.0) },
    ],
  },

  // Veq = 14,0 mL ; VA = 20,0 ; CB = 0,050 ; réponse en mmol
  "titrage:ti5": {
    rep: () => 0.050 * 14.0,
    diags: [
      { erreur: "calcule la concentration", calc: () => 0.050 * 14.0 / 20.0 },
      { erreur: "CB × VA", calc: () => 0.050 * 20.0 },
      { erreur: "résultat en mol", calc: () => 0.050 * 14.0e-3 },
    ],
  },

  // 5 Fe2+ + MnO4- ; VB = 12,0 ; CB = 0,020 ; VA = 20,0
  "titrage:ti6": {
    rep: () => 5 * 0.020 * 12.0 / 20.0,
    diags: [
      { erreur: "oublie le 5", calc: () => 0.020 * 12.0 / 20.0 },
      { erreur: "divise par 5", calc: () => 0.020 * 12.0 / 20.0 / 5 },
      { erreur: "oublie VB/VA", calc: () => 5 * 0.020 },
    ],
  },

  // vinaigre dilué 10 ; 10,0 mL ; soude 0,10 ; Veq 13,0
  "titrage:ti8": {
    rep: () => 0.10 * 13.0 / 10.0 * 10,
    diags: [
      { erreur: "concentration du dilué", calc: () => 0.10 * 13.0 / 10.0 },
      { erreur: "divise par 10", calc: () => 0.10 * 13.0 / 10.0 / 10 },
      { erreur: "multiplie deux fois par 10", calc: () => 0.10 * 13.0 / 10.0 * 10 * 10 },
    ],
  },

  // 15,0 mL de soude à 0,20
  "titrage:ti9": {
    rep: () => 0.20 * 15.0e-3,
    diags: [
      { erreur: "volume gardé en mL", calc: () => 0.20 * 15.0 },
      { erreur: "division inversée V/C, volume en mL", calc: () => 15.0 / 0.20 },
      { erreur: "C / V en mL", calc: () => 0.20 / 15.0 },
    ],
  },

  // courbe pH-métrique
  "titrage:ti10": (() => {
    const pts = [[0, 2.4], [2, 2.7], [4, 3], [6, 3.3], [8, 3.7], [10, 4.3], [11, 4.9], [11.5, 5.6],
      [12, 8.4], [12.5, 10.2], [13, 10.8], [15, 11.5], [18, 11.9], [20, 12.1]];
    const eq = () => { // point de pente maximale (différence centrée)
      let best = null, pmax = -Infinity;
      for (let i = 1; i < pts.length - 1; i++) {
        const p = (pts[i + 1][1] - pts[i - 1][1]) / (pts[i + 1][0] - pts[i - 1][0]);
        if (p > pmax) { pmax = p; best = pts[i]; }
      }
      return best;
    };
    return {
      rep: () => eq()[0],
      diags: [
        { erreur: "pH à l'équivalence", calc: () => eq()[1] },
        { erreur: "fin du tracé", calc: () => pts[pts.length - 1][0] },
        { note: "6 mL : point quelconque de la zone lente, aucun calcul décrit" },
        { erreur: "pH initial", calc: () => pts[0][1] },
      ],
    };
  })(),

  // H2SO4 + 2 NaOH ; VA = 20,0 ; CB = 0,10 ; VB = 16,0
  "titrage:ti11": {
    rep: () => 0.10 * 16.0 / 2 / 20.0,
    diags: [
      { erreur: "oublie de diviser par 2", calc: () => 0.10 * 16.0 / 20.0 },
      { erreur: "multiplie par 2", calc: () => 0.10 * 16.0 * 2 / 20.0 },
      { erreur: "concentration de la soude", calc: () => 0.10 },
      { erreur: "divise par 16,0 mL", calc: () => 0.10 * 16.0 / 2 / 16.0 },
    ],
  },

  // 5 C2O4 + 2 MnO4 ; VA = 20,0 ; CB = 0,020 ; VB = 16,0
  "titrage:ti13": {
    rep: () => (5 / 2) * 0.020 * 16.0 / 20.0,
    diags: [
      { erreur: "CA VA = CB VB", calc: () => 0.020 * 16.0 / 20.0 },
      { erreur: "rapport 2/5", calc: () => (2 / 5) * 0.020 * 16.0 / 20.0 },
    ],
  },

  // atelier : VA = 20,0 ; CB = 0,100 ; VB = 12,5 ; mole à mole
  "titrage:s6/atelier1/etape1": {
    rep: () => 0.100 * 12.5e-3,
    diags: [
      { erreur: "volume gardé en mL", calc: () => 0.100 * 12.5 },
      { erreur: "divise la concentration par le volume (1re hypothèse, V en mL)", calc: () => 0.100 / 12.5 },
      { erreur: "division C / V (V en mL)", calc: () => 0.100 / 12.5 },
    ],
  },
  "titrage:s6/atelier1/etape2": {
    rep: () => 0.100 * 12.5e-3,
    diags: [
      { erreur: "double", calc: () => 2 * 0.100 * 12.5e-3 },
      { erreur: "divise par deux", calc: () => 0.100 * 12.5e-3 / 2 },
      { erreur: "recopie C_B", calc: () => 0.100 },
    ],
  },
  "titrage:s6/atelier1/etape3": {
    rep: () => (0.100 * 12.5e-3) / 20.0e-3,
    diags: [
      { erreur: "concentration de la soude", calc: () => 0.100 },
      { erreur: "V_A / n_A", calc: () => 20.0e-3 / (0.100 * 12.5e-3) },
      { erreur: "n = 2e-3 mol divisé par 12,5 mL", calc: () => 2e-3 / 12.5e-3 },
    ],
  },
  "titrage:s6/atelier1/etape4": {
    rep: () => (0.100 * 12.5e-3) / 20.0e-3 * 60,
    diags: [
      { erreur: "divise par M", calc: () => (0.100 * 12.5e-3) / 20.0e-3 / 60 },
      { erreur: "n au lieu de C", calc: () => 0.100 * 12.5e-3 * 60 },
      { erreur: "recopie M", calc: () => 60 },
    ],
  },
};
