/* Calculs refaits des diagnostics de public/app/03-cours-energie.js
   (voir outils/diags/LISEZMOI.md). Chaque calc part des données de l'énoncé. */
export default {
  /* ===================== ch10 — électrique ===================== */
  "electrique:el1": {
    rep: () => 230 * 2.0,
    diags: [
      { erreur: "U / I", calc: () => 230 / 2.0 },
      { erreur: "U + I", calc: () => 230 + 2.0 },
      { erreur: "I / U", calc: () => 2.0 / 230 },
    ],
  },
  "electrique:el2": {
    rep: () => 60 * 5 * 60,
    diags: [
      { erreur: "durée laissée en minutes", calc: () => 60 * 5 },
      { erreur: "P / Δt (min)", calc: () => 60 / 5 },
      { erreur: "1/(60×5), comme écrit dans le message", calc: () => 1 / (60 * 5) },
    ],
  },
  "electrique:el3": {
    rep: () => 20 * 1.5 ** 2,
    diags: [
      { erreur: "R × I sans carré", calc: () => 20 * 1.5 },
      { erreur: "R / I", calc: () => 20 / 1.5 },
      { erreur: "(R × I)²", calc: () => (20 * 1.5) ** 2 },
    ],
  },
  "electrique:el4": {
    rep: () => 600 / 800 * 100,
    diags: [
      { erreur: "fraction inversée (en %)", calc: () => 800 / 600 * 100 },
      { erreur: "rendement non converti en %", calc: () => 600 / 800 },
      { erreur: "puissance perdue", calc: () => 800 - 600 },
    ],
  },
  "electrique:el5": {
    rep: () => 2000 / 1000 * (45 / 60) * 0.20,
    diags: [
      { erreur: "une heure complète", calc: () => 2000 / 1000 * 1 * 0.20 },
      { erreur: "watts non convertis en kW", calc: () => 2000 * (45 / 60) * 0.20 },
      { erreur: "énergie en kWh sans le prix", calc: () => 2000 / 1000 * (45 / 60) },
    ],
  },
  "electrique:el6": {
    rep: () => 12 / 50,
    diags: [
      { erreur: "U × R", calc: () => 12 * 50 },
      { erreur: "R / U", calc: () => 50 / 12 },
      { erreur: "facteur 10", calc: () => 12 / 50 * 10 },
    ],
  },
  "electrique:el8": {
    rep: () => 2400 * 0.90,
    diags: [
      { erreur: "divisé par le rendement", calc: () => 2400 / 0.90 },
      { erreur: "puissance perdue (10 %)", calc: () => 2400 * 0.10 },
      { erreur: "facteur 10", calc: () => 2400 * 0.90 / 10 },
    ],
  },
  "electrique:el9": {
    rep: () => 1500 / 1000 * 4,
    diags: [
      { erreur: "resté en Wh", calc: () => 1500 * 4 },
      { erreur: "P / Δt", calc: () => 1500 / 4 },
      { erreur: "puissance convertie seule", calc: () => 1500 / 1000 },
    ],
  },
  "electrique:el10": {
    rep: () => 12 * (12 / 6.0),
    diags: [
      { erreur: "U × R", calc: () => 12 * 6.0 },
      { erreur: "intensité I = U/R", calc: () => 12 / 6.0 },
      { erreur: "tension recopiée", calc: () => 12 },
    ],
  },
  "electrique:el11": {
    rep: () => (60 - 9) * 5,
    diags: [
      { erreur: "ancienne ampoule seule", calc: () => 60 * 5 },
      { erreur: "LED seule", calc: () => 9 * 5 },
      { erreur: "écart de puissance sans la durée", calc: () => 60 - 9 },
      { erreur: "somme des consommations", calc: () => 60 * 5 + 9 * 5 },
    ],
  },
  "electrique:el12": {
    rep: () => 2000 * 30 * 60 * 0.85 / 1000,
    diags: [
      { erreur: "énergie reçue (kJ)", calc: () => 2000 * 30 * 60 / 1000 },
      { erreur: "puissance utile", calc: () => 2000 * 0.85 },
      { erreur: "durée en minutes, puis kJ", calc: () => 2000 * 30 * 0.85 / 1000 },
      { erreur: "resté en joules", calc: () => 2000 * 30 * 60 * 0.85 },
    ],
  },
  "electrique:el13": {
    rep: () => 4.0 * 3.85,
    diags: [
      { erreur: "capacité recopiée", calc: () => 4.0 },
      { erreur: "capacité / tension", calc: () => 4.0 / 3.85 },
      { erreur: "converti en joules", calc: () => 4.0 * 3.85 * 3600 },
    ],
  },
  "electrique:el14": {
    rep: () => 500 / 200,
    diags: [
      { erreur: "E × P", calc: () => 500 * 200 },
      { erreur: "P / E", calc: () => 200 / 500 },
      { erreur: "E − P", calc: () => 500 - 200 },
    ],
  },
  // figure : point (I = 0,5 A ; U = 10 V), premier point (0,1 ; 2)
  "electrique:el15": {
    rep: () => 10 / 0.5,
    diags: [
      { erreur: "I / U", calc: () => 0.5 / 10 },
      { erreur: "tension lue recopiée", calc: () => 10 },
      { erreur: "10 / 2", calc: () => 10 / 2 },
    ],
  },
  // atelier : chauffe-eau 2000 W, 2 h/jour, 0,20 €/kWh, rendement 90 %
  "electrique:s6/atelier1/etape1": {
    rep: () => 2000 / 1000 * 2,
    diags: [
      { erreur: "resté en Wh", calc: () => 2000 * 2 },
      { erreur: "P / Δt", calc: () => 2000 / 2 },
      { erreur: "puissance (kW) ou durée recopiée", calc: () => 2000 / 1000 },
      { erreur: "énergie d'une seule heure en J", calc: () => 2000 * 3600 },
    ],
  },
  "electrique:s6/atelier1/etape2": {
    rep: () => 4.0 * 0.20,
    diags: [
      { erreur: "multiplié par 20 au lieu de 0,20", calc: () => 4.0 * 20 },
      { erreur: "division inversée (prix / énergie)", calc: () => 0.20 / 4.0 },
      { erreur: "prix + énergie", calc: () => 4.0 + 0.20 },
    ],
  },
  "electrique:s6/atelier1/etape3": {
    rep: () => 4.0 * 0.20 * 365,
    diags: [
      { erreur: "énergie annuelle sans le prix", calc: () => 4.0 * 365 },
      { erreur: "prix × 365", calc: () => 0.20 * 365 },
    ],
  },
  "electrique:s6/atelier1/etape4": {
    rep: () => 2000 * 0.90,
    diags: [
      { erreur: "puissance perdue", calc: () => 2000 * 0.10 },
      { erreur: "divisé par 0,90", calc: () => 2000 / 0.90 },
      { erreur: "rendement recopié", calc: () => 90 },
    ],
  },
  "electrique:s6/atelier1/etape5": {
    rep: () => 2000 / 1000 * 2 * 0.10,
    diags: [
      { erreur: "énergie utile", calc: () => 2000 / 1000 * 2 * 0.90 },
      { erreur: "prix recopié (ou puissance perdue en kW)", calc: () => 0.20 },
      { erreur: "puissance perdue en W", calc: () => 2000 * 0.10 },
    ],
  },

  /* ===================== ch11 — mécanique ===================== */
  "mecanique:mc1": {
    rep: () => 0.5 * 1200 * 20 ** 2 / 1000,
    diags: [
      { erreur: "vitesse pas au carré (réponse en kJ)", calc: () => 0.5 * 1200 * 20 / 1000 },
      { erreur: "facteur 1/2 oublié (kJ)", calc: () => 1200 * 20 ** 2 / 1000 },
      { erreur: "resté en joules", calc: () => 0.5 * 1200 * 20 ** 2 },
    ],
  },
  "mecanique:mc2": {
    rep: () => 5.0 * 9.81 * 3.0,
    diags: [
      { erreur: "g oublié", calc: () => 5.0 * 3.0 },
      { erreur: "divisé au lieu de multiplier (m ÷ g ÷ z)", calc: () => 5.0 / 9.81 / 3.0 },
      { erreur: "hauteur oubliée", calc: () => 5.0 * 9.81 },
    ],
  },
  "mecanique:mc3": {
    rep: () => 50 * 8.0,
    diags: [
      { erreur: "F / d", calc: () => 50 / 8.0 },
      { erreur: "F + d", calc: () => 50 + 8.0 },
      { erreur: "signe faux", calc: () => -50 * 8.0 },
    ],
  },
  "mecanique:mc5": {
    rep: () => Math.sqrt(2 * 9.81 * 5.0),
    diags: [
      { erreur: "g × h", calc: () => 9.81 * 5.0 },
      { erreur: "2gh sans racine", calc: () => 2 * 9.81 * 5.0 },
      { erreur: "racine de 2h", calc: () => Math.sqrt(2 * 5.0) },
    ],
  },
  "mecanique:mc6": {
    rep: () => 60 * 9.81 * 15 - 0.5 * 60 * 12 ** 2,
    diags: [
      { erreur: "Epp de départ", calc: () => 60 * 9.81 * 15 },
      { erreur: "Ec d'arrivée", calc: () => 0.5 * 60 * 12 ** 2 },
      { erreur: "somme des deux", calc: () => 60 * 9.81 * 15 + 0.5 * 60 * 12 ** 2 },
    ],
  },
  "mecanique:mc8": {
    rep: () => 60 * 10 - 25 * 10,
    diags: [
      { erreur: "traction seule", calc: () => 60 * 10 },
      { erreur: "travaux additionnés sans signe", calc: () => 60 * 10 + 25 * 10 },
      { note: "« erreur de calcul » non précisée : rien à refaire" },
    ],
  },
  "mecanique:mc9": {
    rep: () => 0.5 * 70 * 1.5 ** 2,
    diags: [
      { erreur: "m × v", calc: () => 70 * 1.5 },
      { erreur: "facteur 1/2 oublié", calc: () => 70 * 1.5 ** 2 },
      { erreur: "1/2 m v sans carré", calc: () => 0.5 * 70 * 1.5 },
    ],
  },
  "mecanique:mc10": {
    rep: () => 5.0 * 9.81 * 3.0,
    diags: [
      { erreur: "signe faux", calc: () => -5.0 * 9.81 * 3.0 },
      { erreur: "g oublié", calc: () => 5.0 * 3.0 },
      { erreur: "déplacement horizontal (travail nul)", calc: () => 0 },
    ],
  },
  "mecanique:mc12": {
    rep: () => 0.5 * 1200 * 20 ** 2 / 40,
    diags: [
      { erreur: "Ec sans diviser par d", calc: () => 0.5 * 1200 * 20 ** 2 },
      { erreur: "facteur 1/2 oublié", calc: () => 1200 * 20 ** 2 / 40 },
      { erreur: "facteur 10", calc: () => 0.5 * 1200 * 20 ** 2 / 40 / 10 },
    ],
  },
  // figure : en B, Epp = 55, Ec = 45, Em = 100 ; en C, Epp = 10
  "mecanique:mc13": {
    rep: () => 100 - 55,
    diags: [
      { erreur: "Epp en B lue", calc: () => 55 },
      { erreur: "Em lue", calc: () => 100 },
      { erreur: "Epp en C lue", calc: () => 10 },
    ],
  },
  "mecanique:mc14": {
    rep: () => 60000 / 30,
    diags: [
      { erreur: "W × Δt", calc: () => 60000 * 30 },
      { erreur: "Δt / W", calc: () => 30 / 60000 },
      { erreur: "en kW", calc: () => 60000 / 30 / 1000 },
    ],
  },
  "mecanique:mc15": {
    rep: () => 240 / 8.0,
    diags: [
      { erreur: "P × v", calc: () => 240 * 8.0 },
      { erreur: "v / P", calc: () => 8.0 / 240 },
      { note: "« attention au chiffre » : aucune erreur de calcul décrite" },
    ],
  },
  "mecanique:mc16": {
    rep: () => 200 * 10 * 10 / 50,
    diags: [
      { erreur: "travail, sans diviser par Δt", calc: () => 200 * 10 * 10 },
      { erreur: "divisé par 10 au lieu de 50", calc: () => 200 * 10 * 10 / 10 },
      { erreur: "facteur 10", calc: () => 200 * 10 * 10 / 50 / 10 },
    ],
  },
  // atelier : enfant 30 kg, h = 3,0 m, v = 6,0 m/s, g = 9,81
  "mecanique:s7/atelier1/etape1": {
    rep: () => 30 * 9.81 * 3.0,
    diags: [
      { erreur: "Ec d'arrivée", calc: () => 0.5 * 30 * 6.0 ** 2 },
      { erreur: "g oublié", calc: () => 30 * 3.0 },
      { erreur: "masse recopiée", calc: () => 30 },
    ],
  },
  "mecanique:s7/atelier1/etape2": {
    rep: () => 0.5 * 30 * 6.0 ** 2,
    diags: [
      { erreur: "vitesse pas au carré", calc: () => 0.5 * 30 * 6.0 },
      { erreur: "facteur 1/2 oublié", calc: () => 30 * 6.0 ** 2 },
      { erreur: "énergie de départ", calc: () => 30 * 9.81 * 3.0 },
    ],
  },
  "mecanique:s7/atelier1/etape3": {
    rep: () => 30 * 9.81 * 3.0 - 0.5 * 30 * 6.0 ** 2,
    diags: [
      { erreur: "somme des énergies", calc: () => 30 * 9.81 * 3.0 + 0.5 * 30 * 6.0 ** 2 },
      { erreur: "énergie d'arrivée", calc: () => 0.5 * 30 * 6.0 ** 2 },
      { erreur: "énergie de départ", calc: () => 30 * 9.81 * 3.0 },
    ],
  },
  "mecanique:s7/atelier1/etape4": {
    rep: () => Math.sqrt(2 * 9.81 * 3.0),
    diags: [
      { erreur: "2gh sans racine", calc: () => 2 * 9.81 * 3.0 },
      { erreur: "vitesse réelle recopiée", calc: () => 6.0 },
      { erreur: "g × h", calc: () => 9.81 * 3.0 },
    ],
  },
};
